# Learn Python Site — Design Spec

Date: 2026-08-28

## Purpose

A personal, local-only website that teaches the user Python from zero. The
user has no Python experience but is comfortable with HTML, CSS, and
JavaScript, with a little Java. The site is informational rather than
visual — the priority is clear, accurate teaching content with working code,
not visual flourish.

## Goals

- Teach core Python syntax and semantics (not libraries/frameworks) through
  a linear, sequenced course.
- Let the user run and edit real Python in the browser, no local Python
  install required.
- Give immediate, automatic feedback on exercises via output-matching, not
  just self-graded "look at the answer."
- Lean on the user's existing JS/Java knowledge — every new concept gets an
  explicit comparison to something they already know.
- Track progress locally so the user can leave and resume.

## Non-goals

- No standard-library deep dives, no third-party packages (pandas, Flask,
  etc.) — covered by a possible future course, not this one.
- No deployment/hosting — runs via `npm run dev` on the user's machine only.
- No user accounts, no backend, no multi-device sync.
- No enforced lesson lock-step — completion tracking is informational, not
  a gate.

## Tech Stack

- **React + Vite + Tailwind CSS**, matching the user's existing projects
  (e.g. `react-playground`).
- **react-router-dom** for lesson routing (`/`, `/lessons/:slug`).
- **Pyodide** (Python-in-WASM) for all code execution — both runnable
  examples and exercise checking. Loaded once in a **Web Worker** at app
  startup so the main thread/UI never blocks during execution.
  - First load: ~6.4 MB download, ~4-5s init. Cached by the browser after
    that (sub-second on subsequent loads), which is fine for a
    single-machine local tool.
  - Vite requires `optimizeDeps.exclude: ['pyodide']` and copying Pyodide's
    asset files into the build output; this is a known, documented
    integration path.
- **CodeMirror 6** via `@uiw/react-codemirror` + `@codemirror/lang-python`
  for every editable/syntax-highlighted code block (both examples and
  exercises use the same component).
- **localStorage** for progress persistence. No backend, no database.

## Architecture

```
src/
  worker/
    pyodideWorker.js       # loads Pyodide once, executes code, captures stdout
  hooks/
    usePyodide.js          # postMessage wrapper around the worker; exposes run(code) -> {stdout, error}
    useProgress.js         # reads/writes localStorage progress map
  blocks/
    registry.js             # maps block `type` string -> renderer component
    Prose.jsx
    CodeBlock.jsx          # CodeMirror editor + Run button + output panel (used for examples)
    Exercise.jsx           # CodeMirror editor + Check button + pass/fail feedback (dispatches on check.type)
  components/
    Sidebar.jsx            # lesson list with completion checkmarks, current-lesson highlight
    LessonLayout.jsx        # sidebar + content area + Next/Previous footer
  content/
    courses/
      python-core/
        lessonIndex.js      # ordered array of {slug, title} driving Sidebar + routing
        lessons/
          01-welcome.js
          02-variables-and-types.js
          ... (one file per lesson, 14 total)
  pages/
    Home.jsx                # course overview + "Continue where you left off"
    Lesson.jsx              # renders a lesson's content blocks via LessonLayout
  App.jsx                   # router setup, Pyodide worker provider, active-course constant
```

### Pyodide execution flow

1. On app mount, `usePyodide` spins up `pyodideWorker.js` in a Web Worker
   and posts an `init` message; the worker loads Pyodide and replies
   `ready`.
2. Running a code block (`CodeBlock` or `Exercise`) posts `{id, code}` to
   the worker.
3. The worker redirects `sys.stdout`/`sys.stderr` to an in-memory buffer
   (via Pyodide's `setStdout`/`setStderr` callbacks), executes the code
   with `pyodide.runPython`, and posts back `{id, stdout, stderr, error}`.
4. `CodeBlock` renders stdout/stderr as-is. `Exercise` additionally
   dispatches on the exercise's `check.type` — currently only
   `stdout-exact`, which compares the trimmed, whitespace-normalized
   stdout against `check.expected` — and renders pass/fail.
5. While the worker is loading (first visit only), example/exercise Run
   buttons are disabled with a "Loading Python…" indicator.

## Content Authoring Model

Each lesson is a plain JS module exporting an object, not MDX/Markdown —
this keeps exercise-checking wired directly into the data with no parsing
layer:

```js
// content/courses/python-core/lessons/04-control-flow.js
export default {
  slug: "control-flow",
  title: "Control Flow",
  blocks: [
    { type: "prose", body: "In JS you write `if (x > 0) { ... }`..." },
    { type: "example", code: "x = 5\nif x > 0:\n    print('positive')" },
    {
      type: "exercise",
      id: "control-flow-1",
      prompt: "Write code that prints 'even' if x is even, else 'odd'. x = 7 is provided.",
      starterCode: "x = 7\n",
      check: { type: "stdout-exact", expected: "odd" },
    },
  ],
};
```

`lessonIndex.js` lists all 14 lessons in order (see Curriculum below); it
drives the sidebar, the Next/Previous footer, and routing — adding a
lesson later means adding one file + one index entry.

Two seams are worth calling out because they're what make this easy to
build on later, and both cost nothing extra today:

- **Block rendering is a registry, not a switch statement.** `blocks/registry.js`
  maps a block's `type` string to the component that renders it
  (`prose` → `Prose`, `example` → `CodeBlock`, `exercise` → `Exercise`).
  `Lesson.jsx` just walks a lesson's `blocks` array and looks up the
  renderer. Adding a new block type later (a callout, an image, a quiz)
  means adding one component and one registry entry — no existing
  rendering code changes.
- **Exercise checking is a typed `check` object, not a bare string.**
  Only `{ type: "stdout-exact", expected }` is implemented now (matches
  the auto-checked-output-matching decision above), but `Exercise.jsx`
  dispatches on `check.type` rather than assuming one shape. A future
  checker (e.g. "any of several valid outputs", numeric tolerance) is
  additive: a new `case` in the dispatch, no change to existing
  exercises' data.

## Curriculum (14 lessons, core language only, course slug `python-core`)

1. Welcome & first script — `print()`, comments, no install needed
2. Variables & types — dynamic typing (like JS), no `var`/`let`/`const`, `snake_case`
3. Numbers, strings & f-strings — vs. template literals
4. Control flow — `if`/`elif`/`else`, indentation-as-blocks, truthy/falsy differences
5. Loops — `for x in iterable`, `range()`, `while` — vs. `for...of`/`for...in`
6. Lists — vs. arrays; slicing is new
7. Dictionaries — vs. objects/Maps
8. Tuples & sets — immutability, new concepts
9. Functions — `def`, default-argument gotcha, `*args`/`**kwargs` vs. rest/spread
10. String methods & formatting deep dive
11. Error handling — `try`/`except` vs. `try`/`catch`
12. Modules & imports — vs. `import`/`require`, `if __name__ == "__main__"`
13. Classes & basic OOP — `self` vs. Java's implicit `this`, `__init__` vs. constructors
14. List comprehensions (capstone) — vs. chained `.map()`/`.filter()`

## Lesson Page Anatomy

Each lesson is one scrollable page rendered by `LessonLayout`:

- Sidebar (persistent): all 14 lessons, checkmark on completed ones,
  current lesson highlighted.
- Prose blocks: short paragraphs, explicit JS/Java comparisons.
- Example blocks: pre-filled `CodeBlock` — editable, Run button, output
  shown below. Purely exploratory, not graded.
- Exercise blocks: `Exercise` component — prompt text, starter code in
  CodeMirror, Check button. Runs the code and checks it per the
  exercise's `check` object (currently always `stdout-exact`). Pass
  shows a success state; fail shows the user's actual output next to
  the expected output (never the solution — no reveal, per the user's
  choice of auto-checking over self-grading).
- Footer: Previous/Next lesson links.

## Progress Tracking

- `useProgress` reads/writes a single localStorage key, e.g.
  `learn-python-progress`, shaped as
  `{ [lessonSlug]: { [exerciseId]: true } }`.
- A lesson is "complete" (sidebar checkmark) when every exercise block it
  contains has a `true` entry.
- Home page reads progress to compute "Continue where you left off" —
  the first lesson in `lessonIndex` that isn't complete.
- No lesson is locked; the user can navigate anywhere regardless of
  progress.

## Visual Direction

Informational over visual, per the user's request:

- Two-column layout: fixed sidebar (lesson list) + centered content
  column with a readable prose max-width.
- Syntax-highlighted code blocks (CodeMirror's built-in Python theme),
  clear visual separation between prose, runnable examples, and
  exercises (e.g. exercises get a distinct background/border to signal
  "this one's graded").
- Minimal color palette, generous whitespace, no illustration/marketing
  visuals.
- The implementation plan should invoke the `frontend-design` skill for
  the concrete typography/spacing/color decisions when building the UI —
  that step was intentionally deferred out of this design/brainstorming
  phase.

## Error Handling

- Pyodide worker fails to initialize (unsupported browser / WASM
  disabled): show a one-time error banner on the affected page;
  non-goal to support browsers without WASM.
- User code raises a Python exception: captured stderr is shown in the
  output panel like a real traceback; exercises with an exception are
  treated as a fail (not a crash).
- No other error handling needed — this is a single-user local tool, not
  a system boundary that needs defensive validation.

## Testing / Verification Approach

- No automated test suite for lesson content — it's prose + curated
  examples authored by hand, not logic to unit-test.
- The Pyodide worker's execution/stdout-capture path and the
  exercise-matching logic (`usePyodide`, `Exercise`) are worth a small
  set of unit tests (mock worker responses, assert pass/fail logic).
- Manual verification in the browser: run `npm run dev`, walk through at
  least the first three lessons end-to-end (example runs, exercise
  passes and fails correctly, progress persists across a reload), and
  confirm sidebar/progress/navigation behave as designed.
- Standard `npm run lint` / `npm run build` before considering the
  initial build done.

## Extensibility

The design intentionally keeps a few seams open so the site can grow
without rework, since this is expected to be a living project:

- **New lessons**: add one file under `content/courses/python-core/lessons/`
  and one entry in `lessonIndex.js`. Nothing else changes.
- **New block types** (e.g. a callout box, an image, a quiz): add a
  component and a `blocks/registry.js` entry. Existing lessons/components
  are untouched.
- **New exercise-checking strategies**: add a `case` to `Exercise.jsx`'s
  dispatch on `check.type`. Existing exercises keep using `stdout-exact`.
- **A second course** (e.g. "core + stdlib", or a specific direction like
  web/data/automation, both discussed and declined for v1): add a sibling
  folder under `content/courses/<new-slug>/` with its own
  `lessonIndex.js` and lessons, reusing every existing component
  (`Sidebar`, `LessonLayout`, `blocks/*`, the worker/hooks). `App.jsx`
  currently wires in a single active course by constant; pointing it at
  a different course, or adding a course switcher, is a small,
  self-contained change when/if it's needed.

What this spec is **not** building now, to keep scope honest: a
multi-course switcher UI, any exercise-checker beyond `stdout-exact`, or
extra block types beyond `prose`/`example`/`exercise`. The registry/typed
`check` structure just means adding those later doesn't require
revisiting working code.

## Future Considerations (explicitly out of scope now)

- Deploying to a host (e.g. Vercel) if the user later wants access from
  other devices — would need progress storage to move off pure
  `localStorage` or accept per-browser progress.

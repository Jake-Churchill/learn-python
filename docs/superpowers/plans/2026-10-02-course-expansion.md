# Course Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grow the Learn Python course from 17 thin lessons to 65 in-depth lessons in 12 units, with every example and exercise machine-verified in real Pyodide.

**Architecture:** Small additive code changes (unit grouping, `heading` block, exercise hint/solution, `returns` grading, canned `stdin`, a shared `runPython`) plus a permanent Pyodide-backed verification suite; then lesson content is authored unit by unit (pilot inline, rest by parallel opus subagents against a style guide, each followed by an independent reviewer). Lesson data stays plain JS objects wired through `lessonIndex.js`.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4, react-router-dom v7, Vitest 4 (+ Testing Library, jsdom), oxlint, Pyodide 314 (Python 3.14.2).

**Spec:** `docs/superpowers/specs/2026-10-02-course-expansion-design.md` (approved). The outline in its section 5 is authoritative; if a table in this plan ever disagrees, the spec wins and the discrepancy must be reported.

## Global Constraints

Every task's requirements implicitly include this section.

- **No commits, ever, unless the user explicitly asks.** No `git commit`, `git add`, `git push`, `git stash`, `git reset`, or amend, by anyone (controller, implementers, reviewers). Where a task would normally end in a commit it ends in a "Checkpoint" that is only a verification gate. (User's standing rule.)
- Audience is someone who has never programmed. Define every term at first use. No comparisons to other programming languages (`JavaScript`, `JS`, `Java`, `console.log` never appear in lesson text; a test enforces this).
- A lesson may only use concepts introduced in its own text or in earlier rows of the spec outline. Two declared exceptions: lesson 5 uses `import math` minimally ("brings in extra tools; Unit 10 covers imports fully"), and lesson 43 introduces `@name` lines above a function as "markers that change how the function behaves" (reused by `@property` and `@dataclass`; lesson 57 explains how they are built).
- Lesson shape: regular lessons 600–900 words of prose, at least 2 examples, 2–4 exercises ramping guided → open-ended; `review-*` lessons at least 2 exercises; `project-*` lessons at least 4 staged exercises (stage N's `starterCode` contains stage N−1's solution).
- Lesson style: short paragraphs (4 sentences max), second person, direct; no filler, praise, or emojis; realistic simple data (names, prices, temperatures, scores) rather than `foo`/`bar`.
- Lesson code must be deterministic: no unseeded `random`, no current time or date, no memory addresses, no reliance on set iteration order.
- Existing slugs and exercise ids are preserved wherever a lesson survives (13 do). The localStorage key `learn-python-progress` and its shape are unchanged.
- The existing design tokens only: colors `paper`, `card`, `ink`, `rule`, `indigo`, `amber`, `pine`, `rust`; fonts `font-mono`, `font-body`. No new dependencies. No new external hosts (the CSP in `public/.htaccess` must keep working). Do not modify `public/.htaccess` or `public/robots.txt`.
- Pyodide tests use `// @vitest-environment node` and the shared loader `src/test/pyodideNode.js`. All other tests stay on the default jsdom environment.
- Python behavior is verified against Pyodide only (Python 3.14.2), never the machine's `python3` (3.9.6 here: no `match`, different error messages). Use `node scripts/py.mjs '<code>' ['<stdin>']` (created in Task 7) or the verification suite.
- `timeout` and `gtimeout` are not installed on this machine. Wherever a command needs a time limit, prefix it with `perl -e 'alarm shift; exec @ARGV' <seconds>` (verified: kills a runaway process, exit 142). A Python infinite loop in a solution would otherwise hang the Node process running the suite.
- `node scripts/py.mjs '<code>' '<stdin>'` receives its stdin argument literally: for several input lines use shell `$'5\n7'` (a plain `'5\n7'` is one line containing a backslash and an n).
- Verification commands that must be green at every checkpoint: `npm run test`, `npm run lint`, `npm run build`.
- When a test fails, read the error first; fix the code or the test that is actually wrong. Do not retry unchanged.
- New code gets no comments unless the why is non-obvious. Do not touch code that a task does not mention.
- Subagents: model `opus`. At most 4 running concurrently (a rate-limit interruption has happened before). Authors write only `src/content/courses/python-core/lessons/*.js` files.

## File Structure

**Infrastructure (Phase 1):**

| File | Responsibility |
|---|---|
| `src/worker/runPython.js` (new) | Pure `runPython(pyodide, code, { stdin })` → `{ stdout, stderr }`: output batching, fresh globals per run, traceback trimming, canned stdin with echoing `input()`. Shared by the worker and the tests. |
| `src/worker/pyodideWorker.js` (modify) | Loads Pyodide and delegates each `run` message to `runPython`. |
| `src/test/pyodideNode.js` (new) | Test helper: one cached Node Pyodide instance. |
| `src/hooks/pyodideClient.js`, `src/hooks/PyodideProvider.jsx` (modify) | Carry the optional `stdin` option from block to worker. |
| `src/blocks/blockTypes.js` (new) | `BLOCK_TYPES` list shared by the registry test and the content suite. |
| `src/blocks/Heading.jsx` (new), `src/blocks/registry.js` (modify) | The `heading` block. |
| `src/content/lessonUtils.js` (modify) | `groupByUnit`, `getUnitProgress`. |
| `src/components/Sidebar.jsx`, `src/pages/Home.jsx` (modify) | Units grouped, collapsible in the sidebar, counts per unit. |
| `src/blocks/CodeBlock.jsx`, `src/blocks/Exercise.jsx` (modify) | `stdin`; Exercise adds `hint`, `solution` reveal, `returns` grading. |
| `src/blocks/checkers.js` (modify) | `returns` check, `buildRunnableCode`, `gradeRun`. |
| `src/content/courses.test.js` (new) | Verification suite over every lesson file. |
| `scripts/py.mjs` (new) | Dev helper: run a Python snippet (optionally with stdin) in real Pyodide via `runPython`, for verifying prose claims. |

**Content (Phases 2–4):** 52 new lesson files and 13 rewritten ones under `src/content/courses/python-core/lessons/`, and `lessonIndex.js` rewired. Existing lesson files keep their current filenames (their numeric prefixes are no longer authoritative; `lessonIndex.js` defines order). New files are named `<slug>.js`.

---

## Phase 1 — Infrastructure

### Task 1: `runPython` with canned stdin, extracted from the worker

**Files:**
- Create: `src/test/pyodideNode.js`
- Create: `src/worker/runPython.js`
- Create: `src/worker/runPython.test.js`
- Modify: `src/worker/pyodideWorker.js`

**Interfaces:**
- Consumes: `pyodide` instance (from `loadPyodide`).
- Produces: `runPython(pyodide, code, { stdin }?) → Promise<{ stdout: string, stderr: string }>`; `stdinLines(stdin) → string[]`; test helper `loadNodePyodide() → Promise<Pyodide>` (cached).
- `stdin` semantics: the text a user would type, lines separated by `\n`. One trailing newline is ignored. `undefined` or `""` means no input (Python gets `EOFError`). A lone `"\n"` is one empty line. `input()` echoes the consumed line after the prompt, like a terminal (`What's your name? Ada`).

- [ ] **Step 1: Create the Node test helper**

`src/test/pyodideNode.js`:

```js
import { loadPyodide } from "pyodide";

let cached = null;

export function loadNodePyodide() {
  if (!cached) cached = loadPyodide();
  return cached;
}
```

- [ ] **Step 2: Write the failing test**

`src/worker/runPython.test.js`:

```js
// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { loadNodePyodide } from "../test/pyodideNode.js";
import { runPython, stdinLines } from "./runPython.js";

let pyodide;

beforeAll(async () => {
  pyodide = await loadNodePyodide();
}, 120000);

describe("stdinLines", () => {
  it("returns no lines for undefined or empty stdin", () => {
    expect(stdinLines(undefined)).toEqual([]);
    expect(stdinLines("")).toEqual([]);
  });

  it("splits on newlines and ignores one trailing newline", () => {
    expect(stdinLines("3\n4")).toEqual(["3", "4"]);
    expect(stdinLines("3\n4\n")).toEqual(["3", "4"]);
  });

  it("keeps an empty line in the middle and treats a lone newline as one empty line", () => {
    expect(stdinLines("a\n\nb")).toEqual(["a", "", "b"]);
    expect(stdinLines("\n")).toEqual([""]);
  });
});

describe("runPython", () => {
  it("captures stdout with its newlines", async () => {
    expect(await runPython(pyodide, "print('a')\nprint('b')")).toEqual({
      stdout: "a\nb\n",
      stderr: "",
    });
  });

  it("trims a traceback down to the learner's code", async () => {
    const { stderr } = await runPython(pyodide, "print(undefined_name)");
    expect(stderr).toContain("Traceback (most recent call last):");
    expect(stderr).toContain("NameError");
    expect(stderr).not.toContain("_pyodide");
  });

  it("gives every run a fresh namespace", async () => {
    await runPython(pyodide, "leaked = 1");
    const { stderr } = await runPython(pyodide, "print(leaked)");
    expect(stderr).toContain("NameError");
  });

  it("feeds stdin lines to input() and echoes them after the prompt", async () => {
    const { stdout, stderr } = await runPython(
      pyodide,
      'name = input("Name? ")\nprint(f"Hi {name}")',
      { stdin: "Ada" }
    );
    expect(stderr).toBe("");
    expect(stdout).toBe("Name? Ada\nHi Ada\n");
  });

  it("echoes answers to input() calls that have no prompt", async () => {
    const { stdout } = await runPython(
      pyodide,
      "a = int(input())\nb = int(input())\nprint(a + b)",
      { stdin: "3\n4" }
    );
    expect(stdout).toBe("3\n4\n7\n");
  });

  it("feeds an empty line in the middle of the input", async () => {
    const { stdout } = await runPython(
      pyodide,
      "print(repr(input()), repr(input()), repr(input()))",
      { stdin: "a\n\nb" }
    );
    expect(stdout).toBe("a\n\nb\n'a' '' 'b'\n");
  });

  it("raises EOFError when input runs out, without leaking the echo wrapper frame", async () => {
    const { stderr } = await runPython(pyodide, "input('x')");
    expect(stderr).toContain("EOFError");
    expect(stderr).not.toContain("_echo_input");
  });

  it("does not reuse stdin between runs", async () => {
    await runPython(pyodide, "input()", { stdin: "one" });
    const { stderr } = await runPython(pyodide, "input()");
    expect(stderr).toContain("EOFError");
  });

  it("delivers a last line with no trailing newline in the run that wrote it", async () => {
    expect((await runPython(pyodide, "print('x', end='')")).stdout).toBe("x");
  });

  it("does not leak output from one run into the next", async () => {
    await runPython(pyodide, "print('x', end='')");
    expect((await runPython(pyodide, "print('y')")).stdout).toBe("y\n");
  });

  it("shows the prompt even when input runs out", async () => {
    const { stdout } = await runPython(pyodide, "input('Name? ')");
    expect(stdout).toBe("Name? ");
  });

  it("keeps non-ASCII output intact", async () => {
    expect((await runPython(pyodide, "print('héllo ✓')")).stdout).toBe("héllo ✓\n");
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run src/worker/runPython.test.js`
Expected: FAIL — cannot resolve `./runPython.js`.

- [ ] **Step 4: Write the implementation**

`src/worker/runPython.js`:

```js
const ECHO_INPUT = `
def _echo_input(prompt=""):
    value = input(prompt)
    print(value)
    return value
_echo_input
`;

const echoInputByPyodide = new WeakMap();

function getEchoInput(pyodide) {
  if (!echoInputByPyodide.has(pyodide)) {
    echoInputByPyodide.set(pyodide, pyodide.runPython(ECHO_INPUT));
  }
  return echoInputByPyodide.get(pyodide);
}

export function stdinLines(stdin) {
  if (stdin === undefined || stdin === "") return [];
  return stdin.replace(/\n$/, "").split("\n");
}

function formatTraceback(message) {
  const marker = 'File "<exec>"';
  const index = message.indexOf(marker);
  if (index === -1) return message;
  return `Traceback (most recent call last):\n  ${message.slice(index)}`
    .split("\n")
    .filter((line) => !line.endsWith("in _echo_input"))
    .join("\n");
}

function createCapture() {
  const decoder = new TextDecoder();
  let text = "";
  return {
    handler: {
      write: (buffer) => {
        text += decoder.decode(buffer, { stream: true });
        return buffer.length;
      },
    },
    finish: () => text + decoder.decode(),
  };
}

function flushStreams(pyodide) {
  try {
    pyodide.runPython("import sys\nsys.stdout.flush()\nsys.stderr.flush()");
  } catch {
    // learner code replaced sys.stdout or sys.stderr
  }
}

export async function runPython(pyodide, code, { stdin } = {}) {
  const out = createCapture();
  const err = createCapture();
  pyodide.setStdout(out.handler);
  pyodide.setStderr(err.handler);
  const lines = stdinLines(stdin);
  pyodide.setStdin({ stdin: () => (lines.length > 0 ? lines.shift() : undefined) });
  const globals = pyodide.toPy({ __name__: "__main__" });
  globals.set("input", getEchoInput(pyodide));
  let traceback = "";
  try {
    await pyodide.runPythonAsync(code, { globals });
  } catch (error) {
    traceback = formatTraceback(String(error));
  } finally {
    globals.destroy();
    flushStreams(pyodide);
  }
  return { stdout: out.finish(), stderr: err.finish() + traceback };
}
```

Why raw `write` handlers and a flush instead of `batched`: with `batched`, a last line that has no trailing newline (for example `print("x", end="")`, or an `input()` prompt when input runs out) stays buffered and shows up at the start of the NEXT run's stdout, and `sys.stdout.flush()` does not release it in that mode. Raw `write` handlers receive bytes as Python writes them, newlines arrive natively (no `+ "\n"` workaround), and the explicit flush at the end of each run pushes out any partial last line in the run that produced it. The flush is wrapped in `try`/`catch` because learner code can replace `sys.stdout` (a system-boundary case).

- [ ] **Step 5: Run it to verify it passes**

Run: `npx vitest run src/worker/runPython.test.js`
Expected: PASS (15 tests).

- [ ] **Step 6: Make the worker delegate to `runPython`**

Replace the whole of `src/worker/pyodideWorker.js` with:

```js
import { loadPyodide, version as pyodideVersion } from "pyodide";
import { runPython } from "./runPython.js";

let pyodideReady = null;

async function initPyodide() {
  return loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
  });
}

self.onmessage = async (event) => {
  const { type, id, code, stdin } = event.data;

  if (type === "init") {
    try {
      pyodideReady = initPyodide();
      await pyodideReady;
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "error", message: String(err) });
    }
    return;
  }

  if (type === "run") {
    const pyodide = await pyodideReady;
    const { stdout, stderr } = await runPython(pyodide, code, { stdin });
    self.postMessage({ type: "result", id, stdout, stderr });
  }
};
```

- [ ] **Step 7: Verify nothing else broke**

Run: `npm run test && npm run lint && npm run build`
Expected: all green (31 existing tests + 15 new). The worker itself has no jsdom test; it is exercised live in Task 2 step 8.

- [ ] **Step 8: Checkpoint (no commit)**

`git status --short` shows only: `src/test/pyodideNode.js`, `src/worker/runPython.js`, `src/worker/runPython.test.js` (new) and `src/worker/pyodideWorker.js` (modified), plus the two docs.

---

### Task 2: Carry `stdin` from blocks to the worker

**Files:**
- Modify: `src/hooks/pyodideClient.js`
- Modify: `src/hooks/PyodideProvider.jsx`
- Modify: `src/blocks/CodeBlock.jsx`
- Modify: `src/blocks/Exercise.jsx`
- Test: `src/hooks/pyodideClient.test.js`, `src/blocks/CodeBlock.test.jsx`, `src/blocks/Exercise.test.jsx`

**Interfaces:**
- Consumes: `runPython(..., { stdin })` message contract from Task 1 (worker message `{ type: "run", id, code, stdin }`).
- Produces: `client.run(code, { stdin }?)`; context `run(code, options?)`; `<CodeBlock code stdin />`; `<Exercise ... stdin />` calling `run(code, { stdin })`.

- [ ] **Step 1: Write the failing tests**

In `src/hooks/pyodideClient.test.js`, insert before `it("unsubscribes a status listener", ...)`:

```js
  it("sends stdin with the run message", () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);

    client.run("x = input()", { stdin: "Ada" });

    const runCall = worker.postMessage.mock.calls.find(([msg]) => msg.type === "run");
    expect(runCall[0]).toMatchObject({ code: "x = input()", stdin: "Ada" });
  });

```

In `src/blocks/CodeBlock.test.jsx`, change the existing assertion and add a test. Replace:

```js
    expect(run).toHaveBeenCalledWith("print(1)");
  });
```

with:

```js
    expect(run).toHaveBeenCalledWith("print(1)", { stdin: undefined });
  });

  it("passes the block's stdin to run", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "Ada\n", stderr: "" });
    renderWithContext(<CodeBlock code="print(input())" stdin="Ada" />, { run });

    fireEvent.click(screen.getByRole("button", { name: /run/i }));

    await waitFor(() => expect(run).toHaveBeenCalledWith("print(input())", { stdin: "Ada" }));
  });
```

In `src/blocks/Exercise.test.jsx`, change the helper to forward extra props. Replace:

```jsx
function renderExercise({ run, onExercisePass } = {}) {
  return render(
    <PyodideContext.Provider value={{ status: "ready", run }}>
      <Exercise
        id="ex-1"
        lessonSlug="control-flow"
        prompt="print odd"
        starterCode="x = 7\n"
        check={{ type: "stdout-exact", expected: "odd" }}
        onExercisePass={onExercisePass}
      />
    </PyodideContext.Provider>
  );
}
```

with:

```jsx
function renderExercise({ run, onExercisePass, ...props } = {}) {
  return render(
    <PyodideContext.Provider value={{ status: "ready", run }}>
      <Exercise
        id="ex-1"
        lessonSlug="control-flow"
        prompt="print odd"
        starterCode="x = 7\n"
        check={{ type: "stdout-exact", expected: "odd" }}
        onExercisePass={onExercisePass}
        {...props}
      />
    </PyodideContext.Provider>
  );
}
```

and add inside `describe("Exercise", ...)`, after the last test:

```jsx
  it("passes the exercise's stdin to run", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "odd\n", stderr: "" });
    renderExercise({ run, stdin: "7" });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => expect(run).toHaveBeenCalledWith("x = 7\\n", { stdin: "7" }));
  });
```

The assertion string is `"x = 7\\n"` (a backslash and an `n`) on purpose: the helper's `starterCode="x = 7\n"` is a JSX attribute string, and JSX attribute strings do not process escape sequences, so the component receives those literal characters.

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/hooks/pyodideClient.test.js src/blocks/CodeBlock.test.jsx src/blocks/Exercise.test.jsx`
Expected: FAIL — the new/changed assertions (stdin missing).

- [ ] **Step 3: Implement**

`src/hooks/pyodideClient.js` — replace the `run` function:

```js
  function run(code, { stdin } = {}) {
    const id = nextId++;
    return new Promise((resolve) => {
      pending.set(id, { resolve });
      worker.postMessage({ type: "run", id, code, stdin });
    });
  }
```

`src/hooks/PyodideProvider.jsx` — change two lines. Replace `const run = useCallback((code) => {` with `const run = useCallback((code, options) => {`, and replace `current.client.run(code).then(` with `current.client.run(code, options).then(`.

`src/blocks/CodeBlock.jsx` — replace `export default function CodeBlock({ code: initialCode }) {` with `export default function CodeBlock({ code: initialCode, stdin }) {`, and replace `const result = await run(code);` with `const result = await run(code, { stdin });`.

`src/blocks/Exercise.jsx` — replace the signature line `export default function Exercise({ id, prompt, starterCode, check, lessonSlug, onExercisePass }) {` with `export default function Exercise({ id, prompt, starterCode, check, stdin, lessonSlug, onExercisePass }) {`, and replace `const { stdout, stderr } = await run(code);` with `const { stdout, stderr } = await run(code, { stdin });`.

- [ ] **Step 4: Run them to verify they pass**

Run: `npx vitest run src/hooks/pyodideClient.test.js src/blocks/CodeBlock.test.jsx src/blocks/Exercise.test.jsx`
Expected: PASS.

- [ ] **Step 5: Full verification**

Run: `npm run test && npm run lint && npm run build`
Expected: all green.

- [ ] **Step 6: Live check of the refactored worker (existing flows)**

Start the dev server with the `learn-python-dev` entry (preview_start name `learn-python-dev`, port 5174). Open `/lessons/welcome`. Wait for the status badge to say ready.
- Click **Run** on the example: output shows `Hello, world!`.
- Click **Check** on the exercise without editing: a "Not quite yet" panel appears with the expected text (starter prints nothing).
- Read the browser console: no errors.
Do not type into the CodeMirror editor (synthetic typing is unreliable); the stdin path is verified live in Task 8 with a real lesson.

- [ ] **Step 7: Checkpoint (no commit)**

Confirm `npm run test`, `npm run lint`, `npm run build` are green; stop the preview server.

---

### Task 3: The `heading` block

**Files:**
- Create: `src/blocks/blockTypes.js`
- Create: `src/blocks/Heading.jsx`
- Create: `src/blocks/Heading.test.jsx`
- Create: `src/blocks/registry.test.jsx`
- Modify: `src/blocks/registry.js`

**Interfaces:**
- Produces: `BLOCK_TYPES = ["prose", "heading", "example", "exercise"]`; block `{ type: "heading", text }` rendered as an `<h2>`; `blockRegistry.heading`.

- [ ] **Step 1: Write the failing tests**

`src/blocks/Heading.test.jsx`:

```jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Heading from "./Heading.jsx";

describe("Heading", () => {
  it("renders its text as a level-2 heading", () => {
    render(<Heading text="Common mistakes" />);
    expect(screen.getByRole("heading", { level: 2, name: "Common mistakes" })).toBeInTheDocument();
  });
});
```

`src/blocks/registry.test.jsx`:

```jsx
import { describe, it, expect, vi } from "vitest";
import { blockRegistry } from "./registry.js";
import { BLOCK_TYPES } from "./blockTypes.js";

vi.mock("./PythonEditor.jsx", () => ({ default: () => null }));

describe("blockRegistry", () => {
  it("registers exactly the known block types", () => {
    expect(Object.keys(blockRegistry).sort()).toEqual([...BLOCK_TYPES].sort());
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/blocks/Heading.test.jsx src/blocks/registry.test.jsx`
Expected: FAIL — cannot resolve `./Heading.jsx` / `./blockTypes.js`.

- [ ] **Step 3: Implement**

`src/blocks/blockTypes.js`:

```js
export const BLOCK_TYPES = ["prose", "heading", "example", "exercise"];
```

`src/blocks/Heading.jsx`:

```jsx
export default function Heading({ text }) {
  return (
    <h2 className="mb-2 mt-10 font-mono text-lg font-semibold tracking-tight text-indigo">
      {text}
    </h2>
  );
}
```

`src/blocks/registry.js` — replace the whole file:

```js
import Prose from "./Prose.jsx";
import Heading from "./Heading.jsx";
import CodeBlock from "./CodeBlock.jsx";
import Exercise from "./Exercise.jsx";

export const blockRegistry = {
  prose: Prose,
  heading: Heading,
  example: CodeBlock,
  exercise: Exercise,
};
```

- [ ] **Step 4: Run them to verify they pass**

Run: `npx vitest run src/blocks/Heading.test.jsx src/blocks/registry.test.jsx`
Expected: PASS.

- [ ] **Step 5: Full verification and checkpoint (no commit)**

Run: `npm run test && npm run lint && npm run build`
Expected: all green.

---

### Task 4: Unit grouping (util, Sidebar, Home)

**Files:**
- Modify: `src/content/lessonUtils.js`
- Modify: `src/components/Sidebar.jsx`
- Modify: `src/pages/Home.jsx`
- Test: `src/content/lessonUtils.test.js`, `src/components/Sidebar.test.jsx`

**Interfaces:**
- Produces:
  - `groupByUnit(lessons) → [{ unit: string, items: [{ lesson, number }] }]` — consecutive lessons sharing `lesson.unit` form one group; `number` is the 1-based position in the flat list; a missing `unit` groups under `"Lessons"`.
  - `getUnitProgress(group, progress) → { done: number, total: number }`.

- [ ] **Step 1: Write the failing util tests**

In `src/content/lessonUtils.test.js`, add `groupByUnit` and `getUnitProgress` to the import list from `./lessonUtils.js`, then append:

```js
const unitLessons = [
  { slug: "a", unit: "One", blocks: [{ type: "exercise", id: "a-1" }] },
  { slug: "b", unit: "One", blocks: [{ type: "exercise", id: "b-1" }] },
  { slug: "c", unit: "Two", blocks: [{ type: "exercise", id: "c-1" }] },
  { slug: "d", blocks: [{ type: "exercise", id: "d-1" }] },
];

describe("groupByUnit", () => {
  it("groups consecutive lessons by unit and keeps flat numbering", () => {
    const groups = groupByUnit(unitLessons);
    expect(groups.map((g) => g.unit)).toEqual(["One", "Two", "Lessons"]);
    expect(groups[0].items.map((i) => [i.lesson.slug, i.number])).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
    expect(groups[1].items.map((i) => i.number)).toEqual([3]);
    expect(groups[2].items.map((i) => i.number)).toEqual([4]);
  });
});

describe("getUnitProgress", () => {
  it("counts completed lessons in a group", () => {
    const [first] = groupByUnit(unitLessons);
    expect(getUnitProgress(first, { a: { "a-1": true } })).toEqual({ done: 1, total: 2 });
  });
});
```

- [ ] **Step 2: Write the failing Sidebar tests**

In `src/components/Sidebar.test.jsx`, append inside the file (after the existing `describe`):

```jsx
const unitLessons = [
  { slug: "a", title: "Lesson A", unit: "Unit One", blocks: [{ type: "exercise", id: "a-1" }] },
  { slug: "b", title: "Lesson B", unit: "Unit One", blocks: [{ type: "exercise", id: "b-1" }] },
  { slug: "c", title: "Lesson C", unit: "Unit Two", blocks: [{ type: "exercise", id: "c-1" }] },
];

function renderUnits(progress) {
  return render(
    <PyodideContext.Provider value={{ status: "ready", run: async () => ({}) }}>
      <MemoryRouter initialEntries={["/lessons/a"]}>
        <Sidebar lessons={unitLessons} progress={progress} />
      </MemoryRouter>
    </PyodideContext.Provider>
  );
}

describe("Sidebar units", () => {
  it("groups lessons under unit headings with completion counts", () => {
    renderUnits({ a: { "a-1": true } });
    expect(screen.getByText("Unit One").closest("summary")).toHaveTextContent("1/2");
    expect(screen.getByText("Unit Two").closest("summary")).toHaveTextContent("0/1");
  });

  it("opens only the unit that contains the current lesson", () => {
    renderUnits({});
    expect(screen.getByText("Unit One").closest("details")).toHaveAttribute("open");
    expect(screen.getByText("Unit Two").closest("details")).not.toHaveAttribute("open");
  });

  it("numbers lessons across units", () => {
    renderUnits({});
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run them to verify they fail**

Run: `npx vitest run src/content/lessonUtils.test.js src/components/Sidebar.test.jsx`
Expected: FAIL — `groupByUnit`/`getUnitProgress` not exported; no unit headings.

- [ ] **Step 4: Implement the util**

Append to `src/content/lessonUtils.js`:

```js
export function groupByUnit(lessons) {
  const groups = [];
  lessons.forEach((lesson, index) => {
    const unit = lesson.unit ?? "Lessons";
    const item = { lesson, number: index + 1 };
    const last = groups[groups.length - 1];
    if (last && last.unit === unit) {
      last.items.push(item);
    } else {
      groups.push({ unit, items: [item] });
    }
  });
  return groups;
}

export function getUnitProgress(group, progress) {
  return {
    done: group.items.filter(({ lesson }) => isLessonComplete(lesson, progress)).length,
    total: group.items.length,
  };
}
```

- [ ] **Step 5: Implement the Sidebar**

Replace the whole of `src/components/Sidebar.jsx`:

```jsx
import { NavLink, useMatch } from "react-router-dom";
import { getUnitProgress, groupByUnit, isLessonComplete } from "../content/lessonUtils.js";
import PyodideStatusBadge from "./PyodideStatusBadge.jsx";

export default function Sidebar({ lessons, progress }) {
  const currentSlug = useMatch("/lessons/:slug")?.params.slug;

  return (
    <nav className="sticky top-0 h-screen w-64 shrink-0 self-start overflow-y-auto border-r border-rule bg-paper p-4 font-mono">
      <NavLink to="/" className="mb-6 block text-sm font-semibold tracking-tight text-indigo">
        <span aria-hidden="true">&gt;&gt;&gt;</span> Learn Python
      </NavLink>
      <div className="space-y-1">
        {groupByUnit(lessons).map((group) => {
          const { done, total } = getUnitProgress(group, progress);
          const containsCurrent = group.items.some(({ lesson }) => lesson.slug === currentSlug);
          return (
            <details key={group.unit} open={containsCurrent} className="group">
              <summary className="flex cursor-pointer items-baseline justify-between rounded-sm px-2 py-1 text-xs font-semibold uppercase tracking-widest text-ink/60 hover:bg-card">
                <span className="flex items-baseline">
                  <span
                    aria-hidden="true"
                    className="mr-1 inline-block transition-transform group-open:rotate-90"
                  >
                    ›
                  </span>
                  <span>{group.unit}</span>
                </span>
                <span className="tabular-nums text-ink/40">
                  {done}/{total}
                </span>
              </summary>
              <ol className="mt-0.5 space-y-0.5">
                {group.items.map(({ lesson, number }) => (
                  <li key={lesson.slug}>
                    <NavLink
                      to={`/lessons/${lesson.slug}`}
                      className={({ isActive }) =>
                        `flex items-baseline gap-2 rounded-sm px-2 py-1 text-sm ${
                          isActive
                            ? "border-l-2 border-indigo bg-card font-medium text-indigo"
                            : "border-l-2 border-transparent text-ink/70 hover:border-rule hover:bg-card"
                        }`
                      }
                    >
                      <span className="w-4 shrink-0 text-right text-xs tabular-nums text-ink/40">
                        {isLessonComplete(lesson, progress) ? "✓" : String(number).padStart(2, "0")}
                      </span>
                      <span className="truncate">{lesson.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ol>
            </details>
          );
        })}
      </div>
      <div className="mt-6 border-t border-rule pt-3">
        <PyodideStatusBadge />
      </div>
    </nav>
  );
}
```

The unit name sits in its own `<span>` so `getByText("Unit One")` matches it exactly.

- [ ] **Step 6: Implement Home grouping**

Replace the whole of `src/pages/Home.jsx`:

```jsx
import { Link } from "react-router-dom";
import { lessons } from "../content/courses/python-core/lessonIndex.js";
import { useProgress } from "../hooks/useProgress.js";
import {
  getContinueLesson,
  getUnitProgress,
  groupByUnit,
  isLessonComplete,
} from "../content/lessonUtils.js";

export default function Home() {
  const { progress } = useProgress();
  const continueLesson = getContinueLesson(lessons, progress);
  const completedCount = lessons.filter((lesson) => isLessonComplete(lesson, progress)).length;

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-paper px-8 py-16">
      <h1 className="mb-3 font-mono text-3xl font-semibold tracking-tight text-indigo">
        Learn Python
      </h1>
      <p className="mb-8 font-body text-lg leading-relaxed text-ink/80">
        A {lessons.length}-lesson course covering core Python syntax from scratch — no prior
        coding experience required. {completedCount} of {lessons.length} lessons complete.
      </p>
      <Link
        to={`/lessons/${continueLesson.slug}`}
        className="inline-flex items-center gap-2 rounded-sm bg-indigo px-4 py-2 font-mono text-sm text-paper transition-opacity hover:opacity-90"
      >
        <span aria-hidden="true">&gt;&gt;&gt;</span>
        {completedCount === 0 ? "Start the course" : "Continue where you left off"}
      </Link>
      <div className="mt-10 border-t border-rule pt-2">
        {groupByUnit(lessons).map((group) => {
          const { done, total } = getUnitProgress(group, progress);
          return (
            <section key={group.unit} className="mt-6">
              <h2 className="mb-2 flex items-baseline justify-between px-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink/50">
                <span>{group.unit}</span>
                <span className="tabular-nums text-ink/40">
                  {done}/{total}
                </span>
              </h2>
              <ol className="space-y-1 font-mono text-sm">
                {group.items.map(({ lesson, number }) => (
                  <li key={lesson.slug}>
                    <Link
                      to={`/lessons/${lesson.slug}`}
                      className="flex items-baseline gap-2 rounded-sm px-2 py-1 text-ink/70 hover:bg-card hover:text-indigo"
                    >
                      <span className="w-4 shrink-0 text-right text-xs tabular-nums text-ink/40">
                        {isLessonComplete(lesson, progress) ? "✓" : String(number).padStart(2, "0")}
                      </span>
                      <span className="font-body text-base">{lesson.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
      <footer className="mt-10 border-t border-rule pt-6 font-mono text-sm text-ink/50">
        Questions or feedback?{" "}
        <a href="mailto:warmonkey@jakechurchill.com" className="text-indigo hover:underline">
          warmonkey@jakechurchill.com
        </a>
      </footer>
    </div>
  );
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run src/content/lessonUtils.test.js src/components/Sidebar.test.jsx`
Expected: PASS (the original Sidebar checkmark test still passes: legacy lessons without `unit` group under "Lessons", which contains the current lesson and is open).

- [ ] **Step 8: Live check**

`npm run dev` via preview_start `learn-python-dev`. Home (`/`): lessons appear under a single "Lessons" heading with `0/17` (no lesson has `unit` yet) and the numbered list is intact. Open `/lessons/loops`: the sidebar is sticky, scrolls independently, the "Lessons" group is open with a rotated chevron, the current lesson is highlighted. Click the "Lessons" summary: it collapses and expands. No console errors.

- [ ] **Step 9: Full verification and checkpoint (no commit)**

Run: `npm run test && npm run lint && npm run build`
Expected: all green. Stop the preview server.

---

### Task 5: Exercise hint and solution reveal

**Files:**
- Modify: `src/blocks/Exercise.jsx`
- Test: `src/blocks/Exercise.test.jsx`

**Interfaces:**
- Consumes: Task 2's `stdin` prop and `renderExercise({ ...props })` helper.
- Produces: optional exercise fields `hint` (string) and `solution` (string). A "Hint" toggle exists whenever `hint` is set. A "Show solution" toggle appears only after a failed check when `solution` is set.

- [ ] **Step 1: Write the failing tests**

Append inside `describe("Exercise", ...)` in `src/blocks/Exercise.test.jsx`:

```jsx
  it("toggles the hint when the exercise has one", () => {
    renderExercise({ run: vi.fn(), hint: "Use the modulo operator." });

    expect(screen.queryByText("Use the modulo operator.")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hint" }));
    expect(screen.getByText("Use the modulo operator.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hide hint" }));
    expect(screen.queryByText("Use the modulo operator.")).not.toBeInTheDocument();
  });

  it("has no hint button when the exercise has no hint", () => {
    renderExercise({ run: vi.fn() });
    expect(screen.queryByRole("button", { name: /hint/i })).not.toBeInTheDocument();
  });

  it("offers the solution only after a failed check", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "even\n", stderr: "" });
    renderExercise({ run, solution: 'print("odd")' });

    expect(screen.queryByRole("button", { name: /solution/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /check/i }));
    await waitFor(() => expect(screen.getByText(/Not quite/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Show solution" }));
    expect(screen.getByText('print("odd")')).toBeInTheDocument();
  });

  it("does not offer the solution after a pass", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "odd\n", stderr: "" });
    renderExercise({ run, solution: 'print("odd")' });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));
    await waitFor(() => expect(screen.getByText("Passed!")).toBeInTheDocument());

    expect(screen.queryByRole("button", { name: /solution/i })).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/blocks/Exercise.test.jsx`
Expected: FAIL — no Hint/solution buttons.

- [ ] **Step 3: Implement**

Replace the whole of `src/blocks/Exercise.jsx`:

```jsx
import { useState } from "react";
import PythonEditor from "./PythonEditor.jsx";
import { usePyodideContext } from "../hooks/PyodideProvider.jsx";
import { runCheck } from "./checkers.js";

export default function Exercise({
  id,
  prompt,
  starterCode,
  check,
  stdin,
  hint,
  solution,
  lessonSlug,
  onExercisePass,
}) {
  const { status, run } = usePyodideContext();
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  async function handleCheck() {
    setChecking(true);
    const { stdout, stderr } = await run(code, { stdin });
    let passed = false;
    try {
      passed = !stderr && runCheck(stdout, check);
    } catch {
      passed = false;
    }
    setResult({ passed, actual: stderr || stdout });
    setChecking(false);
    if (passed) {
      onExercisePass?.(lessonSlug, id);
    }
  }

  const toggleClass = "font-mono text-sm text-ink/60 hover:text-pine";

  return (
    <div className="my-6 overflow-hidden rounded-md border-t-2 border-pine bg-card">
      <div className="px-3 pt-2">
        <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-widest text-pine">
          Prove it
        </span>
        <p className="mb-2 mt-1 font-body text-[1.0625rem] text-ink">{prompt}</p>
      </div>
      <PythonEditor value={code} onChange={setCode} />
      <div className="flex flex-wrap items-center gap-3 border-t border-rule p-2">
        <button
          type="button"
          onClick={handleCheck}
          disabled={status !== "ready" || checking}
          className="rounded-sm bg-pine px-3 py-1 font-mono text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status !== "ready" ? "Loading Python…" : checking ? "Checking…" : "Check"}
        </button>
        {hint && (
          <button type="button" onClick={() => setShowHint((shown) => !shown)} className={toggleClass}>
            {showHint ? "Hide hint" : "Hint"}
          </button>
        )}
        {solution && result && !result.passed && (
          <button
            type="button"
            onClick={() => setShowSolution((shown) => !shown)}
            className={toggleClass}
          >
            {showSolution ? "Hide solution" : "Show solution"}
          </button>
        )}
        {result?.passed && <span className="font-mono text-sm text-pine">Passed!</span>}
      </div>
      {showHint && hint && (
        <p className="border-t border-rule px-3 py-2 font-body text-[0.9375rem] text-ink/80">
          {hint}
        </p>
      )}
      {showSolution && solution && result && !result.passed && (
        <div className="border-t border-rule p-3">
          <p className="mb-2 font-mono text-sm text-ink/60">One possible solution:</p>
          <pre className="whitespace-pre-wrap rounded-sm bg-paper p-2 font-mono text-sm text-ink">
            {solution}
          </pre>
        </div>
      )}
      {result && (
        <div
          className={`border-t border-rule p-3 font-mono text-sm ${result.passed ? "text-ink" : "text-rust"}`}
        >
          <p className="mb-2">
            {result.passed
              ? "Output:"
              : "Not quite yet — here's what your code produced:"}
          </p>
          <pre className="mb-2 whitespace-pre-wrap rounded-sm bg-paper p-2">
            {result.actual || "(no output)"}
          </pre>
          {!result.passed && (
            <>
              <p className="mb-2">Expected:</p>
              <pre className="whitespace-pre-wrap rounded-sm bg-paper p-2">{check.expected}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run to verify they pass**

Run: `npx vitest run src/blocks/Exercise.test.jsx`
Expected: PASS (original 3 + stdin 1 + 4 new).

- [ ] **Step 5: Full verification and checkpoint (no commit)**

Run: `npm run test && npm run lint && npm run build`
Expected: all green.

---

### Task 6: The `returns` check type

**Files:**
- Modify: `src/blocks/checkers.js`
- Modify: `src/blocks/Exercise.jsx`
- Test: `src/blocks/checkers.test.js`, `src/blocks/Exercise.test.jsx`
- Create: `src/blocks/returnsCheck.test.js`

**Interfaces:**
- Consumes: `runPython` (Task 1) for the integration test; Task 5's Exercise.
- Produces in `checkers.js`:
  - `RETURNS_SENTINEL = "\x1e"`
  - `buildReturnsHarness(check) → string` (Python source)
  - `parseReturnsOutput(stdout) → { learnerOutput: string, results: [{ call, got, expected }] } | null`
  - `runCheck(stdout, check)` — gains the `"returns"` case
  - `buildRunnableCode(code, check) → string` — `code` itself for `stdout-exact`; `code + "\n" + harness` for `returns`
  - `gradeRun({ stdout, stderr }, check) → { passed: boolean, actual: string, mismatches: [{ call, got, expected }] }`
- Check shape: `{ type: "returns", cases: [{ call: "square(6)", expected: "36" }] }`; `expected` is the `repr` of the expected value (`"36"`, `"'abc'"`, `"[1, 2]"`).

- [ ] **Step 1: Write the failing pure tests**

In `src/blocks/checkers.test.js`, change the import to:

```js
import {
  normalizeOutput,
  checkStdoutExact,
  runCheck,
  RETURNS_SENTINEL,
  buildReturnsHarness,
  parseReturnsOutput,
  buildRunnableCode,
  gradeRun,
} from "./checkers.js";
```

and append:

```js
const returnsCheck = {
  type: "returns",
  cases: [
    { call: "square(6)", expected: "36" },
    { call: "square(-2)", expected: "4" },
  ],
};

function returnsStdout(results, learnerOutput = "") {
  return `${learnerOutput}${RETURNS_SENTINEL}${JSON.stringify(results)}\n`;
}

describe("buildReturnsHarness", () => {
  it("embeds each call with its expected repr and prints the sentinel last", () => {
    const harness = buildReturnsHarness(returnsCheck);
    expect(harness).toContain('["square(6)","36"]');
    expect(harness).toContain('["square(-2)","4"]');
    expect(harness).toContain("\\x1e");
  });
});

describe("parseReturnsOutput", () => {
  it("splits learner output from the results at the last sentinel", () => {
    const stdout = returnsStdout([["square(6)", "36", "36"]], "debug\n");
    expect(parseReturnsOutput(stdout)).toEqual({
      learnerOutput: "debug\n",
      results: [{ call: "square(6)", got: "36", expected: "36" }],
    });
  });

  it("returns null when there is no sentinel", () => {
    expect(parseReturnsOutput("just output\n")).toBeNull();
  });

  it("returns null when the results are not valid JSON", () => {
    expect(parseReturnsOutput(`${RETURNS_SENTINEL}not json`)).toBeNull();
  });
});

describe("runCheck returns", () => {
  it("passes only when every call returned its expected value", () => {
    expect(runCheck(returnsStdout([["a", "1", "1"], ["b", "2", "2"]]), returnsCheck)).toBe(true);
    expect(runCheck(returnsStdout([["a", "1", "1"], ["b", "3", "2"]]), returnsCheck)).toBe(false);
  });

  it("fails when the harness never ran", () => {
    expect(runCheck("36\n", returnsCheck)).toBe(false);
  });
});

describe("buildRunnableCode", () => {
  it("leaves stdout-exact code unchanged", () => {
    expect(buildRunnableCode("print(1)", { type: "stdout-exact", expected: "1" })).toBe("print(1)");
  });

  it("appends the harness for a returns check", () => {
    const code = buildRunnableCode("def square(n):\n    return n * n", returnsCheck);
    expect(code.startsWith("def square(n):\n    return n * n\n")).toBe(true);
    expect(code).toContain("square(6)");
  });
});

describe("gradeRun", () => {
  it("fails with the stderr text when there is a runtime error", () => {
    expect(gradeRun({ stdout: "", stderr: "NameError" }, returnsCheck)).toEqual({
      passed: false,
      actual: "NameError",
      mismatches: [],
    });
  });

  it("grades stdout-exact by normalized output", () => {
    const check = { type: "stdout-exact", expected: "odd" };
    expect(gradeRun({ stdout: "odd\n", stderr: "" }, check).passed).toBe(true);
    expect(gradeRun({ stdout: "even\n", stderr: "" }, check)).toEqual({
      passed: false,
      actual: "even\n",
      mismatches: [],
    });
  });

  it("reports each mismatch for a returns check", () => {
    const stdout = returnsStdout([["square(6)", "6", "36"], ["square(-2)", "4", "4"]], "hi\n");
    expect(gradeRun({ stdout, stderr: "" }, returnsCheck)).toEqual({
      passed: false,
      actual: "hi\n",
      mismatches: [{ call: "square(6)", got: "6", expected: "36" }],
    });
  });

  it("fails a returns check whose harness never printed results", () => {
    expect(gradeRun({ stdout: "oops\n", stderr: "" }, returnsCheck)).toEqual({
      passed: false,
      actual: "oops\n",
      mismatches: [],
    });
  });

  it("treats an unknown check type as a failure", () => {
    expect(gradeRun({ stdout: "x", stderr: "" }, { type: "nope" }).passed).toBe(false);
  });
});
```

- [ ] **Step 2: Write the failing Pyodide integration test**

`src/blocks/returnsCheck.test.js`:

```js
// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { loadNodePyodide } from "../test/pyodideNode.js";
import { runPython } from "../worker/runPython.js";
import { buildRunnableCode, gradeRun } from "./checkers.js";

const check = {
  type: "returns",
  cases: [
    { call: "square(6)", expected: "36" },
    { call: "square(-3)", expected: "9" },
  ],
};

let pyodide;

beforeAll(async () => {
  pyodide = await loadNodePyodide();
}, 120000);

async function grade(code) {
  return gradeRun(await runPython(pyodide, buildRunnableCode(code, check)), check);
}

describe("returns check against real Python", () => {
  it("passes a correct function", async () => {
    const graded = await grade("def square(n):\n    return n * n\n");
    expect(graded.passed).toBe(true);
    expect(graded.mismatches).toEqual([]);
  });

  it("reports wrong return values", async () => {
    const graded = await grade("def square(n):\n    return n\n");
    expect(graded.passed).toBe(false);
    expect(graded.mismatches).toEqual([
      { call: "square(6)", got: "6", expected: "36" },
      { call: "square(-3)", got: "-3", expected: "9" },
    ]);
  });

  it("treats a function that prints instead of returning as wrong", async () => {
    const graded = await grade("def square(n):\n    print(n * n)\n");
    expect(graded.passed).toBe(false);
    expect(graded.mismatches[0]).toEqual({ call: "square(6)", got: "None", expected: "36" });
  });

  it("reports an exception raised inside a call", async () => {
    const graded = await grade('def square(n):\n    raise ValueError("no")\n');
    expect(graded.passed).toBe(false);
    expect(graded.mismatches[0].got).toBe("raised ValueError: no");
  });

  it("fails with the traceback when the learner's own code is broken", async () => {
    const graded = await grade("def square(n:\n");
    expect(graded.passed).toBe(false);
    expect(graded.actual).toContain("SyntaxError");
  });

  it("keeps the learner's own prints out of the grading", async () => {
    const graded = await grade("def square(n):\n    print('debug')\n    return n * n\n");
    expect(graded.passed).toBe(true);
    expect(graded.actual).toContain("debug");
  });
});
```

- [ ] **Step 3: Write the failing Exercise tests**

Append inside `describe("Exercise", ...)` in `src/blocks/Exercise.test.jsx`:

```jsx
  const returnsCheck = {
    type: "returns",
    cases: [{ call: "square(6)", expected: "36" }],
  };

  it("grades a returns check from the harness output", async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: `\x1e${JSON.stringify([["square(6)", "36", "36"]])}\n`,
      stderr: "",
    });
    const onExercisePass = vi.fn();
    renderExercise({ run, onExercisePass, check: returnsCheck });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => expect(screen.getByText("Passed!")).toBeInTheDocument());
    expect(run).toHaveBeenCalledWith(expect.stringContaining("square(6)"), { stdin: undefined });
    expect(onExercisePass).toHaveBeenCalledWith("control-flow", "ex-1");
  });

  it("lists mismatching calls for a failed returns check", async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: `\x1e${JSON.stringify([["square(6)", "6", "36"]])}\n`,
      stderr: "",
    });
    renderExercise({ run, check: returnsCheck });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => expect(screen.getByText(/Not quite/)).toBeInTheDocument());
    expect(screen.getByText("square(6)")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();
    expect(screen.queryByText("Expected:")).not.toBeInTheDocument();
  });
```

- [ ] **Step 4: Run to verify they fail**

Run: `npx vitest run src/blocks/checkers.test.js src/blocks/returnsCheck.test.js src/blocks/Exercise.test.jsx`
Expected: FAIL — missing exports; `returns` unknown.

- [ ] **Step 5: Implement the checkers**

Replace the whole of `src/blocks/checkers.js`:

```js
export const RETURNS_SENTINEL = "\x1e";

export function normalizeOutput(output) {
  return output
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export function checkStdoutExact(actualStdout, check) {
  return normalizeOutput(actualStdout) === normalizeOutput(check.expected);
}

export function buildReturnsHarness(check) {
  const pairs = check.cases.map(({ call, expected }) => [call, expected]);
  return [
    "import json as _json",
    `_cases = ${JSON.stringify(pairs)}`,
    "_results = []",
    "for _call, _expected in _cases:",
    "    try:",
    "        _results.append([_call, repr(eval(_call)), _expected])",
    "    except Exception as _error:",
    '        _results.append([_call, "raised " + type(_error).__name__ + ": " + str(_error), _expected])',
    'print("\\x1e" + _json.dumps(_results))',
  ].join("\n");
}

export function parseReturnsOutput(stdout) {
  const at = stdout.lastIndexOf(RETURNS_SENTINEL);
  if (at === -1) return null;
  try {
    const rows = JSON.parse(stdout.slice(at + 1));
    return {
      learnerOutput: stdout.slice(0, at),
      results: rows.map(([call, got, expected]) => ({ call, got, expected })),
    };
  } catch {
    return null;
  }
}

export function runCheck(actualStdout, check) {
  switch (check.type) {
    case "stdout-exact":
      return checkStdoutExact(actualStdout, check);
    case "returns": {
      const parsed = parseReturnsOutput(actualStdout);
      return parsed !== null && parsed.results.every(({ got, expected }) => got === expected);
    }
    default:
      throw new Error(`Unknown check type: ${check.type}`);
  }
}

export function buildRunnableCode(code, check) {
  return check.type === "returns" ? `${code}\n${buildReturnsHarness(check)}` : code;
}

export function gradeRun({ stdout, stderr }, check) {
  if (stderr) return { passed: false, actual: stderr, mismatches: [] };
  if (check.type === "returns") {
    const parsed = parseReturnsOutput(stdout);
    if (parsed === null) return { passed: false, actual: stdout, mismatches: [] };
    const mismatches = parsed.results.filter(({ got, expected }) => got !== expected);
    return { passed: mismatches.length === 0, actual: parsed.learnerOutput, mismatches };
  }
  let passed = false;
  try {
    passed = runCheck(stdout, check);
  } catch {
    passed = false;
  }
  return { passed, actual: stdout, mismatches: [] };
}
```

- [ ] **Step 6: Switch Exercise to `gradeRun`**

In `src/blocks/Exercise.jsx` make three edits.

(a) Replace the import `import { runCheck } from "./checkers.js";` with `import { buildRunnableCode, gradeRun } from "./checkers.js";`.

(b) Replace the whole `handleCheck` function with:

```jsx
  async function handleCheck() {
    setChecking(true);
    const { stdout, stderr } = await run(buildRunnableCode(code, check), { stdin });
    const graded = gradeRun({ stdout, stderr }, check);
    setResult(graded);
    setChecking(false);
    if (graded.passed) {
      onExercisePass?.(lessonSlug, id);
    }
  }
```

(c) Replace the whole `{result && ( ... )}` result panel (the last block before the closing `</div>`) with:

```jsx
      {result && (
        <div
          className={`border-t border-rule p-3 font-mono text-sm ${result.passed ? "text-ink" : "text-rust"}`}
        >
          {result.passed ? (
            result.actual && (
              <>
                <p className="mb-2">Output:</p>
                <pre className="whitespace-pre-wrap rounded-sm bg-paper p-2">{result.actual}</pre>
              </>
            )
          ) : result.mismatches.length > 0 ? (
            <>
              <p className="mb-2">Not quite yet — your function gave these results:</p>
              <ul className="space-y-1">
                {result.mismatches.map((mismatch, index) => (
                  <li key={index}>
                    <code className="rounded-sm bg-paper px-1">{mismatch.call}</code> returned{" "}
                    <code className="rounded-sm bg-paper px-1">{mismatch.got}</code>, expected{" "}
                    <code className="rounded-sm bg-paper px-1">{mismatch.expected}</code>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="mb-2">Not quite yet — here's what your code produced:</p>
              <pre className="mb-2 whitespace-pre-wrap rounded-sm bg-paper p-2">
                {result.actual || "(no output)"}
              </pre>
              {check.type === "stdout-exact" && (
                <>
                  <p className="mb-2">Expected:</p>
                  <pre className="whitespace-pre-wrap rounded-sm bg-paper p-2">{check.expected}</pre>
                </>
              )}
            </>
          )}
        </div>
      )}
```

- [ ] **Step 7: Run to verify they pass**

Run: `npx vitest run src/blocks/checkers.test.js src/blocks/returnsCheck.test.js src/blocks/Exercise.test.jsx`
Expected: PASS. The earlier Exercise tests (pass, fail, runtime error, stdin, hint, solution) still pass; for a passed `stdout-exact` the output panel still shows `Output:` plus the text.

- [ ] **Step 8: Full verification and checkpoint (no commit)**

Run: `npm run test && npm run lint && npm run build`
Expected: all green.

---

### Task 7: The content verification suite

**Files:**
- Create: `src/content/courses.test.js`

**Interfaces:**
- Consumes: `runPython` (Task 1), `loadNodePyodide` (Task 1), `BLOCK_TYPES` (Task 3), `buildRunnableCode`/`gradeRun` (Task 6), `lessons` from `lessonIndex.js`.
- Produces: per-lesson-file tests named `"<file basename> <rule>"` (so authors can filter with `-t "^(a|b) "`), plus course-wide tests.
- "Migrated" lesson = declares `unit`. Legacy lessons (no `unit`) skip the migrated-only rules.

- [ ] **Step 1: Write the suite**

`src/content/courses.test.js`:

```js
// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { lessons as indexedLessons } from "./courses/python-core/lessonIndex.js";
import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import { buildRunnableCode, gradeRun } from "../blocks/checkers.js";
import { runPython } from "../worker/runPython.js";
import { loadNodePyodide } from "../test/pyodideNode.js";

const loaders = import.meta.glob("./courses/python-core/lessons/*.js");
const lessonPaths = Object.keys(loaders).sort();
const fileName = (path) => path.split("/").pop().replace(/\.js$/, "");
const load = async (path) => (await loaders[path]()).default;

const FORBIDDEN_LANGUAGE_REFERENCES = /\bjavascript\b|\bjs\b|\bjava\b|console\.log/i;

const RESET_FILES = `
import os, shutil
for _name in os.listdir("."):
    _path = os.path.join(".", _name)
    shutil.rmtree(_path) if os.path.isdir(_path) else os.remove(_path)
`;

const blocksOf = (lesson, type) => lesson.blocks.filter((block) => block.type === type);
const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;
const textFields = (lesson) =>
  lesson.blocks.flatMap((block) => [block.body, block.text, block.prompt, block.hint]).filter(Boolean);

let pyodide;

beforeAll(async () => {
  pyodide = await loadNodePyodide();
}, 120000);

function runIsolated(code, stdin) {
  pyodide.runPython(RESET_FILES);
  return runPython(pyodide, code, { stdin });
}

describe("course-wide invariants", () => {
  it("has unique slugs in lessonIndex", () => {
    const slugs = indexedLessons.map((lesson) => lesson.slug);
    expect(slugs.filter((slug, i) => slugs.indexOf(slug) !== i)).toEqual([]);
  });

  it("has unique slugs and exercise ids across every lesson file", async () => {
    const slugs = [];
    const ids = [];
    for (const path of lessonPaths) {
      const lesson = await load(path);
      slugs.push(lesson.slug);
      blocksOf(lesson, "exercise").forEach((block) => ids.push(block.id));
    }
    const duplicates = (list) => list.filter((item, i) => list.indexOf(item) !== i);
    expect(duplicates(slugs)).toEqual([]);
    expect(duplicates(ids)).toEqual([]);
  });

  it("lists each migrated unit as one contiguous run in lessonIndex", () => {
    const seen = new Set();
    let previous;
    const broken = [];
    for (const lesson of indexedLessons) {
      if (lesson.unit === undefined) {
        previous = undefined;
        continue;
      }
      if (lesson.unit !== previous && seen.has(lesson.unit)) broken.push(lesson.unit);
      seen.add(lesson.unit);
      previous = lesson.unit;
    }
    expect(broken).toEqual([]);
  });
});

describe.each(lessonPaths.map((path) => [fileName(path), path]))("%s", (_name, path) => {
  let lesson;

  beforeAll(async () => {
    lesson = await load(path);
  });

  it("has a valid structure", () => {
    expect(typeof lesson.slug).toBe("string");
    expect(typeof lesson.title).toBe("string");
    expect(Array.isArray(lesson.blocks)).toBe(true);
    for (const block of lesson.blocks) {
      expect(BLOCK_TYPES).toContain(block.type);
    }
    for (const block of blocksOf(lesson, "exercise")) {
      expect(typeof block.id).toBe("string");
      expect(typeof block.starterCode).toBe("string");
      expect(block.check).toBeDefined();
    }
  });

  it("keeps every example runnable", async () => {
    const failures = [];
    for (const [index, block] of lesson.blocks.entries()) {
      if (block.type !== "example") continue;
      const { stderr } = await runIsolated(block.code, block.stdin);
      if (block.showsError ? !stderr : stderr) {
        failures.push(`block ${index}: ${stderr || "expected an error but none occurred"}`);
      }
    }
    expect(failures).toEqual([]);
  }, 60000);

  it("has no references to other programming languages", () => {
    expect(textFields(lesson).filter((text) => FORBIDDEN_LANGUAGE_REFERENCES.test(text))).toEqual(
      []
    );
  });

  it("meets the depth floor", () => {
    if (lesson.unit === undefined) return;
    const exercises = blocksOf(lesson, "exercise");
    if (lesson.slug.startsWith("project-")) {
      expect(exercises.length).toBeGreaterThanOrEqual(4);
    } else if (lesson.slug.startsWith("review-")) {
      expect(exercises.length).toBeGreaterThanOrEqual(2);
    } else {
      const words = wordCount(blocksOf(lesson, "prose").map((block) => block.body).join(" "));
      expect(words).toBeGreaterThanOrEqual(450);
      expect(blocksOf(lesson, "example").length).toBeGreaterThanOrEqual(2);
      expect(exercises.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("has verified exercises", async () => {
    if (lesson.unit === undefined) return;
    const failures = [];
    for (const block of blocksOf(lesson, "exercise")) {
      if (typeof block.solution !== "string") {
        failures.push(`${block.id}: missing solution`);
        continue;
      }
      const solved = gradeRun(
        await runIsolated(buildRunnableCode(block.solution, block.check), block.stdin),
        block.check
      );
      if (!solved.passed) failures.push(`${block.id}: solution does not pass (${solved.actual})`);
      const starter = gradeRun(
        await runIsolated(buildRunnableCode(block.starterCode, block.check), block.stdin),
        block.check
      );
      if (starter.passed) failures.push(`${block.id}: starterCode already passes`);
    }
    expect(failures).toEqual([]);
  }, 120000);
});
```

- [ ] **Step 2: Run the suite against the existing 17 lessons**

Run: `npx vitest run src/content/courses.test.js`
Expected: PASS. All 17 lessons are legacy: structure, examples (17 run clean, checked beforehand), and the language-reference rule pass; the migrated-only rules return early.

- [ ] **Step 3: Prove the suite can fail (negative checks)**

Temporarily make three throwaway edits in a copy, one at a time, and confirm the suite goes red, then undo each:
1. In `src/content/courses/python-core/lessons/01-welcome.js` change the example to `print(undefined_name)`; run `npx vitest run src/content/courses.test.js -t "^01-welcome "`; expect the "keeps every example runnable" test to FAIL; revert the edit.
2. Add `unit: "Getting Started",` to `01-welcome.js` (no `solution` on its exercise); run the same filter; expect "has verified exercises" and "meets the depth floor" to FAIL; revert.
3. Add `{ type: "prose", body: "Unlike JavaScript, ..." }` to `01-welcome.js`; expect "has no references to other programming languages" to FAIL; revert.
After reverting, `git diff --stat src/content/courses/` must show no changes.

- [ ] **Step 4: Create the verification helper**

`scripts/py.mjs`:

```js
import { readFileSync } from "node:fs";
import { loadPyodide } from "pyodide";
import { runPython } from "../src/worker/runPython.js";

const [source, stdin] = process.argv.slice(2);
const code = source === "-" ? readFileSync(0, "utf8") : source;
const pyodide = await loadPyodide();
const { stdout, stderr } = await runPython(pyodide, code, { stdin });
process.stdout.write(stdout);
process.stderr.write(stderr);
```

Usage: `node scripts/py.mjs 'print(2 ** 10)'`, `node scripts/py.mjs 'print(input("n? "))' 'Ada'`, or pipe code with `-` as the first argument.

Smoke tests: `node scripts/py.mjs 'print(2 ** 10)'` prints `1024`, and this multi-line snippet prints `three` (it needs Python 3.10+, which the machine's `python3` lacks):

```bash
printf 'match 3:\n    case 3:\n        print("three")\n' | node scripts/py.mjs -
```

- [ ] **Step 5: Prove the file-isolation guard**

Temporarily add to `01-welcome.js` an example `{ type: "example", code: 'open("leak.txt", "w").write("x")' }` followed by a second example `{ type: "example", code: 'print(open("leak.txt").read())' }`; run `npx vitest run src/content/courses.test.js -t "^01-welcome "`; expect "keeps every example runnable" to FAIL (the second example cannot see the first run's file). Revert; `git diff --stat src/content/courses/` shows no changes.

- [ ] **Step 6: Full verification and checkpoint (no commit)**

Run: `npm run test && npm run lint && npm run build`
Expected: all green. Phase 1 is complete: the infrastructure exists, existing lessons still work, and the suite guards content.

---

## Content Authoring Protocol

Used by Phase 2 (the controller writes Unit 1 by hand) and Phase 3 (author subagents). An author or reviewer needs only this section, the spec, and the pilot lessons.

### Lesson file format

```js
export default {
  slug: "example-lesson",
  title: "Example Lesson",
  unit: "Getting Started",
  blocks: [
    { type: "prose", body: "Plain text with `inline code` in backticks. One paragraph per block." },
    { type: "heading", text: "A section heading" },
    { type: "example", code: `print("hi")` },
    { type: "example", code: `name = input("Name? ")\nprint("Hello,", name)`, stdin: "Ada" },
    { type: "example", code: `print(undefined_name)`, showsError: true },
    {
      type: "exercise",
      id: "example-lesson-1",
      prompt: "Print exactly: Hello",
      starterCode: `# write your code below\n`,
      check: { type: "stdout-exact", expected: "Hello" },
      solution: `print("Hello")\n`,
      hint: "Use the print() function.",
    },
    {
      type: "exercise",
      id: "example-lesson-2",
      prompt: "Write a function square(n) that returns n squared.",
      starterCode: `def square(n):\n    pass\n`,
      check: {
        type: "returns",
        cases: [
          { call: "square(6)", expected: "36" },
          { call: "square(-2)", expected: "4" },
        ],
      },
      solution: `def square(n):\n    return n * n\n`,
    },
  ],
};
```

Format rules:

- Block types are exactly `prose`, `heading`, `example`, `exercise`. Prose supports only plain paragraphs with inline code in single backticks (no bold, italics, or lists); use `heading` blocks for structure. A `heading`'s `text` is plain text: backticks would be shown literally, so write `Using range`, never `` Using `range` ``.
- `body`, `text`, `prompt`, `hint`, and `check.expected` are ordinary double-quoted JS strings: escape inner double quotes as `\"`, and write newlines as `\n`. `check.expected` is compared after trimming trailing spaces on each line and trimming both ends.
- `code`, `starterCode`, and `solution` are template literals. Real newlines are allowed. Write `\${` for a literal `${`, `` \` `` for a literal backtick, and `\\` for a literal backslash (Python's `"\n"` is written `"\\n"` inside a template literal).
- `stdin` is the text a user would type: lines separated by `\n`, one trailing newline ignored. `input()` echoes each consumed line after its prompt, so stdout shows `Name? Ada` and then the program's next output on a new line.
- Exercise ids are `<slug>-<n>` counting from 1. A lesson that keeps its slug also keeps the id listed for it in its unit task (its original exercise), which may sit anywhere in the lesson.
- `showsError: true` marks an example that is meant to fail; the suite then requires non-empty stderr.
- `unit` is required on every lesson and must be the exact unit name from the unit task.

### Exercise design rules

1. Ramp within a lesson: the first exercise is guided (scaffolded starter, one thing to fill in), the last is open-ended and has a `hint`.
2. The `prompt` states exactly what to print or return, including exact text for print-based exercises (`Print exactly: ...`). Never leave two reasonable outputs.
3. `starterCode` never contains the answer and is valid Python where possible (use comments for guidance). It must fail the check as written.
4. Every exercise has a `solution` that passes its own check, uses only concepts taught so far, and is the idiomatic way to write it.
5. Use `stdout-exact` for print exercises. From Unit 6 on, use `returns` for function and method exercises (the learner's own prints are ignored). `expected` in a `returns` case is the `repr` of the value (`"36"`, `"'abc'"`, `"[1, 2]"`).
6. Exercises that use `stdin` must say what the program receives and either pass the exact `input()` prompt in the starter code or state the exact prompt text to use, because the prompt and the echoed answer appear in stdout and `expected` includes them.
7. Fix-the-bug exercises: the starter is broken code, `expected` is the output of the fixed code.
8. File exercises must create every file they read, inside the same program (the virtual filesystem is wiped between runs in the suite).
9. Output must be deterministic (see Global Constraints). When prose quotes an output or an error message, it must match Pyodide's exactly.

### Author Brief (the prompt for each unit's author subagent)

Fill the `{{...}}` fields from the unit task's Parameters block, then send everything between the two rules as the prompt (model `opus`).

---

You are writing beginner Python lessons for an existing React/Vite course site in /Users/warmonkeyz/Documents/coding/learn-python. The learner has never programmed. You write lesson data files only, nothing else.

READ FIRST, in this order:
1. docs/superpowers/specs/2026-10-02-course-expansion-design.md: section 2 (style guide) and section 5 (curriculum outline). The outline rows are authoritative for what each lesson introduces. Everything in an earlier row of ANY unit counts as already taught; nothing in a later row may be used.
2. docs/superpowers/plans/2026-10-02-course-expansion.md: the section "Content Authoring Protocol" (file format and exercise design rules).
3. The pilot lessons, which are the exemplar for voice, depth, structure, and block usage: src/content/courses/python-core/lessons/01-welcome.js, reading-errors.js, 02-variables-and-types.js, input-and-output.js.

YOUR UNIT: {{UNIT_NAME}}. Your lessons:
{{LESSON_TABLE}}

UNIT NOTES:
{{UNIT_NOTES}}

HARD RULES
- Create or rewrite ONLY the lesson files listed above, under src/content/courses/python-core/lessons/. Do not edit lessonIndex.js, tests, or any other file. Do not delete any file. Do not run git add, commit, stash, or reset. Do not install packages. You may READ any file.
- Existing lessons you rewrite keep their `slug` and the listed exercise id. Every lesson you write gets `unit: "{{UNIT_NAME}}"`.
- Python behavior is verified against Pyodide (Python 3.14), never the machine's python3 (3.9). Check anything you are unsure of, including quoted outputs and error messages, with: node scripts/py.mjs '<code>' ['<stdin>']
- Every exercise needs a `solution` that passes its check, a `starterCode` that does not pass, and, for open-ended ones, a `hint`. Follow the exercise design rules in the protocol.
- Follow spec section 2 exactly: define terms at first use; no comparisons to other programming languages; use only concepts from earlier outline rows; short paragraphs; no filler, praise, or emojis; deterministic output.
- Depth: 600 to 900 words of prose per regular lesson, at least 2 examples and 2 to 4 exercises (reviews and projects follow the spec). Do not pad; every paragraph must teach something.

VERIFY, repeating until everything is green: perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "{{FILTER}}"
Never edit the test. If a test fails, the lesson is wrong.

FINAL REPORT (plain text, under 300 words): per file, the slug, prose word count, example count, and exercise count; any outline row you could not satisfy and why; any prose claim you are not fully certain of; any deviation from the exemplar.

---

### Reviewer Brief (the prompt for each unit's reviewer subagent)

Fill the `{{...}}` fields, then send everything between the two rules as the prompt (model `opus`).

---

You are an independent reviewer of beginner Python lessons for a course site in /Users/warmonkeyz/Documents/coding/learn-python. The learner has never programmed. You are READ-ONLY: do not edit, create, or delete any file, and run no git command that changes anything. You may run the verification suite and node scripts/py.mjs.

Read the spec docs/superpowers/specs/2026-10-02-course-expansion-design.md (section 2 style guide, section 5 outline) and the section "Content Authoring Protocol" in docs/superpowers/plans/2026-10-02-course-expansion.md.

Review these files: {{FILES}}. Unit: {{UNIT_NAME}}; outline rows {{ROWS}}. What is already taught = everything introduced in outline rows 1 to {{LAST_EARLIER_ROW}}, plus what each lesson itself introduces.

Check every lesson for:
1. FORWARD REFERENCES (blocking): any concept, builtin, syntax, or term used anywhere (prose, examples, starter code, solutions, hints) that is not taught in the lesson itself or an earlier outline row. List each with the block index and the quoted text. Declared exceptions: lesson 5's minimal `import math`; lesson 43's `@name` markers.
2. UNDEFINED JARGON (blocking if central to the lesson, else minor): terms used before they are defined in plain words.
3. FACTUAL ACCURACY (blocking): every claim about Python behavior and every quoted output or error message. Verify anything not obviously right with node scripts/py.mjs (Python 3.14.2 semantics, not 3.9).
4. EXERCISE QUALITY (blocking when ambiguous): the prompt states exactly what to print or return; no equally valid answer would fail the check; the starter does not give away the answer; the ramp goes guided to open-ended; open-ended exercises have a hint; solutions use only taught concepts and are idiomatic; `expected` matches what the prompt asks for; stdin exercises specify the exact `input()` prompt.
5. STYLE: references to other programming languages, filler or praise, paragraphs over 4 sentences, emojis, vague or padded text (minor unless widespread).
6. DEPTH: does each lesson genuinely teach every item in its "Introduces" list with at least one example, or is it thin or repetitive?
7. DETERMINISM: unseeded random, current time or date, memory addresses, reliance on set order.
Also run: perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "{{FILTER}}" and report the result.

REPORT: findings grouped BLOCKING then MINOR. Each finding: file, block index, quoted text, why it is wrong, suggested fix. End with exactly one line: "VERDICT: PASS" (no blocking findings) or "VERDICT: CHANGES NEEDED".

---

### Wiring `lessonIndex.js` (controller only)

After Task 8, `lessonIndex.js` has the shape: imports; `const unit1 = [...]`; `const legacy = [...]`; `export const lessons = [...unit1, ...legacy];`. A unit task wiring step does exactly these edits and nothing else:
1. Add `import` lines for the unit's new files (identifier = camelCase of the slug).
2. For an existing file that migrates in place, keep its existing import line and delete its identifier from `legacy`.
3. For a retired file, delete both its import line and its identifier from `legacy` (the file stays on disk until Task 20).
4. Add `const unitN = [...]` (outline order) directly above `const legacy`.
5. Insert `...unitN` into `lessons` in unit-number order, before `...legacy`.

### Browser spot-check recipe (no typing into the editor)

Typing into CodeMirror through browser automation is unreliable in this environment; verify rendering and wiring, not solving (the suite verifies solving).
1. `preview_start` name `learn-python-dev` (port 5174); wait until the sidebar badge says Python is ready.
2. For each URL the unit task lists: navigate; read the page text; confirm headings render and no text says "Unknown block type".
3. Click **Run** on the first example: its output matches what the prose says. On a `showsError` example, a red traceback shows. On a `stdin` example, the output shows the prompt followed by the echoed answer.
4. Click **Check** on an exercise without editing: the failure panel appears (for `returns` exercises it lists calls with `returned` and `expected`). If the exercise has a hint, **Hint** toggles it; **Show solution** appears after the failed check and reveals the solution text.
5. The sidebar shows the unit group with its count, the current unit open, and prev/next links at the lesson's edges pointing at the right neighbors.
6. The console has no errors.
Stop the preview server afterwards.

### Unit task procedure and batches

Every unit task (9 to 19) has these steps:
- **Step 1, dispatch the author** (opus, background) with the Author Brief filled from the task's Parameters.
- **Step 2, verify the author's claim** yourself: `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "<FILTER>"` must PASS.
- **Step 3, dispatch the reviewer** (opus) with the Reviewer Brief.
- **Step 4, resolve findings:** BLOCKING findings go back to the same author via `SendMessage` (load it first with ToolSearch `select:SendMessage`); re-run Step 2; repeat until a re-review of the changed blocks (by you or the reviewer) shows no BLOCKING finding. Apply MINOR findings when cheap.
- **Step 5, wire** `lessonIndex.js` exactly as the task says.
- **Step 6, full verification:** `npm run test && npm run lint && npm run build` all green.
- **Step 7, spot-check** the listed URLs with the recipe above.
- **Step 8, checkpoint (no commit):** `git status --short` lists only this unit's lesson files plus `lessonIndex.js`.

Batches only cap concurrency; they have no content dependencies. Within a batch, dispatch all authors together (Step 1), then handle each unit's Steps 2 to 4 as its author reports, then do Steps 5 to 8 one unit at a time (wiring edits to `lessonIndex.js` are never done in parallel). Reviewers count toward the 4-agent cap. Start the next batch only after the previous batch's units are all wired and the full suite is green. If an agent stops on a rate limit, dispatch a fresh agent with the same brief plus "files you find already written for your lessons are valid starting points; read them and continue".

---

## Phase 2 — Pilot (Unit 1)

### Task 8: Unit 1 — Getting Started (written by the controller, not delegated)

The controller writes these four lessons by hand so the voice is one hand and the exemplar is solid. Everything every later author sees comes from these files.

**Files:**
- Modify: `src/content/courses/python-core/lessons/01-welcome.js`
- Create: `src/content/courses/python-core/lessons/reading-errors.js`
- Modify: `src/content/courses/python-core/lessons/02-variables-and-types.js`
- Create: `src/content/courses/python-core/lessons/input-and-output.js`
- Modify: `src/content/courses/python-core/lessonIndex.js`

**Parameters:** `UNIT_NAME` is `"Getting Started"`; filter `^(01-welcome|reading-errors|02-variables-and-types|input-and-output) `.

| # | Slug | File | Status | Keep id | Must introduce (from spec) | Ex |
|---|---|---|---|---|---|---|
| 1 | `welcome` | `01-welcome.js` | existing | `welcome-1` | what a program is, running code, `print()`, strings in quotes, comments, top-to-bottom execution | 3 |
| 2 | `reading-errors` | `reading-errors.js` | new | — | traceback anatomy; SyntaxError, NameError, TypeError, IndentationError; errors are normal; fix-the-bug exercises (`showsError` examples) | 3 |
| 3 | `variables-and-types` | `02-variables-and-types.js` | existing | `variables-1` | assignment, naming rules/snake_case, reassignment, multiple assignment, int/float/str/bool/None, `type()`, `int()`/`str()`/`float()` | 3 |
| 4 | `input-and-output` | `input-and-output.js` | new | — | `print` with several values, `sep`, `end`; `input()`; converting input text to numbers. `[stdin]` | 3 |

Suggested exercise ramps (adapt freely; every exercise needs `solution`, and open-ended ones a `hint`):
- `welcome`: keep `welcome-1` (print `Python is fun`); then print three given lines; then open-ended: print a four-line "business card" whose exact text the prompt spells out.
- `reading-errors`: three fix-the-bug programs (a missing closing quote, a misspelled variable name, a bad indent), each with the exact expected output of the fixed program.
- `variables-and-types`: keep `variables-1` (set `city` to `"Phoenix"`, print it); then swap two variables with multiple assignment and print them; then convert `"42"` to a number, add 8, and print the total.
- `input-and-output`: (a) the starter supplies `name = input("Name? ")`, the learner prints `Hello,` and the name using `print` with two values; (b) read two numbers (starter supplies both `input` lines) and print their sum; (c) open-ended: read a number and print it doubled, with the prompt text the exercise specifies. Each exercise states the input it receives and its `expected` includes the prompt and echoed answer.

- [ ] **Step 1: Write the four lesson files** following the format reference, exercise rules, and spec section 2. Prose must not use `if`, loops, lists, functions, or f-strings (all taught later). Use `showsError: true` on every deliberately failing example in `reading-errors`. Verify every quoted output and error message with `node scripts/py.mjs`.

- [ ] **Step 2: Run the suite on the four files**

Run: `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(01-welcome|reading-errors|02-variables-and-types|input-and-output) "`
Expected: PASS for all four (valid structure, examples runnable, no other-language references, depth floor, verified exercises).

- [ ] **Step 3: Replace `lessonIndex.js`** with:

```js
import welcome from "./lessons/01-welcome.js";
import readingErrors from "./lessons/reading-errors.js";
import variablesAndTypes from "./lessons/02-variables-and-types.js";
import inputAndOutput from "./lessons/input-and-output.js";
import numbersStringsFstrings from "./lessons/03-numbers-strings-fstrings.js";
import controlFlow from "./lessons/04-control-flow.js";
import reviewVariablesControlFlow from "./lessons/review-variables-control-flow.js";
import loops from "./lessons/05-loops.js";
import lists from "./lessons/06-lists.js";
import dictionaries from "./lessons/07-dictionaries.js";
import tuplesAndSets from "./lessons/08-tuples-and-sets.js";
import functions from "./lessons/09-functions.js";
import reviewLoopsCollectionsFunctions from "./lessons/review-loops-collections-functions.js";
import stringMethods from "./lessons/10-string-methods.js";
import errorHandling from "./lessons/11-error-handling.js";
import modulesAndImports from "./lessons/12-modules-and-imports.js";
import classesAndOop from "./lessons/13-classes-and-oop.js";
import listComprehensions from "./lessons/14-list-comprehensions.js";
import reviewModulesClassesComprehensions from "./lessons/review-modules-classes-comprehensions.js";

const unit1 = [welcome, readingErrors, variablesAndTypes, inputAndOutput];

const legacy = [
  numbersStringsFstrings,
  controlFlow,
  reviewVariablesControlFlow,
  loops,
  lists,
  dictionaries,
  tuplesAndSets,
  functions,
  reviewLoopsCollectionsFunctions,
  stringMethods,
  errorHandling,
  modulesAndImports,
  classesAndOop,
  listComprehensions,
  reviewModulesClassesComprehensions,
];

export const lessons = [...unit1, ...legacy];
```

- [ ] **Step 4: Full verification**

Run: `npm run test && npm run lint && npm run build`
Expected: all green. The suite's contiguity test passes (Unit 1 is the only migrated unit and is contiguous).

- [ ] **Step 5: Live verification (recipe above, plus the stdin path)**

URLs: `/lessons/welcome`, `/lessons/reading-errors`, `/lessons/variables-and-types`, `/lessons/input-and-output`, and `/` (Home).
- `/lessons/input-and-output`: click **Run** on a `stdin` example; the output shows the prompt, the echoed answer on the same line, and the next output on the following line (for example `Name? Ada` then `Hello, Ada`). This is the first live proof of the `stdin` path through client, provider, worker, and `runPython`.
- `/lessons/reading-errors`: click **Run** on each `showsError` example; each shows a red traceback whose last line names the error type. Traceback lines point at `File "<exec>"` and contain no Pyodide internals.
- `/`: Home shows a "Getting Started" heading with `0/4`, then a "Lessons" heading with `0/15`.
- The sidebar shows "Getting Started" open on these lessons; the sidebar is sticky and scrolls independently.
- Console: no errors.

- [ ] **Step 6: Pilot sign-off gate (STOP)**

Report to the user: the four files, how to open them (`npm run dev`, then the four URLs), the word counts and exercise counts, anything about voice or depth the controller was unsure of. Do NOT start Phase 3 until the user has reviewed Unit 1 and explicitly approved the voice and depth. If the user asks for changes, make them here (the author briefs treat these files as the exemplar), re-run Steps 2 and 4, and ask again. No commit.

---

## Phase 3 — Units 2 to 12 (author subagents)

Authors start only after Task 8 is signed off. Follow the Unit task procedure above. Batch A is Tasks 9 to 12 (4 authors together), Batch B is Tasks 13 to 16 (4 authors), Batch C is Tasks 17 to 19 (3 authors).

### Task 9: Unit 2 — Numbers & Text (Batch A)

**Parameters:** `UNIT_NAME` `"Numbers & Text"`; `FILTER` `^(numbers-and-math|strings-basics|fstrings-and-formatting|10-string-methods|booleans-and-comparisons) `; rows 5–9; `LAST_EARLIER_ROW` 4.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 5 | `numbers-and-math` | `numbers-and-math.js` | new | — | `+ - * / // % **`, precedence, int vs float, `+=` etc., `round`, `abs`, minimal `import math` (`sqrt`, `floor`, `pi`) | 3 |
| 6 | `strings-basics` | `strings-basics.js` | new | — | quotes, escapes, triple-quoted strings, `+` and `*`, `len`, indexing, negative indexes, slicing, immutability | 3 |
| 7 | `fstrings-and-formatting` | `fstrings-and-formatting.js` | new | — | f-strings, expressions inside `{}`, format specs (`.2f`, width, alignment, thousands separator) | 3 |
| 8 | `string-methods` | `10-string-methods.js` | existing | `string-methods-1` | `upper/lower/title`, `strip`, `replace`, `find`, `count`, `startswith/endswith`, `in`, `isdigit/isalpha` (no `split`/`join`) | 3 |
| 9 | `booleans-and-comparisons` | `booleans-and-comparisons.js` | new | — | `True/False`, `== != < > <= >=`, `and/or/not`, chained comparisons, comparing strings | 3 |

**Unit notes for the author:** `if`, loops, lists, tuples, and functions are NOT taught yet: no conditionals, no `for`/`while`, no `[...]`, no `def`, and no `divmod` (it returns a tuple). `input()`, `print` with several values and `sep`/`end`, `type()`, and the type conversions are taught (Unit 1). Lesson 5 may use `import math` minimally ("brings in extra tools; Unit 10 covers imports fully"). Rewrite `10-string-methods.js` in place: drop its `split`/`join` content (taught in lesson 20 with lists) and move its `.2f` format-spec content to lesson 7; keep `string-methods-1` (strip then uppercase `"  hello world  "` to `HELLO WORLD`) as one of the exercises. The file `03-numbers-strings-fstrings.js` is retired: read it for ideas but do not edit or delete it. `%` is introduced in lesson 5.

- [ ] **Step 1: Dispatch the author** (Author Brief with the Parameters and notes above).
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(numbers-and-math|strings-basics|fstrings-and-formatting|10-string-methods|booleans-and-comparisons) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (Reviewer Brief, rows 5–9, `LAST_EARLIER_ROW` 4).
- [ ] **Step 4: Resolve findings** (loop with the author until no BLOCKING finding remains).
- [ ] **Step 5: Wire.** In `lessonIndex.js`: add imports for `numbers-and-math.js` (`numbersAndMath`), `strings-basics.js` (`stringsBasics`), `fstrings-and-formatting.js` (`fstringsAndFormatting`), `booleans-and-comparisons.js` (`booleansAndComparisons`); delete the `numbersStringsFstrings` import and its `legacy` entry (retired); delete `stringMethods` from `legacy` (keep its import); add `const unit2 = [numbersAndMath, stringsBasics, fstringsAndFormatting, stringMethods, booleansAndComparisons];` above `legacy`; set `export const lessons = [...unit1, ...unit2, ...legacy];`.
- [ ] **Step 6: Full verification:** `npm run test && npm run lint && npm run build`.
- [ ] **Step 7: Spot-check:** `/lessons/numbers-and-math`, `/lessons/fstrings-and-formatting`, `/lessons/booleans-and-comparisons`; the first lesson's previous link points at `input-and-output` (the end of Unit 1).
- [ ] **Step 8: Checkpoint (no commit).**

### Task 10: Unit 3 — Decisions (Batch A)

**Parameters:** `UNIT_NAME` `"Decisions"`; `FILTER` `^(04-control-flow|conditions-in-depth|match-and-ternary|review-variables-control-flow) `; rows 10–13; `LAST_EARLIER_ROW` 9.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 10 | `control-flow` | `04-control-flow.js` | existing | `control-flow-1` | blocks and indentation, `if/elif/else`, `%` for even/odd | 3 |
| 11 | `conditions-in-depth` | `conditions-in-depth.js` | new | — | nested ifs, `and/or` in conditions, truthy/falsy, `in` as a condition, `=` vs `==`, `x == 1 or 2` mistake | 3 |
| 12 | `match-and-ternary` | `match-and-ternary.js` | new | — | `match`/`case` with literals, `_`, and guards; `x if cond else y` | 2 |
| 13 | `review-variables-control-flow` | `review-variables-control-flow.js` | existing | `review-variables-control-flow-1` | combines Units 1–3. `[stdin]` | 3 |

**Unit notes:** Loops, lists, and functions are not taught yet. `%` was introduced in lesson 5, so lesson 10 uses it for even/odd without re-teaching it. Truthy/falsy is NOT taught in lesson 10: move the existing "falsy values" paragraph out of `04-control-flow.js` into lesson 11. Rewrite `04-control-flow.js` and `review-variables-control-flow.js` in place (the review's three existing blocks are a starting point; deepen it into a real combination exercise set using `stdin` where it helps). `match` needs Python 3.10+; verify with `node scripts/py.mjs`, never local `python3`.

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(04-control-flow|conditions-in-depth|match-and-ternary|review-variables-control-flow) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 10–13, `LAST_EARLIER_ROW` 9).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for `conditions-in-depth.js` (`conditionsInDepth`) and `match-and-ternary.js` (`matchAndTernary`); keep the existing `controlFlow` and `reviewVariablesControlFlow` imports but delete both identifiers from `legacy`; add `const unit3 = [controlFlow, conditionsInDepth, matchAndTernary, reviewVariablesControlFlow];`; insert `...unit3` after `...unit2` (or after `...unit1` if Unit 2 is not yet wired) in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/control-flow`, `/lessons/match-and-ternary`, `/lessons/review-variables-control-flow` (the review's example and exercise run with their stdin, if any).
- [ ] **Step 8: Checkpoint (no commit).**

### Task 11: Unit 4 — Loops (Batch A)

**Parameters:** `UNIT_NAME` `"Loops"`; `FILTER` `^(05-loops|while-loops|nested-loops|loop-patterns|review-loops) `; rows 14–18; `LAST_EARLIER_ROW` 13.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 14 | `loops` | `05-loops.js` | existing | `loops-1` | `for` over a string and `range(stop)`/`range(start, stop, step)`, loop variable, accumulating a total | 3 |
| 15 | `while-loops` | `while-loops.js` | new | — | `while`, `break`, `continue`, infinite-loop avoidance, sentinel pattern. `[stdin]` | 3 |
| 16 | `nested-loops` | `nested-loops.js` | new | — | loops inside loops, grids, multiplication tables, text patterns | 3 |
| 17 | `loop-patterns` | `loop-patterns.js` | new | — | counting, summing, running max/min, building strings, flag variables | 3 |
| 18 | `review-loops` | `review-loops.js` | new | — | combines Units 1–4 into a number-guessing game. `[stdin]` | 3 |

**Unit notes:** Lists are not taught yet, so `for` iterates over a string or a `range` only; do not print `list(range(...))`. Running max/min is done with plain variables, not `max()`/`min()` on a list. `review-loops` is a guessing game with a fixed secret number and a canned `stdin` sequence of guesses (no `random`), so its output is deterministic; stdin exercises state the exact prompts. Keep `loops-1` (print 1 through 4, one per line). The retired `review-loops-collections-functions.js` is not used by this unit.

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(05-loops|while-loops|nested-loops|loop-patterns|review-loops) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 14–18, `LAST_EARLIER_ROW` 13).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for `while-loops.js` (`whileLoops`), `nested-loops.js` (`nestedLoops`), `loop-patterns.js` (`loopPatterns`), `review-loops.js` (`reviewLoops`); keep the `loops` import but delete `loops` from `legacy`; add `const unit4 = [loops, whileLoops, nestedLoops, loopPatterns, reviewLoops];`; insert `...unit4` in unit order in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/while-loops` (Run the stdin example), `/lessons/nested-loops`, `/lessons/review-loops`.
- [ ] **Step 8: Checkpoint (no commit).**

### Task 12: Unit 5 — Collections (Batch A)

**Parameters:** `UNIT_NAME` `"Collections"`; `FILTER` `^(06-lists|list-methods|tuples-and-unpacking|sets|07-dictionaries|dict-methods|nested-data|review-collections) `; rows 19–26; `LAST_EARLIER_ROW` 18.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 19 | `lists` | `06-lists.js` | existing | `lists-1` | creating, indexing, slicing, `len`, `in`, looping, `append`, `sum/min/max` | 3 |
| 20 | `list-methods` | `list-methods.js` | new | — | `insert/remove/pop/extend/sort/reverse/count/index`, `del`, `sorted()` vs `.sort()`, alias vs copy, `split`/`join`/`splitlines` | 4 |
| 21 | `tuples-and-unpacking` | `tuples-and-unpacking.js` | new | — | tuples, immutability, unpacking, `divmod` as a function that returns a tuple, `enumerate`, `zip`, `reversed` | 3 |
| 22 | `sets` | `sets.js` | new | — | uniqueness, `add/remove/discard`, union/intersection/difference, membership speed note, when to use sets | 3 |
| 23 | `dictionaries` | `07-dictionaries.js` | existing | `dictionaries-1` | key–value pairs, lookup, `KeyError`, add/update/delete, `in`, `len`, looping | 3 |
| 24 | `dict-methods` | `dict-methods.js` | new | — | `get`, `keys/values/items`, `setdefault`, `update`, `pop`, counting and grouping patterns, `\|` merge | 4 |
| 25 | `nested-data` | `nested-data.js` | new | — | lists of dicts, dicts of lists, deep access, looping over nested structures | 3 |
| 26 | `review-collections` | `review-collections.js` | new | — | choosing the right collection; combines Units 1–5. `[stdin]` | 3 |

**Unit notes:** Functions are NOT taught yet: no `def`, `lambda`, or `return` in any lesson of this unit. `sorted(x)` is used plainly; `key=` is taught in lesson 32, so no sorting a dict by value here. `split`, `join`, and `splitlines` are introduced in lesson 20 (they were removed from the string-methods lesson because they return or take lists). `divmod`, `enumerate`, `zip`, and `reversed` belong to lesson 21. Rewrite `06-lists.js` and `07-dictionaries.js` in place, keeping `lists-1` and `dictionaries-1`. The retired files `08-tuples-and-sets.js` and `review-loops-collections-functions.js` are read-only source material (the tuples/sets content and the summarize-a-list exercise idea); do not edit or delete them.

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(06-lists|list-methods|tuples-and-unpacking|sets|07-dictionaries|dict-methods|nested-data|review-collections) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 19–26, `LAST_EARLIER_ROW` 18).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for `list-methods.js` (`listMethods`), `tuples-and-unpacking.js` (`tuplesAndUnpacking`), `sets.js` (`sets`), `dict-methods.js` (`dictMethods`), `nested-data.js` (`nestedData`), `review-collections.js` (`reviewCollections`); keep the `lists` and `dictionaries` imports but delete both from `legacy`; delete the `tuplesAndSets` import and its `legacy` entry (retired); add `const unit5 = [lists, listMethods, tuplesAndUnpacking, sets, dictionaries, dictMethods, nestedData, reviewCollections];`; insert `...unit5` in unit order in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/list-methods`, `/lessons/tuples-and-unpacking`, `/lessons/dict-methods`, `/lessons/review-collections`.
- [ ] **Step 8: Checkpoint (no commit).**

### Task 13: Unit 6 — Functions (Batch B)

**Parameters:** `UNIT_NAME` `"Functions"`; `FILTER` `^(09-functions|parameters-and-defaults|scope|args-and-kwargs|recursion|lambda-and-higher-order|review-functions) `; rows 27–33; `LAST_EARLIER_ROW` 26.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 27 | `functions` | `09-functions.js` | existing | `functions-1` | `def`, parameters, `return` vs `print`, `None`, calling. `[returns]` | 3 |
| 28 | `parameters-and-defaults` | `parameters-and-defaults.js` | new | — | positional vs keyword arguments, defaults, mutable-default trap, returning several values. `[returns]` | 3 |
| 29 | `scope` | `scope.js` | new | — | local vs global, shadowing, why `global` is discouraged, variables vanish after a call. `[returns]` | 3 |
| 30 | `args-and-kwargs` | `args-and-kwargs.js` | new | — | collecting arguments, unpacking in calls. `[returns]` | 3 |
| 31 | `recursion` | `recursion.js` | new | — | base case, recursive case, call stack, recursion limit, recursion vs loops. `[returns]` | 3 |
| 32 | `lambda-and-higher-order` | `lambda-and-higher-order.js` | new | — | functions as values, `lambda`, `sorted(key=)`, `map`, `filter`, sorting a dict by value. `[returns]` | 3 |
| 33 | `review-functions` | `review-functions.js` | new | — | combines Units 1–6. `[returns]` | 3 |

**Unit notes:** Use `returns` checks for function exercises (cases like `{ call: "square(6)", expected: "36" }`, `expected` being the `repr`); use `stdout-exact` for exercises about printing. A function that prints instead of returning must fail a `returns` exercise. Rewrite `09-functions.js` in place, keeping `functions-1` (its current exercise prints `square(6)`; convert it to a `returns` or `stdout-exact` check as appropriate, keeping the id). The retired `review-loops-collections-functions.js` (a `summarize` function over a list) is read-only source material for `review-functions`. Sorting a dict by value (`sorted(d.items(), key=...)`) belongs to lesson 32.

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(09-functions|parameters-and-defaults|scope|args-and-kwargs|recursion|lambda-and-higher-order|review-functions) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 27–33, `LAST_EARLIER_ROW` 26).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for `parameters-and-defaults.js` (`parametersAndDefaults`), `scope.js` (`scope`), `args-and-kwargs.js` (`argsAndKwargs`), `recursion.js` (`recursion`), `lambda-and-higher-order.js` (`lambdaAndHigherOrder`), `review-functions.js` (`reviewFunctions`); keep the `functions` import but delete it from `legacy`; delete the `reviewLoopsCollectionsFunctions` import and its `legacy` entry (retired); add `const unit6 = [functions, parametersAndDefaults, scope, argsAndKwargs, recursion, lambdaAndHigherOrder, reviewFunctions];`; insert `...unit6` in unit order in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/functions` and `/lessons/parameters-and-defaults`: click **Check** on a `returns` exercise without editing; the failure panel must list calls with `returned` and `expected` (for example `fahrenheit(100)` returned `None` in functions-2; functions-1 is graded by stdout-exact). Also `/lessons/lambda-and-higher-order`.
- [ ] **Step 8: Checkpoint (no commit).**

### Task 14: Unit 7 — Comprehensions & Iteration (Batch B)

**Parameters:** `UNIT_NAME` `"Comprehensions & Iteration"`; `FILTER` `^(14-list-comprehensions|dict-and-set-comprehensions|iterators-and-generators|any-all-aggregates) `; rows 34–37; `LAST_EARLIER_ROW` 33.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 34 | `list-comprehensions` | `14-list-comprehensions.js` | existing | `list-comprehensions-1` | map/filter forms, nested `for` in a comprehension, when not to use one | 3 |
| 35 | `dict-and-set-comprehensions` | `dict-and-set-comprehensions.js` | new | — | `{k: v for ...}`, `{x for ...}` | 3 |
| 36 | `iterators-and-generators` | `iterators-and-generators.js` | new | — | iterable vs iterator, `iter`/`next`, `yield`, generator expressions, lazy evaluation | 3 |
| 37 | `any-all-aggregates` | `any-all-aggregates.js` | new | — | `any`, `all`, `sum`/`min`/`max` over generator expressions, `min/max(key=)` | 3 |

**Unit notes:** `map`/`filter` and `lambda` were taught in lesson 32; functions, `sorted(key=)`, and `*args` are all available. Use `returns` checks for function exercises. Rewrite `14-list-comprehensions.js` in place keeping `list-comprehensions-1` (squares of the even numbers in `[1, 2, 3, 4, 5, 6]` printing `[4, 16, 36]`). Never rely on set or dict-comprehension output order beyond insertion order for dicts; for sets, print `sorted(...)` of the result.

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(14-list-comprehensions|dict-and-set-comprehensions|iterators-and-generators|any-all-aggregates) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 34–37, `LAST_EARLIER_ROW` 33).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for `dict-and-set-comprehensions.js` (`dictAndSetComprehensions`), `iterators-and-generators.js` (`iteratorsAndGenerators`), `any-all-aggregates.js` (`anyAllAggregates`); keep the `listComprehensions` import but delete it from `legacy`; add `const unit7 = [listComprehensions, dictAndSetComprehensions, iteratorsAndGenerators, anyAllAggregates];`; insert `...unit7` in unit order in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/list-comprehensions`, `/lessons/iterators-and-generators`.
- [ ] **Step 8: Checkpoint (no commit).**

### Task 15: Unit 8 — Errors & Files (Batch B)

**Parameters:** `UNIT_NAME` `"Errors & Files"`; `FILTER` `^(11-error-handling|raising-exceptions|files|processing-text-data) `; rows 38–41; `LAST_EARLIER_ROW` 37.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 38 | `error-handling` | `11-error-handling.js` | existing | `error-handling-1` | `try/except/else/finally`, `as e`, multiple excepts, common exception types, input-validation loops. `[stdin]` | 3 |
| 39 | `raising-exceptions` | `raising-exceptions.js` | new | — | `raise`, choosing exception types, re-raising, validating arguments (custom exception classes come in #45) | 3 |
| 40 | `files` | `files.js` | new | — | `open`, modes, `read/readline/readlines`, `write`, `with`, the in-browser virtual filesystem (exercises write then read within one program) | 3 |
| 41 | `processing-text-data` | `processing-text-data.js` | new | — | line-by-line processing, parsing delimited lines, word counting, building reports | 3 |

**Unit notes:** Classes are not taught yet, so no custom exception classes (lesson 45). The browser runs Python with an in-memory filesystem: files persist only for the page session and there are no pre-existing files. Every example and exercise that reads a file must first write it in the same program. In the suite the filesystem is wiped before every run, so a file written by one block is never visible to another. Say once, plainly, in lesson 40 that these files live in the browser's memory (no folder on the learner's computer). Rewrite `11-error-handling.js` in place keeping `error-handling-1` (catch the `ValueError` from `int("abc")` and print `invalid number`). Use `stdin` for input-validation loops and state the exact prompts in the exercise text.

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(11-error-handling|raising-exceptions|files|processing-text-data) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 38–41, `LAST_EARLIER_ROW` 37).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for `raising-exceptions.js` (`raisingExceptions`), `files.js` (`files`), `processing-text-data.js` (`processingTextData`); keep the `errorHandling` import but delete it from `legacy`; add `const unit8 = [errorHandling, raisingExceptions, files, processingTextData];`; insert `...unit8` in unit order in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/error-handling`, `/lessons/files` (Run the examples twice in a row: the second run must still work, since each program writes its own file).
- [ ] **Step 8: Checkpoint (no commit).**

### Task 16: Unit 9 — Object-Oriented Python (Batch B)

**Parameters:** `UNIT_NAME` `"Object-Oriented Python"`; `FILTER` `^(13-classes-and-oop|attributes-and-methods|special-methods|inheritance|composition-and-polymorphism|properties|dataclasses|review-oop) `; rows 42–49; `LAST_EARLIER_ROW` 41.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 42 | `classes-and-oop` | `13-classes-and-oop.js` | existing | `classes-and-oop-1` | class, instance, `__init__`, `self`, attributes, methods. `[returns]` | 3 |
| 43 | `attributes-and-methods` | `attributes-and-methods.js` | new | — | instance vs class attributes, `@classmethod`, `@staticmethod`, objects that hold lists/dicts, mutating vs returning | 3 |
| 44 | `special-methods` | `special-methods.js` | new | — | `__str__`, `__repr__`, `__eq__`, `__len__`, `__lt__`, `__add__` | 3 |
| 45 | `inheritance` | `inheritance.js` | new | — | subclasses, `super()`, overriding, `isinstance`, custom exception classes | 3 |
| 46 | `composition-and-polymorphism` | `composition-and-polymorphism.js` | new | — | has-a vs is-a, duck typing, choosing between inheritance and composition | 3 |
| 47 | `properties` | `properties.js` | new | — | `_private` convention, `@property`, setters with validation | 3 |
| 48 | `dataclasses` | `dataclasses.js` | new | — | `@dataclass`, defaults, `frozen`, ordering, type hints | 3 |
| 49 | `review-oop` | `review-oop.js` | new | — | combines Units 1–9 | 3 |

**Unit notes:** Lesson 43 introduces `@name` lines above a function as "markers that change how the function behaves" (used again by `@property` and `@dataclass`; lesson 57 explains how decorators are built). Use `returns` checks for method exercises (cases like `{ call: "Circle(2).area()", expected: "12" }`) and `stdout-exact` for printing. Rewrite `13-classes-and-oop.js` in place keeping `classes-and-oop-1` (the `Dog` class whose `bark()` prints `Rex says woof`; use `stdout-exact` for it). The retired `review-modules-classes-comprehensions.js` (a `Circle` class with `math` and a comprehension) is read-only source material for `review-oop`.

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(13-classes-and-oop|attributes-and-methods|special-methods|inheritance|composition-and-polymorphism|properties|dataclasses|review-oop) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 42–49, `LAST_EARLIER_ROW` 41).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for `attributes-and-methods.js` (`attributesAndMethods`), `special-methods.js` (`specialMethods`), `inheritance.js` (`inheritance`), `composition-and-polymorphism.js` (`compositionAndPolymorphism`), `properties.js` (`properties`), `dataclasses.js` (`dataclasses`), `review-oop.js` (`reviewOop`); keep the `classesAndOop` import but delete it from `legacy`; delete the `reviewModulesClassesComprehensions` import and its `legacy` entry (retired); add `const unit9 = [classesAndOop, attributesAndMethods, specialMethods, inheritance, compositionAndPolymorphism, properties, dataclasses, reviewOop];`; insert `...unit9` in unit order in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/classes-and-oop`, `/lessons/special-methods`, `/lessons/dataclasses`.
- [ ] **Step 8: Checkpoint (no commit).**

### Task 17: Unit 10 — Modules & Standard Library (Batch C)

**Parameters:** `UNIT_NAME` `"Modules & Standard Library"`; `FILTER` `^(12-modules-and-imports|math-random-statistics|collections-module|itertools-functools|datetime-module|json-module|regular-expressions) `; rows 50–56; `LAST_EARLIER_ROW` 49.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 50 | `modules-and-imports` | `12-modules-and-imports.js` | existing | `modules-and-imports-1` | `import`, `from … import`, `as`, `dir`/`help`, `__name__ == "__main__"`, how Python finds modules | 3 |
| 51 | `math-random-statistics` | `math-random-statistics.js` | new | — | `math` functions, `random` with `seed`, `statistics` (mean, median, mode) | 3 |
| 52 | `collections-module` | `collections-module.js` | new | — | `Counter`, `defaultdict`, `deque`, `namedtuple` | 3 |
| 53 | `itertools-functools` | `itertools-functools.js` | new | — | `chain`, `product`, `combinations`, `permutations`, `groupby`; `functools.reduce`, `functools.partial` | 3 |
| 54 | `datetime-module` | `datetime-module.js` | new | — | `date`, `datetime`, `timedelta`, `strftime`/`strptime`; exercises use fixed dates | 3 |
| 55 | `json-module` | `json-module.js` | new | — | `dumps`/`loads`, `indent`, dict ↔ JSON, JSON in files | 3 |
| 56 | `regular-expressions` | `regular-expressions.js` | new | — | `re.search/match/findall/sub`, groups, common patterns | 3 |

**Unit notes:** Every module used must be importable in Pyodide's bundled standard library with no package download; the suite proves it (an import that needs a download fails the test; in that case choose a different example). Always `random.seed(...)` before any `random` call. Never print the current date or time; build dates explicitly. `functools.lru_cache` is NOT used here (it is a decorator; lesson 57 introduces it). Use `returns` checks where an exercise defines a function. Regular expressions are the hardest topic in the course for a beginner: keep patterns simple and explain each pattern piece by piece. Grading treats ANY stderr output as a failure, and Python 3.14 prints a `SyntaxWarning` to stderr for a non-raw pattern such as `"\d+"`, which would fail an otherwise correct answer. So lesson 56 must teach raw strings (`r"\d+"`) before the first pattern with a backslash, every pattern in every example, starter, and solution must be a raw string, and each exercise prompt must say to use a raw string. Rewrite `12-modules-and-imports.js` in place keeping `modules-and-imports-1` (import `math`, print `math.floor(7.9)` giving `7`).

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(12-modules-and-imports|math-random-statistics|collections-module|itertools-functools|datetime-module|json-module|regular-expressions) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 50–56, `LAST_EARLIER_ROW` 49).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for `math-random-statistics.js` (`mathRandomStatistics`), `collections-module.js` (`collectionsModule`), `itertools-functools.js` (`itertoolsFunctools`), `datetime-module.js` (`datetimeModule`), `json-module.js` (`jsonModule`), `regular-expressions.js` (`regularExpressions`); keep the `modulesAndImports` import but delete it from `legacy`; add `const unit10 = [modulesAndImports, mathRandomStatistics, collectionsModule, itertoolsFunctools, datetimeModule, jsonModule, regularExpressions];`; insert `...unit10` in unit order in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/modules-and-imports`, `/lessons/datetime-module`, `/lessons/regular-expressions`.
- [ ] **Step 8: Checkpoint (no commit).**

### Task 18: Unit 11 — Writing Better Python (Batch C)

**Parameters:** `UNIT_NAME` `"Writing Better Python"`; `FILTER` `^(decorators|testing-with-assert|style-and-idioms) `; rows 57–59; `LAST_EARLIER_ROW` 56.

| # | Slug | File | Status | Keep id | Introduces | Ex |
|---|---|---|---|---|---|---|
| 57 | `decorators` | `decorators.js` | new | — | functions that wrap functions, `@`, `functools.wraps`, built-in `functools.lru_cache`, timing/logging examples | 3 |
| 58 | `testing-with-assert` | `testing-with-assert.js` | new | — | `assert`, test functions, edge cases, test-first example | 3 |
| 59 | `style-and-idioms` | `style-and-idioms.js` | new | — | PEP 8, docstrings, type hint recap, EAFP, idioms, refactoring an example | 3 |

**Unit notes:** Decorator examples must be deterministic: show "timing" structurally or count calls instead of printing real durations; never print the current time. Lesson 57 is where `@name` lines are explained properly (they were introduced as "markers" in lesson 43). Use `returns` checks for function exercises and `stdout-exact` for printing. In lesson 58, a failing `assert` prints `AssertionError`, so test exercises should be graded on printed results, not on raising.

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(decorators|testing-with-assert|style-and-idioms) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 57–59, `LAST_EARLIER_ROW` 56).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for `decorators.js` (`decorators`), `testing-with-assert.js` (`testingWithAssert`), `style-and-idioms.js` (`styleAndIdioms`); add `const unit11 = [decorators, testingWithAssert, styleAndIdioms];`; insert `...unit11` in unit order in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/decorators`, `/lessons/style-and-idioms`.
- [ ] **Step 8: Checkpoint (no commit).**

### Task 19: Unit 12 — Projects (Batch C)

**Parameters:** `UNIT_NAME` `"Projects"`; `FILTER` `^(project-todo-manager|project-word-counter|project-bank-account|project-contact-book|project-inventory|project-text-adventure) `; rows 60–65; `LAST_EARLIER_ROW` 59.

| # | Slug | File | Status | Keep id | Uses | Ex |
|---|---|---|---|---|---|---|
| 60 | `project-todo-manager` | `project-todo-manager.js` | new | — | lists, dicts, functions, loops. `[stdin]` | 4 |
| 61 | `project-word-counter` | `project-word-counter.js` | new | — | strings, dicts, sorting, files | 4 |
| 62 | `project-bank-account` | `project-bank-account.js` | new | — | classes, exceptions, properties | 4 |
| 63 | `project-contact-book` | `project-contact-book.js` | new | — | dicts, `json`, files | 4 |
| 64 | `project-inventory` | `project-inventory.js` | new | — | OOP, composition, dataclasses, `collections` | 4 |
| 65 | `project-text-adventure` | `project-text-adventure.js` | new | — | state, dicts, functions, loops. `[stdin]` | 5 |

**Unit notes:** Each project is one lesson of 4 or 5 staged exercises that build one program: stage N's `starterCode` contains stage N−1's `solution`, and each stage's `prompt` says what to add. A project introduces nothing new: it only uses concepts from earlier outline rows (the "Uses" column names the main ones). Every stage is gradable on its own (`stdout-exact` or `returns`). Projects with `stdin` (`project-todo-manager`, `project-text-adventure`) use canned command sequences so output is deterministic, and state the exact prompts. A short `prose` introduction describes the finished program, and one closing `prose` suggests how the learner could extend it. There are no `example` blocks required, but a worked example of the finished program's output is welcome.

- [ ] **Step 1: Dispatch the author.**
- [ ] **Step 2: Verify:** `perl -e 'alarm shift; exec @ARGV' 600 npx vitest run src/content/courses.test.js -t "^(project-todo-manager|project-word-counter|project-bank-account|project-contact-book|project-inventory|project-text-adventure) "` PASS.
- [ ] **Step 3: Dispatch the reviewer** (rows 60–65, `LAST_EARLIER_ROW` 59).
- [ ] **Step 4: Resolve findings.**
- [ ] **Step 5: Wire.** Add imports for the six files (`projectTodoManager`, `projectWordCounter`, `projectBankAccount`, `projectContactBook`, `projectInventory`, `projectTextAdventure`, each from `./lessons/<slug>.js`); add `const unit12 = [projectTodoManager, projectWordCounter, projectBankAccount, projectContactBook, projectInventory, projectTextAdventure];`; insert `...unit12` in unit order in `lessons`.
- [ ] **Step 6: Full verification.**
- [ ] **Step 7: Spot-check:** `/lessons/project-todo-manager`, `/lessons/project-text-adventure` (each stage's exercise shows its failure panel on a fresh Check; hints and solutions work).
- [ ] **Step 8: Checkpoint (no commit).**

---

## Phase 4 — Integration and ship

### Task 20: Integration, whole-course review, and ship readiness

**Files:**
- Modify: `src/content/courses/python-core/lessonIndex.js` (final form, no `legacy`)
- Modify: `src/content/courses.test.js` (two permanent integration tests)
- Delete: `src/content/courses/python-core/lessons/03-numbers-strings-fstrings.js`, `08-tuples-and-sets.js`, `review-loops-collections-functions.js`, `review-modules-classes-comprehensions.js`

**Interfaces:**
- Consumes: every unit constant `unit1`…`unit12` from Tasks 8–19; every lesson file.
- Produces: the final 65-lesson course.

- [ ] **Step 1: Confirm preconditions**

Tasks 8 to 19 are checkpointed. Run `git status --short`: it lists only lesson files, `lessonIndex.js`, the infrastructure files from Tasks 1 to 7, and the two docs. Run `git diff --stat -- src/content/courses/python-core/lessons/03-numbers-strings-fstrings.js src/content/courses/python-core/lessons/08-tuples-and-sets.js src/content/courses/python-core/lessons/review-loops-collections-functions.js src/content/courses/python-core/lessons/review-modules-classes-comprehensions.js`: it prints nothing (the four retired files are untouched).

- [ ] **Step 2: Write the final `lessonIndex.js`**

Replace the whole file with:

```js
import welcome from "./lessons/01-welcome.js";
import readingErrors from "./lessons/reading-errors.js";
import variablesAndTypes from "./lessons/02-variables-and-types.js";
import inputAndOutput from "./lessons/input-and-output.js";

import numbersAndMath from "./lessons/numbers-and-math.js";
import stringsBasics from "./lessons/strings-basics.js";
import fstringsAndFormatting from "./lessons/fstrings-and-formatting.js";
import stringMethods from "./lessons/10-string-methods.js";
import booleansAndComparisons from "./lessons/booleans-and-comparisons.js";

import controlFlow from "./lessons/04-control-flow.js";
import conditionsInDepth from "./lessons/conditions-in-depth.js";
import matchAndTernary from "./lessons/match-and-ternary.js";
import reviewVariablesControlFlow from "./lessons/review-variables-control-flow.js";

import loops from "./lessons/05-loops.js";
import whileLoops from "./lessons/while-loops.js";
import nestedLoops from "./lessons/nested-loops.js";
import loopPatterns from "./lessons/loop-patterns.js";
import reviewLoops from "./lessons/review-loops.js";

import lists from "./lessons/06-lists.js";
import listMethods from "./lessons/list-methods.js";
import tuplesAndUnpacking from "./lessons/tuples-and-unpacking.js";
import sets from "./lessons/sets.js";
import dictionaries from "./lessons/07-dictionaries.js";
import dictMethods from "./lessons/dict-methods.js";
import nestedData from "./lessons/nested-data.js";
import reviewCollections from "./lessons/review-collections.js";

import functions from "./lessons/09-functions.js";
import parametersAndDefaults from "./lessons/parameters-and-defaults.js";
import scope from "./lessons/scope.js";
import argsAndKwargs from "./lessons/args-and-kwargs.js";
import recursion from "./lessons/recursion.js";
import lambdaAndHigherOrder from "./lessons/lambda-and-higher-order.js";
import reviewFunctions from "./lessons/review-functions.js";

import listComprehensions from "./lessons/14-list-comprehensions.js";
import dictAndSetComprehensions from "./lessons/dict-and-set-comprehensions.js";
import iteratorsAndGenerators from "./lessons/iterators-and-generators.js";
import anyAllAggregates from "./lessons/any-all-aggregates.js";

import errorHandling from "./lessons/11-error-handling.js";
import raisingExceptions from "./lessons/raising-exceptions.js";
import files from "./lessons/files.js";
import processingTextData from "./lessons/processing-text-data.js";

import classesAndOop from "./lessons/13-classes-and-oop.js";
import attributesAndMethods from "./lessons/attributes-and-methods.js";
import specialMethods from "./lessons/special-methods.js";
import inheritance from "./lessons/inheritance.js";
import compositionAndPolymorphism from "./lessons/composition-and-polymorphism.js";
import properties from "./lessons/properties.js";
import dataclasses from "./lessons/dataclasses.js";
import reviewOop from "./lessons/review-oop.js";

import modulesAndImports from "./lessons/12-modules-and-imports.js";
import mathRandomStatistics from "./lessons/math-random-statistics.js";
import collectionsModule from "./lessons/collections-module.js";
import itertoolsFunctools from "./lessons/itertools-functools.js";
import datetimeModule from "./lessons/datetime-module.js";
import jsonModule from "./lessons/json-module.js";
import regularExpressions from "./lessons/regular-expressions.js";

import decorators from "./lessons/decorators.js";
import testingWithAssert from "./lessons/testing-with-assert.js";
import styleAndIdioms from "./lessons/style-and-idioms.js";

import projectTodoManager from "./lessons/project-todo-manager.js";
import projectWordCounter from "./lessons/project-word-counter.js";
import projectBankAccount from "./lessons/project-bank-account.js";
import projectContactBook from "./lessons/project-contact-book.js";
import projectInventory from "./lessons/project-inventory.js";
import projectTextAdventure from "./lessons/project-text-adventure.js";

const unit1 = [welcome, readingErrors, variablesAndTypes, inputAndOutput];
const unit2 = [numbersAndMath, stringsBasics, fstringsAndFormatting, stringMethods, booleansAndComparisons];
const unit3 = [controlFlow, conditionsInDepth, matchAndTernary, reviewVariablesControlFlow];
const unit4 = [loops, whileLoops, nestedLoops, loopPatterns, reviewLoops];
const unit5 = [
  lists,
  listMethods,
  tuplesAndUnpacking,
  sets,
  dictionaries,
  dictMethods,
  nestedData,
  reviewCollections,
];
const unit6 = [
  functions,
  parametersAndDefaults,
  scope,
  argsAndKwargs,
  recursion,
  lambdaAndHigherOrder,
  reviewFunctions,
];
const unit7 = [listComprehensions, dictAndSetComprehensions, iteratorsAndGenerators, anyAllAggregates];
const unit8 = [errorHandling, raisingExceptions, files, processingTextData];
const unit9 = [
  classesAndOop,
  attributesAndMethods,
  specialMethods,
  inheritance,
  compositionAndPolymorphism,
  properties,
  dataclasses,
  reviewOop,
];
const unit10 = [
  modulesAndImports,
  mathRandomStatistics,
  collectionsModule,
  itertoolsFunctools,
  datetimeModule,
  jsonModule,
  regularExpressions,
];
const unit11 = [decorators, testingWithAssert, styleAndIdioms];
const unit12 = [
  projectTodoManager,
  projectWordCounter,
  projectBankAccount,
  projectContactBook,
  projectInventory,
  projectTextAdventure,
];

export const lessons = [
  ...unit1,
  ...unit2,
  ...unit3,
  ...unit4,
  ...unit5,
  ...unit6,
  ...unit7,
  ...unit8,
  ...unit9,
  ...unit10,
  ...unit11,
  ...unit12,
];
```

- [ ] **Step 3: Delete the four retired lesson files**

Run: `rm src/content/courses/python-core/lessons/03-numbers-strings-fstrings.js src/content/courses/python-core/lessons/08-tuples-and-sets.js src/content/courses/python-core/lessons/review-loops-collections-functions.js src/content/courses/python-core/lessons/review-modules-classes-comprehensions.js`
Expected: no output. (They are tracked, superseded by the spec's migration table, and recoverable from git history.)

- [ ] **Step 4: Add the permanent integration tests**

In `src/content/courses.test.js`, inside `describe("course-wide invariants", ...)` directly after the contiguity test, add:

```js
  it("has no legacy lessons left", () => {
    const legacy = indexedLessons.filter((lesson) => lesson.unit === undefined);
    expect(legacy.map((lesson) => lesson.slug)).toEqual([]);
  });

  it("lists every lesson file in lessonIndex", async () => {
    const indexed = new Set(indexedLessons.map((lesson) => lesson.slug));
    const orphans = [];
    for (const path of lessonPaths) {
      const lesson = await load(path);
      if (!indexed.has(lesson.slug)) orphans.push(fileName(path));
    }
    expect(orphans).toEqual([]);
  });
```

- [ ] **Step 5: Run the whole suite**

Run: `perl -e 'alarm shift; exec @ARGV' 1800 npx vitest run src/content/courses.test.js`
Expected: PASS for all 65 lesson files (every rule) and all course-wide tests.

- [ ] **Step 6: Done-gate counts**

Run:

```bash
node -e 'import("./src/content/courses/python-core/lessonIndex.js").then(({ lessons }) => { const units = [...new Set(lessons.map((l) => l.unit))]; console.log(lessons.length, units.length); console.log(units.join(" | ")); })'
```

Expected output:

```
65 12
Getting Started | Numbers & Text | Decisions | Loops | Collections | Functions | Comprehensions & Iteration | Errors & Files | Object-Oriented Python | Modules & Standard Library | Writing Better Python | Projects
```

- [ ] **Step 7: Whole-course review (opus, read-only)**

Dispatch one reviewer with this brief:

---

You are an independent whole-course reviewer for a 65-lesson beginner Python course in /Users/warmonkeyz/Documents/coding/learn-python. READ-ONLY: edit, create, and delete nothing, and run no git command that changes anything. Read the spec docs/superpowers/specs/2026-10-02-course-expansion-design.md (sections 2 and 5), then read every file listed in src/content/courses/python-core/lessonIndex.js in index order.

Report on the course as a whole, not lesson by lesson:
1. CROSS-UNIT FORWARD REFERENCES (blocking): any concept, builtin, or term used in a lesson that first appears in a later lesson in index order. Quote the use and name the lesson that actually introduces it. Declared exceptions: lesson 5's minimal `import math`; lesson 43's `@name` markers.
2. CONTRADICTIONS AND DRIFT (blocking if the learner would be misled): the same concept explained differently in two lessons; terminology that changes (for example "argument" vs "parameter" used inconsistently); numbered references like "lesson 20" or "Unit 6" that are wrong.
3. REPEATED OR MISSING COVERAGE: a concept taught twice at the same depth, or an "Introduces" item in the spec outline that no lesson actually teaches.
4. DIFFICULTY CURVE: any lesson that jumps sharply in difficulty from its predecessor; any projects stage that needs something not yet taught.
5. LANGUAGE: any reference to other programming languages; filler or praise; emojis.
6. Run: perl -e 'alarm shift; exec @ARGV' 1800 npx vitest run src/content/courses.test.js and report the result.

REPORT: BLOCKING then MINOR findings, each with lesson slug, block index, quoted text, and a suggested fix. End with exactly one line: "VERDICT: PASS" or "VERDICT: CHANGES NEEDED".

---

Resolve BLOCKING findings (edit the named lesson files yourself, or re-dispatch that unit's author via `SendMessage` with the finding), re-run Step 5, and have the reviewer re-check the changed lessons.

- [ ] **Step 8: Full verification**

Run: `npm run test && npm run lint && npm run build`
Expected: all green. Report the total test count and the main bundle size from the build output (before this plan the main bundle was 730 kB). If it exceeds 1.5 MB uncompressed, tell the user and propose lazy lesson loading as separate follow-up work; it is not part of this plan.

- [ ] **Step 9: Browser pass**

`preview_start` name `learn-python-dev`.
- Home (`/`): the subtitle says "A 65-lesson course", 12 unit headings in order each with `0/N` counts, lessons numbered 01 to 65.
- Walk each unit boundary and confirm the footer prev/next links point at the right neighbors: lessons 4→5, 9→10, 13→14, 18→19, 26→27, 33→34, 37→38, 41→42, 49→50, 56→57, 59→60. Confirm the sidebar's open unit follows navigation across each boundary.
- Orphaned progress is harmless: run via the page console `localStorage.setItem("learn-python-progress", JSON.stringify({ "numbers-strings-fstrings": { "numbers-strings-1": true }, "welcome": { "welcome-1": true } }))`, reload Home: no errors; the old slug's entry changes nothing; Getting Started shows `0/4` (welcome now has 3 exercises and only one is stored). Then run `localStorage.removeItem("learn-python-progress")`.
- Console: no errors on any page visited. Stop the preview server.

- [ ] **Step 10: Hand off to the user (no commit, no upload)**

Report: lesson, exercise, and test counts; the final bundle size; the reviewer's verdicts; and anything the user should decide (for example the judgment calls in spec section 8 that turned out to need a different answer). State plainly that nothing has been committed and that the site has not been uploaded. For the upload, remind them it is the same flow as before: `dist/` contents (including the hidden `.htaccess` and `robots.txt`) go to the subdomain's document root, then the curl checks they already have. Offer to prepare commits when they ask (a natural grouping is: infrastructure, then one commit per unit, then integration).


# Course Expansion — Design

Status: draft, awaiting review. Builds on `2026-08-28-learn-python-site-design.md`.
Audience for the course (unchanged since the beginner rewrite): someone who has never programmed.

## 1. Goal

Grow the course from 17 thin lessons (~200 words, 1 exercise each) to **65 in-depth lessons** in 12 units, ending with 6 projects. Every example and exercise is machine-verified in real Pyodide.

### Decisions already made

| Decision | Choice |
|---|---|
| Scope | Core language + standard library tour + projects (~65 lessons). Data track (numpy/pandas) is out. |
| Navigation | Add a `unit` string to each lesson. The flat `lessons` array stays the source of truth; Sidebar and Home group at render time. |
| Authoring | Pilot Unit 1 inline with the user, then parallel opus subagents per unit against this spec's style guide, each followed by an independent reviewer. |
| Correctness | Permanent vitest suite runs every example and every exercise solution in real Pyodide (Node). |
| `input()` | Canned stdin: blocks carry a fixed `stdin` string fed to `input()` on run. Not interactive. |
| Commits | None until the user asks. |

## 2. Lesson anatomy and style guide

### Target shape

Regular lessons: 600–900 words of prose, at least 2 examples, 2–4 exercises ramping from guided (starter mostly written) to open-ended. Reviews: 2–3 exercises combining earlier units. Projects: 4–5 staged exercises, each stage's starter code includes the previous stage's solution.

Template (blocks in order; repeat the concept cycle 2–3 times):

1. `prose` hook: what this lets you do (1–2 short paragraphs)
2. `heading` + `prose` + `example` — concept
3. `exercise` — guided
4. `heading` + `prose` + `example` — next concept
5. `exercise` — open-ended (has a `hint`)
6. `heading` "Common mistakes" + `prose`
7. `heading` "Recap" + `prose` (3–4 sentences)

### Style rules (binding on every author and reviewer)

- Reader has never programmed. Define every term at first use, in plain words.
- No comparisons to other programming languages. No "unlike", "similar to X in Y".
- A lesson may only use concepts introduced in earlier outline rows (the "Introduces" column) plus what it introduces itself. Three declared exceptions: lesson 5 uses `import math` minimally ("brings in extra tools; Unit 10 covers imports fully"), lesson 48 uses `from dataclasses import dataclass, field` the same way (dataclasses cannot be taught without it), and lesson 43 introduces `@name` lines above a function as "markers that change how the function behaves" (used again by `@property` and `@dataclass`; lesson 57 explains how they are built).
- Short paragraphs (4 sentences max), second person, direct. No filler, praise or emojis.
- Realistic simple data (names, prices, temperatures, scores), not just `foo`/`bar`.
- Examples must show their output when run. Comments only where the why is non-obvious.
- Exercise prompts state exactly what must be printed or returned. `starterCode` never pre-solves. Every exercise has a `solution` that passes its own check.
- Output must be deterministic: no unseeded `random`, no current time/date, no memory addresses, no reliance on set iteration order.
- No `JavaScript`, `JS`, `Java`, `console.log` anywhere in lesson text (enforced by a test).

## 3. Code changes

All small. Existing behavior is preserved; each item gets a test first.

### 3.1 Lesson/block data additions

```js
{
  slug, title,
  unit: "Getting Started",                 // new; lessons without it are "legacy"
  blocks: [
    { type: "heading", text },                                   // new
    { type: "prose", body },
    { type: "example", code, stdin?, showsError? },              // stdin, showsError new
    { type: "exercise", id, prompt, starterCode, check,
      solution,                                                  // new; required for migrated lessons
      hint?, stdin? },                                           // new
  ],
}
```

- `heading`: new `src/blocks/Heading.jsx` rendering an `<h2>` with existing tokens, registered in `src/blocks/registry.js`.
- `showsError: true` marks an example that is expected to fail (used by the error-messages lesson); the suite then requires stderr instead of forbidding it.

### 3.2 Unit grouping

- `groupByUnit(lessons)` in `src/content/lessonUtils.js` returns `[{ unit, items: [{ lesson, number }] }]`, grouping consecutive lessons with the same `unit`; `number` is the 1-based position in the flat list. A missing `unit` groups under "Lessons".
- `Sidebar.jsx`: one native `<details>` per unit. Summary shows the unit title and `done/total`. A unit is open when it contains the current lesson (from the route).
- `Home.jsx`: unit headings with `done/total`. The "continue" logic is unchanged.

### 3.3 Exercise additions (`src/blocks/Exercise.jsx`)

- `hint`: a "Hint" toggle, shown when the field exists.
- `solution`: a "Show solution" button appearing after the first failed check, revealing the code in a `<pre>`.
- Progress storage is unchanged (`learn-python-progress`, keyed by slug and exercise id). Orphaned entries from retired slugs are ignored by `isLessonComplete`.

### 3.4 `returns` check type (`src/blocks/checkers.js`)

```js
check: { type: "returns", cases: [{ call: "square(6)", expected: "36" }] }
```

- `expected` is the `repr` of the expected value (`"36"`, `"'abc'"`, `"[1, 2]"`).
- The learner's code and an appended harness run in one `run` call, so the harness sees the learner's definitions. The harness evaluates each `call`, then prints a final sentinel line (`\x1e` + JSON of `[call, repr(result) or "raised <Type>", expected]`).
- The Exercise splits stdout at the sentinel. Learner prints are not graded. A failure message reads "`square(6)` returned 35, expected 36" without exposing hidden test code. A traceback in the learner's own code shows with correct line numbers because the harness comes after it.
- Introduced when the Functions unit starts.

### 3.5 `stdin` support

- `pyodideClient.run(code, { stdin })` → `PyodideProvider.run(code, options)` → worker message `{ type: "run", id, code, stdin }`.
- Worker installs a line reader via `pyodide.setStdin` for that run. When lines run out, Python raises `EOFError`, as a closed terminal would.
- `CodeBlock.jsx` and `Exercise.jsx` pass the block's `stdin` through.
- Echo resolved by a spike against real Pyodide: without it the prompt and the next `print` run together (`What's your name? Hello, Ada!`). A small Python-level `input` wrapper installed per run echoes the consumed line after the prompt, giving terminal-faithful output (`What's your name? Ada` then `Hello, Ada!`). Its traceback frame is filtered out of error output. Because the prompt and the echoed answer appear in stdout, exercises with `stdin` must specify the exact `input()` prompt.

### 3.6 Worker refactor for test parity

Extract `runPython(pyodide, code, { stdin })` → `{ stdout, stderr }` (stdout/stderr batching, fresh per-run globals, traceback trimming) from `src/worker/pyodideWorker.js` into `src/worker/runPython.js`. The worker and the verification suite both use it, so the suite tests what production runs.

## 4. Verification suite

`src/content/courses.test.js`, with `// @vitest-environment node`. One shared Pyodide instance (`beforeAll`, loaded from `node_modules`, no network). Lessons are discovered with a lazy `import.meta.glob` over `lessons/*.js`, one `describe` per file, so a half-written file fails only its own tests (parallel authors cannot break each other).

For every lesson:

| Check | Applies to |
|---|---|
| unique slug; unique exercise ids across the course | all |
| block types and check types are known | all |
| every `example` runs with empty stderr (or non-empty if `showsError`) | all |
| `unit` present; units form contiguous runs in `lessonIndex.js` | migrated |
| every exercise has `solution`; the solution passes `check`; `starterCode` alone does **not** pass | migrated |
| depth floor: regular lessons ≥ 450 prose words, ≥ 2 examples, ≥ 2 exercises; `review-*` ≥ 2 exercises; `project-*` ≥ 4 exercises | migrated |
| no `JavaScript` / `\bJS\b` / `\bJava\b` / `console.log` in text | all |
| every lesson file is listed in `lessonIndex.js` | final integration |

"Migrated" means the lesson declares `unit`. Legacy lessons are exempt from the migrated-only rules. A last-phase test asserts that no legacy lessons remain.

Authors run the suite filtered to their slugs: `timeout 180 npx vitest run src/content/courses.test.js -t "(slug-a|slug-b)"`. The `timeout` guards against a learner-code infinite loop in a solution hanging the Node process (accepted limitation).

## 5. Curriculum outline

Rule: a lesson uses only concepts from earlier rows. "Ex" = exercise count. `[stdin]` = uses canned input. `[returns]` = may use the `returns` check. Existing slugs are kept where the lesson survives (marked *existing*).

### Unit 1 — Getting Started (4)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 1 | `welcome` *existing* | Welcome & Your First Script | what a program is, running code, `print()`, strings in quotes, comments, top-to-bottom execution | 3 |
| 2 | `reading-errors` | Reading Error Messages | traceback anatomy; SyntaxError, NameError, TypeError, IndentationError; errors are normal; fix-the-bug exercises (`showsError` examples) | 3 |
| 3 | `variables-and-types` *existing* | Variables & Types | assignment, naming rules/snake_case, reassignment, multiple assignment, int/float/str/bool/None, `type()`, `int()`/`str()`/`float()` | 3 |
| 4 | `input-and-output` | Input & Output | `print` with several values, `sep`, `end`; `input()`; converting input text to numbers. `[stdin]` | 3 |

### Unit 2 — Numbers & Text (5)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 5 | `numbers-and-math` | Numbers & Math | `+ - * / // % **`, precedence, int vs float, `+=` etc., `round`, `abs`, minimal `import math` (`sqrt`, `floor`, `pi`) | 3 |
| 6 | `strings-basics` | Working with Strings | quotes, escapes, triple-quoted strings, `+` and `*`, `len`, indexing, negative indexes, slicing, immutability | 3 |
| 7 | `fstrings-and-formatting` | f-strings & Formatting | f-strings, expressions inside `{}`, format specs (`.2f`, width, alignment, thousands separator) | 3 |
| 8 | `string-methods` *existing* | String Methods | `upper/lower/title`, `strip`, `replace`, `find`, `count`, `startswith/endswith`, `in`, `isdigit/isalpha` (no `split`/`join`: those need lists, see #20) | 3 |
| 9 | `booleans-and-comparisons` | Booleans & Comparisons | `True/False`, `== != < > <= >=`, `and/or/not`, chained comparisons, comparing strings | 3 |

### Unit 3 — Decisions (4)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 10 | `control-flow` *existing* | if, elif & else | blocks and indentation, `if/elif/else`, `%` for even/odd | 3 |
| 11 | `conditions-in-depth` | Combining & Nesting Conditions | nested ifs, `and/or` in conditions, truthy/falsy, `in` as a condition, `=` vs `==`, `x == 1 or 2` mistake | 3 |
| 12 | `match-and-ternary` | match & Conditional Expressions | `match`/`case` with literals, `_`, and guards; `x if cond else y` | 2 |
| 13 | `review-variables-control-flow` *existing* | Review: Variables & Decisions | combines Units 1–3. `[stdin]` | 3 |

### Unit 4 — Loops (5)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 14 | `loops` *existing* | for Loops & range | `for` over a string and `range(stop)`/`range(start, stop, step)`, loop variable, accumulating a total | 3 |
| 15 | `while-loops` | while Loops & Loop Control | `while`, `break`, `continue`, infinite-loop avoidance, sentinel pattern. `[stdin]` | 3 |
| 16 | `nested-loops` | Nested Loops & Patterns | loops inside loops, grids, multiplication tables, text patterns | 3 |
| 17 | `loop-patterns` | Common Loop Patterns | counting, summing, running max/min, building strings, flag variables | 3 |
| 18 | `review-loops` | Review: Guessing Game | combines Units 1–4 into a number-guessing game. `[stdin]` | 3 |

### Unit 5 — Collections (8)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 19 | `lists` *existing* | Lists | creating, indexing, slicing, `len`, `in`, looping, `append`, `sum/min/max` | 3 |
| 20 | `list-methods` | List Methods & Copying | `insert/remove/pop/extend/sort/reverse/count/index`, `del`, `sorted()` vs `.sort()`, alias vs copy, `split`/`join`/`splitlines` | 4 |
| 21 | `tuples-and-unpacking` | Tuples, Unpacking, enumerate & zip | tuples, immutability, unpacking, `divmod` as a function that returns a tuple, `enumerate`, `zip`, `reversed` | 3 |
| 22 | `sets` | Sets | uniqueness, `add/remove/discard`, union/intersection/difference, membership speed note, when to use sets | 3 |
| 23 | `dictionaries` *existing* | Dictionaries | key–value pairs, lookup, `KeyError`, add/update/delete, `in`, `len`, looping | 3 |
| 24 | `dict-methods` | Dictionary Methods & Patterns | `get`, `keys/values/items`, `setdefault`, `update`, `pop`, counting and grouping patterns, `\|` merge | 4 |
| 25 | `nested-data` | Nested Data | lists of dicts, dicts of lists, deep access, looping over nested structures | 3 |
| 26 | `review-collections` | Review: Collections | choosing the right collection; combines Units 1–5. `[stdin]` | 3 |

### Unit 6 — Functions (7)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 27 | `functions` *existing* | Defining & Calling Functions | `def`, parameters, `return` vs `print`, `None`, calling. `[returns]` | 3 |
| 28 | `parameters-and-defaults` | Parameters & Arguments | positional vs keyword arguments, defaults, mutable-default trap, returning several values. `[returns]` | 3 |
| 29 | `scope` | Scope | local vs global, shadowing, why `global` is discouraged, variables vanish after a call. `[returns]` | 3 |
| 30 | `args-and-kwargs` | `*args` and `**kwargs` | collecting arguments, unpacking in calls. `[returns]` | 3 |
| 31 | `recursion` | Recursion | base case, recursive case, call stack, recursion limit, recursion vs loops. `[returns]` | 3 |
| 32 | `lambda-and-higher-order` | Lambda & Higher-Order Functions | functions as values, `lambda`, `sorted(key=)`, `map`, `filter`, sorting a dict by value. `[returns]` | 3 |
| 33 | `review-functions` | Review: Functions & Collections | combines Units 1–6. `[returns]` | 3 |

### Unit 7 — Comprehensions & Iteration (4)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 34 | `list-comprehensions` *existing* | List Comprehensions | map/filter forms, nested `for` in a comprehension, when not to use one | 3 |
| 35 | `dict-and-set-comprehensions` | Dict & Set Comprehensions | `{k: v for ...}`, `{x for ...}` | 3 |
| 36 | `iterators-and-generators` | Iterators & Generators | iterable vs iterator, `iter`/`next`, `yield`, generator expressions, lazy evaluation | 3 |
| 37 | `any-all-aggregates` | any, all & Aggregating | `any`, `all`, `sum`/`min`/`max` over generator expressions, `min/max(key=)` | 3 |

### Unit 8 — Errors & Files (4)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 38 | `error-handling` *existing* | Error Handling | `try/except/else/finally`, `as e`, multiple excepts, common exception types, input-validation loops. `[stdin]` | 3 |
| 39 | `raising-exceptions` | Raising Exceptions | `raise`, choosing exception types, re-raising, validating arguments (custom exception classes come in #45) | 3 |
| 40 | `files` | Reading & Writing Files | `open`, modes, `read/readline/readlines`, `write`, `with`, the in-browser virtual filesystem (exercises write then read within one program) | 3 |
| 41 | `processing-text-data` | Processing Text Data | line-by-line processing, parsing delimited lines, word counting, building reports | 3 |

### Unit 9 — Object-Oriented Python (8)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 42 | `classes-and-oop` *existing* | Classes & Objects | class, instance, `__init__`, `self`, attributes, methods. `[returns]` | 3 |
| 43 | `attributes-and-methods` | Attributes & Methods in Depth | instance vs class attributes, `@classmethod`, `@staticmethod`, objects that hold lists/dicts, mutating vs returning | 3 |
| 44 | `special-methods` | Special Methods | `__str__`, `__repr__`, `__eq__`, `__len__`, `__lt__`, `__add__` | 3 |
| 45 | `inheritance` | Inheritance | subclasses, `super()`, overriding, `isinstance`, custom exception classes | 3 |
| 46 | `composition-and-polymorphism` | Composition & Polymorphism | has-a vs is-a, duck typing, choosing between inheritance and composition | 3 |
| 47 | `properties` | Encapsulation & Properties | `_private` convention, `@property`, setters with validation | 3 |
| 48 | `dataclasses` | Dataclasses & Type Hints | `@dataclass`, defaults, `frozen`, ordering, type hints | 3 |
| 49 | `review-oop` | Review: Object-Oriented Python | combines Units 1–9 | 3 |

### Unit 10 — Modules & Standard Library (7)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 50 | `modules-and-imports` *existing* | Modules & Imports | `import`, `from … import`, `as`, `dir`/`help`, `__name__ == "__main__"`, how Python finds modules | 3 |
| 51 | `math-random-statistics` | math, random & statistics | `math` functions, `random` with `seed`, `statistics` (mean, median, mode) | 3 |
| 52 | `collections-module` | The collections Module | `Counter`, `defaultdict`, `deque`, `namedtuple` | 3 |
| 53 | `itertools-functools` | itertools & functools | `chain`, `product`, `combinations`, `permutations`, `groupby`; `functools.reduce`, `functools.partial` | 3 |
| 54 | `datetime-module` | Dates & Times | `date`, `datetime`, `timedelta`, `strftime`/`strptime`; exercises use fixed dates | 3 |
| 55 | `json-module` | Working with JSON | `dumps`/`loads`, `indent`, dict ↔ JSON, JSON in files | 3 |
| 56 | `regular-expressions` | Regular Expressions | `re.search/match/findall/sub`, groups, common patterns | 3 |

### Unit 11 — Writing Better Python (3)

| # | Slug | Title | Introduces | Ex |
|---|---|---|---|---|
| 57 | `decorators` | Decorators | functions that wrap functions, `@`, `functools.wraps`, built-in `functools.lru_cache`, timing/logging examples | 3 |
| 58 | `testing-with-assert` | Testing Your Code | `assert`, test functions, edge cases, test-first example | 3 |
| 59 | `style-and-idioms` | Pythonic Code & Style | PEP 8, docstrings, type hint recap, EAFP, idioms, refactoring an example | 3 |

### Unit 12 — Projects (6)

Each project is one lesson with 4–5 staged exercises; stage N's `starterCode` contains stage N−1's solution. Introduces nothing new.

| # | Slug | Title | Uses | Ex |
|---|---|---|---|---|
| 60 | `project-todo-manager` | To-Do List Manager | lists, dicts, functions, loops. `[stdin]` | 4 |
| 61 | `project-word-counter` | Word Frequency Counter | strings, dicts, sorting, files | 4 |
| 62 | `project-bank-account` | Bank Account | classes, exceptions, properties | 4 |
| 63 | `project-contact-book` | Contact Book | dicts, `json`, files | 4 |
| 64 | `project-inventory` | Inventory System | OOP, composition, dataclasses, `collections` | 4 |
| 65 | `project-text-adventure` | Text Adventure | state, dicts, functions, loops. `[stdin]` | 5 |

### Migration of the existing 17 lessons

13 survive under their slugs and are deepened in place (marked *existing* above). Their first exercise id (e.g. `welcome-1`) is kept where that exercise survives. Four are retired and their content redistributed; stored progress for them is ignored:

| Retired slug | Goes to |
|---|---|
| `numbers-strings-fstrings` | #5, #6, #7 |
| `tuples-and-sets` | #21, #22 |
| `review-loops-collections-functions` | #18, #26, #33 |
| `review-modules-classes-comprehensions` | #49 |

## 6. Authoring workflow and phases

**Phase 0 — This spec.** The user approves the outline in section 5 and the judgment calls in section 8 before any lesson is written.

**Phase 1 — Infrastructure, test-first.** In order: `runPython` extraction and `stdin` (with the echo spike), `heading` block, `groupByUnit` with Sidebar/Home, Exercise hint/solution, `returns` check, verification suite. Existing lessons keep working throughout (legacy exemption).

**Phase 2 — Pilot (Unit 1).** Written inline by the lead so the voice is one hand. The user reviews voice and depth before anything scales. The Unit 1 files become the exemplar every author reads.

**Phase 3 — Units 2–12.** One opus author subagent per unit, at most 4 running at once (a rate-limit interruption has happened before). Per unit:

1. Author: reads this spec plus the exemplar, writes only its `lessons/*.js` files, runs the filtered suite until green, does not touch `lessonIndex.js` or any other `src/` file, does not delete files (retired lesson files stay in place until the lead wires the unit, because `lessonIndex.js` still imports them), does not commit.
2. Reviewer: a separate opus agent, read-only apart from running the suite. Checks forward references against the "Introduces" columns, undefined jargon, factual correctness of every prose claim, exercise quality (guided → open, hints, plausible solutions), and style-guide violations.
3. The author fixes the findings.
4. The lead wires the unit into `lessonIndex.js`, runs the full suite, and spot-checks in the browser.

**Phase 4 — Integration and ship.** Whole-course pass (numbering, contiguous units, cross-unit forward references), the "no legacy lessons remain" test, `npm run test`, `npm run lint`, `npm run build`, then upload `dist/` to HostGator as before (`.htaccess` already ships).

Definition of done: all three commands green; the suite covers all 65 lessons; every unit spot-checked live; the user has reviewed the pilot.

## 7. Non-goals

Code splitting (revisit only if the bundle gets heavy), search, unit descriptions, predict-the-output block, callout and bulleted-list blocks, badges, accounts or sync, interactive stdin, the data (numpy/pandas) track.

## 8. Risks and judgment calls to confirm

Risks:

- **Voice drift across ~50 new lessons.** Mitigated by the pilot, the style guide, and per-unit review.
- **Exact-match grading frustration.** Mitigated by `returns` checks, hints, and solution reveal.
- **Pyodide limits.** No interactive stdin (hence canned input), 8-second run cap (already handled), no network or threads (not used).
- **A solution with an infinite loop hangs the Node suite.** Accepted; authors wrap runs in `timeout`.

Judgment calls for the user to confirm or change:

1. `match-and-ternary` (#12) is included; Python 3.14 in Pyodide supports it.
2. `regular-expressions` (#56) is the hardest beginner topic; it can be dropped or moved to an optional appendix.
3. `decorators` (#57) is advanced for newcomers; it can be dropped.
4. The six project choices in Unit 12.
5. `input()` echoes the typed answer after the prompt (decided by the spike, see 3.5).

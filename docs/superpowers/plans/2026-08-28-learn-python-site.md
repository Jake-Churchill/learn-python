# Learn Python Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-only React site that teaches core Python syntax to someone who already knows HTML/CSS/JS (and a little Java), with real in-browser Python execution and auto-checked exercises.

**Architecture:** React + Vite + Tailwind CSS, with a single Pyodide (Python-in-WASM) instance running in a Web Worker and shared via React context. Lesson content is authored as plain JS data modules (prose/example/exercise blocks) rendered through a type→component registry, so new lessons, block types, and exercise-checking strategies can be added without touching existing code. Progress persists in `localStorage`.

**Tech Stack:** React 19, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), react-router-dom, Pyodide, `@uiw/react-codemirror` + `@codemirror/lang-python`, Vitest + `@testing-library/react` + jsdom for tests, oxlint for linting.

**Spec:** [docs/superpowers/specs/2026-08-28-learn-python-site-design.md](../specs/2026-08-28-learn-python-site-design.md)

## Global Constraints

- Plain JavaScript (JSX), no TypeScript — matches this user's sibling projects.
- No backend, no deployment step; the site runs via `npm run dev` only (spec Non-goals).
- Progress persists in a single localStorage key `learn-python-progress`, shaped `{ [lessonSlug]: { [exerciseId]: true } }` (spec Progress Tracking).
- Course content lives under `src/content/courses/python-core/...` — a second course would be a sibling folder; never restructure this path without reason (spec Extensibility).
- Exercise correctness is judged by exact, whitespace-normalized stdout match (`check.type: "stdout-exact"`) — no partial credit, and a failed exercise never reveals the solution (spec Goals + Lesson Page Anatomy).
- Block rendering goes through `blocks/registry.js`'s type → component map; never hard-code a block-type switch anywhere else (spec Content Authoring Model extensibility seam).
- Pyodide runs in exactly one Web Worker per app session, shared via React context — never instantiate a second worker per component (spec Architecture).
- Never run `git push`. The repo already has `origin` (`https://github.com/Jake-Churchill/learn-python.git`) configured — all commits in this plan stay local until the user explicitly asks to push.

---

### Task 1: Scaffold the Vite + React + Tailwind + Vitest project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `.gitignore`
- Create: `src/main.jsx`, `src/App.jsx`, `src/index.css`
- Create: `src/test/setup.js`

**Interfaces:**
- Produces: a `npm run dev` / `npm run build` / `npm run test` / `npm run lint` toolchain every later task relies on.

- [ ] **Step 1: Initialize package.json and install dependencies**

Run:

```bash
npm init -y
npm install react react-dom react-router-dom pyodide @uiw/react-codemirror @codemirror/lang-python
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite vitest jsdom @testing-library/react @testing-library/jest-dom oxlint
```

- [ ] **Step 2: Edit package.json scripts**

Open `package.json` and set:

```json
{
  "name": "learn-python",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "oxlint"
  }
}
```

(Leave the `dependencies`/`devDependencies` blocks that `npm install` already wrote — just replace the top-level fields shown above.)

- [ ] **Step 3: Create .gitignore**

```
node_modules
dist
.DS_Store
```

- [ ] **Step 4: Create vite.config.js**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["pyodide"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.js"],
  },
});
```

- [ ] **Step 5: Create src/test/setup.js**

```js
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 6: Create index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Learn Python</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create src/index.css**

```css
@import "tailwindcss";
```

- [ ] **Step 8: Create src/App.jsx (temporary placeholder — replaced in Task 12)**

```jsx
export default function App() {
  return <div className="p-8 text-xl">Learn Python — scaffold OK</div>;
}
```

- [ ] **Step 9: Create src/main.jsx**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 10: Verify the toolchain**

Run: `npm run build`
Expected: build completes with no errors, `dist/` is created.

Run: `npm run lint`
Expected: no errors (oxlint has nothing to complain about yet).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Scaffold Vite + React + Tailwind + Vitest toolchain"
```

---

### Task 2: Exercise-checking logic (`blocks/checkers.js`)

**Files:**
- Create: `src/blocks/checkers.js`
- Test: `src/blocks/checkers.test.js`

**Interfaces:**
- Produces: `runCheck(actualStdout, check)` — used by Task 10's `Exercise.jsx`. `check` is `{ type: "stdout-exact", expected: string }`.

- [ ] **Step 1: Write the failing tests**

```js
// src/blocks/checkers.test.js
import { describe, it, expect } from "vitest";
import { normalizeOutput, checkStdoutExact, runCheck } from "./checkers.js";

describe("normalizeOutput", () => {
  it("trims leading/trailing whitespace and trailing spaces per line", () => {
    expect(normalizeOutput("  odd  \n")).toBe("odd");
    expect(normalizeOutput("1 \n2 \n3\n")).toBe("1\n2\n3");
  });
});

describe("checkStdoutExact", () => {
  it("passes when output matches after normalization", () => {
    expect(checkStdoutExact("odd\n", { expected: "odd" })).toBe(true);
  });

  it("fails when output does not match", () => {
    expect(checkStdoutExact("even\n", { expected: "odd" })).toBe(false);
  });
});

describe("runCheck", () => {
  it("dispatches to stdout-exact", () => {
    expect(runCheck("36\n", { type: "stdout-exact", expected: "36" })).toBe(true);
  });

  it("throws on an unknown check type", () => {
    expect(() => runCheck("x", { type: "nope" })).toThrow("Unknown check type: nope");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/blocks/checkers.test.js`
Expected: FAIL — `checkers.js` does not exist yet.

- [ ] **Step 3: Implement checkers.js**

```js
// src/blocks/checkers.js
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

export function runCheck(actualStdout, check) {
  switch (check.type) {
    case "stdout-exact":
      return checkStdoutExact(actualStdout, check);
    default:
      throw new Error(`Unknown check type: ${check.type}`);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/blocks/checkers.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/blocks/checkers.js src/blocks/checkers.test.js
git commit -m "Add exact-match exercise-checking logic"
```

---

### Task 3: Inline code formatting for prose (`blocks/inlineFormat.js`)

**Files:**
- Create: `src/blocks/inlineFormat.js`
- Test: `src/blocks/inlineFormat.test.js`

**Interfaces:**
- Produces: `parseInlineCode(text)` → `Array<{ type: "text" | "code", value: string }>` — used by Task 8's `Prose.jsx`. Backtick pairs in `text` mark code spans; every lesson body must use an even number of backticks.

- [ ] **Step 1: Write the failing tests**

```js
// src/blocks/inlineFormat.test.js
import { describe, it, expect } from "vitest";
import { parseInlineCode } from "./inlineFormat.js";

describe("parseInlineCode", () => {
  it("returns a single text part when there are no backticks", () => {
    expect(parseInlineCode("hello world")).toEqual([{ type: "text", value: "hello world" }]);
  });

  it("extracts a backtick-wrapped segment as a code part", () => {
    expect(parseInlineCode("use `print()` now")).toEqual([
      { type: "text", value: "use " },
      { type: "code", value: "print()" },
      { type: "text", value: " now" },
    ]);
  });

  it("handles multiple code spans", () => {
    expect(parseInlineCode("`a` and `b`")).toEqual([
      { type: "code", value: "a" },
      { type: "text", value: " and " },
      { type: "code", value: "b" },
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/blocks/inlineFormat.test.js`
Expected: FAIL — module does not exist yet.

- [ ] **Step 3: Implement inlineFormat.js**

```js
// src/blocks/inlineFormat.js
export function parseInlineCode(text) {
  return text
    .split("`")
    .map((value, index) => ({
      type: index % 2 === 1 ? "code" : "text",
      value,
    }))
    .filter((part) => part.value.length > 0);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/blocks/inlineFormat.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/blocks/inlineFormat.js src/blocks/inlineFormat.test.js
git commit -m "Add inline backtick-code parsing for lesson prose"
```

---

### Task 4: Pyodide client message correlation (`hooks/pyodideClient.js`)

**Files:**
- Create: `src/hooks/pyodideClient.js`
- Test: `src/hooks/pyodideClient.test.js`

**Interfaces:**
- Consumes: any object shaped `{ postMessage(msg), onmessage }` (a real or fake Worker).
- Produces: `createPyodideClient(worker) -> { run(code) -> Promise<{stdout, stderr}>, getStatus() -> "loading"|"ready"|"error", onStatusChange(listener) -> unsubscribeFn }`. Used by Task 6's `PyodideProvider`.

This is the one piece of the Pyodide integration that's worth unit testing per the spec — it's pure message-correlation logic, decoupled from the real Worker/WASM runtime via a fake worker object.

- [ ] **Step 1: Write the failing tests**

```js
// src/hooks/pyodideClient.test.js
import { describe, it, expect, vi } from "vitest";
import { createPyodideClient } from "./pyodideClient.js";

function createFakeWorker() {
  return { postMessage: vi.fn(), onmessage: null };
}

describe("createPyodideClient", () => {
  it("starts in loading status and sends an init message", () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);
    expect(client.getStatus()).toBe("loading");
    expect(worker.postMessage).toHaveBeenCalledWith({ type: "init" });
  });

  it("transitions to ready and notifies listeners when the worker reports ready", () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);
    const listener = vi.fn();
    client.onStatusChange(listener);

    worker.onmessage({ data: { type: "ready" } });

    expect(client.getStatus()).toBe("ready");
    expect(listener).toHaveBeenCalledWith("ready");
  });

  it("transitions to error when the worker reports an error", () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);

    worker.onmessage({ data: { type: "error" } });

    expect(client.getStatus()).toBe("error");
  });

  it("resolves run() with the matching result message", async () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);

    const promise = client.run("print(1)");
    const runCall = worker.postMessage.mock.calls.find(([msg]) => msg.type === "run");
    const sentMessage = runCall[0];

    worker.onmessage({
      data: { type: "result", id: sentMessage.id, stdout: "1\n", stderr: "" },
    });

    await expect(promise).resolves.toEqual({ stdout: "1\n", stderr: "" });
  });

  it("unsubscribes a status listener", () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);
    const listener = vi.fn();
    const unsubscribe = client.onStatusChange(listener);
    unsubscribe();

    worker.onmessage({ data: { type: "ready" } });

    expect(listener).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/pyodideClient.test.js`
Expected: FAIL — module does not exist yet.

- [ ] **Step 3: Implement pyodideClient.js**

```js
// src/hooks/pyodideClient.js
export function createPyodideClient(worker) {
  const pending = new Map();
  const statusListeners = new Set();
  let status = "loading";
  let nextId = 0;

  function setStatus(next) {
    status = next;
    statusListeners.forEach((listener) => listener(status));
  }

  worker.onmessage = (event) => {
    const data = event.data;
    if (data.type === "ready") {
      setStatus("ready");
    } else if (data.type === "error") {
      setStatus("error");
    } else if (data.type === "result") {
      const entry = pending.get(data.id);
      if (entry) {
        pending.delete(data.id);
        entry.resolve({ stdout: data.stdout, stderr: data.stderr });
      }
    }
  };

  worker.postMessage({ type: "init" });

  function run(code) {
    const id = nextId++;
    return new Promise((resolve) => {
      pending.set(id, { resolve });
      worker.postMessage({ type: "run", id, code });
    });
  }

  function getStatus() {
    return status;
  }

  function onStatusChange(listener) {
    statusListeners.add(listener);
    return () => statusListeners.delete(listener);
  }

  return { run, getStatus, onStatusChange };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/pyodideClient.test.js`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/pyodideClient.js src/hooks/pyodideClient.test.js
git commit -m "Add Pyodide worker message-correlation client"
```

---

### Task 5: Pyodide Web Worker (`worker/pyodideWorker.js`)

**Files:**
- Create: `src/worker/pyodideWorker.js`

**Interfaces:**
- Consumes: `{type: "init"}` and `{type: "run", id, code}` messages (the protocol `pyodideClient.js` from Task 4 speaks).
- Produces: `{type: "ready"}`, `{type: "error", message}`, `{type: "result", id, stdout, stderr}` messages.

This file loads real Pyodide (WASM) and cannot be meaningfully unit-tested with a fast in-process test — loading it takes several seconds and requires a browser-like environment. Its correctness is verified manually in Task 6 (status flips to "ready") and Task 12 (a real lesson runs end-to-end in the browser), matching the spec's stated testing approach.

- [ ] **Step 1: Implement pyodideWorker.js**

```js
// src/worker/pyodideWorker.js
import { loadPyodide, version as pyodideVersion } from "pyodide";

let pyodideReady = null;

async function initPyodide() {
  return loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
  });
}

self.onmessage = async (event) => {
  const { type, id, code } = event.data;

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
    let stdout = "";
    let stderr = "";
    pyodide.setStdout({
      batched: (text) => {
        stdout += text;
      },
    });
    pyodide.setStderr({
      batched: (text) => {
        stderr += text;
      },
    });
    try {
      await pyodide.runPythonAsync(code);
    } catch (err) {
      stderr += String(err);
    }
    self.postMessage({ type: "result", id, stdout, stderr });
  }
};
```

Note: Pyodide's `batched` callback is called with a complete line (including its trailing newline) whenever a newline is written, or with a partial chunk (no trailing newline) on flush — so `stdout`/`stderr` are built by plain concatenation, with no extra `\n` inserted here.

- [ ] **Step 2: Commit**

```bash
git add src/worker/pyodideWorker.js
git commit -m "Add Pyodide Web Worker for in-browser Python execution"
```

---

### Task 6: Pyodide context provider, status badge, and temporary wiring

**Files:**
- Create: `src/hooks/PyodideProvider.jsx`
- Create: `src/components/PyodideStatusBadge.jsx`
- Modify: `src/App.jsx` (temporary — replaced by real routing in Task 12)

**Interfaces:**
- Consumes: `createPyodideClient` (Task 4), `pyodideWorker.js` (Task 5).
- Produces: `PyodideContext`, `PyodideProvider({children})`, `usePyodideContext() -> {status, run}`. Used by Tasks 9 (`CodeBlock`), 10 (`Exercise`), and the final `Sidebar` (Task 11).

The spec sketched this as a plain `usePyodide` hook, but every `CodeBlock`/`Exercise` on a lesson page must share **one** Pyodide worker, not spin up their own — so this is a context provider wrapping the hook, not a per-component hook. Same architectural role the spec describes ("App.jsx: Pyodide worker provider"), just named for what it actually is.

- [ ] **Step 1: Implement PyodideProvider.jsx**

```jsx
// src/hooks/PyodideProvider.jsx
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { createPyodideClient } from "./pyodideClient.js";

export const PyodideContext = createContext({
  status: "loading",
  run: async () => ({ stdout: "", stderr: "Pyodide not ready" }),
});

export function usePyodideContext() {
  return useContext(PyodideContext);
}

export function PyodideProvider({ children }) {
  const clientRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const worker = new Worker(new URL("../worker/pyodideWorker.js", import.meta.url), {
      type: "module",
    });
    const client = createPyodideClient(worker);
    clientRef.current = client;
    setStatus(client.getStatus());
    const unsubscribe = client.onStatusChange(setStatus);

    return () => {
      unsubscribe();
      worker.terminate();
    };
  }, []);

  const run = useCallback((code) => {
    if (!clientRef.current) {
      return Promise.resolve({ stdout: "", stderr: "Pyodide not ready" });
    }
    return clientRef.current.run(code);
  }, []);

  return <PyodideContext.Provider value={{ status, run }}>{children}</PyodideContext.Provider>;
}
```

- [ ] **Step 2: Implement PyodideStatusBadge.jsx**

```jsx
// src/components/PyodideStatusBadge.jsx
import { usePyodideContext } from "../hooks/PyodideProvider.jsx";

const LABELS = {
  loading: "Python: loading…",
  ready: "Python: ready",
  error: "Python: failed to load",
};

export default function PyodideStatusBadge() {
  const { status } = usePyodideContext();
  return (
    <span className="text-xs text-slate-500" data-status={status}>
      {LABELS[status] ?? status}
    </span>
  );
}
```

- [ ] **Step 3: Temporarily wire both into App.jsx**

```jsx
// src/App.jsx
import { PyodideProvider } from "./hooks/PyodideProvider.jsx";
import PyodideStatusBadge from "./components/PyodideStatusBadge.jsx";

export default function App() {
  return (
    <PyodideProvider>
      <div className="p-8 text-xl">
        Learn Python — scaffold OK
        <div className="mt-2">
          <PyodideStatusBadge />
        </div>
      </div>
    </PyodideProvider>
  );
}
```

- [ ] **Step 4: Manually verify in the browser**

Start the dev server (`npm run dev`) and open it in the Browser pane. Confirm the page first shows "Python: loading…", then — after several seconds (first load pulls ~6.4 MB from jsDelivr) — updates to "Python: ready" with no console errors. Reloading the page should reach "ready" much faster (browser-cached).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/PyodideProvider.jsx src/components/PyodideStatusBadge.jsx src/App.jsx
git commit -m "Wire a shared Pyodide worker into a React context provider"
```

---

### Task 7: Progress persistence (`hooks/useProgress.js`)

**Files:**
- Create: `src/hooks/useProgress.js`
- Test: `src/hooks/useProgress.test.js`

**Interfaces:**
- Produces: `useProgress() -> { progress, markExerciseComplete(lessonSlug, exerciseId) }`. `progress` is shaped `{ [lessonSlug]: { [exerciseId]: true } }` and backed by the `learn-python-progress` localStorage key. Used by Task 12's `Lesson.jsx`/`Home.jsx`.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/hooks/useProgress.test.js
import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, it, expect } from "vitest";
import { useProgress } from "./useProgress.js";

beforeEach(() => {
  localStorage.clear();
});

describe("useProgress", () => {
  it("starts empty when localStorage has no saved progress", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress).toEqual({});
  });

  it("marks an exercise complete and persists it to localStorage", () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.markExerciseComplete("control-flow", "control-flow-1");
    });

    expect(result.current.progress).toEqual({ "control-flow": { "control-flow-1": true } });
    expect(JSON.parse(localStorage.getItem("learn-python-progress"))).toEqual({
      "control-flow": { "control-flow-1": true },
    });
  });

  it("loads previously saved progress on mount", () => {
    localStorage.setItem(
      "learn-python-progress",
      JSON.stringify({ welcome: { "welcome-1": true } })
    );

    const { result } = renderHook(() => useProgress());

    expect(result.current.progress).toEqual({ welcome: { "welcome-1": true } });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useProgress.test.js`
Expected: FAIL — module does not exist yet.

- [ ] **Step 3: Implement useProgress.js**

```js
// src/hooks/useProgress.js
import { useState, useCallback } from "react";

const STORAGE_KEY = "learn-python-progress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const markExerciseComplete = useCallback((lessonSlug, exerciseId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        [lessonSlug]: { ...prev[lessonSlug], [exerciseId]: true },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { progress, markExerciseComplete };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useProgress.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useProgress.js src/hooks/useProgress.test.js
git commit -m "Add localStorage-backed progress tracking hook"
```

---

### Task 8: Block registry and Prose block

**Files:**
- Create: `src/blocks/registry.js`
- Create: `src/blocks/Prose.jsx`
- Test: `src/blocks/Prose.test.jsx`

**Interfaces:**
- Consumes: `parseInlineCode` (Task 3).
- Produces: `blockRegistry: { prose, example, exercise } -> Component`. `Prose` consumes `{ body }`. Extended by Tasks 9/10 (`CodeBlock`, `Exercise`) and consumed by Task 12's `Lesson.jsx`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/blocks/Prose.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Prose from "./Prose.jsx";

describe("Prose", () => {
  it("renders backtick-wrapped text inside a code element", () => {
    render(<Prose body="Use `print()` to output text" />);
    expect(screen.getByText("print()").tagName).toBe("CODE");
  });

  it("renders plain text with no code styling when there are no backticks", () => {
    render(<Prose body="just plain text" />);
    expect(screen.getByText("just plain text").tagName).not.toBe("CODE");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/blocks/Prose.test.jsx`
Expected: FAIL — `Prose.jsx` does not exist yet.

- [ ] **Step 3: Implement Prose.jsx and registry.js**

```jsx
// src/blocks/Prose.jsx
import { parseInlineCode } from "./inlineFormat.js";

export default function Prose({ body }) {
  return (
    <p className="my-3 leading-relaxed text-slate-800">
      {parseInlineCode(body).map((part, i) =>
        part.type === "code" ? (
          <code key={i} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm">
            {part.value}
          </code>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </p>
  );
}
```

Registry is created now with just `prose` registered; Tasks 9 and 10 add the other two entries.

```js
// src/blocks/registry.js
import Prose from "./Prose.jsx";

export const blockRegistry = {
  prose: Prose,
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/blocks/Prose.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/blocks/registry.js src/blocks/Prose.jsx src/blocks/Prose.test.jsx
git commit -m "Add block-type registry and Prose block renderer"
```

---

### Task 9: Python editor and CodeBlock (runnable example) component

**Files:**
- Create: `src/blocks/PythonEditor.jsx`
- Create: `src/blocks/CodeBlock.jsx`
- Modify: `src/blocks/registry.js`
- Test: `src/blocks/CodeBlock.test.jsx`

**Interfaces:**
- Consumes: `usePyodideContext` (Task 6).
- Produces: `blockRegistry.example -> CodeBlock`, consuming `{ code }`. Used by Task 12's `Lesson.jsx`.

CodeMirror renders DOM APIs jsdom doesn't fully implement, so `CodeBlock`'s automated test mocks `PythonEditor` out (a thin presentational wrapper) and asserts `CodeBlock`'s actual behavior — the Run button, the Pyodide call, and the output rendering — which is the part worth testing. `PythonEditor` itself is verified visually in Task 12's manual browser check.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/blocks/CodeBlock.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CodeBlock from "./CodeBlock.jsx";
import { PyodideContext } from "../hooks/PyodideProvider.jsx";

vi.mock("./PythonEditor.jsx", () => ({
  default: ({ value, onChange }) => (
    <textarea data-testid="editor" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

function renderWithContext(ui, { status = "ready", run = vi.fn() } = {}) {
  return render(<PyodideContext.Provider value={{ status, run }}>{ui}</PyodideContext.Provider>);
}

describe("CodeBlock", () => {
  it("disables the Run button until Pyodide is ready", () => {
    renderWithContext(<CodeBlock code="print(1)" />, { status: "loading" });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("runs the code and displays stdout on click", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "1\n", stderr: "" });
    renderWithContext(<CodeBlock code="print(1)" />, { run });

    fireEvent.click(screen.getByRole("button", { name: /run/i }));

    await waitFor(() => expect(screen.getByText(/1/)).toBeInTheDocument());
    expect(run).toHaveBeenCalledWith("print(1)");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/blocks/CodeBlock.test.jsx`
Expected: FAIL — `CodeBlock.jsx`/`PythonEditor.jsx` do not exist yet.

- [ ] **Step 3: Implement PythonEditor.jsx and CodeBlock.jsx, update registry.js**

```jsx
// src/blocks/PythonEditor.jsx
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

export default function PythonEditor({ value, onChange }) {
  return <CodeMirror value={value} extensions={[python()]} onChange={onChange} />;
}
```

```jsx
// src/blocks/CodeBlock.jsx
import { useState } from "react";
import PythonEditor from "./PythonEditor.jsx";
import { usePyodideContext } from "../hooks/PyodideProvider.jsx";

export default function CodeBlock({ code: initialCode }) {
  const { status, run } = usePyodideContext();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    const result = await run(code);
    setOutput(result);
    setRunning(false);
  }

  return (
    <div className="my-4 rounded border border-slate-200">
      <PythonEditor value={code} onChange={setCode} />
      <div className="flex items-center gap-2 border-t border-slate-200 p-2">
        <button
          type="button"
          onClick={handleRun}
          disabled={status !== "ready" || running}
          className="rounded bg-slate-800 px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          {status !== "ready" ? "Loading Python…" : running ? "Running…" : "Run"}
        </button>
      </div>
      {output && (
        <pre className="whitespace-pre-wrap border-t border-slate-200 bg-slate-50 p-2 text-sm">
          {output.stdout}
          {output.stderr}
        </pre>
      )}
    </div>
  );
}
```

```js
// src/blocks/registry.js
import Prose from "./Prose.jsx";
import CodeBlock from "./CodeBlock.jsx";

export const blockRegistry = {
  prose: Prose,
  example: CodeBlock,
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/blocks/CodeBlock.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/blocks/PythonEditor.jsx src/blocks/CodeBlock.jsx src/blocks/registry.js src/blocks/CodeBlock.test.jsx
git commit -m "Add runnable example code block"
```

---

### Task 10: Exercise (auto-checked) component

**Files:**
- Create: `src/blocks/Exercise.jsx`
- Modify: `src/blocks/registry.js`
- Test: `src/blocks/Exercise.test.jsx`

**Interfaces:**
- Consumes: `usePyodideContext` (Task 6), `runCheck` (Task 2).
- Produces: `blockRegistry.exercise -> Exercise`, consuming `{ id, prompt, starterCode, check, lessonSlug, onExercisePass }`. `onExercisePass(lessonSlug, exerciseId)` is called only when the check passes. Used by Task 12's `Lesson.jsx`, which supplies `lessonSlug`/`onExercisePass` (backed by Task 7's `markExerciseComplete`).

`Exercise` never touches `localStorage`/`useProgress` directly — it just reports pass/fail upward via `onExercisePass`, which keeps it testable in isolation and keeps "how progress is stored" out of a component that shouldn't need to know.

- [ ] **Step 1: Write the failing tests**

```jsx
// src/blocks/Exercise.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Exercise from "./Exercise.jsx";
import { PyodideContext } from "../hooks/PyodideProvider.jsx";

vi.mock("./PythonEditor.jsx", () => ({
  default: ({ value, onChange }) => (
    <textarea data-testid="editor" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

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

describe("Exercise", () => {
  it("shows a pass state and calls onExercisePass when output matches", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "odd\n", stderr: "" });
    const onExercisePass = vi.fn();
    renderExercise({ run, onExercisePass });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => expect(screen.getByText("Passed!")).toBeInTheDocument());
    expect(onExercisePass).toHaveBeenCalledWith("control-flow", "ex-1");
  });

  it("shows a fail state and does not call onExercisePass when output does not match", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "even\n", stderr: "" });
    const onExercisePass = vi.fn();
    renderExercise({ run, onExercisePass });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => expect(screen.getByText(/Not quite/)).toBeInTheDocument());
    expect(onExercisePass).not.toHaveBeenCalled();
  });

  it("treats a runtime error as a failure", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "", stderr: "NameError: x is not defined" });
    const onExercisePass = vi.fn();
    renderExercise({ run, onExercisePass });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => expect(screen.getByText(/Not quite/)).toBeInTheDocument());
    expect(onExercisePass).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/blocks/Exercise.test.jsx`
Expected: FAIL — `Exercise.jsx` does not exist yet.

- [ ] **Step 3: Implement Exercise.jsx, update registry.js**

```jsx
// src/blocks/Exercise.jsx
import { useState } from "react";
import PythonEditor from "./PythonEditor.jsx";
import { usePyodideContext } from "../hooks/PyodideProvider.jsx";
import { runCheck } from "./checkers.js";

export default function Exercise({ id, prompt, starterCode, check, lessonSlug, onExercisePass }) {
  const { status, run } = usePyodideContext();
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    setChecking(true);
    const { stdout, stderr } = await run(code);
    const passed = !stderr && runCheck(stdout, check);
    setResult({ passed, actual: stderr || stdout });
    setChecking(false);
    if (passed) {
      onExercisePass?.(lessonSlug, id);
    }
  }

  return (
    <div className="my-4 rounded border-2 border-amber-300 bg-amber-50 p-3">
      <p className="mb-2 font-medium">{prompt}</p>
      <PythonEditor value={code} onChange={setCode} />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCheck}
          disabled={status !== "ready" || checking}
          className="rounded bg-amber-700 px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          {status !== "ready" ? "Loading Python…" : checking ? "Checking…" : "Check"}
        </button>
        {result && (
          <span className={result.passed ? "text-green-700" : "text-red-700"}>
            {result.passed ? "Passed!" : `Not quite — got: ${result.actual}`}
          </span>
        )}
      </div>
    </div>
  );
}
```

```js
// src/blocks/registry.js
import Prose from "./Prose.jsx";
import CodeBlock from "./CodeBlock.jsx";
import Exercise from "./Exercise.jsx";

export const blockRegistry = {
  prose: Prose,
  example: CodeBlock,
  exercise: Exercise,
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/blocks/Exercise.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/blocks/Exercise.jsx src/blocks/registry.js src/blocks/Exercise.test.jsx
git commit -m "Add auto-checked exercise block"
```

---

### Task 11: Lesson navigation utilities, Sidebar, and LessonLayout

**Files:**
- Create: `src/content/lessonUtils.js`
- Create: `src/components/Sidebar.jsx`
- Create: `src/components/LessonLayout.jsx`
- Test: `src/content/lessonUtils.test.js`
- Test: `src/components/Sidebar.test.jsx`

**Interfaces:**
- Produces: `getExerciseIds(lesson)`, `isLessonComplete(lesson, progress)`, `getContinueLesson(lessons, progress)`, `getAdjacentLessons(lessons, currentSlug)`. `Sidebar({ lessons, progress })`, `LessonLayout({ lessons, progress, currentSlug, children })`. All consumed by Task 12's `Home.jsx`/`Lesson.jsx`.
- Consumes: `usePyodideContext` indirectly via `PyodideStatusBadge` (Task 6), rendered inside `Sidebar`.

`lessons` here is always the full array of lesson content objects (`{ slug, title, blocks }`) from Task 12's `lessonIndex.js` — not a lightweight slug/title-only list — so completion can be derived directly from each lesson's exercise blocks without a second, hand-maintained list to keep in sync.

- [ ] **Step 1: Write the failing lessonUtils tests**

```js
// src/content/lessonUtils.test.js
import { describe, it, expect } from "vitest";
import {
  getExerciseIds,
  isLessonComplete,
  getContinueLesson,
  getAdjacentLessons,
} from "./lessonUtils.js";

const lessons = [
  { slug: "a", title: "A", blocks: [{ type: "prose" }, { type: "exercise", id: "a-1" }] },
  {
    slug: "b",
    title: "B",
    blocks: [
      { type: "exercise", id: "b-1" },
      { type: "exercise", id: "b-2" },
    ],
  },
  { slug: "c", title: "C", blocks: [{ type: "exercise", id: "c-1" }] },
];

describe("getExerciseIds", () => {
  it("returns only exercise block ids", () => {
    expect(getExerciseIds(lessons[1])).toEqual(["b-1", "b-2"]);
  });
});

describe("isLessonComplete", () => {
  it("is false when no exercises have been passed", () => {
    expect(isLessonComplete(lessons[0], {})).toBe(false);
  });

  it("is true only when every exercise id is marked true", () => {
    expect(isLessonComplete(lessons[1], { b: { "b-1": true } })).toBe(false);
    expect(isLessonComplete(lessons[1], { b: { "b-1": true, "b-2": true } })).toBe(true);
  });
});

describe("getContinueLesson", () => {
  it("returns the first incomplete lesson", () => {
    const progress = { a: { "a-1": true } };
    expect(getContinueLesson(lessons, progress).slug).toBe("b");
  });

  it("returns the last lesson when everything is complete", () => {
    const progress = {
      a: { "a-1": true },
      b: { "b-1": true, "b-2": true },
      c: { "c-1": true },
    };
    expect(getContinueLesson(lessons, progress).slug).toBe("c");
  });
});

describe("getAdjacentLessons", () => {
  it("returns null for prev at the first lesson and null for next at the last", () => {
    expect(getAdjacentLessons(lessons, "a").prev).toBeNull();
    expect(getAdjacentLessons(lessons, "c").next).toBeNull();
  });

  it("returns the correct neighbors for a middle lesson", () => {
    const { prev, next } = getAdjacentLessons(lessons, "b");
    expect(prev.slug).toBe("a");
    expect(next.slug).toBe("c");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/content/lessonUtils.test.js`
Expected: FAIL — module does not exist yet.

- [ ] **Step 3: Implement lessonUtils.js**

```js
// src/content/lessonUtils.js
export function getExerciseIds(lesson) {
  return lesson.blocks.filter((block) => block.type === "exercise").map((block) => block.id);
}

export function isLessonComplete(lesson, progress) {
  const exerciseIds = getExerciseIds(lesson);
  const lessonProgress = progress[lesson.slug] || {};
  return exerciseIds.length > 0 && exerciseIds.every((id) => lessonProgress[id]);
}

export function getContinueLesson(lessons, progress) {
  return (
    lessons.find((lesson) => !isLessonComplete(lesson, progress)) || lessons[lessons.length - 1]
  );
}

export function getAdjacentLessons(lessons, currentSlug) {
  const index = lessons.findIndex((lesson) => lesson.slug === currentSlug);
  return {
    prev: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/content/lessonUtils.test.js`
Expected: PASS (7 tests)

- [ ] **Step 5: Write the failing Sidebar test**

```jsx
// src/components/Sidebar.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Sidebar from "./Sidebar.jsx";
import { PyodideContext } from "../hooks/PyodideProvider.jsx";

const lessons = [
  { slug: "a", title: "Lesson A", blocks: [{ type: "exercise", id: "a-1" }] },
  { slug: "b", title: "Lesson B", blocks: [{ type: "exercise", id: "b-1" }] },
];

function renderSidebar(progress) {
  return render(
    <PyodideContext.Provider value={{ status: "ready", run: async () => ({}) }}>
      <MemoryRouter initialEntries={["/lessons/a"]}>
        <Sidebar lessons={lessons} progress={progress} />
      </MemoryRouter>
    </PyodideContext.Provider>
  );
}

describe("Sidebar", () => {
  it("shows a checkmark only for completed lessons", () => {
    renderSidebar({ a: { "a-1": true } });
    const links = screen.getAllByRole("link");
    expect(links[1]).toHaveTextContent("✓");
    expect(links[2]).toHaveTextContent("Lesson B");
    expect(links[2]).not.toHaveTextContent("✓");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/Sidebar.test.jsx`
Expected: FAIL — `Sidebar.jsx` does not exist yet.

- [ ] **Step 7: Implement Sidebar.jsx and LessonLayout.jsx**

```jsx
// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { isLessonComplete } from "../content/lessonUtils.js";
import PyodideStatusBadge from "./PyodideStatusBadge.jsx";

export default function Sidebar({ lessons, progress }) {
  return (
    <nav className="w-64 shrink-0 border-r border-slate-200 p-4">
      <NavLink to="/" className="mb-4 block font-semibold text-slate-900">
        Learn Python
      </NavLink>
      <ol className="space-y-1">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <NavLink
              to={`/lessons/${lesson.slug}`}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded px-2 py-1 text-sm ${
                  isActive ? "bg-slate-100 font-medium" : "text-slate-700"
                }`
              }
            >
              <span className="w-4 text-center">
                {isLessonComplete(lesson, progress) ? "✓" : i + 1}
              </span>
              {lesson.title}
            </NavLink>
          </li>
        ))}
      </ol>
      <div className="mt-4 border-t border-slate-200 pt-2">
        <PyodideStatusBadge />
      </div>
    </nav>
  );
}
```

```jsx
// src/components/LessonLayout.jsx
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { getAdjacentLessons } from "../content/lessonUtils.js";

export default function LessonLayout({ lessons, progress, currentSlug, children }) {
  const { prev, next } = getAdjacentLessons(lessons, currentSlug);

  return (
    <div className="flex min-h-screen">
      <Sidebar lessons={lessons} progress={progress} />
      <main className="mx-auto max-w-2xl flex-1 px-6 py-8">
        {children}
        <div className="mt-8 flex justify-between border-t border-slate-200 pt-4 text-sm">
          {prev ? (
            <Link to={`/lessons/${prev.slug}`} className="text-slate-600 hover:underline">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/lessons/${next.slug}`} className="text-slate-600 hover:underline">
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/Sidebar.test.jsx`
Expected: PASS (1 test)

- [ ] **Step 9: Commit**

```bash
git add src/content/lessonUtils.js src/content/lessonUtils.test.js src/components/Sidebar.jsx src/components/LessonLayout.jsx src/components/Sidebar.test.jsx
git commit -m "Add lesson navigation utilities, Sidebar, and LessonLayout"
```

---

### Task 12: First lesson content, pages, and full app wiring (first end-to-end milestone)

**Files:**
- Create: `src/content/courses/python-core/lessons/01-welcome.js`
- Create: `src/content/courses/python-core/lessonIndex.js`
- Create: `src/pages/Home.jsx`
- Create: `src/pages/Lesson.jsx`
- Modify: `src/App.jsx` (replace Task 6's temporary placeholder with real routing)

**Interfaces:**
- Consumes: everything from Tasks 6–11 (`PyodideProvider`, `useProgress`, `blockRegistry`, `LessonLayout`, `lessonUtils`).
- Produces: `lessons` (array of lesson content objects) exported from `lessonIndex.js` — the single source of truth Task 13 appends to.

This is the first point the whole pipeline (routing → content → Pyodide → exercise checking → localStorage) runs together, so it gets a full manual browser walkthrough instead of another unit test.

- [ ] **Step 1: Create the first lesson content file**

```js
// src/content/courses/python-core/lessons/01-welcome.js
export default {
  slug: "welcome",
  title: "Welcome & Your First Script",
  blocks: [
    {
      type: "prose",
      body: "No install needed for this course — Python runs right in your browser via WebAssembly, so you can write, edit, and run real Python without ever opening a terminal.",
    },
    {
      type: "prose",
      body: "In JS, a full \"hello world\" is `console.log('Hello, world!')`. In Python it's `print('Hello, world!')` — no semicolon, and it's a plain function call, not a method on a global object.",
    },
    {
      type: "prose",
      body: "Comments start with `#`, not `//`, and there's no block-comment syntax like `/* */` — every commented line needs its own `#`.",
    },
    {
      type: "example",
      code: `print("Hello, world!")
# This is a comment`,
    },
    {
      type: "exercise",
      id: "welcome-1",
      prompt: "Use print() to output exactly this line: Python is fun",
      starterCode: `# write your code below
`,
      check: { type: "stdout-exact", expected: "Python is fun" },
    },
  ],
};
```

- [ ] **Step 2: Create lessonIndex.js**

```js
// src/content/courses/python-core/lessonIndex.js
import welcome from "./lessons/01-welcome.js";

export const lessons = [welcome];
```

(Task 13 imports the remaining 13 lessons and appends them to this array — nothing else about this file's shape changes.)

- [ ] **Step 3: Create Home.jsx**

```jsx
// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { lessons } from "../content/courses/python-core/lessonIndex.js";
import { useProgress } from "../hooks/useProgress.js";
import { getContinueLesson, isLessonComplete } from "../content/lessonUtils.js";

export default function Home() {
  const { progress } = useProgress();
  const continueLesson = getContinueLesson(lessons, progress);
  const completedCount = lessons.filter((lesson) => isLessonComplete(lesson, progress)).length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold text-slate-900">Learn Python</h1>
      <p className="mb-6 text-slate-600">
        A {lessons.length}-lesson course covering core Python syntax, written for someone who
        already knows HTML, CSS, and JavaScript. {completedCount} of {lessons.length} lessons
        complete.
      </p>
      <Link
        to={`/lessons/${continueLesson.slug}`}
        className="inline-block rounded bg-slate-800 px-4 py-2 text-white"
      >
        {completedCount === 0 ? "Start the course" : "Continue where you left off"}
      </Link>
      <ol className="mt-8 space-y-1">
        {lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link to={`/lessons/${lesson.slug}`} className="text-slate-700 hover:underline">
              {isLessonComplete(lesson, progress) ? "✓" : i + 1}. {lesson.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 4: Create Lesson.jsx**

```jsx
// src/pages/Lesson.jsx
import { useParams } from "react-router-dom";
import { lessons } from "../content/courses/python-core/lessonIndex.js";
import { useProgress } from "../hooks/useProgress.js";
import { blockRegistry } from "../blocks/registry.js";
import LessonLayout from "../components/LessonLayout.jsx";

export default function Lesson() {
  const { slug } = useParams();
  const { progress, markExerciseComplete } = useProgress();
  const lesson = lessons.find((l) => l.slug === slug);

  if (!lesson) {
    return <p className="p-8">Lesson not found.</p>;
  }

  return (
    <LessonLayout lessons={lessons} progress={progress} currentSlug={slug}>
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">{lesson.title}</h1>
      {lesson.blocks.map((block, i) => {
        const Component = blockRegistry[block.type];
        return (
          <Component
            key={i}
            {...block}
            lessonSlug={lesson.slug}
            onExercisePass={markExerciseComplete}
          />
        );
      })}
    </LessonLayout>
  );
}
```

- [ ] **Step 5: Replace App.jsx with real routing**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PyodideProvider } from "./hooks/PyodideProvider.jsx";
import Home from "./pages/Home.jsx";
import Lesson from "./pages/Lesson.jsx";

export default function App() {
  return (
    <PyodideProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons/:slug" element={<Lesson />} />
        </Routes>
      </BrowserRouter>
    </PyodideProvider>
  );
}
```

- [ ] **Step 6: Run the full automated test suite**

Run: `npm run test`
Expected: PASS — every test from Tasks 2–11 still passes (nothing in this task touched code they cover).

- [ ] **Step 7: Manual end-to-end verification in the browser**

Start the dev server and open it in the Browser pane.

1. Home page shows "Learn Python", "Start the course", and a one-item lesson list.
2. Click "Start the course" → lands on `/lessons/welcome`.
3. Sidebar shows "Python: loading…" then "Python: ready" after a few seconds.
4. In the example block, click "Run" → output shows `Hello, world!`.
5. In the exercise block, type `print("Python is fun")`, click "Check" → shows "Passed!" and the sidebar's "Welcome & Your First Script" entry gets a ✓.
6. Reload the page → the ✓ is still there (localStorage persisted it) and the example/exercise code boxes reset to their authored defaults (per-session editor state, not persisted — matches spec's non-goal of anything beyond exercise-pass tracking).
7. Go back to `/` → "Continue where you left off" now points at the same lesson (it's still the only one, and it's complete, so `getContinueLesson` correctly falls back to the last lesson).

- [ ] **Step 8: Commit**

```bash
git add src/content/courses/python-core/lessons/01-welcome.js src/content/courses/python-core/lessonIndex.js src/pages/Home.jsx src/pages/Lesson.jsx src/App.jsx
git commit -m "Wire up routing, Home, and Lesson pages; first working end-to-end lesson"
```

---

### Task 13: Remaining 13 lessons

**Files:**
- Create: `src/content/courses/python-core/lessons/02-variables-and-types.js` through `14-list-comprehensions.js` (13 files)
- Modify: `src/content/courses/python-core/lessonIndex.js`

**Interfaces:**
- Produces: 13 more entries in the `lessons` array from Task 12. No other file changes — this is the "add lessons" extensibility path the spec calls out, exercised 13 times in one batch.

Every example and exercise below has already been executed against a real Python 3 interpreter during planning (both the example code and a correct student solution for each exercise's `starterCode`), so the `check.expected` values are verified correct, not just plausible.

- [ ] **Step 1: Create 02-variables-and-types.js**

```js
export default {
  slug: "variables-and-types",
  title: "Variables & Types",
  blocks: [
    {
      type: "prose",
      body: "JS has `let`, `const`, and old-school `var`. Python has none of that — you just write `name = value` and it's created (or reassigned) on the spot. There's no declaration keyword at all.",
    },
    {
      type: "prose",
      body: "Naming convention differs too: JS and Java favor camelCase; Python convention is snake_case — `user_name`, not `userName`.",
    },
    {
      type: "prose",
      body: "Python is dynamically typed, just like JS: a variable can hold an int and later hold a string with no error. Use `type(x)` to check what something currently is.",
    },
    {
      type: "example",
      code: `age = 30
name = "Ada"
print(type(age))
print(type(name))
age = "thirty"
print(type(age))`,
    },
    {
      type: "exercise",
      id: "variables-1",
      prompt: "Create a variable called city set to the string \"Phoenix\", then print it.",
      starterCode: `# create the variable and print it
`,
      check: { type: "stdout-exact", expected: "Phoenix" },
    },
  ],
};
```

- [ ] **Step 2: Create 03-numbers-strings-fstrings.js**

```js
export default {
  slug: "numbers-strings-fstrings",
  title: "Numbers, Strings & f-strings",
  blocks: [
    {
      type: "prose",
      body: "Python has `int` and `float` instead of one generic number type. `7 / 2` gives a float (3.5); use `//` for integer division — `7 // 2` is `3`.",
    },
    {
      type: "prose",
      body: "Python's equivalent of a JS template literal is an f-string: put an `f` right before the opening quote and use `{}` to interpolate values, e.g. `f\"Hello, {name}!\"` — it does the same job as a template literal with `${name}` inside it.",
    },
    {
      type: "example",
      code: `name = "Sam"
score = 95
print(f"{name} scored {score} points")
print(7 / 2)
print(7 // 2)`,
    },
    {
      type: "exercise",
      id: "numbers-strings-1",
      prompt: "a = 5 and b = 7 are given. Using an f-string, print exactly: Total: 12",
      starterCode: `a = 5
b = 7
# print using an f-string
`,
      check: { type: "stdout-exact", expected: "Total: 12" },
    },
  ],
};
```

- [ ] **Step 3: Create 04-control-flow.js**

```js
export default {
  slug: "control-flow",
  title: "Control Flow",
  blocks: [
    {
      type: "prose",
      body: "JS wraps blocks in `{}`; Python uses indentation instead. A colon `:` starts a block, and every line indented under it belongs to that block — get the indentation wrong and you get an IndentationError.",
    },
    {
      type: "prose",
      body: "JS's if / else if / else becomes Python's `if` / `elif` / `else` — note `elif`, not \"else if\".",
    },
    {
      type: "prose",
      body: "Falsy values differ slightly from JS: `0`, `0.0`, an empty string, `None`, and empty lists/dicts are all falsy; everything else — including the string \"0\" — is truthy.",
    },
    {
      type: "example",
      code: `temperature = 75
if temperature > 80:
    print("hot")
elif temperature > 60:
    print("mild")
else:
    print("cold")`,
    },
    {
      type: "exercise",
      id: "control-flow-1",
      prompt: "x = 7 is given. Print \"even\" if x is even, otherwise print \"odd\". (Hint: x % 2 == 0 checks evenness, same as JS.)",
      starterCode: `x = 7
`,
      check: { type: "stdout-exact", expected: "odd" },
    },
  ],
};
```

- [ ] **Step 4: Create 05-loops.js**

```js
export default {
  slug: "loops",
  title: "Loops",
  blocks: [
    {
      type: "prose",
      body: "JS's for...of loops over the values in an array; Python's for loop always works this way — `for item in some_list:`. There's no idiomatic C-style `for (let i = 0; i < n; i++)` in Python.",
    },
    {
      type: "prose",
      body: "Need a counted loop instead? Use `range(n)`: `for i in range(5):` counts 0 through 4, the same range as `for (let i = 0; i < 5; i++)`.",
    },
    {
      type: "prose",
      body: "`while` works just like JS's while — a condition, a colon, and an indented body. Python also has no `i++`; you write `i += 1` instead.",
    },
    {
      type: "example",
      code: `for i in range(5):
    print(i)

count = 3
while count > 0:
    print(count)
    count -= 1`,
    },
    {
      type: "exercise",
      id: "loops-1",
      prompt: "Use a for loop with range() to print the numbers 1 through 4, each on its own line.",
      starterCode: `# your loop here
`,
      check: { type: "stdout-exact", expected: "1\n2\n3\n4" },
    },
  ],
};
```

- [ ] **Step 5: Create 06-lists.js**

```js
export default {
  slug: "lists",
  title: "Lists",
  blocks: [
    {
      type: "prose",
      body: "Python lists are written just like JS arrays: `fruits = [\"apple\", \"banana\"]`. Indexing works the same way too — `fruits[0]` — and Python adds negative indices: `fruits[-1]` is the last item, no more `arr[arr.length - 1]`.",
    },
    {
      type: "prose",
      body: "Slicing is new: `fruits[1:3]` gives the items at index 1 and 2 — start inclusive, end exclusive. It's like `.slice()` but built into the syntax.",
    },
    {
      type: "prose",
      body: "Common methods map over directly: `.append(x)` is JS's `.push(x)`, and `len(fruits)` replaces `.length` — note it's a function call, not a property.",
    },
    {
      type: "example",
      code: `fruits = ["apple", "banana", "cherry"]
fruits.append("date")
print(fruits)
print(fruits[-1])
print(fruits[1:3])
print(len(fruits))`,
    },
    {
      type: "exercise",
      id: "lists-1",
      prompt: "numbers = [10, 20, 30] is given. Append 40 to it, then print the list.",
      starterCode: `numbers = [10, 20, 30]
`,
      check: { type: "stdout-exact", expected: "[10, 20, 30, 40]" },
    },
  ],
};
```

- [ ] **Step 6: Create 07-dictionaries.js**

```js
export default {
  slug: "dictionaries",
  title: "Dictionaries",
  blocks: [
    {
      type: "prose",
      body: "Python dicts are like JS objects (or Maps): `person = {\"name\": \"Ada\", \"age\": 30}`. Keys are written as strings with quotes — there's no unquoted-key shortcut like JS object literals have.",
    },
    {
      type: "prose",
      body: "Access is bracket-only: `person[\"name\"]` — there's no dot-access shortcut like JS's `person.name`.",
    },
    {
      type: "prose",
      body: "Add or update a key the same way as JS: `person[\"age\"] = 31`. Check whether a key exists with `\"age\" in person`, which reads almost exactly like JS's `\"age\" in person`.",
    },
    {
      type: "example",
      code: `person = {"name": "Ada", "age": 30}
person["age"] = 31
print(person["name"])
print(person)
print("age" in person)`,
    },
    {
      type: "exercise",
      id: "dictionaries-1",
      prompt: "book = {\"title\": \"Dune\"} is given. Add a key \"author\" with value \"Herbert\", then print the dictionary.",
      starterCode: `book = {"title": "Dune"}
`,
      check: { type: "stdout-exact", expected: "{'title': 'Dune', 'author': 'Herbert'}" },
    },
  ],
};
```

- [ ] **Step 7: Create 08-tuples-and-sets.js**

```js
export default {
  slug: "tuples-and-sets",
  title: "Tuples & Sets",
  blocks: [
    {
      type: "prose",
      body: "A tuple looks like a list but with parentheses, and it can't be changed after creation: `point = (3, 4)`. Try `point[0] = 5` and you'll get a TypeError — there's no exact JS equivalent, though Object.freeze() on an array is the closest idea.",
    },
    {
      type: "prose",
      body: "A set is like JS's Set: unordered, with no duplicates. `colors = {\"red\", \"green\", \"red\"}` collapses down to two items.",
    },
    {
      type: "prose",
      body: "Use tuples for fixed groups of values (like coordinates), sets for uniqueness checks, and lists for everything else that needs to change.",
    },
    {
      type: "example",
      code: `point = (3, 4)
print(point[0])

colors = {"red", "green", "red"}
print(len(colors))
print("red" in colors)`,
    },
    {
      type: "exercise",
      id: "tuples-and-sets-1",
      prompt: "numbers = [1, 2, 2, 3, 3, 3] is given. Create a set called unique_nums from it, then print its length with len().",
      starterCode: `numbers = [1, 2, 2, 3, 3, 3]
`,
      check: { type: "stdout-exact", expected: "3" },
    },
  ],
};
```

- [ ] **Step 8: Create 09-functions.js**

```js
export default {
  slug: "functions",
  title: "Functions",
  blocks: [
    {
      type: "prose",
      body: "JS: `function add(a, b) { return a + b; }`. Python: `def add(a, b):` followed by an indented body with `return a + b` — no braces, no function keyword for the body, no semicolon.",
    },
    {
      type: "prose",
      body: "Default parameters look similar — `def greet(name=\"World\"):` compares to `function greet(name = \"World\")` — but Python has a classic trap: a mutable default argument like `def add_item(item, items=[]):` is created once and reused across every call, unlike a fresh JS closure. The fix is `items=None`, then `if items is None: items = []` inside the function.",
    },
    {
      type: "prose",
      body: "Variable arguments: JS's rest parameter `...args` becomes Python's `*args`.",
    },
    {
      type: "example",
      code: `def greet(name="World"):
    print(f"Hello, {name}!")

greet()
greet("Ada")

def total(*numbers):
    return sum(numbers)

print(total(1, 2, 3))`,
    },
    {
      type: "exercise",
      id: "functions-1",
      prompt: "Write a function called square that takes one number and returns its square. Then call square(6) and print the result.",
      starterCode: `def square(n):
    # your code here
    pass
`,
      check: { type: "stdout-exact", expected: "36" },
    },
  ],
};
```

- [ ] **Step 9: Create 10-string-methods.js**

```js
export default {
  slug: "string-methods",
  title: "String Methods & Formatting",
  blocks: [
    {
      type: "prose",
      body: "Many string methods map directly: JS's `.toUpperCase()` becomes Python's `.upper()`; `.trim()` becomes `.strip()`; `.includes()` becomes the `in` operator, e.g. `\"lo\" in \"hello\"`; `.split(\",\")` is spelled and behaves the same way in both.",
    },
    {
      type: "prose",
      body: "Joining is flipped: JS does `arr.join(\", \")`; Python does `\", \".join(arr)` — the separator string calls `.join()`, not the list.",
    },
    {
      type: "prose",
      body: "f-strings support format specs too: `f\"{price:.2f}\"` rounds a float to 2 decimal places, similar to JS's `price.toFixed(2)` but written inline in the string.",
    },
    {
      type: "example",
      code: `name = "  Ada Lovelace  "
print(name.strip().upper())
words = name.strip().split(" ")
print(", ".join(words))
price = 19.5
print(f"\${price:.2f}")`,
    },
    {
      type: "exercise",
      id: "string-methods-1",
      prompt: "s = \"  hello world  \" is given. Print it stripped of whitespace and fully uppercase, on one line.",
      starterCode: `s = "  hello world  "
`,
      check: { type: "stdout-exact", expected: "HELLO WORLD" },
    },
  ],
};
```

Note the `\$` before `{price:.2f}` in the example's template literal — that's a JS escape so `${price:.2f}` isn't parsed as a JS template interpolation; the resulting Python source is the literal `print(f"${price:.2f}")`, which prints a real dollar sign followed by the formatted price.

- [ ] **Step 10: Create 11-error-handling.js**

```js
export default {
  slug: "error-handling",
  title: "Error Handling",
  blocks: [
    {
      type: "prose",
      body: "JS's try { ... } catch (e) { ... } becomes Python's `try:` / `except Exception as e:` — same idea, different keywords, and Python's blocks use indentation like everywhere else.",
    },
    {
      type: "prose",
      body: "Python exceptions are typed, and it's idiomatic to catch specific ones — `except ValueError:`, `except ZeroDivisionError:` — rather than a catch-all `except:`, which also swallows real bugs.",
    },
    {
      type: "prose",
      body: "`finally:` behaves exactly like JS's `finally` block — it runs whether or not an exception happened.",
    },
    {
      type: "example",
      code: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None

print(safe_divide(10, 2))
print(safe_divide(10, 0))`,
    },
    {
      type: "exercise",
      id: "error-handling-1",
      prompt: "Write code that tries to convert the string \"abc\" to an int with int(\"abc\"), catches the ValueError, and prints exactly: invalid number",
      starterCode: `# your try/except here
`,
      check: { type: "stdout-exact", expected: "invalid number" },
    },
  ],
};
```

- [ ] **Step 11: Create 12-modules-and-imports.js**

```js
export default {
  slug: "modules-and-imports",
  title: "Modules & Imports",
  blocks: [
    {
      type: "prose",
      body: "JS's `import { thing } from \"module\"` becomes Python's `import module` or `from module import thing`. Python's standard library ships as built-in modules — no npm install needed for things like `math` or `random`.",
    },
    {
      type: "prose",
      body: "`import math` then use `math.sqrt(16)` — dotted access, similar to a JS namespace import.",
    },
    {
      type: "prose",
      body: "`if __name__ == \"__main__\":` is a Python idiom with no direct JS equivalent — a guard so code only runs when the file is executed directly, not when another file imports it.",
    },
    {
      type: "example",
      code: `import math

print(math.sqrt(16))
print(math.pi)

if __name__ == "__main__":
    print("running directly")`,
    },
    {
      type: "exercise",
      id: "modules-and-imports-1",
      prompt: "Import the math module and print the result of math.floor(7.9).",
      starterCode: `# import and print here
`,
      check: { type: "stdout-exact", expected: "7" },
    },
  ],
};
```

- [ ] **Step 12: Create 13-classes-and-oop.js**

```js
export default {
  slug: "classes-and-oop",
  title: "Classes & Basic OOP",
  blocks: [
    {
      type: "prose",
      body: "Java's constructor — `public Person(String name) { this.name = name; }` — becomes Python's `__init__` method. Every instance method explicitly takes `self` as its first parameter; Python never hides it the way Java hides `this`.",
    },
    {
      type: "prose",
      body: "Attributes are set with `self.name = name` inside `__init__`, and read the same way everywhere else: `self.name`. There's no separate field-declaration section like a Java class body has.",
    },
    {
      type: "prose",
      body: "Creating an instance drops the `new` keyword entirely — Java's `new Person(\"Ada\")` is just `Person(\"Ada\")` in Python.",
    },
    {
      type: "example",
      code: `class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print(f"Hi, I'm {self.name}")

p = Person("Ada")
p.greet()`,
    },
    {
      type: "exercise",
      id: "classes-and-oop-1",
      prompt: "Define a class Dog with an __init__ that takes name and stores it as self.name, and a method bark() that prints \"{name} says woof\". Create a Dog named \"Rex\" and call bark() on it.",
      starterCode: `class Dog:
    # your code here
    pass
`,
      check: { type: "stdout-exact", expected: "Rex says woof" },
    },
  ],
};
```

- [ ] **Step 13: Create 14-list-comprehensions.js**

```js
export default {
  slug: "list-comprehensions",
  title: "List Comprehensions",
  blocks: [
    {
      type: "prose",
      body: "You've written `[1, 2, 3].map(x => x * 2)` or `.filter(x => x > 2)` chains in JS. Python's list comprehension folds both into one expression: `[x * 2 for x in numbers]` for a map, or `[x for x in numbers if x > 2]` for a filter — and you can combine both in one comprehension.",
    },
    {
      type: "prose",
      body: "Read it left to right like English: \"x times 2, for each x in numbers, if x is greater than 2.\" It builds a brand-new list; the original list is never mutated, same as JS's .map()/.filter().",
    },
    {
      type: "example",
      code: `numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
evens = [n for n in numbers if n % 2 == 0]
print(doubled)
print(evens)`,
    },
    {
      type: "exercise",
      id: "list-comprehensions-1",
      prompt: "nums = [1, 2, 3, 4, 5, 6] is given. Use a list comprehension to build a list of the squares of only the even numbers, then print it. Expected: [4, 16, 36]",
      starterCode: `nums = [1, 2, 3, 4, 5, 6]
`,
      check: { type: "stdout-exact", expected: "[4, 16, 36]" },
    },
  ],
};
```

- [ ] **Step 14: Update lessonIndex.js to include all 14 lessons**

```js
// src/content/courses/python-core/lessonIndex.js
import welcome from "./lessons/01-welcome.js";
import variablesAndTypes from "./lessons/02-variables-and-types.js";
import numbersStringsFstrings from "./lessons/03-numbers-strings-fstrings.js";
import controlFlow from "./lessons/04-control-flow.js";
import loops from "./lessons/05-loops.js";
import lists from "./lessons/06-lists.js";
import dictionaries from "./lessons/07-dictionaries.js";
import tuplesAndSets from "./lessons/08-tuples-and-sets.js";
import functions from "./lessons/09-functions.js";
import stringMethods from "./lessons/10-string-methods.js";
import errorHandling from "./lessons/11-error-handling.js";
import modulesAndImports from "./lessons/12-modules-and-imports.js";
import classesAndOop from "./lessons/13-classes-and-oop.js";
import listComprehensions from "./lessons/14-list-comprehensions.js";

export const lessons = [
  welcome,
  variablesAndTypes,
  numbersStringsFstrings,
  controlFlow,
  loops,
  lists,
  dictionaries,
  tuplesAndSets,
  functions,
  stringMethods,
  errorHandling,
  modulesAndImports,
  classesAndOop,
  listComprehensions,
];
```

- [ ] **Step 15: Run the full automated test suite**

Run: `npm run test`
Expected: PASS — content files aren't covered by unit tests (per spec), but this confirms nothing else broke.

- [ ] **Step 16: Manual spot-check in the browser**

Start the dev server. Confirm the sidebar now lists all 14 lessons in order. Open at least these three (chosen to cover different exercise-check shapes) and run their example + pass their exercise:

- `loops` (multi-line expected output)
- `dictionaries` (Python dict repr with single quotes)
- `classes-and-oop` (class definition exercise)

Each should behave like the `welcome` lesson did in Task 12: example runs and shows correct output, exercise shows "Passed!" on a correct answer, sidebar checkmark appears.

- [ ] **Step 17: Commit**

```bash
git add src/content/courses/python-core/lessons src/content/courses/python-core/lessonIndex.js
git commit -m "Add remaining 13 lessons covering the full core-Python curriculum"
```

---

### Task 14: Visual pass via the frontend-design skill

**Files:**
- Modify: `src/index.css` (design tokens)
- Modify: `src/components/Sidebar.jsx`, `src/components/LessonLayout.jsx`, `src/components/PyodideStatusBadge.jsx`
- Modify: `src/blocks/Prose.jsx`, `src/blocks/CodeBlock.jsx`, `src/blocks/Exercise.jsx`
- Modify: `src/pages/Home.jsx`

**Interfaces:** none — this task only changes styling (Tailwind classes / CSS tokens), never component props or behavior. Every test from Tasks 2–11 must still pass unchanged afterward.

Every component built so far uses plain, functional Tailwind utility classes (slate/amber grays) as scaffolding — deliberately, per the spec, which defers concrete typography/color/spacing decisions to this step rather than guessing at them during infrastructure work.

- [ ] **Step 1: Invoke the frontend-design skill**

Ask it for typography, color, and spacing direction for a content-heavy, informational (not marketing) programming-course site — read-heavy prose, syntax-highlighted code, a clear visual distinction between "read this" (prose), "try this" (runnable example), and "prove it" (graded exercise), and a persistent sidebar nav. Mention this is a personal learning tool for one user, not a public product.

- [ ] **Step 2: Apply the resulting direction**

Translate the skill's output into: a small set of color/spacing tokens in `src/index.css` (Tailwind v4's `@theme` block), and updated class names across the components listed above. Keep every component's props/behavior identical — this step only touches `className` values and the CSS token definitions.

- [ ] **Step 3: Run the full automated test suite**

Run: `npm run test`
Expected: PASS — all tests from Tasks 2–11 unchanged (they assert behavior/text content, not styling).

- [ ] **Step 4: Manual visual check in the browser**

Open the home page and at least two lesson pages. Confirm: prose is comfortably readable (line length, contrast), code/exercise blocks are visually distinct from each other and from prose, the sidebar's current-lesson highlight and checkmarks are legible, and nothing regresses the Task 12/13 functional behavior (run/check buttons still work).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Apply frontend-design visual direction to the course UI"
```

---

### Task 15: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run the linter**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 2: Run the full test suite**

Run: `npm run test`
Expected: all tests from Tasks 2–11 pass.

- [ ] **Step 3: Run a production build**

Run: `npm run build`
Expected: builds successfully with no errors (confirms Pyodide's `optimizeDeps.exclude` and the worker import resolve correctly outside of dev mode too, even though this project isn't deployed).

- [ ] **Step 4: Full manual walkthrough per the spec's testing section**

Using the dev server in the Browser pane, walk through the first three lessons (`welcome`, `variables-and-types`, `numbers-strings-fstrings`) end-to-end:

1. Each lesson's example runs and shows correct output.
2. Each lesson's exercise: verify a correct answer shows "Passed!" and an incorrect one shows the "Not quite" state without revealing the solution.
3. Reload the browser after passing an exercise — the sidebar checkmark and the Home page's completed count both persist.
4. Sidebar navigation and Previous/Next footer links move between lessons correctly at both ends of the list (no broken link on lesson 1's "Previous" or lesson 14's "Next" slot).

- [ ] **Step 5: Commit any final fixes**

If Steps 1–4 turned up anything, fix it and commit:

```bash
git add -A
git commit -m "Fix issues found in final verification pass"
```

If nothing needed fixing, there's nothing to commit — the plan is done.

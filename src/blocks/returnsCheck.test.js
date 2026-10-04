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

  it("is not fooled by learner names that shadow the builtins the harness uses", async () => {
    const graded = await grade(
      'type = "dog"\nstr = "x"\nrepr = "y"\neval = "e"\nprint = "p"\nException = "z"\n' +
        'def square(n):\n    if n < 0:\n        raise ValueError("no")\n    return n * n\n'
    );
    expect(graded.mismatches).toEqual([
      { call: "square(-3)", got: "raised ValueError: no", expected: "9" },
    ]);
  });

  it("grades correctly when the learner prints the sentinel character itself", async () => {
    const graded = await grade('print("\\x1e[]")\ndef square(n):\n    print("\\x1e")\n    return n * n\n');
    expect(graded.passed).toBe(true);
    expect(graded.mismatches).toEqual([]);
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

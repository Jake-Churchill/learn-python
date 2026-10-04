import { describe, it, expect } from "vitest";
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
    expect(harness).toContain(JSON.stringify(RETURNS_SENTINEL));
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

  it("fails a check with no cases even when the harness printed no results", () => {
    expect(runCheck(returnsStdout([]), { type: "returns", cases: [] })).toBe(false);
  });

  it("fails when the harness printed fewer or more results than there are cases", () => {
    const row = ["square(6)", "36", "36"];
    expect(runCheck(returnsStdout([row]), returnsCheck)).toBe(false);
    expect(runCheck(returnsStdout([row, row, row]), returnsCheck)).toBe(false);
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

  it("fails a returns check with no cases even when the harness printed no results", () => {
    const graded = gradeRun({ stdout: returnsStdout([]), stderr: "" }, { type: "returns", cases: [] });
    expect(graded.passed).toBe(false);
  });

  it("fails a returns check whose harness printed the wrong number of results", () => {
    const row = ["square(6)", "36", "36"];
    for (const rows of [[row], [row, row, row]]) {
      const stdout = returnsStdout(rows);
      expect(gradeRun({ stdout, stderr: "" }, returnsCheck)).toEqual({
        passed: false,
        actual: stdout,
        mismatches: [],
      });
    }
  });

  it("treats an unknown check type as a failure", () => {
    expect(gradeRun({ stdout: "x", stderr: "" }, { type: "nope" }).passed).toBe(false);
  });
});

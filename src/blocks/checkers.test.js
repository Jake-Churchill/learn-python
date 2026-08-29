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

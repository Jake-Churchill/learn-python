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

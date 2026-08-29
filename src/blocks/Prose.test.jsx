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

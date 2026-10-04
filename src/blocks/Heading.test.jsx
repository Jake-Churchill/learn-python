import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Heading from "./Heading.jsx";

describe("Heading", () => {
  it("renders its text as a level-2 heading", () => {
    render(<Heading text="Common mistakes" />);
    expect(screen.getByRole("heading", { level: 2, name: "Common mistakes" })).toBeInTheDocument();
  });
});

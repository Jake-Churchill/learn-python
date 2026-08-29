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

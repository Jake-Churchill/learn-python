import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
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

const unitLessons = [
  { slug: "a", title: "Lesson A", unit: "Unit One", blocks: [{ type: "exercise", id: "a-1" }] },
  { slug: "b", title: "Lesson B", unit: "Unit One", blocks: [{ type: "exercise", id: "b-1" }] },
  { slug: "c", title: "Lesson C", unit: "Unit Two", blocks: [{ type: "exercise", id: "c-1" }] },
];

function renderUnits(progress, lessons = unitLessons) {
  return render(
    <PyodideContext.Provider value={{ status: "ready", run: async () => ({}) }}>
      <MemoryRouter initialEntries={["/lessons/a"]}>
        <Sidebar lessons={lessons} progress={progress} />
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

  it("renders a repeated unit as separate groups without duplicate React keys", () => {
    const errorSpy = vi.spyOn(console, "error");
    const { container } = renderUnits({}, [
      { ...unitLessons[0], unit: "One" },
      { ...unitLessons[1], unit: "Two" },
      { ...unitLessons[2], unit: "One" },
    ]);
    expect(container.querySelectorAll("details")).toHaveLength(3);
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

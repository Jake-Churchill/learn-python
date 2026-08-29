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

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Exercise from "./Exercise.jsx";
import { PyodideContext } from "../hooks/PyodideProvider.jsx";

vi.mock("./PythonEditor.jsx", () => ({
  default: ({ value, onChange }) => (
    <textarea data-testid="editor" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

function renderExercise({ run, onExercisePass, ...props } = {}) {
  return render(
    <PyodideContext.Provider value={{ status: "ready", run }}>
      <Exercise
        id="ex-1"
        lessonSlug="control-flow"
        prompt="print odd"
        starterCode="x = 7\n"
        check={{ type: "stdout-exact", expected: "odd" }}
        onExercisePass={onExercisePass}
        {...props}
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

  it("passes the exercise's stdin to run", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "odd\n", stderr: "" });
    renderExercise({ run, stdin: "7" });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => expect(run).toHaveBeenCalledWith("x = 7\\n", { stdin: "7" }));
  });

  it("toggles the hint when the exercise has one", () => {
    renderExercise({ run: vi.fn(), hint: "Use the modulo operator." });

    expect(screen.queryByText("Use the modulo operator.")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hint" }));
    expect(screen.getByText("Use the modulo operator.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hide hint" }));
    expect(screen.queryByText("Use the modulo operator.")).not.toBeInTheDocument();
  });

  it("has no hint button when the exercise has no hint", () => {
    renderExercise({ run: vi.fn() });
    expect(screen.queryByRole("button", { name: /hint/i })).not.toBeInTheDocument();
  });

  it("offers the solution only after a failed check", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "even\n", stderr: "" });
    renderExercise({ run, solution: 'print("odd")' });

    expect(screen.queryByRole("button", { name: /solution/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /check/i }));
    await waitFor(() => expect(screen.getByText(/Not quite/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Show solution" }));
    expect(screen.getByText('print("odd")').tagName).toBe("PRE");

    fireEvent.click(screen.getByRole("button", { name: "Hide solution" }));
    expect(screen.queryByText('print("odd")')).not.toBeInTheDocument();
  });

  it("keeps the failure details above the revealed solution", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "even\n", stderr: "" });
    renderExercise({ run, solution: 'print("odd")' });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));
    fireEvent.click(await screen.findByRole("button", { name: "Show solution" }));

    const failure = screen.getByText(/Not quite yet/);
    const solution = screen.getByText('print("odd")');
    expect(failure.compareDocumentPosition(solution) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("closes the solution once a check passes", async () => {
    const fail = { stdout: "even\n", stderr: "" };
    const run = vi
      .fn()
      .mockResolvedValueOnce(fail)
      .mockResolvedValueOnce({ stdout: "odd\n", stderr: "" })
      .mockResolvedValueOnce(fail);
    renderExercise({ run, solution: 'print("odd")' });
    const check = () => fireEvent.click(screen.getByRole("button", { name: /check/i }));

    check();
    fireEvent.click(await screen.findByRole("button", { name: "Show solution" }));
    check();
    await screen.findByText("Passed!");
    check();
    await screen.findByText(/Not quite/);

    expect(screen.queryByText('print("odd")')).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show solution" })).toBeInTheDocument();
  });

  it("calls run with an undefined stdin when the exercise has none", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "odd\n", stderr: "" });
    renderExercise({ run });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await screen.findByText("Passed!");
    expect(run.mock.calls).toStrictEqual([["x = 7\\n", { stdin: undefined }]]);
  });

  it("does not offer the solution after a pass", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "odd\n", stderr: "" });
    renderExercise({ run, solution: 'print("odd")' });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));
    await waitFor(() => expect(screen.getByText("Passed!")).toBeInTheDocument());

    expect(screen.queryByRole("button", { name: /solution/i })).not.toBeInTheDocument();
  });

  const returnsCheck = {
    type: "returns",
    cases: [{ call: "square(6)", expected: "36" }],
  };

  it("grades a returns check from the harness output", async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: `\x1e${JSON.stringify([["square(6)", "36", "36"]])}\n`,
      stderr: "",
    });
    const onExercisePass = vi.fn();
    renderExercise({ run, onExercisePass, check: returnsCheck });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => expect(screen.getByText("Passed!")).toBeInTheDocument());
    expect(run).toHaveBeenCalledWith(expect.stringContaining("square(6)"), { stdin: undefined });
    expect(onExercisePass).toHaveBeenCalledWith("control-flow", "ex-1");
    expect(screen.queryByText("Output:")).not.toBeInTheDocument();
  });

  it("lists mismatching calls for a failed returns check", async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: `\x1e${JSON.stringify([["square(6)", "6", "36"]])}\n`,
      stderr: "",
    });
    renderExercise({ run, check: returnsCheck });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() => expect(screen.getByText(/Not quite/)).toBeInTheDocument());
    expect(screen.getByText("square(6)")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("36")).toBeInTheDocument();
    expect(screen.getByRole("listitem").textContent).toBe("square(6) returned 6, expected 36");
    expect(screen.queryByText("Expected:")).not.toBeInTheDocument();
    expect(screen.queryByText("Your code printed:")).not.toBeInTheDocument();
  });

  it("says a call raised, not returned, when it raised an exception", async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: `\x1e${JSON.stringify([["square(6)", "raised ValueError: no", "36"]])}\n`,
      stderr: "",
    });
    renderExercise({ run, check: returnsCheck });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    const item = await screen.findByRole("listitem");
    expect(item.textContent).toBe("square(6) raised ValueError: no, expected 36");
    expect([...item.querySelectorAll("code")].map((code) => code.textContent)).toEqual([
      "square(6)",
      "36",
    ]);
  });

  it("shows the learner's own prints below the mismatches of a failed returns check", async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: `debug 6\n\x1e${JSON.stringify([["square(6)", "6", "36"]])}\n`,
      stderr: "",
    });
    renderExercise({ run, check: returnsCheck });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    const label = await screen.findByText("Your code printed:");
    const list = screen.getByRole("list");
    expect(list.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText("debug 6").tagName).toBe("PRE");
  });

  it("shows the traceback and no expected block when a returns check fails with an error", async () => {
    const run = vi.fn().mockResolvedValue({
      stdout: "",
      stderr: "Traceback (most recent call last):\nNameError: name 'x' is not defined\n",
    });
    renderExercise({ run, check: returnsCheck });

    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    expect(await screen.findByText(/NameError: name 'x' is not defined/)).toBeInTheDocument();
    expect(screen.queryByText("Expected:")).not.toBeInTheDocument();
  });
});

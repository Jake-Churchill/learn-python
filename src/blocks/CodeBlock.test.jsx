import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CodeBlock from "./CodeBlock.jsx";
import { PyodideContext } from "../hooks/PyodideProvider.jsx";

vi.mock("./PythonEditor.jsx", () => ({
  default: ({ value, onChange }) => (
    <textarea data-testid="editor" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

function renderWithContext(ui, { status = "ready", run = vi.fn() } = {}) {
  return render(<PyodideContext.Provider value={{ status, run }}>{ui}</PyodideContext.Provider>);
}

describe("CodeBlock", () => {
  it("disables the Run button until Pyodide is ready", () => {
    renderWithContext(<CodeBlock code="print(1)" />, { status: "loading" });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("runs the code and displays stdout on click", async () => {
    const run = vi.fn().mockResolvedValue({ stdout: "1\n", stderr: "" });
    renderWithContext(<CodeBlock code="print(1)" />, { run });

    fireEvent.click(screen.getByRole("button", { name: /run/i }));

    await waitFor(() => expect(screen.getByText(/1/)).toBeInTheDocument());
    expect(run).toHaveBeenCalledWith("print(1)");
  });
});

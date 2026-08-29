import { useState } from "react";
import PythonEditor from "./PythonEditor.jsx";
import { usePyodideContext } from "../hooks/PyodideProvider.jsx";

export default function CodeBlock({ code: initialCode }) {
  const { status, run } = usePyodideContext();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    const result = await run(code);
    setOutput(result);
    setRunning(false);
  }

  return (
    <div className="my-6 overflow-hidden rounded-md border-t-2 border-amber bg-card">
      <div className="flex items-center justify-between px-3 pt-2">
        <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-widest text-amber">
          Try it
        </span>
      </div>
      <PythonEditor value={code} onChange={setCode} />
      <div className="flex items-center gap-2 border-t border-rule p-2">
        <button
          type="button"
          onClick={handleRun}
          disabled={status !== "ready" || running}
          className="rounded-sm bg-amber px-3 py-1 font-mono text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status !== "ready" ? "Loading Python…" : running ? "Running…" : "Run"}
        </button>
      </div>
      {output && (
        <pre className="whitespace-pre-wrap border-t border-rule bg-paper p-3 font-mono text-sm text-ink">
          {output.stdout}
          {output.stderr}
        </pre>
      )}
    </div>
  );
}

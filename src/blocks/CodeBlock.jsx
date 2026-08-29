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
    <div className="my-4 rounded border border-slate-200">
      <PythonEditor value={code} onChange={setCode} />
      <div className="flex items-center gap-2 border-t border-slate-200 p-2">
        <button
          type="button"
          onClick={handleRun}
          disabled={status !== "ready" || running}
          className="rounded bg-slate-800 px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          {status !== "ready" ? "Loading Python…" : running ? "Running…" : "Run"}
        </button>
      </div>
      {output && (
        <pre className="whitespace-pre-wrap border-t border-slate-200 bg-slate-50 p-2 text-sm">
          {output.stdout}
          {output.stderr}
        </pre>
      )}
    </div>
  );
}

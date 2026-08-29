import { useState } from "react";
import PythonEditor from "./PythonEditor.jsx";
import { usePyodideContext } from "../hooks/PyodideProvider.jsx";
import { runCheck } from "./checkers.js";

export default function Exercise({ id, prompt, starterCode, check, lessonSlug, onExercisePass }) {
  const { status, run } = usePyodideContext();
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    setChecking(true);
    const { stdout, stderr } = await run(code);
    const passed = !stderr && runCheck(stdout, check);
    setResult({ passed, actual: stderr || stdout });
    setChecking(false);
    if (passed) {
      onExercisePass?.(lessonSlug, id);
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-md border-t-2 border-pine bg-card">
      <div className="px-3 pt-2">
        <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-widest text-pine">
          Prove it
        </span>
        <p className="mb-2 mt-1 font-body text-[1.0625rem] text-ink">{prompt}</p>
      </div>
      <PythonEditor value={code} onChange={setCode} />
      <div className="flex flex-wrap items-center gap-3 border-t border-rule p-2">
        <button
          type="button"
          onClick={handleCheck}
          disabled={status !== "ready" || checking}
          className="rounded-sm bg-pine px-3 py-1 font-mono text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status !== "ready" ? "Loading Python…" : checking ? "Checking…" : "Check"}
        </button>
        {result && (
          <span className={`font-mono text-sm ${result.passed ? "text-pine" : "text-rust"}`}>
            {result.passed ? "Passed!" : `Not quite — got: ${result.actual}`}
          </span>
        )}
      </div>
    </div>
  );
}

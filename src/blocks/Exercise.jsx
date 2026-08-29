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
    <div className="my-4 rounded border-2 border-amber-300 bg-amber-50 p-3">
      <p className="mb-2 font-medium">{prompt}</p>
      <PythonEditor value={code} onChange={setCode} />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCheck}
          disabled={status !== "ready" || checking}
          className="rounded bg-amber-700 px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          {status !== "ready" ? "Loading Python…" : checking ? "Checking…" : "Check"}
        </button>
        {result && (
          <span className={result.passed ? "text-green-700" : "text-red-700"}>
            {result.passed ? "Passed!" : `Not quite — got: ${result.actual}`}
          </span>
        )}
      </div>
    </div>
  );
}

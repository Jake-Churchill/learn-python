import { useState } from "react";
import PythonEditor from "./PythonEditor.jsx";
import { usePyodideContext } from "../hooks/PyodideProvider.jsx";
import { buildRunnableCode, gradeRun } from "./checkers.js";

export default function Exercise({
  id,
  prompt,
  starterCode,
  check,
  stdin,
  hint,
  solution,
  lessonSlug,
  onExercisePass,
}) {
  const { status, run } = usePyodideContext();
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  async function handleCheck() {
    setChecking(true);
    const { stdout, stderr } = await run(buildRunnableCode(code, check), { stdin });
    const graded = gradeRun({ stdout, stderr }, check);
    setResult(graded);
    setChecking(false);
    if (graded.passed) {
      setShowSolution(false);
      onExercisePass?.(lessonSlug, id);
    }
  }

  const toggleClass = "font-mono text-sm text-ink/60 hover:text-pine";
  const canShowSolution = solution && result && !result.passed;

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
        {hint && (
          <button type="button" onClick={() => setShowHint((shown) => !shown)} className={toggleClass}>
            {showHint ? "Hide hint" : "Hint"}
          </button>
        )}
        {canShowSolution && (
          <button
            type="button"
            onClick={() => setShowSolution((shown) => !shown)}
            className={toggleClass}
          >
            {showSolution ? "Hide solution" : "Show solution"}
          </button>
        )}
        {result?.passed && <span className="font-mono text-sm text-pine">Passed!</span>}
      </div>
      {showHint && hint && (
        <p className="border-t border-rule px-3 py-2 font-body text-[0.9375rem] text-ink/80">
          {hint}
        </p>
      )}
      {result && (
        <div
          className={`border-t border-rule p-3 font-mono text-sm ${result.passed ? "text-ink" : "text-rust"}`}
        >
          {result.passed ? (
            result.actual && (
              <>
                <p className="mb-2">Output:</p>
                <pre className="whitespace-pre-wrap rounded-sm bg-paper p-2">{result.actual}</pre>
              </>
            )
          ) : result.mismatches.length > 0 ? (
            <>
              <p className="mb-2">Not quite yet — your function gave these results:</p>
              <ul className="space-y-1">
                {result.mismatches.map((mismatch, index) => (
                  <li key={index}>
                    <code className="rounded-sm bg-paper px-1">{mismatch.call}</code>{" "}
                    {mismatch.got.startsWith("raised ") ? (
                      mismatch.got
                    ) : (
                      <>
                        returned <code className="rounded-sm bg-paper px-1">{mismatch.got}</code>
                      </>
                    )}
                    , expected <code className="rounded-sm bg-paper px-1">{mismatch.expected}</code>
                  </li>
                ))}
              </ul>
              {result.actual && (
                <>
                  <p className="mb-2 mt-3">Your code printed:</p>
                  <pre className="whitespace-pre-wrap rounded-sm bg-paper p-2">{result.actual}</pre>
                </>
              )}
            </>
          ) : (
            <>
              <p className="mb-2">Not quite yet — here's what your code produced:</p>
              <pre className="mb-2 whitespace-pre-wrap rounded-sm bg-paper p-2">
                {result.actual || "(no output)"}
              </pre>
              {check.type === "stdout-exact" && (
                <>
                  <p className="mb-2">Expected:</p>
                  <pre className="whitespace-pre-wrap rounded-sm bg-paper p-2">{check.expected}</pre>
                </>
              )}
            </>
          )}
        </div>
      )}
      {showSolution && canShowSolution && (
        <div className="border-t border-rule p-3">
          <p className="mb-2 font-mono text-sm text-ink/60">One possible solution:</p>
          <pre className="whitespace-pre-wrap rounded-sm bg-paper p-2 font-mono text-sm text-ink">
            {solution}
          </pre>
        </div>
      )}
    </div>
  );
}

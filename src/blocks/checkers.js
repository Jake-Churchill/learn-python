export const RETURNS_SENTINEL = "\x1e";

export function normalizeOutput(output) {
  return output
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export function checkStdoutExact(actualStdout, check) {
  return normalizeOutput(actualStdout) === normalizeOutput(check.expected);
}

export function buildReturnsHarness(check) {
  const pairs = check.cases.map(({ call, expected }) => [call, expected]);
  return [
    "import builtins as _b",
    "import json as _json",
    `_cases = ${JSON.stringify(pairs)}`,
    "_results = []",
    "for _call, _expected in _cases:",
    "    try:",
    "        _results.append([_call, _b.repr(_b.eval(_call)), _expected])",
    "    except _b.Exception as _error:",
    '        _results.append([_call, "raised " + _b.type(_error).__name__ + ": " + _b.str(_error), _expected])',
    `_b.print(${JSON.stringify(RETURNS_SENTINEL)} + _json.dumps(_results))`,
  ].join("\n");
}

export function parseReturnsOutput(stdout) {
  const at = stdout.lastIndexOf(RETURNS_SENTINEL);
  if (at === -1) return null;
  try {
    const rows = JSON.parse(stdout.slice(at + RETURNS_SENTINEL.length));
    return {
      learnerOutput: stdout.slice(0, at),
      results: rows.map(([call, got, expected]) => ({ call, got, expected })),
    };
  } catch {
    return null;
  }
}

function returnsPassed(parsed, check) {
  return (
    check.cases.length > 0 &&
    parsed.results.length === check.cases.length &&
    parsed.results.every(({ got, expected }) => got === expected)
  );
}

export function runCheck(actualStdout, check) {
  switch (check.type) {
    case "stdout-exact":
      return checkStdoutExact(actualStdout, check);
    case "returns": {
      const parsed = parseReturnsOutput(actualStdout);
      return parsed !== null && returnsPassed(parsed, check);
    }
    default:
      throw new Error(`Unknown check type: ${check.type}`);
  }
}

export function buildRunnableCode(code, check) {
  return check.type === "returns" ? `${code}\n${buildReturnsHarness(check)}` : code;
}

export function gradeRun({ stdout, stderr }, check) {
  if (stderr) return { passed: false, actual: stderr, mismatches: [] };
  if (check.type === "returns") {
    const parsed = parseReturnsOutput(stdout);
    if (parsed === null || parsed.results.length !== check.cases.length) {
      return { passed: false, actual: stdout, mismatches: [] };
    }
    const mismatches = parsed.results.filter(({ got, expected }) => got !== expected);
    return { passed: returnsPassed(parsed, check), actual: parsed.learnerOutput, mismatches };
  }
  let passed = false;
  try {
    passed = runCheck(stdout, check);
  } catch {
    passed = false;
  }
  return { passed, actual: stdout, mismatches: [] };
}

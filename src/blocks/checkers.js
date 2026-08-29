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

export function runCheck(actualStdout, check) {
  switch (check.type) {
    case "stdout-exact":
      return checkStdoutExact(actualStdout, check);
    default:
      throw new Error(`Unknown check type: ${check.type}`);
  }
}

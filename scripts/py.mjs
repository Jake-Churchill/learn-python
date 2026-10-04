import { readFileSync } from "node:fs";
import { loadPyodide } from "pyodide";
import { runPython } from "../src/worker/runPython.js";

const [source, stdin] = process.argv.slice(2);
if (source === undefined) {
  process.stderr.write("usage: node scripts/py.mjs <code | -> [stdin]\n");
  process.exit(2);
}
const code = source === "-" ? readFileSync(0, "utf8") : source;
const pyodide = await loadPyodide();
const { stdout, stderr } = await runPython(pyodide, code, { stdin });
process.stdout.write(stdout);
process.stderr.write(stderr);
process.exitCode = stderr ? 1 : 0;

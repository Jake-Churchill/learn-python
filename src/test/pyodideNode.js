import { loadPyodide } from "pyodide";

let cached = null;

export function loadNodePyodide() {
  if (!cached) cached = loadPyodide();
  return cached;
}

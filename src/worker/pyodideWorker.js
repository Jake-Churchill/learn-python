import { loadPyodide, version as pyodideVersion } from "pyodide";
import { runPython } from "./runPython.js";

let pyodideReady = null;

async function initPyodide() {
  return loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
  });
}

self.onmessage = async (event) => {
  const { type, id, code, stdin } = event.data;

  if (type === "init") {
    try {
      pyodideReady = initPyodide();
      await pyodideReady;
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "error", message: String(err) });
    }
    return;
  }

  if (type === "run") {
    const pyodide = await pyodideReady;
    const { stdout, stderr } = await runPython(pyodide, code, { stdin });
    self.postMessage({ type: "result", id, stdout, stderr });
  }
};

// src/worker/pyodideWorker.js
import { loadPyodide, version as pyodideVersion } from "pyodide";

let pyodideReady = null;

async function initPyodide() {
  return loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
  });
}

self.onmessage = async (event) => {
  const { type, id, code } = event.data;

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
    let stdout = "";
    let stderr = "";
    pyodide.setStdout({
      batched: (text) => {
        stdout += text;
      },
    });
    pyodide.setStderr({
      batched: (text) => {
        stderr += text;
      },
    });
    try {
      await pyodide.runPythonAsync(code);
    } catch (err) {
      stderr += String(err);
    }
    self.postMessage({ type: "result", id, stdout, stderr });
  }
};

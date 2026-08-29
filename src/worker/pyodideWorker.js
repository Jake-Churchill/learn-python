import { loadPyodide, version as pyodideVersion } from "pyodide";

let pyodideReady = null;

async function initPyodide() {
  return loadPyodide({
    indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
  });
}

function formatTraceback(message) {
  const marker = 'File "<exec>"';
  const index = message.indexOf(marker);
  if (index === -1) return message;
  return `Traceback (most recent call last):\n  ${message.slice(index)}`;
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
        stdout += text + "\n";
      },
    });
    pyodide.setStderr({
      batched: (text) => {
        stderr += text + "\n";
      },
    });
    const globals = pyodide.toPy({ __name__: "__main__" });
    try {
      await pyodide.runPythonAsync(code, { globals });
    } catch (err) {
      stderr += formatTraceback(String(err));
    } finally {
      globals.destroy();
    }
    self.postMessage({ type: "result", id, stdout, stderr });
  }
};

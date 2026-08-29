export function createPyodideClient(worker) {
  const pending = new Map();
  const statusListeners = new Set();
  let status = "loading";
  let nextId = 0;

  function setStatus(next) {
    status = next;
    statusListeners.forEach((listener) => listener(status));
  }

  worker.onmessage = (event) => {
    const data = event.data;
    if (data.type === "ready") {
      setStatus("ready");
    } else if (data.type === "error") {
      setStatus("error");
    } else if (data.type === "result") {
      const entry = pending.get(data.id);
      if (entry) {
        pending.delete(data.id);
        entry.resolve({ stdout: data.stdout, stderr: data.stderr });
      }
    }
  };

  worker.postMessage({ type: "init" });

  function run(code) {
    const id = nextId++;
    return new Promise((resolve) => {
      pending.set(id, { resolve });
      worker.postMessage({ type: "run", id, code });
    });
  }

  function getStatus() {
    return status;
  }

  function onStatusChange(listener) {
    statusListeners.add(listener);
    return () => statusListeners.delete(listener);
  }

  return { run, getStatus, onStatusChange };
}

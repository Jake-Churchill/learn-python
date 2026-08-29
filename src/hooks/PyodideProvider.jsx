import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { createPyodideClient } from "./pyodideClient.js";

export const PyodideContext = createContext({
  status: "loading",
  run: async () => ({ stdout: "", stderr: "Pyodide not ready" }),
});

export function usePyodideContext() {
  return useContext(PyodideContext);
}

const RUN_TIMEOUT_MS = 8000;

function spawnWorkerAndClient(onStatusChange) {
  const worker = new Worker(new URL("../worker/pyodideWorker.js", import.meta.url), {
    type: "module",
  });
  const client = createPyodideClient(worker);
  const unsubscribe = client.onStatusChange(onStatusChange);
  return { worker, client, unsubscribe };
}

export function PyodideProvider({ children }) {
  const stateRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const spawned = spawnWorkerAndClient(setStatus);
    stateRef.current = spawned;
    setStatus(spawned.client.getStatus());

    return () => {
      spawned.unsubscribe();
      spawned.worker.terminate();
    };
  }, []);

  const run = useCallback((code) => {
    const current = stateRef.current;
    if (!current) {
      return Promise.resolve({ stdout: "", stderr: "Pyodide not ready" });
    }

    return Promise.race([
      current.client.run(code).then((result) => ({ ...result, timedOut: false })),
      new Promise((resolve) => {
        setTimeout(() => resolve({ timedOut: true }), RUN_TIMEOUT_MS);
      }),
    ]).then((result) => {
      if (!result.timedOut) {
        return result;
      }
      current.unsubscribe();
      current.worker.terminate();
      const next = spawnWorkerAndClient(setStatus);
      stateRef.current = next;
      setStatus(next.client.getStatus());
      return {
        stdout: "",
        stderr:
          "Timed out after 8 seconds — check for an infinite loop. Python has been restarted; try again once it says \"ready\".",
      };
    });
  }, []);

  return <PyodideContext.Provider value={{ status, run }}>{children}</PyodideContext.Provider>;
}

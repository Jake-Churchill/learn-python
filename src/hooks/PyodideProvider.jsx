import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { createPyodideClient } from "./pyodideClient.js";

export const PyodideContext = createContext({
  status: "loading",
  run: async () => ({ stdout: "", stderr: "Pyodide not ready" }),
});

export function usePyodideContext() {
  return useContext(PyodideContext);
}

export function PyodideProvider({ children }) {
  const clientRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const worker = new Worker(new URL("../worker/pyodideWorker.js", import.meta.url), {
      type: "module",
    });
    const client = createPyodideClient(worker);
    clientRef.current = client;
    setStatus(client.getStatus());
    const unsubscribe = client.onStatusChange(setStatus);

    return () => {
      unsubscribe();
      worker.terminate();
    };
  }, []);

  const run = useCallback((code) => {
    if (!clientRef.current) {
      return Promise.resolve({ stdout: "", stderr: "Pyodide not ready" });
    }
    return clientRef.current.run(code);
  }, []);

  return <PyodideContext.Provider value={{ status, run }}>{children}</PyodideContext.Provider>;
}

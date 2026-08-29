// src/hooks/pyodideClient.test.js
import { describe, it, expect, vi } from "vitest";
import { createPyodideClient } from "./pyodideClient.js";

function createFakeWorker() {
  return { postMessage: vi.fn(), onmessage: null };
}

describe("createPyodideClient", () => {
  it("starts in loading status and sends an init message", () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);
    expect(client.getStatus()).toBe("loading");
    expect(worker.postMessage).toHaveBeenCalledWith({ type: "init" });
  });

  it("transitions to ready and notifies listeners when the worker reports ready", () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);
    const listener = vi.fn();
    client.onStatusChange(listener);

    worker.onmessage({ data: { type: "ready" } });

    expect(client.getStatus()).toBe("ready");
    expect(listener).toHaveBeenCalledWith("ready");
  });

  it("transitions to error when the worker reports an error", () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);

    worker.onmessage({ data: { type: "error" } });

    expect(client.getStatus()).toBe("error");
  });

  it("resolves run() with the matching result message", async () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);

    const promise = client.run("print(1)");
    const runCall = worker.postMessage.mock.calls.find(([msg]) => msg.type === "run");
    const sentMessage = runCall[0];

    worker.onmessage({
      data: { type: "result", id: sentMessage.id, stdout: "1\n", stderr: "" },
    });

    await expect(promise).resolves.toEqual({ stdout: "1\n", stderr: "" });
  });

  it("unsubscribes a status listener", () => {
    const worker = createFakeWorker();
    const client = createPyodideClient(worker);
    const listener = vi.fn();
    const unsubscribe = client.onStatusChange(listener);
    unsubscribe();

    worker.onmessage({ data: { type: "ready" } });

    expect(listener).not.toHaveBeenCalled();
  });
});

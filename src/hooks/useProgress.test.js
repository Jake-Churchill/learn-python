import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, it, expect } from "vitest";
import { useProgress } from "./useProgress.js";

beforeEach(() => {
  localStorage.clear();
});

describe("useProgress", () => {
  it("starts empty when localStorage has no saved progress", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress).toEqual({});
  });

  it("marks an exercise complete and persists it to localStorage", () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.markExerciseComplete("control-flow", "control-flow-1");
    });

    expect(result.current.progress).toEqual({ "control-flow": { "control-flow-1": true } });
    expect(JSON.parse(localStorage.getItem("learn-python-progress"))).toEqual({
      "control-flow": { "control-flow-1": true },
    });
  });

  it("loads previously saved progress on mount", () => {
    localStorage.setItem(
      "learn-python-progress",
      JSON.stringify({ welcome: { "welcome-1": true } })
    );

    const { result } = renderHook(() => useProgress());

    expect(result.current.progress).toEqual({ welcome: { "welcome-1": true } });
  });
});

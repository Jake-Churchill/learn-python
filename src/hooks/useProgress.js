import { useState, useCallback } from "react";

const STORAGE_KEY = "learn-python-progress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const markExerciseComplete = useCallback((lessonSlug, exerciseId) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        [lessonSlug]: { ...prev[lessonSlug], [exerciseId]: true },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { progress, markExerciseComplete };
}

import { describe, it, expect } from "vitest";
import {
  getExerciseIds,
  isLessonComplete,
  getContinueLesson,
  getAdjacentLessons,
} from "./lessonUtils.js";

const lessons = [
  { slug: "a", title: "A", blocks: [{ type: "prose" }, { type: "exercise", id: "a-1" }] },
  {
    slug: "b",
    title: "B",
    blocks: [
      { type: "exercise", id: "b-1" },
      { type: "exercise", id: "b-2" },
    ],
  },
  { slug: "c", title: "C", blocks: [{ type: "exercise", id: "c-1" }] },
];

describe("getExerciseIds", () => {
  it("returns only exercise block ids", () => {
    expect(getExerciseIds(lessons[1])).toEqual(["b-1", "b-2"]);
  });
});

describe("isLessonComplete", () => {
  it("is false when no exercises have been passed", () => {
    expect(isLessonComplete(lessons[0], {})).toBe(false);
  });

  it("is true only when every exercise id is marked true", () => {
    expect(isLessonComplete(lessons[1], { b: { "b-1": true } })).toBe(false);
    expect(isLessonComplete(lessons[1], { b: { "b-1": true, "b-2": true } })).toBe(true);
  });
});

describe("getContinueLesson", () => {
  it("returns the first incomplete lesson", () => {
    const progress = { a: { "a-1": true } };
    expect(getContinueLesson(lessons, progress).slug).toBe("b");
  });

  it("returns the last lesson when everything is complete", () => {
    const progress = {
      a: { "a-1": true },
      b: { "b-1": true, "b-2": true },
      c: { "c-1": true },
    };
    expect(getContinueLesson(lessons, progress).slug).toBe("c");
  });
});

describe("getAdjacentLessons", () => {
  it("returns null for prev at the first lesson and null for next at the last", () => {
    expect(getAdjacentLessons(lessons, "a").prev).toBeNull();
    expect(getAdjacentLessons(lessons, "c").next).toBeNull();
  });

  it("returns the correct neighbors for a middle lesson", () => {
    const { prev, next } = getAdjacentLessons(lessons, "b");
    expect(prev.slug).toBe("a");
    expect(next.slug).toBe("c");
  });
});

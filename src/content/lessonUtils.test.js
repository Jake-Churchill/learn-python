import { describe, it, expect } from "vitest";
import {
  getExerciseIds,
  isLessonComplete,
  getContinueLesson,
  getAdjacentLessons,
  groupByUnit,
  getUnitProgress,
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

const unitLessons = [
  { slug: "a", unit: "One", blocks: [{ type: "exercise", id: "a-1" }] },
  { slug: "b", unit: "One", blocks: [{ type: "exercise", id: "b-1" }] },
  { slug: "c", unit: "Two", blocks: [{ type: "exercise", id: "c-1" }] },
  { slug: "d", blocks: [{ type: "exercise", id: "d-1" }] },
];

describe("groupByUnit", () => {
  it("groups consecutive lessons by unit and keeps flat numbering", () => {
    const groups = groupByUnit(unitLessons);
    expect(groups.map((g) => g.unit)).toEqual(["One", "Two", "Lessons"]);
    expect(groups[0].items.map((i) => [i.lesson.slug, i.number])).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
    expect(groups[1].items.map((i) => i.number)).toEqual([3]);
    expect(groups[2].items.map((i) => i.number)).toEqual([4]);
  });

  it("starts a new group when a unit repeats after another unit", () => {
    const groups = groupByUnit([
      { slug: "a", unit: "One" },
      { slug: "b", unit: "Two" },
      { slug: "c", unit: "One" },
    ]);
    expect(groups.map((g) => [g.unit, g.items.map((i) => i.lesson.slug)])).toEqual([
      ["One", ["a"]],
      ["Two", ["b"]],
      ["One", ["c"]],
    ]);
  });
});

describe("getUnitProgress", () => {
  it("counts completed lessons in a group", () => {
    const [first] = groupByUnit(unitLessons);
    expect(getUnitProgress(first, { a: { "a-1": true } })).toEqual({ done: 1, total: 2 });
  });
});

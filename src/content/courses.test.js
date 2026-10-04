// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { BLOCK_TYPES } from "../blocks/blockTypes.js";
import { buildRunnableCode, gradeRun } from "../blocks/checkers.js";
import { runPython } from "../worker/runPython.js";
import { loadNodePyodide } from "../test/pyodideNode.js";

const loaders = import.meta.glob("./courses/python-core/lessons/*.js");
const lessonPaths = Object.keys(loaders).sort();
const fileName = (path) => path.split("/").pop().replace(/\.js$/, "");
const load = async (path) => (await loaders[path]()).default;
// Imported lazily so one broken lesson file fails only its own tests in filtered runs.
const loadIndexedLessons = async () =>
  (await import("./courses/python-core/lessonIndex.js")).lessons;

const FORBIDDEN_LANGUAGE_REFERENCES = /\bjavascript\b|\bjs\b|\bjava\b|console\.log/i;

const RESET_FILES = `
import os, shutil
os.chdir("/home/pyodide")
for _name in os.listdir("."):
    _path = os.path.join(".", _name)
    shutil.rmtree(_path) if os.path.isdir(_path) else os.remove(_path)
`;

const blocksOf = (lesson, type) => lesson.blocks.filter((block) => block.type === type);
const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;
const textFields = (lesson) =>
  [
    lesson.title,
    ...lesson.blocks.flatMap((block) => [
      block.body,
      block.text,
      block.prompt,
      block.hint,
      block.code,
      block.starterCode,
      block.solution,
    ]),
  ].filter(Boolean);

function checkProblems(check) {
  if (!check) return ["missing check"];
  if (check.type === "stdout-exact") {
    return typeof check.expected === "string"
      ? []
      : [`check.expected must be a string, got ${JSON.stringify(check.expected)}`];
  }
  if (check.type !== "returns") return [`unknown check type ${JSON.stringify(check.type)}`];
  if (!Array.isArray(check.cases) || check.cases.length === 0) {
    return ["check.cases must be a non-empty array"];
  }
  return check.cases.flatMap(({ call, expected }, i) => [
    ...(typeof call === "string" ? [] : [`check.cases[${i}].call must be a string`]),
    ...(typeof expected === "string"
      ? []
      : [`check.cases[${i}].expected must be a string, got ${JSON.stringify(expected)}`]),
  ]);
}

let pyodide;

beforeAll(async () => {
  pyodide = await loadNodePyodide();
}, 120000);

function runIsolated(code, stdin) {
  pyodide.runPython(RESET_FILES);
  return runPython(pyodide, code, { stdin });
}

describe("course-wide invariants", () => {
  it("finds lesson files", () => {
    expect(lessonPaths.length).toBeGreaterThan(0);
  });

  it("has unique slugs in lessonIndex", async () => {
    const slugs = (await loadIndexedLessons()).map((lesson) => lesson.slug);
    expect(slugs.filter((slug, i) => slugs.indexOf(slug) !== i)).toEqual([]);
  });

  it("has unique slugs and exercise ids across every lesson file", async () => {
    const slugs = [];
    const ids = [];
    for (const path of lessonPaths) {
      const lesson = await load(path);
      slugs.push(lesson.slug);
      blocksOf(lesson, "exercise").forEach((block) => ids.push(block.id));
    }
    const duplicates = (list) => list.filter((item, i) => list.indexOf(item) !== i);
    expect(duplicates(slugs)).toEqual([]);
    expect(duplicates(ids)).toEqual([]);
  });

  it("lists each migrated unit as one contiguous run in lessonIndex", async () => {
    const seen = new Set();
    let previous;
    const broken = [];
    for (const lesson of await loadIndexedLessons()) {
      if (lesson.unit === undefined) {
        previous = undefined;
        continue;
      }
      if (lesson.unit !== previous && seen.has(lesson.unit)) broken.push(lesson.unit);
      seen.add(lesson.unit);
      previous = lesson.unit;
    }
    expect(broken).toEqual([]);
  });

  it("has no legacy lessons left", async () => {
    const legacy = (await loadIndexedLessons()).filter((lesson) => lesson.unit === undefined);
    expect(legacy.map((lesson) => lesson.slug)).toEqual([]);
  });

  it("lists every lesson file in lessonIndex", async () => {
    const indexed = new Set((await loadIndexedLessons()).map((lesson) => lesson.slug));
    const orphans = [];
    for (const path of lessonPaths) {
      const lesson = await load(path);
      if (!indexed.has(lesson.slug)) orphans.push(fileName(path));
    }
    expect(orphans).toEqual([]);
  });

  it("wipes only the home directory, whatever directory the previous run left", async () => {
    await runIsolated(
      'import os\nos.makedirs("/tmp/keep", exist_ok=True)\nopen("/tmp/keep/f", "w").write("x")\nos.chdir("/tmp/keep")'
    );
    const { stdout } = await runIsolated('import os\nprint(os.path.exists("/tmp/keep/f"))');
    expect(stdout).toBe("True\n");
  });
});

describe.each(lessonPaths.map((path) => [fileName(path), path]))("%s", (_name, path) => {
  let lesson;

  beforeAll(async () => {
    lesson = await load(path);
  });

  it("has a valid structure", () => {
    const problems = [];
    if (typeof lesson.slug !== "string") problems.push("slug must be a string");
    if (typeof lesson.title !== "string") problems.push("title must be a string");
    if (!Array.isArray(lesson.blocks)) problems.push("blocks must be an array");
    const ids = new Set();
    for (const [index, block] of (Array.isArray(lesson.blocks) ? lesson.blocks : []).entries()) {
      if (!BLOCK_TYPES.includes(block.type)) {
        problems.push(`block ${index}: unknown type ${JSON.stringify(block.type)}`);
      }
      if (block.type !== "exercise") continue;
      const at = `block ${index} (exercise ${block.id})`;
      if (typeof block.id !== "string") problems.push(`${at}: id must be a string`);
      else if (ids.has(block.id)) problems.push(`${at}: duplicate exercise id`);
      ids.add(block.id);
      if (typeof block.starterCode !== "string") problems.push(`${at}: missing starterCode`);
      problems.push(...checkProblems(block.check).map((problem) => `${at}: ${problem}`));
    }
    expect(problems).toEqual([]);
  });

  it("keeps every example runnable", async () => {
    const failures = [];
    for (const [index, block] of lesson.blocks.entries()) {
      if (block.type !== "example") continue;
      const { stderr } = await runIsolated(block.code, block.stdin);
      if (block.showsError ? !stderr : stderr) {
        failures.push(`block ${index}: ${stderr || "expected an error but none occurred"}`);
      }
    }
    expect(failures).toEqual([]);
  }, 60000);

  it("has no references to other programming languages", () => {
    expect(textFields(lesson).filter((text) => FORBIDDEN_LANGUAGE_REFERENCES.test(text))).toEqual(
      []
    );
  });

  it("meets the depth floor", () => {
    if (lesson.unit === undefined) return;
    const exercises = blocksOf(lesson, "exercise").length;
    const words = wordCount(blocksOf(lesson, "prose").map((block) => block.body).join(" "));
    const floors = lesson.slug.startsWith("project-")
      ? [[exercises, 4, "exercise"]]
      : lesson.slug.startsWith("review-")
        ? [[exercises, 2, "exercise"]]
        : [
            [words, 450, "prose word"],
            [blocksOf(lesson, "example").length, 2, "example"],
            [exercises, 2, "exercise"],
          ];
    const misses = floors
      .filter(([count, floor]) => count < floor)
      .map(([count, floor, noun]) => `${count} ${noun}${count === 1 ? "" : "s"} (floor ${floor})`);
    expect(misses.length > 0 ? [`depth: ${misses.join("; ")}`] : []).toEqual([]);
  });

  it("has verified exercises", async () => {
    if (lesson.unit === undefined) return;
    const failures = [];
    for (const block of blocksOf(lesson, "exercise")) {
      if (typeof block.solution !== "string") {
        failures.push(`${block.id}: missing solution`);
        continue;
      }
      const solved = gradeRun(
        await runIsolated(buildRunnableCode(block.solution, block.check), block.stdin),
        block.check
      );
      if (!solved.passed) {
        const why =
          solved.mismatches.length > 0
            ? solved.mismatches
                .map(({ call, got, expected }) => {
                  const verb = got.startsWith("raised ") ? "" : "returned ";
                  return `${call} ${verb}${got}, expected ${expected}`;
                })
                .join("; ")
            : solved.actual;
        failures.push(`${block.id}: solution does not pass (${why})`);
      }
      const starter = gradeRun(
        await runIsolated(buildRunnableCode(block.starterCode, block.check), block.stdin),
        block.check
      );
      if (starter.passed) failures.push(`${block.id}: starterCode already passes`);
    }
    expect(failures).toEqual([]);
  }, 120000);
});

// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { loadNodePyodide } from "../test/pyodideNode.js";
import { runPython, stdinLines } from "./runPython.js";

let pyodide;

beforeAll(async () => {
  pyodide = await loadNodePyodide();
}, 120000);

describe("stdinLines", () => {
  it("returns no lines for undefined or empty stdin", () => {
    expect(stdinLines(undefined)).toEqual([]);
    expect(stdinLines("")).toEqual([]);
  });

  it("splits on newlines and ignores one trailing newline", () => {
    expect(stdinLines("3\n4")).toEqual(["3", "4"]);
    expect(stdinLines("3\n4\n")).toEqual(["3", "4"]);
  });

  it("keeps an empty line in the middle and treats a lone newline as one empty line", () => {
    expect(stdinLines("a\n\nb")).toEqual(["a", "", "b"]);
    expect(stdinLines("\n")).toEqual([""]);
  });
});

describe("runPython", () => {
  it("captures stdout with its newlines", async () => {
    expect(await runPython(pyodide, "print('a')\nprint('b')")).toEqual({
      stdout: "a\nb\n",
      stderr: "",
    });
  });

  it("trims a traceback down to the learner's code", async () => {
    const { stderr } = await runPython(pyodide, "print(undefined_name)");
    expect(stderr).toContain("Traceback (most recent call last):");
    expect(stderr).toContain("NameError");
    expect(stderr).not.toContain("_pyodide");
  });

  it("gives every run a fresh namespace", async () => {
    await runPython(pyodide, "leaked = 1");
    const { stderr } = await runPython(pyodide, "print(leaked)");
    expect(stderr).toContain("NameError");
  });

  it("feeds stdin lines to input() and echoes them after the prompt", async () => {
    const { stdout, stderr } = await runPython(
      pyodide,
      'name = input("Name? ")\nprint(f"Hi {name}")',
      { stdin: "Ada" }
    );
    expect(stderr).toBe("");
    expect(stdout).toBe("Name? Ada\nHi Ada\n");
  });

  it("echoes answers to input() calls that have no prompt", async () => {
    const { stdout } = await runPython(
      pyodide,
      "a = int(input())\nb = int(input())\nprint(a + b)",
      { stdin: "3\n4" }
    );
    expect(stdout).toBe("3\n4\n7\n");
  });

  it("feeds an empty line in the middle of the input", async () => {
    const { stdout } = await runPython(
      pyodide,
      "print(repr(input()), repr(input()), repr(input()))",
      { stdin: "a\n\nb" }
    );
    expect(stdout).toBe("a\n\nb\n'a' '' 'b'\n");
  });

  it("raises EOFError when input runs out, without leaking the echo wrapper frame", async () => {
    const { stderr } = await runPython(pyodide, "input('x')");
    expect(stderr).toContain("EOFError");
    expect(stderr).not.toContain("_echo_input");
  });

  it("does not reuse stdin between runs", async () => {
    expect((await runPython(pyodide, "input()", { stdin: "one" })).stdout).toBe("one\n");
    const { stderr } = await runPython(pyodide, "input()");
    expect(stderr).toContain("EOFError");
  });

  it("feeds stdin to a run that follows one that ran out of input", async () => {
    expect((await runPython(pyodide, "input()")).stderr).toContain("EOFError");
    expect(await runPython(pyodide, "input()", { stdin: "two" })).toEqual({
      stdout: "two\n",
      stderr: "",
    });
  });

  it("restores sys.stdin replaced by an earlier run", async () => {
    await runPython(pyodide, 'import io, sys\nsys.stdin = io.StringIO("stale\\n")');
    expect(await runPython(pyodide, "input()", { stdin: "fresh" })).toEqual({
      stdout: "fresh\n",
      stderr: "",
    });
  });

  it("delivers a last line with no trailing newline in the run that wrote it", async () => {
    expect((await runPython(pyodide, "print('x', end='')")).stdout).toBe("x");
  });

  it("does not leak output from one run into the next", async () => {
    await runPython(pyodide, "print('x', end='')");
    expect((await runPython(pyodide, "print('y')")).stdout).toBe("y\n");
  });

  it("shows the prompt even when input runs out", async () => {
    const { stdout } = await runPython(pyodide, "input('Name? ')");
    expect(stdout).toBe("Name? ");
  });

  it("keeps non-ASCII output intact", async () => {
    expect((await runPython(pyodide, "print('héllo ✓')")).stdout).toBe("héllo ✓\n");
  });

  it("restores sys.stdout and sys.stderr replaced by an earlier run", async () => {
    await runPython(pyodide, "import io, sys\nsys.stdout = io.StringIO()\nsys.stderr = io.StringIO()");
    expect(
      await runPython(pyodide, "import sys\nprint('out')\nprint('err', file=sys.stderr)")
    ).toEqual({ stdout: "out\n", stderr: "err\n" });
  });

  it("re-imports a module file rewritten between runs", async () => {
    const useHelpers = (value) =>
      `open("helpers.py", "w").write("VALUE = ${value}\\n")\nimport helpers\nprint(helpers.VALUE)`;
    expect((await runPython(pyodide, useHelpers(1))).stdout).toBe("1\n");
    expect((await runPython(pyodide, useHelpers(2))).stdout).toBe("2\n");
    await runPython(pyodide, "import os\nos.remove('helpers.py')");
  });

  it("reseeds random between runs while a seeded run stays repeatable", async () => {
    const seeded = "import random\nrandom.seed(42)\nprint(random.randint(1, 100))";
    const unseeded = "import random\nprint(random.random())";
    const first = [await runPython(pyodide, seeded), await runPython(pyodide, unseeded)];
    const second = [await runPython(pyodide, seeded), await runPython(pyodide, unseeded)];
    expect(second[0].stdout).toBe(first[0].stdout);
    expect(second[1].stdout).not.toBe(first[1].stdout);
  });

  it("starts every run in the home directory", async () => {
    const cwd = "import os\nprint(os.getcwd())";
    await runPython(pyodide, "import os\nos.makedirs('data', exist_ok=True)\nos.chdir('data')");
    expect((await runPython(pyodide, cwd)).stdout).toBe("/home/pyodide\n");
    await runPython(pyodide, "import os\nos.chdir('..')");
    expect((await runPython(pyodide, cwd)).stdout).toBe("/home/pyodide\n");
    await runPython(pyodide, "import os\nos.rmdir('data')");
  });

  it("forgets a deleted namespace package, including a nested one", async () => {
    const create =
      "import os\nos.makedirs('nspkg/sub', exist_ok=True)\n" +
      "open('nspkg/sub/m.py', 'w').write('X = 1\\n')\nimport nspkg.sub.m\nprint(nspkg.sub.m.X)";
    expect((await runPython(pyodide, create)).stdout).toBe("1\n");
    await runPython(pyodide, "import shutil\nshutil.rmtree('nspkg')");
    expect((await runPython(pyodide, "import nspkg")).stderr).toContain("ModuleNotFoundError");
  });

  it("keeps running after a package __init__ fails once it imported a namespace subpackage", async () => {
    const create =
      "import os\nos.makedirs('pkg/sub', exist_ok=True)\n" +
      "open('pkg/sub/m.py', 'w').write('X = 1\\n')\n" +
      "open('pkg/__init__.py', 'w').write('from . import sub\\nraise ValueError(\"broken\")\\n')\n" +
      "import pkg";
    expect((await runPython(pyodide, create)).stderr).toContain("ValueError: broken");
    const ok = { stdout: "ok\n", stderr: "" };
    expect(await runPython(pyodide, "print('ok')")).toEqual(ok);
    expect(await runPython(pyodide, "import shutil\nshutil.rmtree('pkg')\nprint('ok')")).toEqual(ok);
    expect(await runPython(pyodide, "import sys\nprint('pkg.sub' in sys.modules)")).toEqual({
      stdout: "False\n",
      stderr: "",
    });
  });

  it("keeps running after learner code breaks a step of the reset", async () => {
    await runPython(pyodide, "import random\nrandom.seed = 42");
    expect(await runPython(pyodide, "print('ok')")).toEqual({ stdout: "ok\n", stderr: "" });
    await runPython(pyodide, "import importlib, random\nimportlib.reload(random)");
  });

  it("recovers when a run deletes the home directory", async () => {
    await runPython(pyodide, "import os, shutil\nos.chdir('/')\nshutil.rmtree('/home/pyodide')");
    expect(await runPython(pyodide, "print('ok')")).toEqual({ stdout: "ok\n", stderr: "" });
  });

  it("keeps overlapping runs from mixing their input and output", async () => {
    const results = await Promise.all([
      runPython(pyodide, 'name = input("A? ")\nprint("Hello,", name)', { stdin: "Ada" }),
      runPython(pyodide, 'age = input("B? ")\nprint(type(age))', { stdin: "30" }),
      runPython(pyodide, 'print("third")'),
    ]);
    expect(results).toEqual([
      { stdout: "A? Ada\nHello, Ada\n", stderr: "" },
      { stdout: "B? 30\n<class 'str'>\n", stderr: "" },
      { stdout: "third\n", stderr: "" },
    ]);
  });

  it("executes overlapping runs in call order", async () => {
    const append = (n) => `open("order.txt", "a").write("${n}")`;
    const [, , last] = await Promise.all([
      runPython(pyodide, append(1)),
      runPython(pyodide, append(2)),
      runPython(pyodide, `${append(3)}\nimport os\nprint(open("order.txt").read())\nos.remove("order.txt")`),
    ]);
    expect(last).toEqual({ stdout: "123\n", stderr: "" });
  });

  it("keeps running queued runs after one rejects or raises", async () => {
    const [rejected, raised, after] = await Promise.allSettled([
      runPython(pyodide, "print('never')", null),
      runPython(pyodide, "raise ValueError('boom')"),
      runPython(pyodide, "print('after')"),
    ]);
    expect(rejected.status).toBe("rejected");
    expect(raised).toMatchObject({
      status: "fulfilled",
      value: { stderr: expect.stringContaining("ValueError: boom") },
    });
    expect(after).toEqual({ status: "fulfilled", value: { stdout: "after\n", stderr: "" } });
  });
});

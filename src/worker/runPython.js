const ECHO_INPUT = `
def _echo_input(prompt=""):
    value = input(prompt)
    print(value)
    return value
_echo_input
`;

// Undo interpreter state an earlier run may have left behind: a changed or deleted
// working directory, replaced sys.stdin/sys.stdout/sys.stderr, cached imports of the
// learner's own modules and packages, and the random module's state.
const RESET_STATE = `
def _make_reset_state():
    import importlib, os, sys
    home = "/home/pyodide"
    streams = (sys.stdin, sys.stdout, sys.stderr)
    def under_home(path):
        return (path or "").startswith(home + "/")
    def is_user_module(module):
        try:
            return under_home(getattr(module, "__file__", None)) or any(
                under_home(entry) for entry in getattr(module, "__path__", ())
            )
        except Exception:
            # e.g. a namespace subpackage whose parent's import failed; a module
            # whose path cannot be computed is not importable anyway.
            return True
    def go_home():
        os.makedirs(home, exist_ok=True)
        os.chdir(home)
    def restore_streams():
        sys.stdin, sys.stdout, sys.stderr = streams
    def forget_user_modules():
        # Collect before deleting: iterating a namespace package's __path__
        # looks its parent package up in sys.modules.
        stale = [name for name, module in list(sys.modules.items()) if is_user_module(module)]
        for name in stale:
            del sys.modules[name]
    def reseed_random():
        if "random" in sys.modules:
            sys.modules["random"].seed()
    steps = (go_home, restore_streams, forget_user_modules, importlib.invalidate_caches, reseed_random)
    def reset_state():
        # Learner code may have corrupted any of this state. Each step is skipped
        # on failure so a broken reset can never lock the learner out of running code.
        for step in steps:
            try:
                step()
            except Exception:
                pass
    return reset_state
_make_reset_state()
`;

const helpersByPyodide = new WeakMap();

function getHelpers(pyodide) {
  if (!helpersByPyodide.has(pyodide)) {
    helpersByPyodide.set(pyodide, {
      echoInput: pyodide.runPython(ECHO_INPUT),
      resetState: pyodide.runPython(RESET_STATE),
    });
  }
  return helpersByPyodide.get(pyodide);
}

export function stdinLines(stdin) {
  if (stdin === undefined || stdin === "") return [];
  return stdin.replace(/\n$/, "").split("\n");
}

function formatTraceback(message) {
  const marker = 'File "<exec>"';
  const index = message.indexOf(marker);
  if (index === -1) return message;
  return `Traceback (most recent call last):\n  ${message.slice(index)}`
    .split("\n")
    .filter((line) => !line.endsWith("in _echo_input"))
    .join("\n");
}

function createCapture() {
  const decoder = new TextDecoder();
  let text = "";
  return {
    handler: {
      write: (buffer) => {
        text += decoder.decode(buffer, { stream: true });
        return buffer.length;
      },
    },
    finish: () => text + decoder.decode(),
  };
}

function flushStreams(pyodide) {
  try {
    pyodide.runPython("import sys\nsys.stdout.flush()\nsys.stderr.flush()");
  } catch {
    // learner code replaced sys.stdout or sys.stderr
  }
}

const queues = new WeakMap();

// The stdout/stderr/stdin handlers are interpreter-global, so overlapping runs
// on one Pyodide instance would capture each other's I/O: run them one at a time.
export function runPython(pyodide, code, options) {
  const previous = queues.get(pyodide) ?? Promise.resolve();
  const result = previous.then(() => executeRun(pyodide, code, options));
  queues.set(pyodide, result.catch(() => {}));
  return result;
}

async function executeRun(pyodide, code, { stdin } = {}) {
  const out = createCapture();
  const err = createCapture();
  pyodide.setStdout(out.handler);
  pyodide.setStderr(err.handler);
  const lines = stdinLines(stdin);
  pyodide.setStdin({ stdin: () => (lines.length > 0 ? lines.shift() : undefined) });
  const { echoInput, resetState } = getHelpers(pyodide);
  const globals = pyodide.toPy({ __name__: "__main__" });
  globals.set("input", echoInput);
  let traceback = "";
  try {
    resetState();
    await pyodide.runPythonAsync(code, { globals });
  } catch (error) {
    traceback = formatTraceback(String(error));
  } finally {
    globals.destroy();
    flushStreams(pyodide);
  }
  return { stdout: out.finish(), stderr: err.finish() + traceback };
}

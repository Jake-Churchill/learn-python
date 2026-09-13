export default {
  slug: "error-handling",
  title: "Error Handling",
  blocks: [
    {
      type: "prose",
      body: "When code might fail — like dividing by zero or converting invalid text to a number — wrap it in a `try` block, and handle the failure in an `except` block: `try:` / `except Exception as e:`. If an error occurs inside `try`, Python immediately jumps to the matching `except` instead of crashing the program.",
    },
    {
      type: "prose",
      body: "Python exceptions are typed, and it's idiomatic to catch specific ones — `except ValueError:`, `except ZeroDivisionError:` — rather than a catch-all `except:`, which also swallows real bugs.",
    },
    {
      type: "prose",
      body: "A `finally:` block, if you add one, always runs after the `try`/`except` — whether or not an error happened — which makes it useful for cleanup code that must happen no matter what.",
    },
    {
      type: "example",
      code: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None

print(safe_divide(10, 2))
print(safe_divide(10, 0))`,
    },
    {
      type: "exercise",
      id: "error-handling-1",
      prompt: "Write code that tries to convert the string \"abc\" to an int with int(\"abc\"), catches the ValueError, and prints exactly: invalid number",
      starterCode: `# your try/except here
`,
      check: { type: "stdout-exact", expected: "invalid number" },
    },
  ],
};

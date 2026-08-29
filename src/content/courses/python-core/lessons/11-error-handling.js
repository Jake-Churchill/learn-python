export default {
  slug: "error-handling",
  title: "Error Handling",
  blocks: [
    {
      type: "prose",
      body: "JS's try { ... } catch (e) { ... } becomes Python's `try:` / `except Exception as e:` — same idea, different keywords, and Python's blocks use indentation like everywhere else.",
    },
    {
      type: "prose",
      body: "Python exceptions are typed, and it's idiomatic to catch specific ones — `except ValueError:`, `except ZeroDivisionError:` — rather than a catch-all `except:`, which also swallows real bugs.",
    },
    {
      type: "prose",
      body: "`finally:` behaves exactly like JS's `finally` block — it runs whether or not an exception happened.",
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

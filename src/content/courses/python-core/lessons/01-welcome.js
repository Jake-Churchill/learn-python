export default {
  slug: "welcome",
  title: "Welcome & Your First Script",
  blocks: [
    {
      type: "prose",
      body: "No install needed for this course — Python runs right in your browser via WebAssembly, so you can write, edit, and run real Python without ever opening a terminal.",
    },
    {
      type: "prose",
      body: "To have Python display something, use the `print()` function: `print('Hello, world!')`. Whatever you put inside the parentheses gets shown as output — no semicolon needed at the end of the line.",
    },
    {
      type: "prose",
      body: "Comments are notes in your code that Python ignores when running it — they're there for humans to read. Start one with `#`; everything after it on that line is ignored. There's no way to comment out several lines at once — each one needs its own `#`.",
    },
    {
      type: "example",
      code: `print("Hello, world!")
# This is a comment`,
    },
    {
      type: "exercise",
      id: "welcome-1",
      prompt: "Use print() to output exactly this line: Python is fun",
      starterCode: `# write your code below
`,
      check: { type: "stdout-exact", expected: "Python is fun" },
    },
  ],
};

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
      body: "In JS, a full \"hello world\" is `console.log('Hello, world!')`. In Python it's `print('Hello, world!')` — no semicolon, and it's a plain function call, not a method on a global object.",
    },
    {
      type: "prose",
      body: "Comments start with `#`, not `//`, and there's no block-comment syntax like `/* */` — every commented line needs its own `#`.",
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

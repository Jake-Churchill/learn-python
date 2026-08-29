export default {
  slug: "modules-and-imports",
  title: "Modules & Imports",
  blocks: [
    {
      type: "prose",
      body: "JS's `import { thing } from \"module\"` becomes Python's `import module` or `from module import thing`. Python's standard library ships as built-in modules — no npm install needed for things like `math` or `random`.",
    },
    {
      type: "prose",
      body: "`import math` then use `math.sqrt(16)` — dotted access, similar to a JS namespace import.",
    },
    {
      type: "prose",
      body: "`if __name__ == \"__main__\":` is a Python idiom with no direct JS equivalent — a guard so code only runs when the file is executed directly, not when another file imports it.",
    },
    {
      type: "example",
      code: `import math

print(math.sqrt(16))
print(math.pi)

if __name__ == "__main__":
    print("running directly")`,
    },
    {
      type: "exercise",
      id: "modules-and-imports-1",
      prompt: "Import the math module and print the result of math.floor(7.9).",
      starterCode: `# import and print here
`,
      check: { type: "stdout-exact", expected: "7" },
    },
  ],
};

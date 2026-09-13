export default {
  slug: "modules-and-imports",
  title: "Modules & Imports",
  blocks: [
    {
      type: "prose",
      body: "A module is just a file of Python code that other files can reuse. Bring one into your file with `import module_name`, or pull out just what you need with `from module_name import thing`. Python ships with a large standard library of built-in modules — like `math` and `random` — ready to use with no separate installation step.",
    },
    {
      type: "prose",
      body: "After `import math`, access anything inside it with a dot: `math.sqrt(16)`. This dotted-access pattern is how you reach any function or value defined inside a module you've imported.",
    },
    {
      type: "prose",
      body: "`if __name__ == \"__main__\":` is a common Python idiom: `__name__` is a special variable Python sets to `\"__main__\"` only when the file is run directly, and to the module's name when another file imports it instead. Wrapping code in this check means it only runs when you execute the file yourself — not every time something else imports it.",
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

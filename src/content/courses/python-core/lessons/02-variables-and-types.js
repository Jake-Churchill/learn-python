export default {
  slug: "variables-and-types",
  title: "Variables & Types",
  blocks: [
    {
      type: "prose",
      body: "JS has `let`, `const`, and old-school `var`. Python has none of that — you just write `name = value` and it's created (or reassigned) on the spot. There's no declaration keyword at all.",
    },
    {
      type: "prose",
      body: "Naming convention differs too: JS and Java favor camelCase; Python convention is snake_case — `user_name`, not `userName`.",
    },
    {
      type: "prose",
      body: "Python is dynamically typed, just like JS: a variable can hold an int and later hold a string with no error. Use `type(x)` to check what something currently is.",
    },
    {
      type: "example",
      code: `age = 30
name = "Ada"
print(type(age))
print(type(name))
age = "thirty"
print(type(age))`,
    },
    {
      type: "exercise",
      id: "variables-1",
      prompt: "Create a variable called city set to the string \"Phoenix\", then print it.",
      starterCode: `# create the variable and print it
`,
      check: { type: "stdout-exact", expected: "Phoenix" },
    },
  ],
};

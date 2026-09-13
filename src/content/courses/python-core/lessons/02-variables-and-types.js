export default {
  slug: "variables-and-types",
  title: "Variables & Types",
  blocks: [
    {
      type: "prose",
      body: "A variable is a name that stores a value so you can use it again later. In Python, you create one just by writing `name = value` — there's no declaration keyword needed. Assigning to a name that already exists simply replaces its old value.",
    },
    {
      type: "prose",
      body: "Python's naming convention for variables is snake_case: lowercase words separated by underscores, like `user_name` rather than `userName`. It isn't enforced by the language, but following it makes your code easier for other Python programmers — and future you — to read.",
    },
    {
      type: "prose",
      body: "Every value in Python has a type, such as `int` for whole numbers or `str` for text. Python is dynamically typed, meaning a variable isn't locked to one type: it simply holds whatever value you last assigned it, whether that's a number now and a string later. Use the built-in `type(x)` function any time you want to check what a value currently is.",
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

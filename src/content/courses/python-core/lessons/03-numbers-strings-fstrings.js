export default {
  slug: "numbers-strings-fstrings",
  title: "Numbers, Strings & f-strings",
  blocks: [
    {
      type: "prose",
      body: "Python has `int` and `float` instead of one generic number type. `7 / 2` gives a float (3.5); use `//` for integer division — `7 // 2` is `3`.",
    },
    {
      type: "prose",
      body: "To build a string that includes the value of a variable, use an f-string: put an `f` right before the opening quote, then wrap any variable name in `{}` inside the string, e.g. `f\"Hello, {name}!\"`. Python fills in the current value of `name` automatically — this is called string interpolation, and it's much cleaner than gluing pieces together with `+`.",
    },
    {
      type: "example",
      code: `name = "Sam"
score = 95
print(f"{name} scored {score} points")
print(7 / 2)
print(7 // 2)`,
    },
    {
      type: "exercise",
      id: "numbers-strings-1",
      prompt: "a = 5 and b = 7 are given. Using an f-string, print exactly: Total: 12",
      starterCode: `a = 5
b = 7
# print using an f-string
`,
      check: { type: "stdout-exact", expected: "Total: 12" },
    },
  ],
};

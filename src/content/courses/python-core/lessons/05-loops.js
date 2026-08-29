export default {
  slug: "loops",
  title: "Loops",
  blocks: [
    {
      type: "prose",
      body: "JS's for...of loops over the values in an array; Python's for loop always works this way — `for item in some_list:`. There's no idiomatic C-style `for (let i = 0; i < n; i++)` in Python.",
    },
    {
      type: "prose",
      body: "Need a counted loop instead? Use `range(n)`: `for i in range(5):` counts 0 through 4, the same range as `for (let i = 0; i < 5; i++)`.",
    },
    {
      type: "prose",
      body: "`while` works just like JS's while — a condition, a colon, and an indented body. Python also has no `i++`; you write `i += 1` instead.",
    },
    {
      type: "example",
      code: `for i in range(5):
    print(i)

count = 3
while count > 0:
    print(count)
    count -= 1`,
    },
    {
      type: "exercise",
      id: "loops-1",
      prompt: "Use a for loop with range() to print the numbers 1 through 4, each on its own line.",
      starterCode: `# your loop here
`,
      check: { type: "stdout-exact", expected: "1\n2\n3\n4" },
    },
  ],
};

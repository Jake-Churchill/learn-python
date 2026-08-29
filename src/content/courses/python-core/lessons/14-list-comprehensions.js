export default {
  slug: "list-comprehensions",
  title: "List Comprehensions",
  blocks: [
    {
      type: "prose",
      body: "You've written `[1, 2, 3].map(x => x * 2)` or `.filter(x => x > 2)` chains in JS. Python's list comprehension folds both into one expression: `[x * 2 for x in numbers]` for a map, or `[x for x in numbers if x > 2]` for a filter — and you can combine both in one comprehension.",
    },
    {
      type: "prose",
      body: "Read it left to right like English: \"x times 2, for each x in numbers, if x is greater than 2.\" It builds a brand-new list; the original list is never mutated, same as JS's .map()/.filter().",
    },
    {
      type: "example",
      code: `numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
evens = [n for n in numbers if n % 2 == 0]
print(doubled)
print(evens)`,
    },
    {
      type: "exercise",
      id: "list-comprehensions-1",
      prompt: "nums = [1, 2, 3, 4, 5, 6] is given. Use a list comprehension to build a list of the squares of only the even numbers, then print it. Expected: [4, 16, 36]",
      starterCode: `nums = [1, 2, 3, 4, 5, 6]
`,
      check: { type: "stdout-exact", expected: "[4, 16, 36]" },
    },
  ],
};

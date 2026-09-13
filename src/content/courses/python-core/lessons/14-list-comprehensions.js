export default {
  slug: "list-comprehensions",
  title: "List Comprehensions",
  blocks: [
    {
      type: "prose",
      body: "A list comprehension builds a new list from an existing one in a single line: `[x * 2 for x in numbers]` creates a list with every item in `numbers` doubled. Add an `if` at the end to filter which items are included: `[x for x in numbers if x > 2]` keeps only the items greater than 2. You can combine a transformation and a filter in one comprehension.",
    },
    {
      type: "prose",
      body: "Read a comprehension left to right like a sentence: \"x times 2, for each x in numbers, if x is greater than 2.\" It always builds a brand-new list — the original list, `numbers`, is left completely unchanged.",
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

export default {
  slug: "lists",
  title: "Lists",
  blocks: [
    {
      type: "prose",
      body: "Python lists are written just like JS arrays: `fruits = [\"apple\", \"banana\"]`. Indexing works the same way too — `fruits[0]` — and Python adds negative indices: `fruits[-1]` is the last item, no more `arr[arr.length - 1]`.",
    },
    {
      type: "prose",
      body: "Slicing is new: `fruits[1:3]` gives the items at index 1 and 2 — start inclusive, end exclusive. It's like `.slice()` but built into the syntax.",
    },
    {
      type: "prose",
      body: "Common methods map over directly: `.append(x)` is JS's `.push(x)`, and `len(fruits)` replaces `.length` — note it's a function call, not a property.",
    },
    {
      type: "example",
      code: `fruits = ["apple", "banana", "cherry"]
fruits.append("date")
print(fruits)
print(fruits[-1])
print(fruits[1:3])
print(len(fruits))`,
    },
    {
      type: "exercise",
      id: "lists-1",
      prompt: "numbers = [10, 20, 30] is given. Append 40 to it, then print the list.",
      starterCode: `numbers = [10, 20, 30]
`,
      check: { type: "stdout-exact", expected: "[10, 20, 30, 40]" },
    },
  ],
};

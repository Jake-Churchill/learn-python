export default {
  slug: "lists",
  title: "Lists",
  blocks: [
    {
      type: "prose",
      body: "A list holds an ordered collection of values: `fruits = [\"apple\", \"banana\"]`. Access an item by its position (starting at 0) with square brackets: `fruits[0]` is `\"apple\"`. Python also supports negative indices counting from the end, so `fruits[-1]` always gives you the last item without needing to know how long the list is.",
    },
    {
      type: "prose",
      body: "Slicing lets you pull out a sub-list: `fruits[1:3]` gives the items at index 1 and 2 — the start index is included, the end index is not. Leave either side blank to slice to the beginning or end, e.g. `fruits[:2]` or `fruits[1:]`.",
    },
    {
      type: "prose",
      body: "To add an item to the end of a list, use `.append(x)`. To find out how many items a list holds, use the built-in `len(fruits)` function — note it's a function you call on the list, not a value the list stores.",
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

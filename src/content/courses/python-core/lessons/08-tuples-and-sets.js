export default {
  slug: "tuples-and-sets",
  title: "Tuples & Sets",
  blocks: [
    {
      type: "prose",
      body: "A tuple looks like a list but uses parentheses instead of square brackets, and — unlike a list — it can't be changed after it's created: `point = (3, 4)`. Try `point[0] = 5` and Python raises a TypeError. Tuples are useful whenever a value is meant to stay fixed, like a pair of coordinates.",
    },
    {
      type: "prose",
      body: "A set stores a collection of values with two rules: order isn't tracked, and duplicates are automatically removed. `colors = {\"red\", \"green\", \"red\"}` collapses down to two items, since \"red\" only counts once.",
    },
    {
      type: "prose",
      body: "Use tuples for fixed groups of values (like coordinates), sets for uniqueness checks, and lists for everything else that needs to change.",
    },
    {
      type: "example",
      code: `point = (3, 4)
print(point[0])

colors = {"red", "green", "red"}
print(len(colors))
print("red" in colors)`,
    },
    {
      type: "exercise",
      id: "tuples-and-sets-1",
      prompt: "numbers = [1, 2, 2, 3, 3, 3] is given. Create a set called unique_nums from it, then print its length with len().",
      starterCode: `numbers = [1, 2, 2, 3, 3, 3]
`,
      check: { type: "stdout-exact", expected: "3" },
    },
  ],
};

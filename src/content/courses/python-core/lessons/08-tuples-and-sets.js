export default {
  slug: "tuples-and-sets",
  title: "Tuples & Sets",
  blocks: [
    {
      type: "prose",
      body: "A tuple looks like a list but with parentheses, and it can't be changed after creation: `point = (3, 4)`. Try `point[0] = 5` and you'll get a TypeError — there's no exact JS equivalent, though Object.freeze() on an array is the closest idea.",
    },
    {
      type: "prose",
      body: "A set is like JS's Set: unordered, with no duplicates. `colors = {\"red\", \"green\", \"red\"}` collapses down to two items.",
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

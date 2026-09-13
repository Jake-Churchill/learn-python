export default {
  slug: "loops",
  title: "Loops",
  blocks: [
    {
      type: "prose",
      body: "A loop lets you repeat code without writing it out multiple times. Python's `for` loop iterates over the items in a collection one at a time: `for item in some_list:` runs its indented body once for each item, with `item` set to the current one each time through.",
    },
    {
      type: "prose",
      body: "To loop a specific number of times instead of over an existing collection, use `range(n)`, which produces the numbers 0 up to (but not including) `n`. So `for i in range(5):` runs the body 5 times, with `i` taking the values 0, 1, 2, 3, 4 in turn.",
    },
    {
      type: "prose",
      body: "A `while` loop repeats its body for as long as a condition stays true, rechecking the condition before each pass: `while count > 0:` followed by an indented body. Python has no `i++` shorthand — to change a number by one, write `count -= 1` (or `count += 1`).",
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

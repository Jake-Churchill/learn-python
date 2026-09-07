export default {
  slug: "review-loops-collections-functions",
  title: "Review: Loops, Collections & Functions",
  blocks: [
    {
      type: "prose",
      body: "You've covered loops, lists, dictionaries, tuples, sets, and functions — time to combine them. A common real pattern: loop over a collection, build up a dictionary as you go, and wrap the logic in a function you can reuse.",
    },
    {
      type: "example",
      code: `def total_and_max(numbers):
    total = 0
    highest = numbers[0]
    for n in numbers:
        total += n
        if n > highest:
            highest = n
    return {"total": total, "max": highest}

print(total_and_max([4, 9, 2, 7]))`,
    },
    {
      type: "exercise",
      id: "review-loops-collections-functions-1",
      prompt:
        "Fill in summarize(items) so it loops over items, builds a dictionary counting how many times each value appears, and returns a tuple of (that dictionary, the number of unique values using a set). The call below is already written for you.",
      starterCode: `def summarize(items):
    # your code here
    pass

print(summarize([1, 2, 2, 3, 3, 3]))
`,
      check: { type: "stdout-exact", expected: "({1: 1, 2: 2, 3: 3}, 3)" },
    },
  ],
};

export default {
  slug: "lists",
  title: "Lists",
  unit: "Collections",
  blocks: [
    {
      type: "prose",
      body: "So far each variable has held one value: one name, one price, one score. A program that tracks a week of temperatures or a class of thirty students would need dozens of separate variables. A list solves this. It is a single value that holds many values, kept in order.",
    },
    {
      type: "heading",
      text: "Creating a list",
    },
    {
      type: "prose",
      body: "You create a list by writing values between square brackets, separated by commas. Each value in a list is called an item. A list can hold any type of value, and its type is called `list`.",
    },
    {
      type: "example",
      code: `temperatures = [18, 21, 25, 24]
names = ["Ada", "Grace", "Alan"]
empty = []
print(temperatures)
print(names)
print(empty)
print(type(names))`,
    },
    {
      type: "prose",
      body: "Printing a list shows the brackets and every item. Strings appear in single quotes so you can tell them apart from numbers, even if you wrote them with double quotes. `[]` is an empty list: a list with no items yet, ready to be filled later.",
    },
    {
      type: "heading",
      text: "Adding items with append",
    },
    {
      type: "prose",
      body: "A method is a function that belongs to a value, called with a dot after that value, as you did with string methods such as `upper()`. Lists have their own methods. The most common is `append()`, which adds one item to the end of the list.",
    },
    {
      type: "prose",
      body: "`append()` changes the list itself, so you do not store its result anywhere. A common pattern is to start with an empty list and append to it inside a loop.",
    },
    {
      type: "example",
      code: `squares = []
for n in range(1, 6):
    squares.append(n * n)
print(squares)`,
    },
    {
      type: "exercise",
      id: "lists-1",
      prompt:
        "The list numbers holds 10, 20, and 30. Append 40 to it, then print the list. The output should be exactly: [10, 20, 30, 40]",
      starterCode: `numbers = [10, 20, 30]
# append 40, then print the list
`,
      check: { type: "stdout-exact", expected: "[10, 20, 30, 40]" },
      solution: `numbers = [10, 20, 30]
numbers.append(40)
print(numbers)
`,
      hint: "Write numbers.append(40) on its own line, then print(numbers).",
    },
    {
      type: "heading",
      text: "Reading items by position",
    },
    {
      type: "prose",
      body: "Every item has a position number called an index. Indexes start at 0, so the first item is at index 0 and the second at index 1. You read an item by writing its index in square brackets after the list, as in `names[0]`. Negative indexes count from the end: `names[-1]` is the last item.",
    },
    {
      type: "prose",
      body: "A slice takes several items at once and gives you a new list. `names[1:3]` holds the items at indexes 1 and 2, because the start index is included and the stop index is not. Leaving out the start, as in `names[:2]`, begins at the first item, and leaving out the stop runs to the end. Indexing and slicing work exactly as they do on strings.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace", "Alan", "Linus", "Guido"]
print(names[0])
print(names[-1])
print(names[1:3])
print(names[:2])
print(names[3:])`,
    },
    {
      type: "prose",
      body: "Asking for an index that does not exist stops the program with an `IndexError`. This list has five items, so its last index is 4, and `names[5]` is one step past the end. The last line of the message reads `IndexError: list index out of range`.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace", "Alan", "Linus", "Guido"]
print(names[5])`,
      showsError: true,
    },
    {
      type: "prose",
      body: "A string cannot be changed once it is made, but a list can. Assigning to an index replaces the item in that position: `scores[1] = 90` puts 90 where the second item was. The other items and the length of the list stay the same.",
    },
    {
      type: "example",
      code: `scores = [72, 65, 88]
scores[1] = 90
print(scores)`,
    },
    {
      type: "heading",
      text: "Counting items and checking membership",
    },
    {
      type: "prose",
      body: "The `len()` function you used on strings also works on lists, where it counts the items. The `in` operator checks whether a value is one of the items and gives `True` or `False`, and `not in` gives the opposite. Both read naturally inside an `if` statement. An empty list is falsy, so `if names:` is true only when the list has at least one item.",
    },
    {
      type: "example",
      code: `fruits = ["apple", "banana", "cherry"]
print(len(fruits))
print("banana" in fruits)
print("mango" not in fruits)
if "apple" in fruits:
    print("We have apples.")`,
    },
    {
      type: "exercise",
      id: "lists-2",
      prompt:
        "The list temperatures holds a week of readings. Print exactly three lines: the first reading, the last reading using a negative index, and a slice holding the first three readings. The output should be: 18, then 20, then [18, 21, 25]",
      starterCode: `temperatures = [18, 21, 25, 24, 19, 22, 20]
# print the first reading, the last reading, and the first three readings
`,
      check: { type: "stdout-exact", expected: "18\n20\n[18, 21, 25]" },
      solution: `temperatures = [18, 21, 25, 24, 19, 22, 20]
print(temperatures[0])
print(temperatures[-1])
print(temperatures[:3])
`,
      hint: "Index 0 is the first item and index -1 the last. The slice [:3] stops before index 3.",
    },
    {
      type: "heading",
      text: "Looping over a list",
    },
    {
      type: "prose",
      body: "A `for` loop works on a list the same way it works on a string. The loop variable takes each item in turn, from first to last, and the loop body runs once per item. This lets you count or total the items with the patterns from the Loops unit.",
    },
    {
      type: "example",
      code: `temperatures = [18, 21, 25, 24, 19, 22, 20]
warm_days = 0
for temp in temperatures:
    if temp > 21:
        warm_days += 1
print("Warm days:", warm_days)`,
    },
    {
      type: "heading",
      text: "Totals, smallest, and largest",
    },
    {
      type: "prose",
      body: "Three built-in functions save you from writing those loops for common questions. `sum()` adds up a list of numbers, `min()` finds the smallest item, and `max()` finds the largest. On a list of strings, `min()` and `max()` compare the way `<` and `>` compare strings, which is alphabetical for words in the same case. Dividing the sum by the length gives the average.",
    },
    {
      type: "example",
      code: `temperatures = [18, 21, 25, 24, 19, 22, 20]
print(sum(temperatures))
print(min(temperatures))
print(max(temperatures))
average = sum(temperatures) / len(temperatures)
print(round(average, 1))`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Using the length as an index is the most common mistake. A list of five items has indexes 0 to 4, so `names[len(names)]` is always one past the end and raises an `IndexError`. Use `names[-1]` to reach the last item.",
    },
    {
      type: "prose",
      body: "Two more are worth knowing. Writing `squares = squares.append(9)` replaces your list with `None`, because `append()` changes the list and gives nothing back; call it on its own line. And `min()` and `max()` fail with a `ValueError` on an empty list, because there is no smallest item in a list with no items.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A list holds items in order inside square brackets. You read items by index or slice, replace an item by assigning to its index, and add to the end with `append()`. `len()`, `in`, and a `for` loop work on lists as they do on strings, and `sum()`, `min()`, and `max()` summarize a list of numbers.",
    },
    {
      type: "exercise",
      id: "lists-3",
      prompt:
        "The list scores holds six test scores. Use a for loop and append() to build a new list called passing that holds only the scores of 60 or more, in their original order. Then print exactly three lines: the passing list, how many scores passed, and the highest passing score. The output should be: [72, 88, 91, 60], then 4, then 91",
      starterCode: `scores = [72, 45, 88, 59, 91, 60]
# build the passing list, then print the three lines
`,
      check: { type: "stdout-exact", expected: "[72, 88, 91, 60]\n4\n91" },
      solution: `scores = [72, 45, 88, 59, 91, 60]
passing = []
for score in scores:
    if score >= 60:
        passing.append(score)
print(passing)
print(len(passing))
print(max(passing))
`,
      hint: "Start with passing = []. Inside the loop, an if statement decides whether to append the score. After the loop, len() and max() give the last two lines.",
    },
  ],
};

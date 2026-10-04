export default {
  slug: "tuples-and-unpacking",
  title: "Tuples, Unpacking, enumerate & zip",
  unit: "Collections",
  blocks: [
    {
      type: "prose",
      body: "Some groups of values belong together and should never change, such as the two coordinates of a point or the year, month, and day of a date. A tuple holds a group like that. This lesson also shows how to unpack a group into separate variables, and three built-in functions, `enumerate()`, `zip()`, and `reversed()`, that make loops over lists clearer.",
    },
    {
      type: "heading",
      text: "Creating a tuple",
    },
    {
      type: "prose",
      body: "A tuple is an ordered collection of items written with parentheses instead of square brackets: `point = (3, 4)`. You can index it, slice it, measure it with `len()`, check it with `in`, and loop over it, exactly as with a list. Its type is `tuple`.",
    },
    {
      type: "prose",
      body: "It is the comma, not the parentheses, that makes a tuple. `size = 1920, 1080` creates a tuple too, and a tuple with one item needs a trailing comma, `(5,)`, because `(5)` is just the number 5 in parentheses. An empty tuple is written `()`.",
    },
    {
      type: "example",
      code: `point = (3, 4)
date = (2025, 6, 30)
print(point)
print(date[0])
print(len(date))
print(type(point))
print(type((5,)))
print(type((5)))`,
    },
    {
      type: "heading",
      text: "Tuples cannot change",
    },
    {
      type: "prose",
      body: "Once created, a tuple cannot be changed: you cannot replace, add, or remove items, and tuples have no `append()` or `remove()` method. A value that cannot be changed is called immutable. Strings are immutable too. Trying to assign to an index of a tuple stops the program with a `TypeError`.",
    },
    {
      type: "example",
      code: `point = (3, 4)
point[0] = 5`,
      showsError: true,
    },
    {
      type: "prose",
      body: "The message reads `TypeError: 'tuple' object does not support item assignment`. That limit is useful: a tuple tells anyone reading your code that its contents stay fixed, which suits records such as a date. When you need a changed version, build a new tuple, or convert it with `list()`, change the list, and convert back with `tuple()`, which converts a value to a tuple the way `list()` converts to a list.",
    },
    {
      type: "heading",
      text: "Unpacking",
    },
    {
      type: "prose",
      body: "Unpacking means storing each item of a tuple in its own variable, all in one line: `x, y = point`. The number of names on the left must match the number of items. If it does not, Python raises a `ValueError` such as `too many values to unpack (expected 2, got 3)`. Unpacking works on lists as well.",
    },
    {
      type: "prose",
      body: "You have used unpacking before. In Variables & Types, `width, height = 3, 4` built a tuple on the right and unpacked it on the left. The swap `first, second = second, first` works the same way.",
    },
    {
      type: "example",
      code: `point = (3, 7)
x, y = point
print(x)
print(y)

name, age, city = ["Ada", 36, "London"]
print(name, "lives in", city)`,
    },
    {
      type: "exercise",
      id: "tuples-and-unpacking-1",
      prompt:
        "The tuple size holds a screen width and height. Unpack it into two variables called width and height on the empty line, so the program prints exactly two lines: Width: 1920 and then Height: 1080",
      starterCode: `size = (1920, 1080)
# unpack size into width and height on the next line

print("Width:", width)
print("Height:", height)
`,
      check: { type: "stdout-exact", expected: "Width: 1920\nHeight: 1080" },
      solution: `size = (1920, 1080)
width, height = size
print("Width:", width)
print("Height:", height)
`,
      hint: "Put the two names on the left of =, separated by a comma, and the tuple on the right.",
    },
    {
      type: "heading",
      text: "divmod gives back a tuple",
    },
    {
      type: "prose",
      body: "A function can give back several values at once by packing them into a tuple. `divmod(a, b)` divides `a` by `b` and gives back two numbers: the whole-number result of `a // b` and the remainder `a % b`. Unpacking the tuple names both parts in one step.",
    },
    {
      type: "example",
      code: `result = divmod(135, 60)
print(result)
hours, minutes = divmod(135, 60)
print(hours, "hours and", minutes, "minutes")`,
    },
    {
      type: "exercise",
      id: "tuples-and-unpacking-2",
      prompt:
        "Eggs are packed in boxes of 12. Use divmod() to split the 100 eggs into full boxes and leftover eggs, unpacking the result into variables called boxes and extra. Print exactly: 8 boxes and 4 extra eggs",
      starterCode: `eggs = 100
# use divmod to find the full boxes of 12 and the leftover eggs
`,
      check: { type: "stdout-exact", expected: "8 boxes and 4 extra eggs" },
      solution: `eggs = 100
boxes, extra = divmod(eggs, 12)
print(boxes, "boxes and", extra, "extra eggs")
`,
      hint: "divmod(eggs, 12) gives a tuple of two numbers. Unpack it with boxes, extra = on the left.",
    },
    {
      type: "heading",
      text: "Numbering items with enumerate",
    },
    {
      type: "prose",
      body: "Sometimes a loop needs both the position and the item. `enumerate()` hands the loop one pair at a time, made of an index and an item, and you unpack each pair right in the loop header. Counting starts at 0, and the option `start=1` starts it at 1, which suits numbered lists meant for people.",
    },
    {
      type: "example",
      code: `tasks = ["Buy milk", "Call Sam", "Pay rent"]
for number, task in enumerate(tasks, start=1):
    print(f"{number}. {task}")`,
    },
    {
      type: "heading",
      text: "Pairing lists with zip",
    },
    {
      type: "prose",
      body: "`zip()` walks through two lists side by side and hands out pairs: the first item of each, then the second item of each, and so on. It stops when the shorter list runs out. The loop header unpacks each pair, as with `enumerate()`.",
    },
    {
      type: "prose",
      body: "The two functions combine. In `enumerate(zip(names, scores), start=1)`, each item is a number paired with a (name, score) tuple. Writing `rank, (name, score)` in the loop header unpacks both levels at once.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace", "Alan"]
scores = [92, 88, 75]
for name, score in zip(names, scores):
    print(f"{name}: {score}")
print(list(zip(names, scores)))

for rank, (name, score) in enumerate(zip(names, scores), start=1):
    print(f"{rank}. {name} scored {score}")`,
    },
    {
      type: "heading",
      text: "Looping backwards with reversed",
    },
    {
      type: "prose",
      body: "`reversed()` hands out the items of a list, tuple, or string from last to first, without changing the original. The list method `reverse()` flips the list itself, while `reversed()` leaves it alone. Use `reversed()` in a `for` loop, or combine it with `list()` or `join()` to collect the results.",
    },
    {
      type: "example",
      code: `countdown = [1, 2, 3]
for n in reversed(countdown):
    print(n)
print("Liftoff!")
print(countdown)
print("".join(reversed("stressed")))`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Leaving the comma out of a one-item tuple is the most common mistake: `(5)` is the number 5, not a tuple. Unpacking into the wrong number of names is the next most common, and the `ValueError` it raises tells you how many values it expected and how many it got.",
    },
    {
      type: "prose",
      body: "Printing `zip()`, `enumerate()`, or `reversed()` directly shows a short description, such as one starting with `<zip object at`, instead of the items. These functions hand out their items one at a time. Loop over them, or wrap them in `list()` to see everything at once.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A tuple is an ordered, immutable group of items, made by commas and usually written in parentheses. Unpacking stores each item in its own variable, and `divmod()` is one of many functions that give back a tuple to unpack. In loops, `enumerate()` adds a position number, `zip()` pairs up lists, and `reversed()` goes from last to first.",
    },
    {
      type: "exercise",
      id: "tuples-and-unpacking-3",
      prompt:
        "The lists runners and times are in finishing order. Print one line per runner with the place number starting at 1, the name, a colon, and the time. The output should be exactly three lines: 1. Ada: 12.4, then 2. Grace: 12.9, then 3. Alan: 13.1",
      starterCode: `runners = ["Ada", "Grace", "Alan"]
times = [12.4, 12.9, 13.1]
# print each runner's place, name, and time
`,
      check: {
        type: "stdout-exact",
        expected: "1. Ada: 12.4\n2. Grace: 12.9\n3. Alan: 13.1",
      },
      solution: `runners = ["Ada", "Grace", "Alan"]
times = [12.4, 12.9, 13.1]
for place, (name, time) in enumerate(zip(runners, times), start=1):
    print(f"{place}. {name}: {time}")
`,
      hint: "zip(runners, times) pairs each name with its time. Wrap it in enumerate() with start=1, and unpack with place, (name, time) in the loop header.",
    },
  ],
};

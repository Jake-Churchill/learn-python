export default {
  slug: "list-methods",
  title: "List Methods & Copying",
  unit: "Collections",
  blocks: [
    {
      type: "prose",
      body: "In the last lesson you added items with `append()`. Lists have many more methods, for inserting, removing, searching, and ordering items. This lesson covers them, along with the difference between a second name for a list and a real copy. It ends with methods that turn text into lists and lists back into text.",
    },
    {
      type: "heading",
      text: "Adding and removing items",
    },
    {
      type: "prose",
      body: "`insert()` puts an item at a chosen index and shifts the later items along, so `queue.insert(0, \"Zoe\")` adds Zoe at the front. `extend()` adds every item from another list to the end. `remove()` deletes the first item equal to the value you give it.",
    },
    {
      type: "prose",
      body: "`pop()` removes an item and gives it back, so you can store it in a variable. With nothing in the parentheses it takes the last item, and `pop(0)` takes the first. The word `del`, short for delete, removes an item by index without giving it back: `del queue[0]`.",
    },
    {
      type: "example",
      code: `queue = ["Ada", "Grace", "Alan"]
queue.insert(0, "Zoe")
queue.extend(["Linus", "Guido"])
print(queue)
queue.remove("Grace")
print(queue)
served = queue.pop(0)
print("Served:", served)
last = queue.pop()
print("Left the line:", last)
del queue[0]
print(queue)`,
    },
    {
      type: "prose",
      body: "These methods fail when there is nothing to act on. `remove()` raises a `ValueError` if the value is not in the list, and `pop()` raises an `IndexError` on an empty list. When you are not sure an item is there, check with `in` first.",
    },
    {
      type: "exercise",
      id: "list-methods-1",
      prompt:
        "The first line adds butter to the front of the shopping list. Remove \"eggs\" from the list, then print the list. The output should be exactly: ['butter', 'milk', 'bread']",
      starterCode: `shopping = ["milk", "eggs", "bread"]
shopping.insert(0, "butter")
# remove "eggs", then print the list
`,
      check: { type: "stdout-exact", expected: "['butter', 'milk', 'bread']" },
      solution: `shopping = ["milk", "eggs", "bread"]
shopping.insert(0, "butter")
shopping.remove("eggs")
print(shopping)
`,
      hint: "remove() takes the value to delete, written inside the parentheses.",
    },
    {
      type: "heading",
      text: "Searching and counting",
    },
    {
      type: "prose",
      body: "`count()` tells you how many times a value appears in a list, and gives 0 when it never does. `index()` gives the index of the first matching item. If there is no match, `index()` raises a `ValueError`, just like `remove()`.",
    },
    {
      type: "example",
      code: `rolls = [3, 6, 2, 6, 6, 1]
print(rolls.count(6))
print(rolls.count(5))
print(rolls.index(6))`,
    },
    {
      type: "heading",
      text: "Sorting a list or getting a sorted copy",
    },
    {
      type: "prose",
      body: "`sort()` puts the items of a list in order: smallest first for numbers, alphabetical for strings. It changes the list itself and gives back `None`. Adding the option `reverse=True`, written like the `sep=` option of `print()`, orders from largest to smallest. The separate `reverse()` method flips the current order without sorting anything.",
    },
    {
      type: "prose",
      body: "Often you want an ordered version and also want to keep the original order. The built-in function `sorted()` builds a new sorted list and leaves the original untouched. It accepts `reverse=True` as well.",
    },
    {
      type: "example",
      code: `scores = [88, 72, 95, 60]
ranked = sorted(scores, reverse=True)
print(ranked)
print(scores)
scores.sort()
print(scores)
scores.reverse()
print(scores)`,
    },
    {
      type: "exercise",
      id: "list-methods-2",
      prompt:
        "The list prices holds four prices. Print a copy sorted from highest to lowest using sorted(), then print the original list to show it did not change. The output should be exactly two lines: [30, 12, 8, 5] and then [12, 5, 30, 8]",
      starterCode: `prices = [12, 5, 30, 8]
# print a sorted copy, highest first, then the original list
`,
      check: { type: "stdout-exact", expected: "[30, 12, 8, 5]\n[12, 5, 30, 8]" },
      solution: `prices = [12, 5, 30, 8]
print(sorted(prices, reverse=True))
print(prices)
`,
      hint: "sorted(prices, reverse=True) gives a new list. Print it, then print prices itself.",
    },
    {
      type: "heading",
      text: "A second name or a real copy",
    },
    {
      type: "prose",
      body: "Writing `same = playlist` does not copy the list. It gives the same list a second name, and a second name for the same value is called an alias. Any change made through one name shows up through the other, because there is only one list.",
    },
    {
      type: "prose",
      body: "In Variables & Types, giving `a` a new value after `b = a` left `b` unchanged, and assigning a new value still works that way. The `=` sign always gives a second name for the same value; with numbers and strings you cannot tell, because they are never changed in place. A list can be changed in place, by a method such as `append()`, and since both names refer to that one list, both see the change.",
    },
    {
      type: "prose",
      body: "To get an independent list, make a copy. The `copy()` method and a slice of the whole list, `[:]`, both build a new list with the same items. So does the `list()` function, which converts a value to a list the way `int()` converts to a whole number.",
    },
    {
      type: "example",
      code: `playlist = ["Intro", "Verse"]
same = playlist
copied = playlist.copy()
sliced = playlist[:]
listed = list(playlist)
playlist.append("Chorus")
print(playlist)
print(same)
print(copied)
print(sliced)
print(listed)`,
    },
    {
      type: "exercise",
      id: "list-methods-3",
      prompt:
        "This program is meant to save a backup of the days before adding Thu, but both lines print four days. Fix the second line so backup is a real copy. The output should be exactly two lines: ['Mon', 'Tue', 'Wed', 'Thu'] and then ['Mon', 'Tue', 'Wed']",
      starterCode: `days = ["Mon", "Tue", "Wed"]
backup = days
days.append("Thu")
print(days)
print(backup)
`,
      check: {
        type: "stdout-exact",
        expected: "['Mon', 'Tue', 'Wed', 'Thu']\n['Mon', 'Tue', 'Wed']",
      },
      solution: `days = ["Mon", "Tue", "Wed"]
backup = days.copy()
days.append("Thu")
print(days)
print(backup)
`,
      hint: "backup = days makes an alias. Call the copy() method on days instead.",
    },
    {
      type: "heading",
      text: "Turning text into lists and back",
    },
    {
      type: "prose",
      body: "`split()` is a string method that cuts text into a list of strings. With nothing in the parentheses, it splits wherever there are spaces, tabs, or line breaks, and ignores extra spaces. Given a separator, as in `split(\",\")`, it cuts at each comma. The pieces are always strings, so convert numbers with `int()` before doing math with them.",
    },
    {
      type: "prose",
      body: "`join()` goes the other way. You call it on the separator and give it a list of strings: `\", \".join(names)` places a comma and a space between the names. `splitlines()` gives a list with one item per line of the text, which suits text written in triple quotes.",
    },
    {
      type: "example",
      code: `sentence = "the quick  brown fox"
words = sentence.split()
print(words)
print(len(words))

record = "Ada,36,London"
print(record.split(","))

print(" - ".join(["red", "green", "blue"]))

poem = """Roses are red
Violets are blue"""
print(poem.splitlines())`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Storing the result of `sort()` is the most common mistake. `scores = scores.sort()` leaves `scores` holding `None`, because `sort()` changes the list and gives nothing back. Call `scores.sort()` on its own line, or use `sorted()` when you want a new list.",
    },
    {
      type: "prose",
      body: "`join()` accepts only strings, so `\", \".join([1, 2, 3])` fails with a `TypeError`. Sorting also puts every capital letter before every lowercase letter, so `\"Zoe\"` sorts ahead of `\"ada\"`. And remember that `=` never copies a list; use `copy()` when you need a separate one.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`insert()`, `extend()`, `remove()`, `pop()`, and `del` add and remove items, while `count()` and `index()` search. `sort()` and `reverse()` change the list itself, and `sorted()` builds a new sorted list. Assigning a list to another name makes an alias, and `copy()` or `[:]` makes a real copy. `split()` and `splitlines()` turn text into a list, and `join()` turns a list of strings back into text.",
    },
    {
      type: "exercise",
      id: "list-methods-4",
      prompt:
        "The variable line holds four names separated by commas. Split it into a list, sort the list alphabetically, and print exactly two lines: the number of names, then the sorted names joined with a comma and a space. The output should be: 4 and then Ada, Alan, Grace, Linus",
      starterCode: `line = "Grace,Ada,Linus,Alan"
# split, sort, and print the two lines
`,
      check: { type: "stdout-exact", expected: "4\nAda, Alan, Grace, Linus" },
      solution: `line = "Grace,Ada,Linus,Alan"
names = line.split(",")
names.sort()
print(len(names))
print(", ".join(names))
`,
      hint: "split(\",\") gives a list of names. Sort it with sort(), count it with len(), and call join() on the string \", \".",
    },
  ],
};

export default {
  slug: "collections-module",
  title: "The collections Module",
  unit: "Modules & Standard Library",
  blocks: [
    {
      type: "prose",
      body: "Lists, tuples, sets, and dictionaries handle most jobs. The `collections` module adds four specialized containers, each made for a task you have already done by hand: counting items, grouping items, managing a line of waiting items, and naming the parts of a tuple. Each one turns a few lines of careful code into one clear line.",
    },
    {
      type: "heading",
      text: "Counting with Counter",
    },
    {
      type: "prose",
      body: "A `Counter` is a dictionary that counts. Give it a list, or any other iterable, and it maps each different item to the number of times that item appears. You bring it in with `from collections import Counter`. It replaces the counting loop you wrote in the dictionary lessons.",
    },
    {
      type: "prose",
      body: "Looking up an item that never appeared gives 0 instead of a `KeyError`. The `most_common(n)` method returns a list of the n most frequent items as (item, count) tuples, most frequent first. Without a number, it returns every item in that order.",
    },
    {
      type: "example",
      code: `from collections import Counter

votes = ["tea", "coffee", "tea", "juice", "tea", "coffee"]
counts = Counter(votes)
print(counts)
print(counts["tea"], counts["water"])
print(counts.most_common(2))

print(Counter("banana"))`,
    },
    {
      type: "prose",
      body: "A string is an iterable of characters, so `Counter(\"banana\")` counts letters. A `Counter` also supports the usual dictionary tools, such as `items()`, `in`, and `counts[\"tea\"] += 1`.",
    },
    {
      type: "exercise",
      id: "collections-module-1",
      prompt:
        "Use Counter to count the colors in the list, then print the result of calling most_common(2) on it. The output should be exactly: [('red', 3), ('blue', 2)]",
      starterCode: `from collections import Counter

colors = ["red", "blue", "red", "green", "blue", "red"]
# count the colors, then print the two most common
`,
      check: { type: "stdout-exact", expected: "[('red', 3), ('blue', 2)]" },
      solution: `from collections import Counter

colors = ["red", "blue", "red", "green", "blue", "red"]
counts = Counter(colors)
print(counts.most_common(2))
`,
      hint: "Store Counter(colors) in a variable, then print that variable's most_common(2).",
    },
    {
      type: "heading",
      text: "Grouping with defaultdict",
    },
    {
      type: "prose",
      body: "A `defaultdict` is a dictionary that creates missing values for you. When you create one, you give it a function, such as `list` or `int`. When you look up a key that is not there yet, it calls that function with no arguments, stores the result under the key, and hands it back. `list()` gives an empty list and `int()` gives 0.",
    },
    {
      type: "prose",
      body: "This removes the check-or-create step from the grouping and totalling patterns you wrote with `setdefault()` and `get()`. With `defaultdict(list)` you can append straight away, and with `defaultdict(int)` you can add straight away. Printing one shows the function first; pass it to `dict()` to get an ordinary dictionary.",
    },
    {
      type: "example",
      code: `from collections import defaultdict

by_letter = defaultdict(list)
for name in ["Ada", "Alan", "Grace", "Guido", "Linus"]:
    by_letter[name[0]].append(name)
print(by_letter)
print(dict(by_letter))

totals = defaultdict(int)
for category, price in [("fruit", 3), ("bread", 2), ("fruit", 4)]:
    totals[category] += price
print(dict(totals))`,
    },
    {
      type: "exercise",
      id: "collections-module-2",
      prompt:
        "Write a function group_by_length(words) that returns a dictionary mapping each word length to a list of the words with that length, in the order they appear. For example, group_by_length([\"hi\", \"sun\", \"go\"]) gives {2: ['hi', 'go'], 3: ['sun']}. Returning a defaultdict is fine.",
      starterCode: `from collections import defaultdict

def group_by_length(words):
    # create a defaultdict(list), fill it, and return it
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "dict(group_by_length(['hi', 'sun', 'go']))", expected: "{2: ['hi', 'go'], 3: ['sun']}" },
          {
            call: "dict(group_by_length(['tea', 'milk', 'jam', 'bread', 'eggs']))",
            expected: "{3: ['tea', 'jam'], 4: ['milk', 'eggs'], 5: ['bread']}",
          },
          { call: "dict(group_by_length([]))", expected: "{}" },
        ],
      },
      solution: `from collections import defaultdict

def group_by_length(words):
    groups = defaultdict(list)
    for word in words:
        groups[len(word)].append(word)
    return groups
`,
      hint: "Inside a for loop over words, append each word to groups[len(word)]. The defaultdict creates the empty list the first time a length appears.",
    },
    {
      type: "heading",
      text: "Queues with deque",
    },
    {
      type: "prose",
      body: "A deque, pronounced \"deck\", is a sequence built for adding and removing items at both ends. `append()` and `pop()` work on the right end, as they do for a list, and `appendleft()` and `popleft()` work on the left end. Removing the first item of a long list is slow, because every other item has to shift one place, but a deque does it quickly.",
    },
    {
      type: "prose",
      body: "That makes a deque a good fit for a queue, where items are served in the order they arrived: add on the right, take from the left. A deque created with `maxlen=3` holds at most three items. Adding a fourth drops the item at the other end, which suits keeping only the most recent few.",
    },
    {
      type: "example",
      code: `from collections import deque

line = deque(["Ada", "Alan"])
line.append("Grace")
line.appendleft("Linus")
print(line)
print(line.popleft())
print(line)

recent = deque(maxlen=3)
for page in ["home", "shop", "cart", "checkout", "receipt"]:
    recent.append(page)
print(recent)`,
    },
    {
      type: "heading",
      text: "Named tuples",
    },
    {
      type: "prose",
      body: "A tuple such as `(3, 4)` does not say what its parts mean, and code full of `point[0]` and `point[1]` is hard to read. `namedtuple()` creates a new tuple type whose positions also have names. You give it the type's name and a list of field names, and it gives back a class, which you store in a variable with the same name.",
    },
    {
      type: "prose",
      body: "An instance behaves like an ordinary tuple: you can index it, unpack it, and compare it with a tuple, and it cannot be changed. You can also reach each part by name, as in `p.x`, and printing it shows the field names.",
    },
    {
      type: "example",
      code: `from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p)
print(p.x, p[1])
x, y = p
print(x + y)

Book = namedtuple("Book", ["title", "author", "year"])
dune = Book("Dune", "Frank Herbert", 1965)
print(dune.title, dune.year)`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Looking up a missing key in a `defaultdict` adds that key. Even `print(by_letter[\"Z\"])` stores an empty list under `\"Z\"`, so use `in` when you only want to check whether a key exists. A `Counter` does not do this: reading a missing count gives 0 without storing anything.",
    },
    {
      type: "prose",
      body: "Writing `defaultdict(list())` instead of `defaultdict(list)` passes an empty list instead of the function, and Python stops with `TypeError: first argument must be callable or None`. And because named tuples cannot be changed, `p.x = 5` stops with `AttributeError: can't set attribute`; create a new instance instead.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`Counter` counts the items of an iterable, and `most_common()` lists them from most to least frequent. `defaultdict` creates a missing value by calling the function you gave it, which makes grouping and totalling short. `deque` adds and removes quickly at both ends and can keep only the last few items with `maxlen`. `namedtuple()` makes tuple types whose parts have names.",
    },
    {
      type: "exercise",
      id: "collections-module-3",
      prompt:
        "Create a named tuple type Score with the fields name and points. Then write a function best(results) that takes a list of (name, points) tuples, turns each one into a Score, and returns the Score with the most points. For example, best([(\"Ada\", 82), (\"Alan\", 91)]) returns Score(name='Alan', points=91).",
      starterCode: `from collections import namedtuple

# create the Score type and write best(results) here
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "best([('Ada', 82), ('Alan', 91), ('Grace', 88)])",
            expected: "Score(name='Alan', points=91)",
          },
          { call: "best([('Linus', 70)]).name", expected: "'Linus'" },
          { call: "Score('Ada', 5).points", expected: "5" },
        ],
      },
      solution: `from collections import namedtuple

Score = namedtuple("Score", ["name", "points"])

def best(results):
    scores = [Score(name, points) for name, points in results]
    return max(scores, key=lambda score: score.points)
`,
      hint: "Write Score = namedtuple(\"Score\", [\"name\", \"points\"]) first. In best(), build a list of Score values with a comprehension, then use max() with key=lambda score: score.points.",
    },
  ],
};

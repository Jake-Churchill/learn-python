export default {
  slug: "sets",
  title: "Sets",
  unit: "Collections",
  blocks: [
    {
      type: "prose",
      body: "A guest list should not name the same person twice, and checking whether someone is on it should be quick. A set is a collection built for exactly that. It keeps each value only once and answers the question \"is this value in here?\" quickly. Sets can also compare two groups, telling you what they share and how they differ.",
    },
    {
      type: "heading",
      text: "Creating a set",
    },
    {
      type: "prose",
      body: "You create a set by writing values between curly braces: `colors = {\"red\", \"green\"}`. A set keeps each value only once, so duplicates disappear as soon as the set is made. The `set()` function converts a list into a set, which is the quickest way to remove repeated values. The type of a set is `set`.",
    },
    {
      type: "prose",
      body: "A set has no order. Python may print its items in any order, and that order can change from one run to the next, so this course prints sets through `sorted()`, which gives back a sorted list. For the same reason a set has no indexes, so `colors[0]` raises a `TypeError`.",
    },
    {
      type: "example",
      code: `colors = {"red", "green", "red", "blue", "green"}
print(len(colors))
print(sorted(colors))

visits = ["Ada", "Alan", "Ada", "Grace", "Alan", "Ada"]
visitors = set(visits)
print(len(visits), "visits from", len(visitors), "people")
print(sorted(visitors))
print(type(visitors))`,
    },
    {
      type: "prose",
      body: "An empty set must be written `set()`. Empty curly braces, `{}`, make a different kind of collection called a dictionary, which you will meet in the next lesson.",
    },
    {
      type: "exercise",
      id: "sets-1",
      prompt:
        "The list numbers contains repeated values. On the empty line, create a set called unique_nums from numbers, so the last line prints how many different values there are. The output should be exactly: 3",
      starterCode: `numbers = [1, 2, 2, 3, 3, 3]
# create a set called unique_nums from numbers on the next line

print(len(unique_nums))
`,
      check: { type: "stdout-exact", expected: "3" },
      solution: `numbers = [1, 2, 2, 3, 3, 3]
unique_nums = set(numbers)
print(len(unique_nums))
`,
      hint: "Give the list to the set() function and store the result in unique_nums.",
    },
    {
      type: "heading",
      text: "Adding and removing items",
    },
    {
      type: "prose",
      body: "The `add()` method puts one value into a set, and adding a value that is already there changes nothing. `remove()` takes a value out. If the value is missing, `remove()` raises a `KeyError`, the error Python uses when it cannot find the value it was asked to look up.",
    },
    {
      type: "prose",
      body: "`discard()` also takes a value out, but quietly does nothing when the value is missing. Use `discard()` when all you need is for the value to be gone. Use `remove()` when a missing value would mean a mistake you want to hear about.",
    },
    {
      type: "example",
      code: `tags = {"python", "beginner"}
tags.add("loops")
tags.add("python")
print(sorted(tags))
tags.discard("beginner")
tags.discard("advanced")
print(sorted(tags))`,
    },
    {
      type: "example",
      code: `tags = {"python", "loops"}
tags.remove("advanced")`,
      showsError: true,
    },
    {
      type: "exercise",
      id: "sets-2",
      prompt:
        "The set guests holds a party's guest list. Grace has accepted, so add her. Alan and Linus have cancelled, so take both out, but Linus was never on the list, and the program must not stop with an error. Then print the set through sorted(). The output should be exactly: ['Ada', 'Grace']",
      starterCode: `guests = {"Ada", "Alan"}
# add Grace, take out Alan and Linus, then print the sorted guests
`,
      check: { type: "stdout-exact", expected: "['Ada', 'Grace']" },
      solution: `guests = {"Ada", "Alan"}
guests.add("Grace")
guests.discard("Alan")
guests.discard("Linus")
print(sorted(guests))
`,
      hint: "remove() raises a KeyError for a missing value, so use the method that quietly does nothing instead.",
    },
    {
      type: "heading",
      text: "Combining and comparing sets",
    },
    {
      type: "prose",
      body: "Three operators compare two sets and build a new one. The union, written `a | b`, holds every value that is in either set. The intersection, `a & b`, holds only the values that are in both. The difference, `a - b`, holds the values in `a` that are not in `b`.",
    },
    {
      type: "prose",
      body: "Each operator has a method that reads more like English: `a.union(b)`, `a.intersection(b)`, and `a.difference(b)` give the same results. None of them change the sets you started with.",
    },
    {
      type: "example",
      code: `chess = {"Ada", "Alan", "Grace"}
drama = {"Grace", "Linus", "Ada", "Guido"}
print(sorted(chess | drama))
print(sorted(chess & drama))
print(sorted(chess - drama))
print(sorted(drama - chess))
print(sorted(chess.intersection(drama)))`,
    },
    {
      type: "heading",
      text: "Fast membership checks",
    },
    {
      type: "prose",
      body: "The `in` operator works on sets, and it is fast. To check `in` on a list, Python compares the value with each item in turn, so a longer list takes longer. A set is stored in a way that lets Python go almost straight to where the value would be. The check takes about the same time whether the set holds ten items or ten million.",
    },
    {
      type: "prose",
      body: "With a few dozen items you will never notice the difference. It matters when a program checks membership many times against a large collection, such as checking every word of a book against a set of known words.",
    },
    {
      type: "example",
      code: `banned = {"spam", "scam", "fake"}
words = "this is not a scam or spam".split()
for word in words:
    if word in banned:
        print("Blocked word:", word)`,
    },
    {
      type: "heading",
      text: "When to use a set",
    },
    {
      type: "prose",
      body: "Use a set when you care whether a value is present, not where it is or how many times it appears: removing duplicates, remembering what you have already seen, or comparing two groups. Use a list when order matters, when duplicates matter, or when you need to reach items by index. The two often work together, as in the next example, which keeps the first order of each drink while a set remembers what it has seen.",
    },
    {
      type: "example",
      code: `orders = ["tea", "coffee", "tea", "juice", "coffee"]
seen = set()
first_orders = []
for drink in orders:
    if drink not in seen:
        seen.add(drink)
        first_orders.append(drink)
print(first_orders)`,
    },
    {
      type: "prose",
      body: "A set can only hold values that cannot change, such as numbers, strings, and tuples of those. Putting a list in a set raises a `TypeError` whose message begins `cannot use 'list' as a set element`, because a list could change after it was stored.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Writing `{}` for an empty set is the most common mistake. It makes an empty dictionary instead, so write `set()`. Expecting a set to keep your order is the next most common: sort it whenever the order of the output matters.",
    },
    {
      type: "prose",
      body: "Indexing a set, as in `colors[0]`, fails with `TypeError: 'set' object is not subscriptable`, where subscript is the technical name for a square-bracket index. And `remove()` raises a `KeyError` for a missing value, so use `discard()` when the value may not be there.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A set holds each value once, in no particular order, and `set()` turns a list into a set. `add()`, `remove()`, and `discard()` change a set, and `|`, `&`, and `-` build the union, intersection, and difference of two sets. Checking `in` on a set is fast, so sets suit duplicate removal, membership checks, and comparing groups.",
    },
    {
      type: "exercise",
      id: "sets-3",
      prompt:
        "The sets chess and drama hold the members of two clubs. Print exactly three lines, each a sorted list: the members in both clubs, then the members in at least one club, then the members only in the chess club. The output should be: ['Ada', 'Grace'], then ['Ada', 'Alan', 'Grace', 'Guido', 'Linus', 'Margaret'], then ['Alan', 'Linus']",
      starterCode: `chess = {"Ada", "Alan", "Grace", "Linus"}
drama = {"Grace", "Guido", "Ada", "Margaret"}
# print the three sorted lists
`,
      check: {
        type: "stdout-exact",
        expected:
          "['Ada', 'Grace']\n['Ada', 'Alan', 'Grace', 'Guido', 'Linus', 'Margaret']\n['Alan', 'Linus']",
      },
      solution: `chess = {"Ada", "Alan", "Grace", "Linus"}
drama = {"Grace", "Guido", "Ada", "Margaret"}
print(sorted(chess & drama))
print(sorted(chess | drama))
print(sorted(chess - drama))
`,
      hint: "Both clubs is the intersection (&), at least one club is the union (|), and only chess is the difference chess - drama. Wrap each in sorted() inside print().",
    },
  ],
};

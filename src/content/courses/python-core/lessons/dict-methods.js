export default {
  slug: "dict-methods",
  title: "Dictionary Methods & Patterns",
  unit: "Collections",
  blocks: [
    {
      type: "prose",
      body: "The last lesson used square brackets for everything: looking up, adding, and changing values. Dictionaries also have methods that make common jobs shorter and safer, such as looking up a key that might be missing. This lesson covers those methods and two patterns you will use constantly, counting things and grouping things.",
    },
    {
      type: "heading",
      text: "Safe lookups with get",
    },
    {
      type: "prose",
      body: "`get()` looks up a key the way square brackets do, but gives back `None` instead of raising a `KeyError` when the key is missing. You can also give it a default as a second value in the parentheses, as in `ages.get(\"Grace\", 0)`, and it gives back that default for a missing key. `get()` only reads; it never adds the key to the dictionary.",
    },
    {
      type: "example",
      code: `ages = {"Ada": 36, "Alan": 41}
print(ages.get("Ada"))
print(ages.get("Grace"))
print(ages.get("Grace", "unknown"))
print(ages)`,
    },
    {
      type: "exercise",
      id: "dict-methods-1",
      prompt:
        "The first print() looks up France with get() and a default. Add a second print() that looks up Peru the same way, with the default \"not listed\". The output should be exactly two lines: Paris and then not listed",
      starterCode: `capitals = {"France": "Paris", "Japan": "Tokyo"}
print(capitals.get("France", "not listed"))
# look up Peru the same way
`,
      check: { type: "stdout-exact", expected: "Paris\nnot listed" },
      solution: `capitals = {"France": "Paris", "Japan": "Tokyo"}
print(capitals.get("France", "not listed"))
print(capitals.get("Peru", "not listed"))
`,
      hint: "Copy the first print() line and change the key to \"Peru\".",
    },
    {
      type: "heading",
      text: "Keys, values, and items",
    },
    {
      type: "prose",
      body: "Three methods hand you parts of a dictionary. `keys()` gives the keys, `values()` gives the values, and `items()` gives each pair as a (key, value) tuple. You can loop over any of them, and `list()` turns any of them into a real list.",
    },
    {
      type: "prose",
      body: "`items()` is the one you will use most. Unpacking each pair in the loop header gives you the key and the value together, with no separate lookup. `values()` works with `sum()`, `min()`, and `max()`, and `in` on `values()` checks the values instead of the keys.",
    },
    {
      type: "example",
      code: `scores = {"Ada": 92, "Grace": 88, "Alan": 75}
print(list(scores.keys()))
print(list(scores.values()))
print(list(scores.items()))
for name, score in scores.items():
    print(f"{name} scored {score}")
print(sum(scores.values()))
print(88 in scores.values())`,
    },
    {
      type: "exercise",
      id: "dict-methods-2",
      prompt:
        "The dictionary highs maps days to high temperatures. Loop over items() to print each day and temperature as Mon: 18, then print the warmest temperature using max() on the values. The output should be exactly four lines: Mon: 18, then Tue: 24, then Wed: 21, then Warmest: 24",
      starterCode: `highs = {"Mon": 18, "Tue": 24, "Wed": 21}
# print each day and temperature, then the warmest temperature
`,
      check: {
        type: "stdout-exact",
        expected: "Mon: 18\nTue: 24\nWed: 21\nWarmest: 24",
      },
      solution: `highs = {"Mon": 18, "Tue": 24, "Wed": 21}
for day, temp in highs.items():
    print(f"{day}: {temp}")
print("Warmest:", max(highs.values()))
`,
      hint: "Write for day, temp in highs.items(): and print both inside the loop. After the loop, max(highs.values()) gives the warmest.",
    },
    {
      type: "heading",
      text: "Updating, popping, and merging",
    },
    {
      type: "prose",
      body: "`update()` copies every pair from another dictionary into this one, adding new keys and replacing the values of existing ones. `pop()` removes a key and gives back its value, as `pop()` does for lists. Given a default as a second value, `pop()` gives that back instead of raising a `KeyError` when the key is missing.",
    },
    {
      type: "prose",
      body: "The `|` operator merges two dictionaries into a new one and leaves both originals alone. When both have the same key, the value from the dictionary on the right wins. That makes it a neat way to lay a person's own choices over the default settings.",
    },
    {
      type: "example",
      code: `settings = {"theme": "light", "font_size": 12}
settings.update({"font_size": 14, "language": "en"})
print(settings)

removed = settings.pop("language")
print(removed)
print(settings.pop("volume", "not set"))
print(settings)

defaults = {"theme": "light", "font_size": 12, "sound": True}
choices = {"theme": "dark"}
final = defaults | choices
print(final)
print(defaults)`,
    },
    {
      type: "heading",
      text: "Counting with a dictionary",
    },
    {
      type: "prose",
      body: "To count how often each value appears, use a dictionary whose keys are the values and whose values are the counts. For each item, `counts.get(item, 0)` gives the count so far, or 0 the first time the item appears. Adding 1 and storing the result under the same key records the new count, all in one line.",
    },
    {
      type: "example",
      code: `votes = ["tea", "coffee", "tea", "juice", "tea", "coffee"]
counts = {}
for vote in votes:
    counts[vote] = counts.get(vote, 0) + 1
print(counts)`,
    },
    {
      type: "prose",
      body: "Without `get()`, the same count needs an `if`: check whether the key is in the dictionary, store 1 the first time, and add 1 every other time. `get()` with a default of 0 folds that check into the lookup.",
    },
    {
      type: "prose",
      body: "To find the most common item, loop over `items()` and keep a running maximum, the pattern from the Loops unit. Track both the best item and its count, and replace them whenever a bigger count comes along.",
    },
    {
      type: "example",
      code: `counts = {"tea": 3, "coffee": 2, "juice": 1}
favorite = ""
most = 0
for drink, count in counts.items():
    if count > most:
        favorite = drink
        most = count
print(favorite, "won with", most, "votes")`,
    },
    {
      type: "exercise",
      id: "dict-methods-3",
      prompt:
        "Split the sentence into words and count how often each word appears, using a dictionary called counts and get() with a default of 0. Then print the dictionary. The output should be exactly: {'the': 3, 'cat': 1, 'and': 2, 'dog': 1, 'bird': 1}",
      starterCode: `sentence = "the cat and the dog and the bird"
counts = {}
# split the sentence, count each word, then print counts
`,
      check: {
        type: "stdout-exact",
        expected: "{'the': 3, 'cat': 1, 'and': 2, 'dog': 1, 'bird': 1}",
      },
      solution: `sentence = "the cat and the dog and the bird"
counts = {}
for word in sentence.split():
    counts[word] = counts.get(word, 0) + 1
print(counts)
`,
      hint: "Loop over sentence.split(). Inside the loop, use the same line as the votes example, with word in place of vote.",
    },
    {
      type: "heading",
      text: "Grouping with setdefault",
    },
    {
      type: "prose",
      body: "Grouping collects items into lists by something they share, such as names by their first letter. `setdefault(key, default)` gives back the value stored under `key` if there is one. If there is not, it first stores `default` under that key and then gives it back.",
    },
    {
      type: "prose",
      body: "With an empty list as the default, `groups.setdefault(letter, []).append(name)` does all the work. The first time a letter appears, `setdefault()` stores a new empty list for it and `append()` adds the name. Every later time, the existing list comes back and the name joins it.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace", "Alan", "Guido", "Linus"]
groups = {}
for name in names:
    letter = name[0]
    groups.setdefault(letter, []).append(name)
print(groups)`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Expecting `get()` to change the dictionary is a common mistake. `counts.get(\"tea\", 0) + 1` on its own line calculates a number and then discards it. Store it with `counts[\"tea\"] = counts.get(\"tea\", 0) + 1`.",
    },
    {
      type: "prose",
      body: "Printing `keys()`, `values()`, or `items()` directly shows a label, as in `dict_keys(['Ada', 'Grace'])`; wrap it in `list()` when you need a plain list. And `|` builds a new dictionary that you must store, while `update()` changes the dictionary itself and gives back `None`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`get()` looks up a key with a fallback instead of an error, and `keys()`, `values()`, and `items()` hand out the parts of a dictionary for loops. `update()` and `|` combine dictionaries, and `pop()` removes a key and gives back its value. Counting uses `counts[item] = counts.get(item, 0) + 1`, and grouping uses `setdefault(key, []).append(item)`.",
    },
    {
      type: "exercise",
      id: "dict-methods-4",
      prompt:
        "The dictionary grades maps each student to a letter grade. Build a new dictionary called by_grade that maps each letter grade to a list of the students who earned it, in the order they appear in grades. Then print by_grade. The output should be exactly: {'A': ['Ada', 'Alan'], 'B': ['Grace', 'Guido'], 'C': ['Linus']}",
      starterCode: `grades = {"Ada": "A", "Grace": "B", "Alan": "A", "Linus": "C", "Guido": "B"}
# group the students by grade, then print by_grade
`,
      check: {
        type: "stdout-exact",
        expected: "{'A': ['Ada', 'Alan'], 'B': ['Grace', 'Guido'], 'C': ['Linus']}",
      },
      solution: `grades = {"Ada": "A", "Grace": "B", "Alan": "A", "Linus": "C", "Guido": "B"}
by_grade = {}
for name, grade in grades.items():
    by_grade.setdefault(grade, []).append(name)
print(by_grade)
`,
      hint: "Start with by_grade = {}. Loop over grades.items() to get each name and grade, then use setdefault(grade, []) and append the name.",
    },
  ],
};

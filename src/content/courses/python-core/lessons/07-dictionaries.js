export default {
  slug: "dictionaries",
  title: "Dictionaries",
  unit: "Collections",
  blocks: [
    {
      type: "prose",
      body: "A list finds items by position, but often you want to find something by name: the price of coffee, the phone number for Ada, the score for each player. A dictionary stores values under labels you choose, so you can look them up directly without knowing where they sit.",
    },
    {
      type: "heading",
      text: "Keys and values",
    },
    {
      type: "prose",
      body: "A dictionary is a collection of key-value pairs. The key is the label you look things up by, and the value is the information stored under it. You write a dictionary in curly braces, with a colon between each key and its value and commas between the pairs. Its type is `dict`, short for dictionary.",
    },
    {
      type: "prose",
      body: "Keys are usually strings, but numbers work too, and each key can appear only once. Values can be any type, including lists. A dictionary remembers the order in which its pairs were added and prints them in that order.",
    },
    {
      type: "example",
      code: `prices = {"coffee": 3.5, "bagel": 2.25, "juice": 4.0}
person = {"name": "Ada", "age": 36, "languages": ["English", "French"]}
empty = {}
print(prices)
print(person)
print(empty)
print(type(prices))`,
    },
    {
      type: "heading",
      text: "Looking up a value",
    },
    {
      type: "prose",
      body: "You look up a value by writing its key in square brackets: `prices[\"coffee\"]` gives `3.5`. This looks like indexing a list, but the thing inside the brackets is a key, not a position. A dictionary has no positions, so `prices[0]` would look for a key that is the number 0.",
    },
    {
      type: "example",
      code: `prices = {"coffee": 3.5, "bagel": 2.25, "juice": 4.0}
print(prices["coffee"])
print(prices["bagel"] * 2)`,
    },
    {
      type: "prose",
      body: "Asking for a key that does not exist stops the program with a `KeyError`, the error you met when removing a missing value from a set. The last line of the message names the missing key, here `KeyError: 'tea'`, which makes typos easy to spot.",
    },
    {
      type: "example",
      code: `prices = {"coffee": 3.5, "bagel": 2.25}
print(prices["tea"])`,
      showsError: true,
    },
    {
      type: "heading",
      text: "Adding, updating, and deleting",
    },
    {
      type: "prose",
      body: "Assigning to a key adds a new pair if the key is new, and replaces the value if the key already exists. Because keys are unique, there is never a second copy of a key. Writing `del` before a lookup, as in `del prices[\"bagel\"]`, removes that pair, and raises a `KeyError` if the key is missing.",
    },
    {
      type: "example",
      code: `prices = {"coffee": 3.5, "bagel": 2.25}
prices["tea"] = 2.75
prices["coffee"] = 3.75
del prices["bagel"]
print(prices)
prices["coffee"] += 0.25
print(prices["coffee"])`,
    },
    {
      type: "prose",
      body: "The last two lines show that a value stored in a dictionary works like any variable. `prices[\"coffee\"] += 0.25` reads the old value, adds to it, and stores the result under the same key.",
    },
    {
      type: "heading",
      text: "What can be a key",
    },
    {
      type: "prose",
      body: "Keys must be values that cannot change, the same rule a set follows for its items. Strings, numbers, and tuples of those work as keys. A list does not, and using one raises a `TypeError` whose message begins `cannot use 'list' as a dict key`. Tuple keys are handy when a label has two parts, such as a row and a column on a game board.",
    },
    {
      type: "example",
      code: `board = {(0, 0): "rook", (0, 4): "king", (7, 4): "queen"}
print(board[(0, 4)])
print(board[(7, 4)])
board[(3, 3)] = "knight"
print(board)`,
    },
    {
      type: "exercise",
      id: "dictionaries-1",
      prompt:
        "The dictionary book holds one pair. Add a key \"author\" with the value \"Herbert\", then print the dictionary. The output should be exactly: {'title': 'Dune', 'author': 'Herbert'}",
      starterCode: `book = {"title": "Dune"}
# add the author, then print the dictionary
`,
      check: { type: "stdout-exact", expected: "{'title': 'Dune', 'author': 'Herbert'}" },
      solution: `book = {"title": "Dune"}
book["author"] = "Herbert"
print(book)
`,
      hint: "Write the new key in square brackets after book, then = and the value.",
    },
    {
      type: "heading",
      text: "Checking keys with in and len",
    },
    {
      type: "prose",
      body: "The `in` operator checks whether a key exists, which lets you avoid a `KeyError` before it happens. It checks keys only: `\"apples\" in stock` is `True`, but `12 in stock` is `False` even though 12 is one of the values. `len()` counts the pairs, and an empty dictionary is falsy, just like an empty list.",
    },
    {
      type: "example",
      code: `stock = {"apples": 12, "pears": 0}
item = "plums"
if item in stock:
    print(item, "in stock:", stock[item])
else:
    print("We do not sell", item)
print(len(stock))
print(12 in stock)`,
    },
    {
      type: "exercise",
      id: "dictionaries-2",
      prompt:
        "Update the dictionary stock in three steps: add 6 to the pears, delete plums, and add a new key \"figs\" with the value 8. Then print the dictionary and its number of pairs. The output should be exactly two lines: {'apples': 12, 'pears': 11, 'figs': 8} and then 3",
      starterCode: `stock = {"apples": 12, "pears": 5, "plums": 0}
# add 6 pears, delete plums, add figs, then print stock and its length
`,
      check: {
        type: "stdout-exact",
        expected: "{'apples': 12, 'pears': 11, 'figs': 8}\n3",
      },
      solution: `stock = {"apples": 12, "pears": 5, "plums": 0}
stock["pears"] += 6
del stock["plums"]
stock["figs"] = 8
print(stock)
print(len(stock))
`,
      hint: "Use += on stock[\"pears\"], del on stock[\"plums\"], and assignment for the new key. len(stock) counts the pairs.",
    },
    {
      type: "heading",
      text: "Looping over a dictionary",
    },
    {
      type: "prose",
      body: "A `for` loop over a dictionary gives you its keys, one at a time, in the order they were added. Inside the loop, use the key to look up its value. The next lesson shows methods that hand you each key and value together.",
    },
    {
      type: "prose",
      body: "Loops also build dictionaries. Start with an empty dictionary and assign one key on each pass through the loop. Here `zip()` pairs each name with an age, and each pair becomes a key and its value.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace", "Alan"]
ages = [36, 45, 41]
people = {}
for name, age in zip(names, ages):
    people[name] = age
print(people)`,
    },
    {
      type: "example",
      code: `prices = {"coffee": 3.5, "bagel": 2.25, "juice": 4.0}
total = 0
for item in prices:
    print(f"{item}: \${prices[item]:.2f}")
    total += prices[item]
print(f"Total: \${total:.2f}")`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Looking up a key that is not there is the most common mistake. Keys must match exactly, including capital letters and spaces, so `prices[\"Coffee\"]` raises a `KeyError` when the key is `\"coffee\"`. Check with `in` first whenever a key might be missing.",
    },
    {
      type: "prose",
      body: "Adding or deleting keys inside a loop over the same dictionary fails with `RuntimeError: dictionary changed size during iteration`. Changing the value under a key that already exists is fine. And remember that `in` and `for` work with keys, never with values.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A dictionary stores key-value pairs in curly braces and finds a value by its key in square brackets. A missing key raises a `KeyError`, so check with `in` when unsure. Assigning to a key adds or replaces a pair, `del` removes one, `len()` counts the pairs, and a `for` loop goes through the keys in the order they were added.",
    },
    {
      type: "exercise",
      id: "dictionaries-3",
      prompt:
        "The dictionary stock maps each fruit to how many are in stock. Loop over it and print Out of stock: followed by the name for every fruit with 0 left, in the dictionary's order. Then print the total number of fruit in stock. The output should be exactly three lines: Out of stock: pears, then Out of stock: figs, then Units in stock: 19",
      starterCode: `stock = {"apples": 12, "pears": 0, "plums": 7, "figs": 0}
# report the fruit that is out of stock, then the total
`,
      check: {
        type: "stdout-exact",
        expected: "Out of stock: pears\nOut of stock: figs\nUnits in stock: 19",
      },
      solution: `stock = {"apples": 12, "pears": 0, "plums": 7, "figs": 0}
total = 0
for fruit in stock:
    if stock[fruit] == 0:
        print("Out of stock:", fruit)
    total += stock[fruit]
print("Units in stock:", total)
`,
      hint: "Start a total at 0 before the loop. Inside the loop, stock[fruit] is the count: print the name when it is 0, and add it to the total every time.",
    },
  ],
};

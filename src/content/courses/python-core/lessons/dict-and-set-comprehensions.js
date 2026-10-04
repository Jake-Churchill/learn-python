export default {
  slug: "dict-and-set-comprehensions",
  title: "Dict & Set Comprehensions",
  unit: "Comprehensions & Iteration",
  blocks: [
    {
      type: "prose",
      body: "The comprehension pattern is not limited to lists. With curly braces instead of square brackets, the same one-line pattern builds a dictionary or a set. This lesson shows both, and how Python tells them apart.",
    },
    {
      type: "heading",
      text: "Dictionary comprehensions",
    },
    {
      type: "prose",
      body: "A dictionary comprehension builds a dictionary. It is written in curly braces, and its front part is a key and a value separated by a colon: `{name: len(name) for name in names}`. For each item, Python works out the key, works out the value, and stores the pair.",
    },
    {
      type: "prose",
      body: "The pairs are stored in the order the `for` clause produces them, so the new dictionary follows the order of the collection you looped over. The `for` clause can unpack each item, which makes `zip()` a natural way to pair up two lists as keys and values.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace", "Alan"]
lengths = {name: len(name) for name in names}
print(lengths)

items = ["tea", "cake", "soup"]
prices = [2.5, 3.0, 4.75]
menu = {item: price for item, price in zip(items, prices)}
print(menu)
print(menu["cake"])`,
    },
    {
      type: "exercise",
      id: "dict-and-set-comprehensions-1",
      prompt:
        "Replace the empty dictionary {} with a dictionary comprehension that maps each whole number from 1 to 5 to its square. The program should print exactly: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}",
      starterCode: `squares = {}  # replace {} with a dictionary comprehension
print(squares)
`,
      check: { type: "stdout-exact", expected: "{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}" },
      solution: `squares = {n: n * n for n in range(1, 6)}
print(squares)
`,
      hint: "Loop over range(1, 6). The key is the number itself and the value is the number times itself, with a colon between them.",
    },
    {
      type: "heading",
      text: "Transforming and filtering a dictionary",
    },
    {
      type: "prose",
      body: "Looping over `items()` gives each key and value, and the comprehension can change either one before storing the pair. An `if` clause at the end keeps only some pairs, exactly as in a list comprehension. Together they build a changed or smaller copy of a dictionary in one line, and the original stays as it was.",
    },
    {
      type: "example",
      code: `prices = {"tea": 2.5, "cake": 3.0, "soup": 4.75}
on_sale = {item: round(price * 0.8, 2) for item, price in prices.items()}
print(on_sale)

scores = {"Ada": 92, "Grace": 48, "Alan": 75, "Linus": 39}
passed = {name: score for name, score in scores.items() if score >= 50}
print(passed)

codes = {"FR": "France", "JP": "Japan"}
by_country = {country: code for code, country in codes.items()}
print(by_country)`,
    },
    {
      type: "prose",
      body: "The last part of the example swaps keys and values, turning a lookup from code to country into one from country to code. That works only when the values are all different, because keys must be unique.",
    },
    {
      type: "prose",
      body: "When two items produce the same key, the later value replaces the earlier one, just as assigning to an existing key does, and no error tells you so. The key keeps the position where it first appeared. In the next example, Alan replaces Ada under the key `A`.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace", "Alan"]
by_letter = {name[0]: name for name in names}
print(by_letter)`,
    },
    {
      type: "heading",
      text: "Building a lookup table",
    },
    {
      type: "prose",
      body: "Data often arrives as a list of records, such as a list of dictionaries that each describe one product. Finding one product's price then means looping through the list. A dictionary comprehension turns the list into a lookup table, a dictionary keyed by the field you search on, so later code finds a value in one step.",
    },
    {
      type: "example",
      code: `products = [
    {"name": "lamp", "price": 25, "stock": 4},
    {"name": "mug", "price": 8, "stock": 0},
    {"name": "clock", "price": 19, "stock": 2},
]
price_of = {p["name"]: p["price"] for p in products}
print(price_of)
print(price_of["clock"])

in_stock = {p["name"]: p["stock"] for p in products if p["stock"] > 0}
print(in_stock)`,
    },
    {
      type: "heading",
      text: "Set comprehensions",
    },
    {
      type: "prose",
      body: "A set comprehension is written in curly braces with no colon: `{expression for item in collection}`. It builds a set, so each value appears only once, however many items produce it. Use it when you want the distinct results of a calculation, such as every different word in a sentence once case is ignored.",
    },
    {
      type: "prose",
      body: "A set has no order, so this course prints sets through `sorted()`, as in the Sets lesson. `len()` tells you how many distinct values the set holds.",
    },
    {
      type: "example",
      code: `words = "the cat saw the dog and The bird".split()
print(len(words))
distinct = {word.lower() for word in words}
print(len(distinct))
print(sorted(distinct))
print(sorted({len(word) for word in words}))`,
    },
    {
      type: "exercise",
      id: "dict-and-set-comprehensions-2",
      prompt:
        "The list emails holds email addresses. Use a set comprehension to build a set called domains holding the part of each address after the @, in lowercase. Then print sorted(domains). The output should be exactly: ['kernel.org', 'mail.com', 'navy.mil']",
      starterCode: `emails = ["ada@mail.com", "Grace@Navy.mil", "alan@MAIL.com", "linus@kernel.org"]
# build the set of lowercase domains, then print it sorted
`,
      check: { type: "stdout-exact", expected: "['kernel.org', 'mail.com', 'navy.mil']" },
      solution: `emails = ["ada@mail.com", "Grace@Navy.mil", "alan@MAIL.com", "linus@kernel.org"]
domains = {email.split("@")[1].lower() for email in emails}
print(sorted(domains))
`,
      hint: "email.split(\"@\") gives a list of two parts, and index 1 is the part after the @. Call lower() on it so that MAIL.com and mail.com become the same value.",
    },
    {
      type: "heading",
      text: "Telling the brackets apart",
    },
    {
      type: "prose",
      body: "The brackets and the colon decide what a comprehension builds. Square brackets build a list. Curly braces with a `key: value` at the front build a dictionary, and curly braces with a single expression build a set.",
    },
    {
      type: "example",
      code: `scores = [70, 85, 70, 90]
print([s + 5 for s in scores])
print(sorted({s + 5 for s in scores}))
print({s: s + 5 for s in scores})`,
    },
    {
      type: "prose",
      body: "The set and the dictionary hold three entries each, not four. The two scores of 70 give the same value, which the set keeps once, and the same key, which the dictionary stores once.",
    },
    {
      type: "prose",
      body: "Parentheses do not build a tuple. A comprehension in parentheses makes a different kind of value, which the next lesson covers. And empty curly braces, `{}`, are still an empty dictionary, not an empty set.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Leaving out the colon is the most common mistake. `{len(name) for name in names}` is valid code, but it builds a set of lengths, not a dictionary. If the result prints without any `key: value` pairs, check for the colon.",
    },
    {
      type: "prose",
      body: "Losing data to repeated keys is the next. A dictionary comprehension stores the last value for each key and silently drops the rest. When you swap keys and values, or key items by something short such as a first letter, check that the keys really are unique.",
    },
    {
      type: "prose",
      body: "Finally, do not rely on the order in which a set prints. Sort it when the output order matters, or use a list comprehension if you need to keep the original order and the repeats.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A dictionary comprehension, `{key: value for item in collection if condition}`, builds a dictionary, and looping over `items()` lets it transform or filter another dictionary. When keys repeat, the last value wins. A set comprehension, `{expression for item in collection}`, builds a set of distinct results, and only the colon separates it from a dictionary comprehension.",
    },
    {
      type: "exercise",
      id: "dict-and-set-comprehensions-3",
      prompt:
        "Write a function restock(stock, target). stock is a dictionary mapping item names to how many are on the shelf. Return a new dictionary holding only the items with fewer than target on the shelf, each mapped to how many more are needed to reach target, in their original order. Use a dictionary comprehension. For example, restock({\"apples\": 3, \"pears\": 10, \"plums\": 0}, 5) returns {'apples': 2, 'plums': 5}.",
      starterCode: `def restock(stock, target):
    # return a dictionary comprehension
    pass
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "restock({\"apples\": 3, \"pears\": 10, \"plums\": 0}, 5)",
            expected: "{'apples': 2, 'plums': 5}",
          },
          { call: "restock({\"milk\": 8, \"bread\": 2}, 8)", expected: "{'bread': 6}" },
          { call: "restock({\"eggs\": 12}, 6)", expected: "{}" },
        ],
      },
      solution: `def restock(stock, target):
    return {item: target - count for item, count in stock.items() if count < target}
`,
      hint: "Loop over stock.items() to get each item and its count. The value to store is target - count, and an if clause at the end keeps only the counts below target.",
    },
  ],
};

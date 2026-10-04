export default {
  slug: "any-all-aggregates",
  title: "any, all & Aggregating",
  unit: "Comprehensions & Iteration",
  blocks: [
    {
      type: "prose",
      body: "Many questions about a collection have a one-word or one-number answer: did anyone fail, is every password long enough, what does the cart cost, which product is cheapest? Python's built-in functions answer each of these in one line. Generator expressions feed them exactly the values they need.",
    },
    {
      type: "heading",
      text: "any and all",
    },
    {
      type: "prose",
      body: "`any()` takes an iterable and gives back `True` if at least one of its items is truthy, and `False` otherwise. `all()` gives back `True` only if every item is truthy. Truthy means the value counts as true in an `if`, as you saw in the Decisions unit.",
    },
    {
      type: "prose",
      body: "You usually give them a generator expression that produces `True` or `False` for each item: `any(score < 50 for score in scores)` asks whether any score is below 50. When a generator expression is the only thing inside a function's parentheses, it needs no parentheses of its own.",
    },
    {
      type: "example",
      code: `scores = [72, 45, 90, 61]
print(any(score < 50 for score in scores))
print(all(score >= 40 for score in scores))
print(all(score >= 50 for score in scores))

password = "sunflower42"
print(any(ch.isdigit() for ch in password))
print(all(ch.isalpha() for ch in password))
print(len(password) >= 8 and any(ch.isdigit() for ch in password))`,
    },
    {
      type: "prose",
      body: "Both functions stop as soon as they know the answer. `any()` stops at the first true item and `all()` stops at the first false one, so a generator expression never computes the rest. On an empty collection, `any()` gives `False`, because no item is true, and `all()` gives `True`, because no item is false.",
    },
    {
      type: "exercise",
      id: "any-all-aggregates-1",
      prompt:
        "The first print() checks whether any temperature is below 0. Add a second print() that uses all() with a generator expression to check whether every temperature is below 20. The output should be exactly two lines: True and then False",
      starterCode: `temps = [12, 18, -2, 25, 9]
print(any(t < 0 for t in temps))
# check whether every temperature is below 20
`,
      check: { type: "stdout-exact", expected: "True\nFalse" },
      solution: `temps = [12, 18, -2, 25, 9]
print(any(t < 0 for t in temps))
print(all(t < 20 for t in temps))
`,
      hint: "Copy the first line, change any to all, and change the condition to t < 20.",
    },
    {
      type: "heading",
      text: "sum, min and max with generator expressions",
    },
    {
      type: "prose",
      body: "`sum()`, `min()`, and `max()` accept any iterable, not only lists, so a generator expression can feed them directly. `sum(item[\"price\"] for item in cart)` adds up the prices without building a list of them first. Each value is handed over as it is computed, which is the lazy evaluation from the last lesson.",
    },
    {
      type: "prose",
      body: "An `if` clause narrows what gets added up or compared. Adding 1 for every item that passes a test counts those items: `sum(1 for score in scores if score >= 50)` is the number of passing scores.",
    },
    {
      type: "example",
      code: `cart = [
    {"name": "bread", "price": 3.5, "qty": 2},
    {"name": "milk", "price": 1.25, "qty": 4},
    {"name": "cheese", "price": 6.0, "qty": 1},
]
total = sum(item["price"] * item["qty"] for item in cart)
print(f"Total: {total:.2f}")
print(sum(item["qty"] for item in cart), "items")
print(max(item["price"] for item in cart))
print(sum(1 for item in cart if item["price"] > 2), "products over 2.00")`,
    },
    {
      type: "prose",
      body: "`min()` and `max()` raise a `ValueError` when there is nothing to compare, for example when the `if` clause filters out every item. Their `default=` option gives a value to return instead. With a second argument like this, the generator expression needs its own parentheses, as in `max((t for t in temps if t > 40), default=0)`.",
    },
    {
      type: "example",
      code: `temps = [31, 28, 35]
print(max((t for t in temps if t > 40), default=0))
print(max((t for t in temps if t > 30), default=0))
print(sum(t for t in temps if t > 40))`,
    },
    {
      type: "prose",
      body: "`sum()` needs no default: with nothing to add, it gives back 0.",
    },
    {
      type: "exercise",
      id: "any-all-aggregates-2",
      prompt:
        "The list orders holds (customer, amount) tuples. Using a generator expression for each line, print exactly three lines: Total: 101.5, then Big orders: 2 (the number of amounts over 20), then Largest: 45.0",
      starterCode: `orders = [("Ada", 12.5), ("Grace", 45.0), ("Alan", 8.0), ("Linus", 36.0)]
# print the total, the number of orders over 20, and the largest amount
`,
      check: { type: "stdout-exact", expected: "Total: 101.5\nBig orders: 2\nLargest: 45.0" },
      solution: `orders = [("Ada", 12.5), ("Grace", 45.0), ("Alan", 8.0), ("Linus", 36.0)]
print("Total:", sum(amount for name, amount in orders))
print("Big orders:", sum(1 for name, amount in orders if amount > 20))
print("Largest:", max(amount for name, amount in orders))
`,
      hint: "Unpack each tuple with for name, amount in orders. Use sum() for the total, sum(1 for ... if amount > 20) for the count, and max() for the largest.",
    },
    {
      type: "heading",
      text: "Choosing by key with min and max",
    },
    {
      type: "prose",
      body: "Sometimes you want the item itself, not a number about it. `max(names, key=len)` gives back the longest name, while `max(len(name) for name in names)` gives back only its length. The `key=` option works as it does for `sorted()`: Python calls the function on each item and compares the results, but hands back the original item.",
    },
    {
      type: "prose",
      body: "A `lambda` works as the key, which is handy for lists of dictionaries or tuples. When several items tie for the largest or smallest result, `max()` and `min()` give back the first of them.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace", "Linus", "Alan"]
print(max(len(name) for name in names))
print(max(names, key=len))
print(min(names, key=len))

products = [
    {"name": "lamp", "price": 25},
    {"name": "mug", "price": 8},
    {"name": "clock", "price": 19},
]
cheapest = min(products, key=lambda p: p["price"])
print(cheapest)
print(cheapest["name"])

scores = {"Ada": 92, "Grace": 97, "Alan": 75}
print(max(scores, key=scores.get))`,
    },
    {
      type: "prose",
      body: "Grace and Linus both have five letters, and `max()` gave back Grace because she comes first. The last line passes `scores.get` as the key: without parentheses, it is the `get()` method itself rather than a call to it, and here it does the same job as `lambda name: scores[name]`. Looping over a dictionary gives its keys, and `scores.get` turns each key into its value, so `max()` compares the scores and gives back the name.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Mixing up the two kinds of `max()` is the most common mistake. A generator expression inside `max()` gives back the largest computed value, such as a length or a price, while `key=` gives back the item that has it. Decide which one the question asks for.",
    },
    {
      type: "prose",
      body: "Leaving out the parentheses of a generator expression that is not the only argument is the next. `max(t for t in temps, default=0)` is a `SyntaxError` whose message reads `Generator expression must be parenthesized`. Write `max((t for t in temps), default=0)` instead.",
    },
    {
      type: "prose",
      body: "Finally, remember what `all()` says about an empty collection. `all(score >= 50 for score in [])` is `True`, so when an empty collection should not count as a pass, check that it has items too, as in `len(scores) > 0 and all(...)`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`any()` is true when at least one item is truthy and `all()` when every item is, and both stop as soon as they know the answer. `sum()`, `min()`, and `max()` take generator expressions directly, and `sum(1 for ... if ...)` counts matching items. `min()` and `max()` with `key=` give back the item with the smallest or largest result, and `default=` covers a collection with nothing in it.",
    },
    {
      type: "exercise",
      id: "any-all-aggregates-3",
      prompt:
        "Write a function best_student(grades). grades is a dictionary mapping each student's name to a list of their scores. Return the name of the student with the highest average score; if two students tie, return the one that comes first in the dictionary. For example, best_student({\"Ada\": [90, 80], \"Grace\": [85, 95], \"Alan\": [70, 100]}) returns 'Grace'.",
      starterCode: `def best_student(grades):
    # return the name with the highest average score
    pass
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "best_student({\"Ada\": [90, 80], \"Grace\": [85, 95], \"Alan\": [70, 100]})",
            expected: "'Grace'",
          },
          { call: "best_student({\"Ada\": [80], \"Alan\": [70, 90]})", expected: "'Ada'" },
          { call: "best_student({\"Linus\": [60, 70, 80]})", expected: "'Linus'" },
        ],
      },
      solution: `def best_student(grades):
    return max(grades, key=lambda name: sum(grades[name]) / len(grades[name]))
`,
      hint: "Call max() on grades, which loops over the names. For key=, use a lambda that takes a name and works out sum(grades[name]) / len(grades[name]).",
    },
  ],
};

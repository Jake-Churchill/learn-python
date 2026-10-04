export default {
  slug: "list-comprehensions",
  title: "List Comprehensions",
  unit: "Comprehensions & Iteration",
  blocks: [
    {
      type: "prose",
      body: "Many loops exist only to build a new list: start with an empty list, loop over another collection, and append something for each item. A list comprehension writes that whole pattern as one expression. Once you can read one, it states what the new list contains more directly than the loop does.",
    },
    {
      type: "heading",
      text: "From a loop to a comprehension",
    },
    {
      type: "prose",
      body: "The example below builds a list of doubled prices in two ways: first with the loop-and-append pattern you know, then with a list comprehension. Both print the same list.",
    },
    {
      type: "example",
      code: `prices = [4, 10, 7]
doubled = []
for price in prices:
    doubled.append(price * 2)
print(doubled)

doubled = [price * 2 for price in prices]
print(doubled)
print(prices)`,
    },
    {
      type: "prose",
      body: "A list comprehension is written inside square brackets, because it builds a list. It has two parts: first an expression that says what each new item should be, then a `for` clause that says where the items come from. Read `[price * 2 for price in prices]` as \"price times 2, for each price in prices\".",
    },
    {
      type: "prose",
      body: "The comprehension always builds a brand-new list and leaves the original unchanged, as the last line of the example shows. Its `for` clause can go over anything a `for` loop can: a list, a string, a `range()`, or a dictionary's `items()`.",
    },
    {
      type: "heading",
      text: "Transforming every item",
    },
    {
      type: "prose",
      body: "The simplest comprehension changes every item in the same way. That is the job `map()` does: `list(map(lambda c: c * 9 / 5 + 32, celsius))` and `[c * 9 / 5 + 32 for c in celsius]` build the same list. The comprehension needs no `lambda` and no `list()` around it, so it is usually the easier one to read.",
    },
    {
      type: "example",
      code: `celsius = [0, 21, 37]
fahrenheit = [c * 9 / 5 + 32 for c in celsius]
print(fahrenheit)

names = ["ada", "grace", "alan"]
print([name.title() for name in names])
print([len(name) for name in names])
print([n * n for n in range(1, 6)])`,
    },
    {
      type: "heading",
      text: "Keeping only some items",
    },
    {
      type: "prose",
      body: "An `if` clause at the end makes a comprehension keep only the items that pass a test, which is the job `filter()` does. In `[t for t in temps if t > 25]`, each `t` is checked against the condition, and only the items for which it is true go into the new list.",
    },
    {
      type: "prose",
      body: "The two forms combine. For each item, Python checks the `if` clause first and works out the expression at the front only for items that pass. The `for` clause can also unpack each item, exactly as a loop header can, which suits a dictionary's `items()`.",
    },
    {
      type: "example",
      code: `temps = [18, 27, 31, 22, 29]
hot_days = [t for t in temps if t > 25]
print(hot_days)
print([t * 9 / 5 + 32 for t in temps if t > 30])

scores = {"Ada": 92, "Grace": 48, "Alan": 75}
passed = [name for name, score in scores.items() if score >= 50]
print(passed)
print(["pass" if score >= 50 else "fail" for score in scores.values()])`,
    },
    {
      type: "prose",
      body: "The last line uses a conditional expression, `x if condition else y`, at the front instead of an `if` clause at the end. It keeps every item but chooses between two values for each one. An `if` at the end removes items; an `if` with `else` at the front decides what each item becomes.",
    },
    {
      type: "exercise",
      id: "list-comprehensions-1",
      prompt:
        "The list nums is given. Replace the empty list [] with a list comprehension that builds the squares of only the even numbers in nums. The program should print exactly: [4, 16, 36]",
      starterCode: `nums = [1, 2, 3, 4, 5, 6]
even_squares = []  # replace [] with a list comprehension
print(even_squares)
`,
      check: { type: "stdout-exact", expected: "[4, 16, 36]" },
      solution: `nums = [1, 2, 3, 4, 5, 6]
even_squares = [n * n for n in nums if n % 2 == 0]
print(even_squares)
`,
      hint: "Put n * n at the front, then for n in nums, then an if clause that keeps the numbers whose remainder after dividing by 2 is 0.",
    },
    {
      type: "heading",
      text: "Nested for clauses",
    },
    {
      type: "prose",
      body: "A comprehension can have more than one `for` clause. They run like nested loops written from top to bottom: the first `for` is the outer loop and the second is the inner loop. This is the usual way to flatten a list of lists, which means collecting all the inner items into one flat list.",
    },
    {
      type: "example",
      code: `teams = [["Ada", "Alan"], ["Grace"], ["Linus", "Guido"]]
players = [name for team in teams for name in team]
print(players)

players = []
for team in teams:
    for name in team:
        players.append(name)
print(players)

sizes = ["S", "M"]
colors = ["red", "blue"]
print([f"{size}-{color}" for size in sizes for color in colors])`,
    },
    {
      type: "prose",
      body: "Write the clauses in the same order as the nested loops. Putting them the other way round, as in `[name for name in team for team in teams]`, fails with a `NameError` in a program where `team` does not already exist, because `team` is used before the clause that creates it.",
    },
    {
      type: "exercise",
      id: "list-comprehensions-2",
      prompt:
        "The list orders holds one list of item prices per customer. Use a list comprehension with two for clauses and an if clause to build one flat list called big_items holding every price over 5, in the order they appear, then print it. The output should be exactly: [12, 8, 9.5, 20]",
      starterCode: `orders = [[3, 12, 8], [2.5, 9.5], [20, 4]]
# build big_items with one list comprehension, then print it
`,
      check: { type: "stdout-exact", expected: "[12, 8, 9.5, 20]" },
      solution: `orders = [[3, 12, 8], [2.5, 9.5], [20, 4]]
big_items = [price for order in orders for price in order if price > 5]
print(big_items)
`,
      hint: "The first for clause goes over orders, the second goes over each order, and the if clause comes last.",
    },
    {
      type: "heading",
      text: "When not to use a comprehension",
    },
    {
      type: "prose",
      body: "A comprehension is for building a list. If a loop's job is something else, such as printing or adding to a running total, write an ordinary loop. A comprehension that calls `print()` still builds a list, filled with the `None` that each `print()` gives back.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace"]
result = [print(name) for name in names]
print(result)

for name in names:
    print(name)`,
    },
    {
      type: "prose",
      body: "Readability is the other limit. A comprehension holds a single expression, so use a loop when each item needs several steps, an `elif`, or a variable of its own. Two `for` clauses are about as far as a comprehension stays easy to read; beyond that, or with a long condition, a loop with well-named variables is clearer.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Mixing up the two places an `if` can go is the most common mistake. An `if` at the end filters and cannot have an `else`, so `[s for s in scores if s >= 50 else 0]` is a `SyntaxError`. To keep every item and choose a value for each, put `if` and `else` at the front.",
    },
    {
      type: "prose",
      body: "Forgetting to store the result is the other. `[n * 2 for n in nums]` on a line by itself builds a list and throws it away, and `nums` does not change. Assign the comprehension to a variable, or pass it straight to the function that needs it.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A list comprehension builds a new list in one expression: `[expression for item in collection if condition]`. Without the `if` clause it transforms every item, as `map()` does; with it, it keeps only matching items, as `filter()` does. Several `for` clauses work like nested loops, and an ordinary loop is the better choice when the work is not building a list or needs several steps.",
    },
    {
      type: "exercise",
      id: "list-comprehensions-3",
      prompt:
        "Write a function passing_names(results) that takes a list of (name, score) tuples and returns a list of the names, in capital letters, of everyone who scored 50 or more, in their original order. Use a list comprehension. For example, passing_names([(\"Ada\", 92), (\"Grace\", 48), (\"Alan\", 75)]) returns ['ADA', 'ALAN'].",
      starterCode: `def passing_names(results):
    # return a list comprehension
    pass
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "passing_names([(\"Ada\", 92), (\"Grace\", 48), (\"Alan\", 75)])",
            expected: "['ADA', 'ALAN']",
          },
          { call: "passing_names([(\"Linus\", 50), (\"Guido\", 49)])", expected: "['LINUS']" },
          { call: "passing_names([])", expected: "[]" },
        ],
      },
      solution: `def passing_names(results):
    return [name.upper() for name, score in results if score >= 50]
`,
      hint: "Unpack each tuple in the for clause with for name, score in results. Use name.upper() as the expression at the front, and filter with if score >= 50 at the end.",
    },
  ],
};

export default {
  slug: "style-and-idioms",
  title: "Pythonic Code & Style",
  unit: "Writing Better Python",
  blocks: [
    {
      type: "prose",
      body: "Code is read far more often than it is written: by teammates, by people who call your functions, and by you months later. A program that works but is hard to read is hard to fix. This lesson covers the style rules Python programmers share, docstrings, type hints, and idioms, then uses them to clean up a clumsy function.",
    },
    {
      type: "prose",
      body: "Code written the way experienced Python programmers expect is called Pythonic: plainer rather than cleverer, because it uses the tools the language already provides.",
    },
    {
      type: "heading",
      text: "PEP 8",
    },
    {
      type: "prose",
      body: "PEP 8 is Python's official style guide. A PEP, short for Python Enhancement Proposal, is a document describing a new feature or convention for Python, and number 8 covers how code should look. Most Python code follows it, so yours will look familiar to other programmers.",
    },
    {
      type: "prose",
      body: "The naming rules: snake_case for variables and functions, CapWords for classes (each word capitalized, with no underscores, as in `ShoppingCart`), and UPPER_CASE for constants. A constant is a variable set once and never changed, such as a tax rate; Python does not enforce this, but the capitals warn readers.",
    },
    {
      type: "prose",
      body: "The main layout rules, slightly simplified: indent with four spaces, and put one space on each side of `=` and of operators such as `+` and `==`, and one after each comma. Leave out the spaces around the `=` of a keyword argument or default value, as in `sep=\", \"`. Keep lines to at most 79 characters, and leave two blank lines between top-level functions and classes.",
    },
    {
      type: "example",
      code: `TaxRate=0.08
class shopping_cart:
  def __init__(self):
    self.Items=[]
  def Add(self,name,price):
    self.Items.append((name,price))
  def Total(self,rate = TaxRate):
    return round(sum(price for name,price in self.Items)*(1+rate),2)
cart=shopping_cart()
cart.Add("lamp",24.5)
cart.Add("mug",8)
print(cart.Total())`,
    },
    {
      type: "prose",
      body: "That program runs, but almost every line breaks a rule. The PEP 8 version below prints the same total, and its names alone show which is the class, which are methods, and which value is fixed.",
    },
    {
      type: "example",
      code: `TAX_RATE = 0.08


class ShoppingCart:
    def __init__(self):
        self.items = []

    def add(self, name, price):
        self.items.append((name, price))

    def total(self, rate=TAX_RATE):
        subtotal = sum(price for name, price in self.items)
        return round(subtotal * (1 + rate), 2)


cart = ShoppingCart()
cart.add("lamp", 24.5)
cart.add("mug", 8)
print(cart.total())`,
    },
    {
      type: "heading",
      text: "Docstrings and type hints",
    },
    {
      type: "prose",
      body: "A docstring is a string written as the very first statement of a function's body, describing what the function does. By convention it is written in triple quotes, even when it fits on one line. Python stores it in the function's `__doc__` attribute, and `help()` displays it, so anyone can learn what your function does without reading its code.",
    },
    {
      type: "prose",
      body: "Write the first line as a command that sums up the function, such as `\"\"\"Return the average of scores.\"\"\"`. For more detail, add a blank line and then further lines. A comment explains how code works to someone reading it, while a docstring tells someone calling the function what it does.",
    },
    {
      type: "prose",
      body: "Type hints, from Dataclasses & Type Hints, complete the picture, with `-> float` naming the return type. Square brackets name what a collection holds: `scores: list[float]` is a list of floats, and `dict[str, int]` has string keys and whole-number values. Python keeps hints in the function's `__annotations__` attribute and still does not enforce them.",
    },
    {
      type: "example",
      code: `def average(scores: list[float]) -> float:
    """Return the mean of scores, or 0.0 for an empty list."""
    if not scores:
        return 0.0
    return sum(scores) / len(scores)

print(average([80, 92.5, 75]))
print(average.__doc__)
help(average)`,
    },
    {
      type: "exercise",
      id: "style-and-idioms-1",
      prompt:
        "The function below works, but its name breaks PEP 8 and it has no docstring or type hints. Rename it to celsius_to_fahrenheit and its parameter to celsius. Add type hints saying celsius is a float and the function returns a float, and add the docstring Convert a temperature from Celsius to Fahrenheit. (with the full stop) on one line, with nothing else inside the quotes. Then celsius_to_fahrenheit(100) returns 212.0.",
      starterCode: `def ConvertTemp(c):
    return c * 9 / 5 + 32
`,
      check: {
        type: "returns",
        cases: [
          { call: "celsius_to_fahrenheit(100)", expected: "212.0" },
          { call: "celsius_to_fahrenheit(-40)", expected: "-40.0" },
          {
            call: "celsius_to_fahrenheit.__doc__",
            expected: "'Convert a temperature from Celsius to Fahrenheit.'",
          },
          {
            call: "celsius_to_fahrenheit.__annotations__",
            expected: "{'celsius': <class 'float'>, 'return': <class 'float'>}",
          },
        ],
      },
      solution: `def celsius_to_fahrenheit(celsius: float) -> float:
    """Convert a temperature from Celsius to Fahrenheit."""
    return celsius * 9 / 5 + 32
`,
      hint: "The def line becomes def celsius_to_fahrenheit(celsius: float) -> float:, and the docstring goes on the first line of the body, inside triple quotes. Use celsius in the return line too.",
    },
    {
      type: "heading",
      text: "Ask forgiveness, not permission",
    },
    {
      type: "prose",
      body: "There are two ways to handle an operation that might fail. You can check every condition first, a style called LBYL, for look before you leap. Or you can try the operation and handle the exception if it fails, a style called EAFP: easier to ask for forgiveness than permission. Python code usually prefers EAFP.",
    },
    {
      type: "prose",
      body: "Checks written in advance often miss cases. The check-first version below uses `isdigit()`, which is `False` for `\"-5\"` and for `\" 7 \"`, even though `int()` accepts both. The EAFP version lets `int()` itself decide.",
    },
    {
      type: "example",
      code: `def parse_lbyl(text):
    if text.isdigit():
        return int(text)
    return 0

def parse_eafp(text):
    try:
        return int(text)
    except ValueError:
        return 0

for text in ["42", "-5", " 7 ", "ten"]:
    print(repr(text), parse_lbyl(text), parse_eafp(text))`,
    },
    {
      type: "prose",
      body: "EAFP does not mean wrapping everything in `try`. When a simple check covers every case, such as `in` for a dictionary key or `get()` with a default, use it. And catch only the specific exception you expect, so other mistakes still show up.",
    },
    {
      type: "exercise",
      id: "style-and-idioms-2",
      prompt:
        "get_city(user) receives a dictionary that may hold an \"address\" dictionary, which may hold a \"city\". The check-first version crashes with a KeyError when the address has no city. Rewrite the body in EAFP style: try to return user[\"address\"][\"city\"], and return \"unknown\" if a KeyError is raised. For a two-level lookup like this, one try replaces the two checks a check-first version needs, so do not use get(). For example, get_city({\"name\": \"Grace\", \"address\": {}}) returns 'unknown'.",
      starterCode: `def get_city(user):
    if "address" in user:
        return user["address"]["city"]
    return "unknown"
`,
      check: {
        type: "returns",
        cases: [
          { call: 'get_city({"name": "Ada", "address": {"city": "London"}})', expected: "'London'" },
          { call: 'get_city({"name": "Alan"})', expected: "'unknown'" },
          { call: 'get_city({"name": "Grace", "address": {}})', expected: "'unknown'" },
        ],
      },
      solution: `def get_city(user):
    try:
        return user["address"]["city"]
    except KeyError:
        return "unknown"
`,
      hint: "Put the return line inside a try block, and add except KeyError: with return \"unknown\" below it. The if is no longer needed.",
    },
    {
      type: "heading",
      text: "Common idioms",
    },
    {
      type: "prose",
      body: "An idiom is the usual way experienced programmers write a common task, and you have met most of Python's already. Loop over items directly instead of over `range(len(items))`, and use `enumerate()` when you also need the position or `zip()` to walk two lists together.",
    },
    {
      type: "prose",
      body: "Test truthiness directly: `if items:` instead of `if len(items) > 0:`, and `if done:` instead of `if done == True:`. Compare with `None` using `is None`. Build simple lists with a comprehension, and let `sum()`, `max()`, `any()`, and `join()` replace hand-written loops.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace", "Alan"]
scores = [92, 88, 95]

# clumsy
for i in range(len(names)):
    print(str(i + 1) + ". " + names[i] + ": " + str(scores[i]))
high = []
for i in range(len(scores)):
    if (scores[i] >= 90) == True:
        high.append(scores[i])
print(high)

# Pythonic
for place, (name, score) in enumerate(zip(names, scores), start=1):
    print(f"{place}. {name}: {score}")
print([score for score in scores if score >= 90])`,
    },
    {
      type: "heading",
      text: "Refactoring an example",
    },
    {
      type: "prose",
      body: "Refactoring means changing how code is written without changing what it does. Tests make it safe: if they pass before and after, the behavior they check has not changed. The first function below works, but it uses an index loop, a manual counter, hand-placed commas, and `== True`.",
    },
    {
      type: "example",
      code: `def paid_summary_old(names, paid):
    result = ""
    count = 0
    for i in range(len(names)):
        if paid[i] == True:
            if count > 0:
                result = result + ", "
            result = result + names[i]
            count = count + 1
    return result + " (" + str(count) + " paid)"


def paid_summary(names: list[str], paid: list[bool]) -> str:
    """Return the names of members who paid, followed by a count."""
    paid_names = [name for name, has_paid in zip(names, paid) if has_paid]
    return f"{', '.join(paid_names)} ({len(paid_names)} paid)"


names = ["Ada", "Grace", "Alan", "Linus"]
paid = [True, False, True, True]
assert paid_summary(names, paid) == paid_summary_old(names, paid)
assert paid_summary([], []) == paid_summary_old([], [])
print(paid_summary(names, paid))`,
    },
    {
      type: "prose",
      body: "The asserts confirm that both versions agree, including on empty lists. Each change swapped hand-written machinery for a tool Python already has: `zip()` instead of indexes, a comprehension with a truthiness test instead of `== True`, and `join()` and `len()` instead of manual commas and a counter.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Squeezing too much into one line is as hard to read as clumsy code. A comprehension with two loops and two conditions saves lines but costs clarity. If a line needs a second reading, split it up or store a part in a well-named variable.",
    },
    {
      type: "prose",
      body: "A docstring must be the first statement in the body. A string placed after another statement is not a docstring, and neither is a `#` comment; `__doc__` is then `None`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "PEP 8 is the shared style guide: snake_case for functions and variables, CapWords for classes, UPPER_CASE for constants, and four-space indents. A docstring says what a function does and `help()` shows it, while type hints say what goes in and comes out. Pythonic code often prefers EAFP, direct loops, `enumerate()`, `zip()`, comprehensions, and truthiness tests. Refactor with tests in place so the behavior stays the same.",
    },
    {
      type: "exercise",
      id: "style-and-idioms-3",
      prompt:
        "LowStock works but is clumsy. Write a Pythonic version called low_stock(stock, limit) with the same behavior: stock is a dictionary mapping item names to quantities, and the function returns a sorted list of the names whose quantity is below limit. Give it type hints and the docstring Return the sorted names of items below limit. (with the full stop) on one line, with nothing else inside the quotes. For example, low_stock({\"rice\": 2, \"beans\": 12, \"salt\": 0}, 5) returns ['rice', 'salt'].",
      starterCode: `def LowStock(stock, limit):
    names = []
    for key in stock.keys():
        if (stock[key] < limit) == True:
            names.append(key)
    names.sort()
    return names

# write low_stock(stock, limit) below
`,
      check: {
        type: "returns",
        cases: [
          { call: 'low_stock({"rice": 2, "beans": 12, "salt": 0}, 5)', expected: "['rice', 'salt']" },
          { call: 'low_stock({"tea": 9, "milk": 1}, 10)', expected: "['milk', 'tea']" },
          { call: 'low_stock({"flour": 5}, 5)', expected: "[]" },
          { call: "low_stock({}, 3)", expected: "[]" },
          { call: "low_stock.__doc__", expected: "'Return the sorted names of items below limit.'" },
        ],
      },
      solution: `def low_stock(stock: dict[str, int], limit: int) -> list[str]:
    """Return the sorted names of items below limit."""
    return sorted(name for name, quantity in stock.items() if quantity < limit)
`,
      hint: "Loop over stock.items() to get each name and quantity together. A generator expression inside sorted() can keep the names whose quantity is below limit. The docstring goes on the first line of the body, in triple quotes.",
    },
  ],
};

export default {
  slug: "functions",
  title: "Functions",
  blocks: [
    {
      type: "prose",
      body: "JS: `function add(a, b) { return a + b; }`. Python: `def add(a, b):` followed by an indented body with `return a + b` — no braces, no function keyword for the body, no semicolon.",
    },
    {
      type: "prose",
      body: "Default parameters look similar — `def greet(name=\"World\"):` compares to `function greet(name = \"World\")` — but Python has a classic trap: a mutable default argument like `def add_item(item, items=[]):` is created once and reused across every call, unlike a fresh JS closure. The fix is `items=None`, then `if items is None: items = []` inside the function.",
    },
    {
      type: "prose",
      body: "Variable arguments: JS's rest parameter `...args` becomes Python's `*args`.",
    },
    {
      type: "example",
      code: `def greet(name="World"):
    print(f"Hello, {name}!")

greet()
greet("Ada")

def total(*numbers):
    return sum(numbers)

print(total(1, 2, 3))`,
    },
    {
      type: "exercise",
      id: "functions-1",
      prompt: "Write a function called square that takes one number and returns its square. Then call square(6) and print the result.",
      starterCode: `def square(n):
    # your code here
    pass
`,
      check: { type: "stdout-exact", expected: "36" },
    },
  ],
};

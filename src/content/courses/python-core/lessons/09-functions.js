export default {
  slug: "functions",
  title: "Functions",
  blocks: [
    {
      type: "prose",
      body: "Define a function with `def`, a name, parentheses for its parameters, and a colon: `def add(a, b):` followed by an indented body. Use `return` to send a value back to wherever the function was called — the same indentation rules from `if` and loops apply here too.",
    },
    {
      type: "prose",
      body: "A parameter can have a default value, used whenever the caller doesn't supply one: `def greet(name=\"World\"):` lets you call `greet()` and have `name` default to `\"World\"`. Watch out for one trap: a default value that's a mutable object, like `def add_item(item, items=[]):`, is created only once — the first time Python reads the function definition — and then reused on every call, so items pile up across calls instead of starting fresh each time. The fix is to default to `None` instead: `items=None`, then `if items is None: items = []` as the first line inside the function.",
    },
    {
      type: "prose",
      body: "To let a function accept any number of arguments, use `*args` in the parameter list: `def total(*numbers):` collects every argument passed in as a tuple named `numbers` inside the function, however many there are.",
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

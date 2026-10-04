export default {
  slug: "parameters-and-defaults",
  title: "Parameters & Arguments",
  unit: "Functions",
  blocks: [
    {
      type: "prose",
      body: "You have already used arguments written with a name and an `=` sign, such as `sep=\"-\"` in `print()` and `reverse=True` in `sorted()`. You could also leave them out, and the function used a sensible value instead. This lesson shows how to give your own functions the same flexibility, and how one function can hand back several values at once.",
    },
    {
      type: "heading",
      text: "Positional and keyword arguments",
    },
    {
      type: "prose",
      body: "The arguments you have passed to your own functions so far are positional arguments: Python matches them to parameters by their position, first to first and second to second. Swapping two positional arguments swaps the values the function receives, which can quietly give a wrong answer.",
    },
    {
      type: "prose",
      body: "A keyword argument names the parameter it is for, as in `animal=\"cat\"`. Python matches it by name, so the order of keyword arguments does not matter, and the call explains itself to anyone reading it. You can mix the two kinds in one call, but every positional argument must come before the first keyword argument.",
    },
    {
      type: "example",
      code: `def describe_pet(name, animal):
    return f"{name} is a {animal}."

print(describe_pet("Rex", "dog"))
print(describe_pet("dog", "Rex"))
print(describe_pet(animal="cat", name="Tom"))
print(describe_pet("Polly", animal="parrot"))`,
    },
    {
      type: "prose",
      body: "The second call shows the risk of positional arguments in the wrong order. Writing a positional argument after a keyword argument, as in `describe_pet(name=\"Rex\", \"dog\")`, is a `SyntaxError` with the message `positional argument follows keyword argument`.",
    },
    {
      type: "heading",
      text: "Default values",
    },
    {
      type: "prose",
      body: "A parameter can have a default value, written with `=` in the `def` line: `def with_tax(price, rate=0.08):`. A call that leaves that argument out uses the default, and a call that gives it uses the value given. Parameters with defaults must come after the parameters without them.",
    },
    {
      type: "prose",
      body: "Defaults suit options that usually stay the same, such as a tax rate or a greeting. Callers who are happy with the usual value write less. The rest pass a keyword argument to change only the option they care about, as the last call below does by skipping `greeting` and setting `punctuation`.",
    },
    {
      type: "example",
      code: `def with_tax(price, rate=0.08):
    return round(price * (1 + rate), 2)

print(with_tax(10))
print(with_tax(10, 0.2))

def greet(name, greeting="Hello", punctuation="!"):
    return f"{greeting}, {name}{punctuation}"

print(greet("Ada"))
print(greet("Grace", "Welcome back"))
print(greet("Alan", punctuation="."))`,
    },
    {
      type: "exercise",
      id: "parameters-and-defaults-1",
      prompt:
        "The function shipping(weight, rate) returns the shipping cost for a parcel. Most parcels use a rate of 4.5 per kilogram. Give the parameter rate a default value of 4.5, so that shipping(2) returns 9.0 and shipping(2, rate=6) returns 12.",
      starterCode: `def shipping(weight, rate):
    return weight * rate
`,
      check: {
        type: "returns",
        cases: [
          { call: "shipping(2)", expected: "9.0" },
          { call: "shipping(10)", expected: "45.0" },
          { call: "shipping(2, rate=6)", expected: "12" },
          { call: "shipping(3, 2.0)", expected: "6.0" },
        ],
      },
      solution: `def shipping(weight, rate=4.5):
    return weight * rate
`,
      hint: "Change only the def line: write rate=4.5 inside the parentheses.",
    },
    {
      type: "heading",
      text: "The mutable default trap",
    },
    {
      type: "prose",
      body: "A default value is created once, when Python runs the `def` line, not each time the function is called. Every call that leaves the argument out shares that one value. For numbers and strings this never matters, because they are immutable and cannot be changed in place.",
    },
    {
      type: "prose",
      body: "A list is mutable, which means it can be changed in place. If a default list is changed inside the function, for example with `append()`, the change is still there on the next call. Items pile up across calls that each expected to start with an empty list.",
    },
    {
      type: "example",
      code: `def add_item(item, basket=[]):
    basket.append(item)
    return basket

print(add_item("apple"))
print(add_item("bread"))`,
    },
    {
      type: "prose",
      body: "The fix is to use `None` as the default and create a fresh list inside the function. The `is` operator asks whether two names refer to the very same value, and `basket is None` is the standard way to check whether `basket` holds `None`. Its opposite is `is not`, as in `basket is not None`, just as `not in` is the opposite of `in`. Each call that leaves the argument out then gets its own new list.",
    },
    {
      type: "example",
      code: `def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket

print(add_item("apple"))
print(add_item("bread"))
print(add_item("milk", ["eggs"]))`,
    },
    {
      type: "exercise",
      id: "parameters-and-defaults-2",
      prompt:
        "add_tag(tag, tags) adds a tag to a list of tags and returns the list, but tags from earlier calls leak into later ones. Fix it with the None pattern, so add_tag(\"sale\") returns ['sale'], a second call add_tag(\"new\") returns ['new'], and add_tag(\"new\", [\"sale\"]) returns ['sale', 'new'].",
      starterCode: `def add_tag(tag, tags=[]):
    tags.append(tag)
    return tags
`,
      check: {
        type: "returns",
        cases: [
          { call: 'add_tag("sale")', expected: "['sale']" },
          { call: 'add_tag("new")', expected: "['new']" },
          { call: 'add_tag("new", ["sale"])', expected: "['sale', 'new']" },
        ],
      },
      solution: `def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags
`,
      hint: "Make None the default. As the first line of the body, create an empty list when tags is None.",
    },
    {
      type: "heading",
      text: "Returning several values",
    },
    {
      type: "prose",
      body: "A function can hand back several values by listing them after `return`, separated by commas: `return low, high`. The commas build a tuple, so the function still returns one value, a tuple holding the parts. The caller can unpack it into separate variables, exactly as with `divmod()`.",
    },
    {
      type: "example",
      code: `def min_max(numbers):
    return min(numbers), max(numbers)

temperatures = [18, 24, 21, 15, 27]
result = min_max(temperatures)
print(result)
low, high = min_max(temperatures)
print(f"Low {low}, high {high}")`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "A list or dictionary as a default value is the classic mistake, because the shared value keeps the changes from earlier calls. Use `None` as the default and create the list or dictionary inside the function.",
    },
    {
      type: "prose",
      body: "Putting a parameter without a default after one with a default, as in `def greet(greeting=\"Hello\", name):`, is a `SyntaxError`. A keyword argument must also use the parameter's exact name: `with_tax(10, tax=0)` stops with `TypeError: with_tax() got an unexpected keyword argument 'tax'`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Positional arguments are matched by order and keyword arguments by name, and positional ones come first in a call. A default value makes an argument optional; it is created only once, so use `None` instead of a list or dictionary. A function returns several values by returning a tuple, which the caller can unpack.",
    },
    {
      type: "exercise",
      id: "parameters-and-defaults-3",
      prompt:
        "Write a function split_bill(total, people=1, tip_percent=15) that returns two values: the tip, which is total times tip_percent divided by 100, and the amount each person pays, which is the total plus the tip, divided by people. Round both to 2 decimal places with round(). For example, split_bill(80, 4) returns (12.0, 23.0).",
      starterCode: `# write the function split_bill below
`,
      check: {
        type: "returns",
        cases: [
          { call: "split_bill(100)", expected: "(15.0, 115.0)" },
          { call: "split_bill(80, 4)", expected: "(12.0, 23.0)" },
          { call: "split_bill(60, 3, tip_percent=20)", expected: "(12.0, 24.0)" },
          { call: "split_bill(people=2, total=50, tip_percent=10)", expected: "(5.0, 27.5)" },
        ],
      },
      solution: `def split_bill(total, people=1, tip_percent=15):
    tip = total * tip_percent / 100
    share = (total + tip) / people
    return round(tip, 2), round(share, 2)
`,
      hint: "Store the tip in a variable first, then use it to work out each person's share. Return both rounded values, separated by a comma.",
    },
  ],
};

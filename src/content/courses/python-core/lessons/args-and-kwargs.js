export default {
  slug: "args-and-kwargs",
  title: "*args and **kwargs",
  unit: "Functions",
  blocks: [
    {
      type: "prose",
      body: "`print()` accepts any number of values: one, three, or none at all. The functions you have written so far take a fixed number of arguments. This lesson shows how a function can collect as many arguments as the caller gives, and how to spread the items of a list or dictionary out into separate arguments.",
    },
    {
      type: "heading",
      text: "Collecting positional arguments",
    },
    {
      type: "prose",
      body: "A parameter written with a star in front, such as `*prices`, collects every positional argument left over after the ordinary parameters are filled. Inside the function it is a tuple holding those arguments, in order. If there are none, it is an empty tuple.",
    },
    {
      type: "prose",
      body: "Any name works after the star. `*args`, short for arguments, is the usual name when nothing more descriptive fits, but a name that says what the values are, like `*prices` or `*names`, makes the function easier to read.",
    },
    {
      type: "example",
      code: `def total(*prices):
    print(prices)
    return sum(prices)

print(total(2.5, 4.0, 1.25))
print(total(9))
print(total())`,
    },
    {
      type: "prose",
      body: "Ordinary parameters can come before the starred one, and they take their arguments first. A parameter written after the starred one can only be given as a keyword argument, because the star collects every remaining positional argument. Such a parameter is called keyword-only. `print()` works this way, which is why its `sep` must be written as `sep=`.",
    },
    {
      type: "example",
      code: `def announce(event, *names, sep=", "):
    return f"{event}: {sep.join(names)}"

print(announce("Winners", "Ada", "Grace", "Alan"))
print(announce("Winners", "Ada", "Grace", sep=" and "))`,
    },
    {
      type: "exercise",
      id: "args-and-kwargs-1",
      prompt:
        "Complete average(*numbers) so it returns the average of all the numbers it is given: their sum divided by how many there are. For example, average(4, 8) returns 6.0 and average(10, 20, 30, 40) returns 25.0.",
      starterCode: `def average(*numbers):
    # numbers is a tuple of every argument
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "average(4, 8)", expected: "6.0" },
          { call: "average(10, 20, 30, 40)", expected: "25.0" },
          { call: "average(7)", expected: "7.0" },
          { call: "average(1, 2)", expected: "1.5" },
        ],
      },
      solution: `def average(*numbers):
    return sum(numbers) / len(numbers)
`,
      hint: "sum() and len() both work on a tuple.",
    },
    {
      type: "heading",
      text: "Collecting keyword arguments",
    },
    {
      type: "prose",
      body: "Two stars collect keyword arguments. A parameter such as `**details` gathers every keyword argument that does not match another parameter into a dictionary. Each key is the argument's name as a string, and each value is the value given. The usual name is `**kwargs`, short for keyword arguments.",
    },
    {
      type: "example",
      code: `def make_profile(name, **details):
    profile = {"name": name}
    for key, value in details.items():
        profile[key] = value
    return profile

print(make_profile("Ada", age=36, city="London"))
print(make_profile("Alan"))`,
    },
    {
      type: "prose",
      body: "`\"Ada\"` fills the ordinary parameter `name`, so only `age` and `city` end up in `details`. When no keyword arguments are given, as in the second call, `details` is an empty dictionary and the loop does nothing.",
    },
    {
      type: "prose",
      body: "A function can use both kinds. In the `def` line, ordinary parameters come first, then the starred parameter, then any keyword-only parameters, and the double-starred parameter comes last.",
    },
    {
      type: "example",
      code: `def order(drink, *extras, **options):
    print("Drink:", drink)
    print("Extras:", extras)
    print("Options:", options)

order("latte", "cinnamon", "vanilla", size="large", milk="oat")`,
    },
    {
      type: "prose",
      body: "The positional arguments after `\"latte\"` land in the tuple `extras`, and the keyword arguments land in the dictionary `options`, in the order they were written.",
    },
    {
      type: "exercise",
      id: "args-and-kwargs-2",
      prompt:
        "Write the body of update_settings(settings, **changes) so it returns a new dictionary: the settings dictionary with every keyword argument laid over it. A change to an existing key replaces its value, and a new key is added at the end. The dictionary passed in must not change. For example, update_settings(defaults, size=14) returns {'theme': 'light', 'size': 14} and leaves defaults as it was.",
      starterCode: `defaults = {"theme": "light", "size": 12}

def update_settings(settings, **changes):
    # return a new dictionary with the changes applied
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "update_settings(defaults, size=14)", expected: "{'theme': 'light', 'size': 14}" },
          {
            call: "update_settings({'theme': 'light'}, theme='dark', sound=False)",
            expected: "{'theme': 'dark', 'sound': False}",
          },
          { call: "update_settings({'size': 12})", expected: "{'size': 12}" },
          { call: "defaults", expected: "{'theme': 'light', 'size': 12}" },
        ],
      },
      solution: `defaults = {"theme": "light", "size": 12}

def update_settings(settings, **changes):
    return settings | changes
`,
      hint: "changes is a dictionary. The | operator from Dictionary Methods merges two dictionaries into a new one, and the right side wins when both have the same key.",
    },
    {
      type: "heading",
      text: "Unpacking arguments in a call",
    },
    {
      type: "prose",
      body: "The stars also work the other way, in a call. A star before a list or tuple, as in `rectangle_area(*size)`, spreads its items out as separate positional arguments. Two stars before a dictionary spread its pairs out as keyword arguments, so each key must match a parameter name.",
    },
    {
      type: "example",
      code: `def rectangle_area(width, height):
    return width * height

size = [3, 5]
print(rectangle_area(*size))

dimensions = {"height": 2, "width": 7}
print(rectangle_area(**dimensions))

names = ["Ada", "Grace", "Alan"]
print(*names)
print(*names, sep=", ")`,
    },
    {
      type: "prose",
      body: "`print(*names)` is exactly the same call as `print(\"Ada\", \"Grace\", \"Alan\")`, so `print()` receives three values and puts its usual space between them. Unpacked and ordinary arguments can be mixed in one call, which is how the last line adds `sep`.",
    },
    {
      type: "prose",
      body: "Unpacking helps when data arrives already grouped, such as a tuple from a list of records, but the function you need takes separate arguments. A function that collects `**kwargs` can also pass them straight on to another function by writing `**kwargs` in that call.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting the star in a call passes the whole list as one argument: `rectangle_area(size)` stops with `TypeError: rectangle_area() missing 1 required positional argument: 'height'`. Unpacking a list with the wrong number of items fails in a similar way. With `**`, every key must match a parameter name: unpacking a dictionary with the key `\"w\"` gives `TypeError: rectangle_area() got an unexpected keyword argument 'w'`.",
    },
    {
      type: "prose",
      body: "Inside the function, `*args` is a tuple and `**kwargs` is a dictionary, not separate variables. Loop over them or index them like any other tuple or dictionary. And a parameter written after `*args` can only be given by keyword.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A starred parameter collects leftover positional arguments into a tuple, and a double-starred parameter collects leftover keyword arguments into a dictionary. Parameters after the starred one are keyword-only. In a call, `*` spreads a list or tuple into positional arguments and `**` spreads a dictionary into keyword arguments.",
    },
    {
      type: "exercise",
      id: "args-and-kwargs-3",
      prompt:
        "The function price_label(name, price, currency=\"$\") is written for you. Write a function make_labels(products, **options), where products is a list of (name, price) tuples. It returns a list with one label per product, made by calling price_label() with the tuple's items unpacked as positional arguments and options passed on as keyword arguments. For example, make_labels([(\"Tea\", 2.5)], currency=\"£\") returns ['Tea: £2.50'].",
      starterCode: `def price_label(name, price, currency="$"):
    return f"{name}: {currency}{price:.2f}"

# write make_labels(products, **options) below
`,
      check: {
        type: "returns",
        cases: [
          { call: 'make_labels([("Tea", 2.5), ("Cake", 3)])', expected: "['Tea: $2.50', 'Cake: $3.00']" },
          { call: 'make_labels([("Tea", 2.5)], currency="£")', expected: "['Tea: £2.50']" },
          { call: "make_labels([])", expected: "[]" },
        ],
      },
      solution: `def price_label(name, price, currency="$"):
    return f"{name}: {currency}{price:.2f}"

def make_labels(products, **options):
    labels = []
    for product in products:
        labels.append(price_label(*product, **options))
    return labels
`,
      hint: "Build the list with a loop and append(). Inside the loop, one star unpacks the product tuple and two stars pass options on to price_label().",
    },
  ],
};

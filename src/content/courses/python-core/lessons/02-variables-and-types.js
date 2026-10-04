export default {
  slug: "variables-and-types",
  title: "Variables & Types",
  unit: "Getting Started",
  blocks: [
    {
      type: "prose",
      body: "So far every program printed text you typed directly. Real programs need to remember information, such as a name, a price, or a score, and use it later. A variable is a name that you attach to a piece of information so you can refer to it again.",
    },
    {
      type: "heading",
      text: "Creating a variable",
    },
    {
      type: "prose",
      body: "You create a variable with the `=` sign. Write the name on the left and the information on the right: `age = 30`. The information itself is called a value, and storing it under a name is called assignment. The `=` sign does not mean \"equals\" here. It means \"store the value on the right in the name on the left.\"",
    },
    {
      type: "prose",
      body: "Once a variable exists, you can use its name anywhere you would use the value. Writing `print(age)` prints the value stored in `age`, which is `30`. Notice that `age` has no quotation marks. Quotation marks mean text, and no quotation marks mean a name.",
    },
    {
      type: "example",
      code: `age = 30
city = "Phoenix"
print(age)
print(city)`,
    },
    {
      type: "prose",
      body: "A variable can be given a new value at any time. The old value is replaced, and the program uses the new one from that line onward. When you write `b = a`, `b` gets the value that `a` holds at that moment. Giving `a` a new value later does not change `b`.",
    },
    {
      type: "example",
      code: `score = 10
print(score)
score = 25
print(score)

a = 5
b = a
a = 9
print(a)
print(b)`,
    },
    {
      type: "heading",
      text: "Choosing names",
    },
    {
      type: "prose",
      body: "A variable name can contain letters, digits, and underscores. It cannot start with a digit and it cannot contain spaces. Names are case-sensitive, so `score` and `Score` are two different variables. Python also keeps a few words for itself, such as `True` and `None`, so you cannot use those as names.",
    },
    {
      type: "prose",
      body: "Python programmers write names in snake_case: lowercase words joined by underscores, such as `user_name` or `total_price`. Python does not force this style, but everyone expects it. Choose a name that describes what the variable holds, so that your code explains itself.",
    },
    {
      type: "prose",
      body: "You can create several variables in one line. `width, height = 3, 4` stores `3` in `width` and `4` in `height`. The same idea lets two variables trade values: `first, second = second, first`. Python works out the whole right side before it stores anything, so the swap works.",
    },
    {
      type: "exercise",
      id: "variables-1",
      prompt:
        "Create a variable called city set to the string \"Phoenix\", then print it.",
      starterCode: `# create the variable and print it
`,
      check: { type: "stdout-exact", expected: "Phoenix" },
      solution: `city = "Phoenix"
print(city)
`,
      hint: "Write city = and then the text inside quotation marks. Print the variable by its name, without quotation marks.",
    },
    {
      type: "heading",
      text: "Types of values",
    },
    {
      type: "prose",
      body: "Every value has a type, which describes what kind of information it is. A whole number such as `30` has the type `int`. A number with a decimal point, such as `4.5`, has the type `float`. Text such as `\"Ada\"` has the type `str`, short for string.",
    },
    {
      type: "prose",
      body: "Two more types are worth knowing now. A `bool` is either `True` or `False`, always written with a capital first letter. `None` is a special value that means \"no value yet\", and its type is called `NoneType`. The built-in function `type()` tells you the type of any value you give it.",
    },
    {
      type: "example",
      code: `age = 30
price = 4.5
name = "Ada"
is_member = True
nothing = None
print(type(age))
print(type(price))
print(type(name))
print(type(is_member))
print(type(nothing))`,
    },
    {
      type: "prose",
      body: "Python does not lock a variable to one type. You can store a number in a variable now and text in the same variable later. Whatever you assigned last is what the variable holds.",
    },
    {
      type: "heading",
      text: "Converting between types",
    },
    {
      type: "prose",
      body: "The text `\"42\"` and the number `42` look alike when printed, but they are different types and behave differently. Three functions convert a value to another type: `int()` makes a whole number, `float()` makes a decimal number, and `str()` makes text. You give each one the value to convert.",
    },
    {
      type: "example",
      code: `count_text = "42"
count = int(count_text)
print(type(count_text))
print(type(count))
print(int(3.9))
print(float("3.5"))
print(type(str(42)))`,
    },
    {
      type: "prose",
      body: "Notice that `int(3.9)` gives `3`. The `int()` function drops the decimal part. It does not round. Conversions can also fail: Python cannot turn the text `\"abc\"` into a number, so `int(\"abc\")` stops with a `ValueError`.",
    },
    {
      type: "example",
      code: `print(int("abc"))`,
      showsError: true,
    },
    {
      type: "exercise",
      id: "variables-2",
      prompt:
        "The variables first and second hold the text \"left\" and \"right\". Swap their values using the multiple assignment shown above, then print first and then second, each on its own line.",
      starterCode: `first = "left"
second = "right"
# swap the two values, then print them
`,
      check: { type: "stdout-exact", expected: "right\nleft" },
      solution: `first = "left"
second = "right"
first, second = second, first
print(first)
print(second)
`,
      hint: "Write first, second = second, first on one line, before the two print() calls.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Using a name before you create it is the most common mistake. `print(score)` on a program with no `score` variable gives a `NameError`, which you met in the last lesson. Create the variable on an earlier line than the line that uses it.",
    },
    {
      type: "prose",
      body: "Other mistakes come from the naming rules. A name that starts with a digit, such as `2nd_place`, is a `SyntaxError`. A capital letter in the wrong place points at a different name, so using `Score` after creating `score` gives a `NameError`, and writing `true` instead of `True` fails for the same reason. When you see an error, read the last line of the message.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A variable is a name attached to a value, created with `=`. Names use letters, digits, and underscores, and snake_case is the convention. Values have types such as `int`, `float`, `str`, `bool`, and `None`, which `type()` reports, and `int()`, `float()`, and `str()` convert between them.",
    },
    {
      type: "exercise",
      id: "variables-3",
      prompt:
        "The variable price_text holds the text \"19.99\". Convert it to a decimal number with float(), store the result in a variable called price, and print type(price). The output should be: <class 'float'>",
      starterCode: `price_text = "19.99"
# convert it, store it in price, and print its type
`,
      check: { type: "stdout-exact", expected: "<class 'float'>" },
      solution: `price_text = "19.99"
price = float(price_text)
print(type(price))
`,
      hint: "float() takes the text as its input and gives back a number. Store that result in price, then give price to type().",
    },
  ],
};

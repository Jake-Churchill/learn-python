export default {
  slug: "booleans-and-comparisons",
  title: "Booleans & Comparisons",
  unit: "Numbers & Text",
  blocks: [
    {
      type: "prose",
      body: "Programs constantly ask questions. Is the password correct? Is the temperature below freezing? Can the customer afford this item?",
    },
    {
      type: "prose",
      body: "Each of these questions has a yes-or-no answer, and Python represents those answers with two values: `True` and `False`. This lesson shows how to ask such questions and how to combine the answers. The next unit uses them to make decisions.",
    },
    {
      type: "heading",
      text: "True and False",
    },
    {
      type: "prose",
      body: "You met the `bool` type in the Variables & Types lesson. It has exactly two values, `True` and `False`, written with a capital first letter and no quotation marks. A value of this type is called a boolean. With quotation marks, `\"True\"` would be a string of four letters, not a boolean.",
    },
    {
      type: "prose",
      body: "You can store a boolean in a variable like any other value. Names that read as a yes-or-no question, such as `is_member` or `has_ticket`, make code easy to follow.",
    },
    {
      type: "heading",
      text: "Comparison operators",
    },
    {
      type: "prose",
      body: "A comparison operator compares two values and produces a boolean. `==` checks whether two values are equal, and `!=` checks whether they are different. `<` means less than and `>` means greater than. `<=` means less than or equal to, and `>=` means greater than or equal to.",
    },
    {
      type: "prose",
      body: "Notice that equality uses two equals signs. A single `=` stores a value in a variable, while `==` asks whether two values are the same. Numbers compare by value, so `3 == 3.0` is `True`. The text `\"3\"` is not equal to the number `3`, because a string is never equal to a number.",
    },
    {
      type: "example",
      code: `age = 20
print(age == 20)
print(age != 20)
print(age > 18)
print(age < 18)
print(age >= 20)
print(3 == 3.0)
print("3" == 3)`,
    },
    {
      type: "prose",
      body: "The result of a comparison is an ordinary value, so you can store it: `is_adult = age >= 18`. Python works out the comparison first, then stores `True` or `False` in the variable.",
    },
    {
      type: "exercise",
      id: "booleans-and-comparisons-1",
      prompt:
        "The variables price and budget are set for you. Replace False with a comparison that is True when price is less than or equal to budget. The output should be exactly: Can afford: True",
      starterCode: `price = 12.5
budget = 20
can_afford = False  # replace False with a comparison
print("Can afford:", can_afford)
`,
      check: { type: "stdout-exact", expected: "Can afford: True" },
      solution: `price = 12.5
budget = 20
can_afford = price <= budget
print("Can afford:", can_afford)
`,
      hint: "Use the <= operator with price on the left and budget on the right.",
    },
    {
      type: "heading",
      text: "Comparing strings",
    },
    {
      type: "prose",
      body: "Strings can be compared too. `==` is `True` only when two strings match exactly, character for character, so capital letters matter: `\"Ada\" == \"ada\"` is `False`. To ignore capitals, compare lowercase copies made with `lower()` from the String Methods lesson.",
    },
    {
      type: "prose",
      body: "`<` and `>` compare strings one character at a time from the left, using a code number that Python gives every character. Among capital letters alone, or small letters alone, this is alphabetical order, but every capital from A to Z comes before every small letter from a to z, so `\"Zebra\" < \"apple\"` is `True`. Digits inside text are compared as characters too, so `\"10\" < \"9\"` is `True` because the character `1` comes before `9`.",
    },
    {
      type: "example",
      code: `print("apple" < "banana")
print("Ada" == "ada")
print("Ada".lower() == "ada")
print("Zebra" < "apple")
print("10" < "9")`,
    },
    {
      type: "heading",
      text: "Combining with and, or, and not",
    },
    {
      type: "prose",
      body: "Python keeps three words for combining booleans: `and`, `or`, and `not`. `and` gives `True` only when both sides are `True`. `or` gives `True` when at least one side is `True`. `not` flips a single boolean, so `not True` is `False`.",
    },
    {
      type: "prose",
      body: "Comparisons are worked out before any of the three, so `age >= 18 and has_ticket` compares first and then combines. Among the three, `not` comes first, then `and`, then `or`. Parentheses make the order clear, and they are worth adding whenever you mix `and` with `or`.",
    },
    {
      type: "example",
      code: `age = 16
has_ticket = True
is_raining = False
print(age >= 18 and has_ticket)
print(age < 18 or has_ticket)
print(not is_raining)
print(has_ticket and not is_raining)`,
    },
    {
      type: "heading",
      text: "Chained comparisons",
    },
    {
      type: "prose",
      body: "To check that a value lies between two others, you can chain comparisons. `0 <= score <= 100` means the same as `0 <= score and score <= 100`, and it reads the way you would write it in math. Use `<=` at an end you want to include and `<` at an end you want to leave out.",
    },
    {
      type: "example",
      code: `temperature = 72
print(65 <= temperature <= 80)
print(0 < temperature < 32)
score = 100
print(0 <= score <= 100)
print(0 <= score < 100)`,
    },
    {
      type: "exercise",
      id: "booleans-and-comparisons-2",
      prompt:
        "The variables temperature and humidity are set for you. Print two lines. First, whether temperature is from 65 to 80, including both ends, using a chained comparison. Second, whether the day is comfortable, which means the temperature is in that range and humidity is below 60. The output should be exactly: True and then False",
      starterCode: `temperature = 72
humidity = 70
# print whether temperature is from 65 to 80
# print whether the day is comfortable
`,
      check: { type: "stdout-exact", expected: "True\nFalse" },
      solution: `temperature = 72
humidity = 70
print(65 <= temperature <= 80)
print(65 <= temperature <= 80 and humidity < 60)
`,
      hint: "The first line is a chained comparison with <= at both ends. The second line joins that same comparison and humidity < 60 with and.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Writing `=` when you mean `==` is the most common mistake. `=` stores a value and `==` compares, and only `==` produces `True` or `False`. Also write the two-character operators in the right order: `>=` and `<=`, never `=>` or `=<`, which cause a `SyntaxError`.",
    },
    {
      type: "prose",
      body: "Floats can trip you up as well. Because of the tiny errors in decimal numbers, `0.1 + 0.2 == 0.3` is `False`, but rounding first fixes it: `round(0.1 + 0.2, 2) == 0.3` is `True`. Comparing a number with a string using `<` or `>` stops with a `TypeError`, so convert input with `int()` or `float()` before comparing it with a number.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A boolean is `True` or `False`. The comparison operators `==`, `!=`, `<`, `>`, `<=`, and `>=` produce booleans, and strings compare character by character, with capital letters before small ones. `and`, `or`, and `not` combine booleans, and a chain such as `0 <= score <= 100` checks a range in one expression.",
    },
    {
      type: "exercise",
      id: "booleans-and-comparisons-3",
      prompt:
        "The program receives the input 67. Ask for an age with the exact prompt Age? (a question mark followed by a space) and convert the answer to a whole number. Then print four lines: whether the person is a child (under 12), whether they are a senior (65 or older), whether they get a discount (child or senior), and whether they pay full price (no discount). The output should be exactly five lines: Age? 67, then False, then True, then True, then False",
      starterCode: `# ask for the age and convert it to a whole number
`,
      stdin: "67",
      check: {
        type: "stdout-exact",
        expected: "Age? 67\nFalse\nTrue\nTrue\nFalse",
      },
      solution: `age = int(input("Age? "))
is_child = age < 12
is_senior = age >= 65
has_discount = is_child or is_senior
print(is_child)
print(is_senior)
print(has_discount)
print(not has_discount)
`,
      hint: "Store each answer in a variable, such as is_child = age < 12. Build the discount answer from is_child and is_senior with or, and the full-price answer with not.",
    },
  ],
};

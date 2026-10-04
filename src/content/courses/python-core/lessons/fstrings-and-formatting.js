export default {
  slug: "fstrings-and-formatting",
  title: "f-strings & Formatting",
  unit: "Numbers & Text",
  blocks: [
    {
      type: "prose",
      body: "Most output mixes fixed text with values: a name in a greeting, a price on a receipt, a score on a results line. Joining the pieces with `+` and `str()` works, but it gets messy fast. f-strings let you write the whole line as one string, with each value placed right where it belongs. Format specs then control how those values look.",
    },
    {
      type: "heading",
      text: "Your first f-string",
    },
    {
      type: "prose",
      body: "An f-string is a string with the letter `f` placed directly before the opening quote. Inside it, a variable name written in curly braces, `{` and `}`, is replaced by that variable's value when the line runs. The rest of the text is kept exactly as written. Values of any type work, so numbers need no `str()`.",
    },
    {
      type: "example",
      code: `name = "Sam"
score = 95
print(f"{name} scored {score} points")
print("Player: " + name + ", score: " + str(score))
print(f"Player: {name}, score: {score}")`,
    },
    {
      type: "prose",
      body: "The last two lines print the same text. The f-string version is shorter, needs no conversion, and shows the shape of the output at a glance.",
    },
    {
      type: "exercise",
      id: "fstrings-and-formatting-1",
      prompt:
        "This print() call is missing one character, so it prints the braces and names instead of the values. Fix it so the output is exactly: Sam scored 95 points",
      starterCode: `name = "Sam"
score = 95
print("{name} scored {score} points")
`,
      check: { type: "stdout-exact", expected: "Sam scored 95 points" },
      solution: `name = "Sam"
score = 95
print(f"{name} scored {score} points")
`,
      hint: "An f-string needs the letter f directly before the opening quotation mark.",
    },
    {
      type: "heading",
      text: "Expressions inside the braces",
    },
    {
      type: "prose",
      body: "The braces can hold more than a variable name. Any expression works: arithmetic such as `{price * quantity}`, a function call such as `{len(item)}`, or an index such as `{item[0]}`. Python works out the expression and puts its result into the string.",
    },
    {
      type: "example",
      code: `item = "notebook"
price = 4.5
quantity = 3
print(f"{quantity} x {item} = {price * quantity}")
print(f"The word {item} has {len(item)} letters")
print(f"It starts with {item[0]}")`,
    },
    {
      type: "heading",
      text: "Decimal places",
    },
    {
      type: "prose",
      body: "A format spec controls how a value is displayed. It goes inside the braces, after a colon: `{total:.2f}`. The spec `.2f` means show the number with exactly 2 digits after the decimal point, rounding if needed. The `f` stands for fixed-point, the usual way of writing decimals, and you can change the 2 to any number of digits.",
    },
    {
      type: "prose",
      body: "A format spec changes only how the value looks in this one string. The variable keeps its full value. This makes `.2f` the standard choice for money, because a total of `13.5` is shown as `13.50`.",
    },
    {
      type: "example",
      code: `price = 4.5
quantity = 3
total = price * quantity
print(f"Total: {total}")
print(f"Total: {total:.2f}")
print(f"Total: \${total:.2f}")
print(f"Pi to 3 places: {3.14159:.3f}")`,
    },
    {
      type: "prose",
      body: "In the third print() call, the `$` sits just outside the braces, so it is ordinary text printed before the number.",
    },
    {
      type: "exercise",
      id: "fstrings-and-formatting-2",
      prompt:
        "A meal costs 18.4 and the tip is 15 percent, so the tip amount is meal * 0.15. Print one line with an f-string that shows the tip to 2 decimal places after a dollar sign. The output should be exactly: Tip: $2.76",
      starterCode: `meal = 18.4
# print the tip, which is meal * 0.15, to 2 decimal places
`,
      check: { type: "stdout-exact", expected: "Tip: $2.76" },
      solution: `meal = 18.4
print(f"Tip: \${meal * 0.15:.2f}")
`,
      hint: "A format spec can follow any expression inside the braces, not just a variable name.",
    },
    {
      type: "heading",
      text: "Width and alignment",
    },
    {
      type: "prose",
      body: "A whole number after the colon sets a minimum width: the number of characters the value takes up. Python pads the value with spaces to reach that width. Text sits on the left of its space and numbers sit on the right, unless you choose otherwise. A value longer than the width is never cut short.",
    },
    {
      type: "prose",
      body: "To choose the side yourself, put an alignment sign before the width: `<` for left, `>` for right, and `^` for centered. A character placed before the alignment sign fills the gap instead of spaces. In the next example, the square brackets are ordinary text that show where the padding goes.",
    },
    {
      type: "example",
      code: `name = "Ada"
age = 36
print(f"[{name:10}]")
print(f"[{age:10}]")
print(f"[{name:>10}]")
print(f"[{name:^10}]")
print(f"[{name:*^11}]")`,
    },
    {
      type: "heading",
      text: "Thousands separators",
    },
    {
      type: "prose",
      body: "A comma in the spec adds a thousands separator, so a population of `1250000` is shown as `1,250,000`. The parts of a spec combine in a fixed order: fill and alignment, then width, then the comma, then the decimal places. So `{cost:>10,.2f}` right-aligns a number in 10 characters, with commas and 2 decimal places.",
    },
    {
      type: "prose",
      body: "Giving every line the same widths lines the values up in columns. The next example prints a small budget table this way.",
    },
    {
      type: "example",
      code: `population = 1250000
print(f"Population: {population:,}")
item1 = "Rent"
cost1 = 1450
item2 = "Groceries"
cost2 = 612.4
print(f"{item1:<12}{cost1:>10,.2f}")
print(f"{item2:<12}{cost2:>10,.2f}")`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting the `f` is the most common mistake. Without it, the braces and the names inside them are printed as ordinary text. No error appears, so read your output carefully.",
    },
    {
      type: "prose",
      body: "A number spec such as `.2f` needs a number. A value read with `input()` is text, so convert it with `float()` first, or Python stops with `ValueError: Unknown format code 'f' for object of type 'str'`. To print a real brace inside an f-string, double it: `{{` prints `{` and `}}` prints `}`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "An f-string starts with `f` before the opening quote and replaces each pair of braces with the value of the expression inside. A format spec after a colon controls the display: `.2f` for 2 decimal places, a number for the width, `<`, `>`, or `^` for alignment, and a comma for thousands separators. The spec changes only what is shown, never the value itself.",
    },
    {
      type: "exercise",
      id: "fstrings-and-formatting-3",
      prompt:
        "A shop sells 3 laptops at 1249.5 each. Print one line with an f-string: the product name left-aligned in a field 10 characters wide, followed directly by the total cost (price times quantity) right-aligned in a field 12 characters wide, with a thousands separator and 2 decimal places. The output should be exactly: Laptop        3,748.50 (Laptop, 8 spaces, then 3,748.50)",
      starterCode: `product = "Laptop"
price = 1249.5
quantity = 3
# print the product and the total cost in one f-string
`,
      check: { type: "stdout-exact", expected: "Laptop        3,748.50" },
      solution: `product = "Laptop"
price = 1249.5
quantity = 3
print(f"{product:<10}{price * quantity:>12,.2f}")
`,
      hint: "Use two pairs of braces side by side with nothing between them. Give product the spec <10. Put price * quantity in the second pair, with a spec made of >12, then a comma, then .2f.",
    },
  ],
};

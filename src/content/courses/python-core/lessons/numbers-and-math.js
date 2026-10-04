export default {
  slug: "numbers-and-math",
  title: "Numbers & Math",
  unit: "Numbers & Text",
  blocks: [
    {
      type: "prose",
      body: "Programs spend much of their time working with numbers: adding up a bill, turning minutes into hours, or working out the area of a room. Python can do all of this arithmetic for you. This lesson covers the math operators, the difference between whole and decimal numbers, and a few tools for rounding and measuring.",
    },
    {
      type: "heading",
      text: "Arithmetic operators",
    },
    {
      type: "prose",
      body: "An operator is a symbol that combines values to produce a new one. Python uses `+` for addition, `-` for subtraction, `*` for multiplication, and `/` for division. The values on either side can be numbers you type directly or variables that hold numbers.",
    },
    {
      type: "prose",
      body: "A combination of values and operators, such as `price * quantity`, is called an expression. Python works out the expression and uses its result wherever you wrote it, for example inside `print()` or on the right side of `=`.",
    },
    {
      type: "example",
      code: `price = 12
quantity = 3
print(price + 5)
print(price - 5)
print(price * quantity)
print(price / 5)`,
    },
    {
      type: "prose",
      body: "Notice that `price / 5` gives `2.4`, a float. The `/` operator always produces a float, even when the division comes out even: `8 / 2` gives `4.0`, not `4`.",
    },
    {
      type: "heading",
      text: "Floor division, remainder, and powers",
    },
    {
      type: "prose",
      body: "Three more operators handle common jobs. `//` is floor division: it divides and then rounds the result down to a whole number. `%` gives the remainder, the amount left over after dividing, and is often called modulo. `**` raises a number to a power, so `2 ** 3` means 2 times 2 times 2, which is `8`.",
    },
    {
      type: "prose",
      body: "Floor division and remainder work well together. If 50 eggs go into cartons that hold 12, `50 // 12` tells you how many cartons you can fill, and `50 % 12` tells you how many eggs are left over.",
    },
    {
      type: "example",
      code: `eggs = 50
print(eggs // 12)
print(eggs % 12)
print(2 ** 3)
print(10 ** 2)`,
    },
    {
      type: "exercise",
      id: "numbers-and-math-1",
      prompt:
        "A movie lasts 135 minutes. The number of full hours is worked out for you. Replace the 0 so that leftover holds the minutes left over after the full hours, using the % operator. The output should be exactly: 2 hours 15 minutes",
      starterCode: `minutes = 135
hours = minutes // 60
leftover = 0  # replace 0 with the remainder calculation
print(hours, "hours", leftover, "minutes")
`,
      check: { type: "stdout-exact", expected: "2 hours 15 minutes" },
      solution: `minutes = 135
hours = minutes // 60
leftover = minutes % 60
print(hours, "hours", leftover, "minutes")
`,
      hint: "An hour has 60 minutes, so the minutes left over are the remainder of dividing minutes by 60.",
    },
    {
      type: "heading",
      text: "Order of operations",
    },
    {
      type: "prose",
      body: "When an expression has several operators, Python does not simply work from left to right. It follows a fixed order called precedence: `**` first, then `*`, `/`, `//`, and `%`, then `+` and `-`. So `2 + 3 * 4` is `14`, because the multiplication happens before the addition.",
    },
    {
      type: "prose",
      body: "Operators on the same level are worked out from left to right, so `10 - 4 - 3` is `3`. The one exception is `**`, which works from right to left. Parentheses override all of this: Python works out what is inside them first, so `(2 + 3) * 4` is `20`. When an expression is hard to read, add parentheses even where they are not needed.",
    },
    {
      type: "example",
      code: `print(2 + 3 * 4)
print((2 + 3) * 4)
print(10 - 4 - 3)
print(2 * 3 ** 2)`,
    },
    {
      type: "heading",
      text: "Whole numbers and decimals",
    },
    {
      type: "prose",
      body: "The Variables & Types lesson introduced two number types: `int` for whole numbers and `float` for numbers with a decimal point. When both values are ints, `+`, `-`, `*`, `//`, and `%` give an int. If either value is a float, the result is a float, even when its decimal part is zero.",
    },
    {
      type: "prose",
      body: "Computers store floats in a form that cannot hold most decimals exactly, so tiny errors can appear. `0.1 + 0.2` gives `0.30000000000000004` instead of `0.3`. This is normal and rarely matters, and the `round()` function shown later tidies it up for display.",
    },
    {
      type: "example",
      code: `print(3 + 2)
print(3 + 2.0)
print(8 / 2)
print(type(8 // 2))
print(0.1 + 0.2)`,
    },
    {
      type: "heading",
      text: "Updating a variable",
    },
    {
      type: "prose",
      body: "Programs often change a variable based on its current value, such as adding points to a score. You could write `score = score + 10`: Python works out the right side using the old value, then stores the result back in `score`. The shorter form `score += 10` does exactly the same thing.",
    },
    {
      type: "prose",
      body: "Each arithmetic operator has a version like this: `-=`, `*=`, `/=`, `//=`, `%=`, and `**=`. They are called augmented assignment operators. Each one applies its operator to the variable and the value on the right, then stores the result in the variable.",
    },
    {
      type: "example",
      code: `score = 0
score += 10
score += 5
print(score)
score -= 3
print(score)
score *= 2
print(score)`,
    },
    {
      type: "exercise",
      id: "numbers-and-math-2",
      prompt:
        "The variable balance starts at 100. Using augmented assignment operators, add 50, then subtract 30, then double the balance. The print() call is already written. The output should be exactly: 240",
      starterCode: `balance = 100
# add 50, subtract 30, then double the balance
print(balance)
`,
      check: { type: "stdout-exact", expected: "240" },
      solution: `balance = 100
balance += 50
balance -= 30
balance *= 2
print(balance)
`,
      hint: "Use +=, then -=, then *=, one per line, above the print() call.",
    },
    {
      type: "heading",
      text: "Rounding, absolute values, and math tools",
    },
    {
      type: "prose",
      body: "`round()` rounds a number. Given one value, it rounds to the nearest whole number and gives an int. Given a second value, it rounds to that many digits after the decimal point (zeros at the end are not shown), so `round(3.14159, 2)` gives `3.14`. `abs()` gives the absolute value, which is the distance from zero, so `abs(-12)` is `12`.",
    },
    {
      type: "prose",
      body: "Python also has extra tools that are not available until you ask for them. The line `import math` brings in a set of math tools; Unit 10 covers imports fully. After that line, you use a tool by writing `math.` and then its name. `math.sqrt()` gives a square root, `math.floor()` rounds down to a whole number, and `math.pi` holds the value of pi.",
    },
    {
      type: "example",
      code: `import math

print(round(7.6))
print(round(3.14159, 2))
print(abs(-12))
print(math.sqrt(25))
print(math.floor(7.9))
print(math.pi)`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting parentheses is the most common mistake. To average two test scores you need `(80 + 90) / 2`, which is `85.0`. Without the parentheses, `80 + 90 / 2` divides first and gives `125.0`.",
    },
    {
      type: "prose",
      body: "Dividing by zero stops the program with `ZeroDivisionError: division by zero`. This applies to `/`, `//`, and `%` alike. When you see it, look for the variable that held zero.",
    },
    {
      type: "prose",
      body: "`round()` can surprise you with numbers that end in exactly .5. It rounds them to the nearest even number, so `round(2.5)` is `2` while `round(3.5)` is `4`. This is deliberate, and it keeps totals from drifting upward when many numbers are rounded.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Python has operators for addition, subtraction, multiplication, division, floor division, remainder, and powers, applied in a fixed order that parentheses can override. `/` always gives a float, and mixing an int with a float gives a float. Augmented operators such as `+=` update a variable from its current value. `round()` and `abs()` tidy numbers, and `import math` brings in `math.sqrt()`, `math.floor()`, and `math.pi`.",
    },
    {
      type: "exercise",
      id: "numbers-and-math-3",
      prompt:
        "A round table has a radius of 3. Bring in the math tools, work out the area with the formula pi times the radius squared, round it to 2 decimal places, and print it after the label Area: so the output is exactly: Area: 28.27",
      starterCode: `# bring in the math tools on the first line
radius = 3
# work out the area, round it to 2 decimal places, and print it
`,
      check: { type: "stdout-exact", expected: "Area: 28.27" },
      solution: `import math

radius = 3
area = math.pi * radius ** 2
print("Area:", round(area, 2))
`,
      hint: "The area is math.pi * radius ** 2, and precedence squares the radius before multiplying. Give print() two values: the text \"Area:\" and round(area, 2).",
    },
  ],
};

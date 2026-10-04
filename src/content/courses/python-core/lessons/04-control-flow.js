export default {
  slug: "control-flow",
  title: "if, elif & else",
  unit: "Decisions",
  blocks: [
    {
      type: "prose",
      body: "Every program so far has run every one of its lines, from top to bottom. Real programs need to make choices: charge shipping only on small orders, warn only when a password is too short, print a different message for a hot day than for a cold one. This lesson shows how to make Python run some lines only when something is true.",
    },
    {
      type: "prose",
      body: "In the Booleans & Comparisons lesson you wrote comparisons such as `age >= 18`, which produce `True` or `False`. When Python uses a value like that to decide what to do next, the value is called a condition. Every decision in this unit is built from conditions.",
    },
    {
      type: "heading",
      text: "Making a decision with if",
    },
    {
      type: "prose",
      body: "A statement is one complete instruction, such as an assignment or a call to `print()`. An `if` statement runs some lines only when its condition is `True`. You write the word `if`, then the condition, then a colon `:`. The lines that depend on the condition go underneath, each starting with four spaces.",
    },
    {
      type: "prose",
      body: "When the condition is `False`, Python skips those indented lines and continues with the first line after them. Lines that are not indented under the `if` run either way.",
    },
    {
      type: "example",
      code: `order_total = 62.50
if order_total >= 50:
    print("You get free shipping.")
print("Thank you for your order.")`,
    },
    {
      type: "prose",
      body: "Change `order_total` to `30` and run the example again. The shipping message disappears, but the thank-you line still prints, because it is not indented under the `if`.",
    },
    {
      type: "heading",
      text: "Blocks and indentation",
    },
    {
      type: "prose",
      body: "The indented lines under an `if` form a block: a group of lines that Python runs or skips together. The spaces at the start of a line are called indentation, and they are how Python knows which lines belong to the block. A block starts on the line after the colon and ends at the first line that goes back to the earlier indentation.",
    },
    {
      type: "prose",
      body: "A block can hold as many lines as you need, and every line in it must have the same indentation. Four spaces is the standard amount. In the Reading Error Messages lesson, extra spaces at the start of a line caused an `IndentationError`. Lines inside a block are the place where indentation is required.",
    },
    {
      type: "example",
      code: `temperature = 31
if temperature > 30:
    print("It is hot today.")
    print("Drink plenty of water.")
print("Forecast done.")`,
    },
    {
      type: "prose",
      body: "A block cannot be empty. If the line after the colon is not indented, Python stops before running anything. The last line of the message below reads `IndentationError: expected an indented block after 'if' statement on line 2`. Indenting the `print()` line fixes it.",
    },
    {
      type: "example",
      code: `temperature = 31
if temperature > 30:
print("It is hot today.")`,
      showsError: true,
    },
    {
      type: "heading",
      text: "Choosing between two paths with else",
    },
    {
      type: "prose",
      body: "Often you want one thing to happen when a condition is `True` and something different when it is `False`. Add an `else:` line after the `if` block, at the same indentation as the `if`, and put the other lines in a block under it. Each possible path through an `if` statement is called a branch.",
    },
    {
      type: "prose",
      body: "With an `else`, exactly one of the two branches runs: never both, and never neither. The `else` has no condition of its own. It covers every case the `if` did not.",
    },
    {
      type: "example",
      code: `password = "sunflower"
if len(password) >= 8:
    print("Password accepted.")
else:
    print("Password too short.")`,
    },
    {
      type: "heading",
      text: "Even or odd",
    },
    {
      type: "prose",
      body: "The `%` operator from the Numbers & Math lesson gives the remainder after a division. An even number divides by 2 with nothing left over, so `number % 2 == 0` is `True` for even numbers and `False` for odd ones. That makes it a natural condition for an `if`.",
    },
    {
      type: "example",
      code: `number = 14
if number % 2 == 0:
    print(number, "is even")
else:
    print(number, "is odd")`,
    },
    {
      type: "prose",
      body: "The same idea works with any number after the `%`. For example, `guests % 4 == 0` is `True` when a group of guests fills tables of four with no empty seats.",
    },
    {
      type: "exercise",
      id: "control-flow-1",
      prompt:
        "The variable number holds 7, and the if branch is written for you. Add an else branch so the program prints exactly: odd",
      starterCode: `number = 7
if number % 2 == 0:
    print("even")
# add an else branch that prints odd
`,
      check: { type: "stdout-exact", expected: "odd" },
      solution: `number = 7
if number % 2 == 0:
    print("even")
else:
    print("odd")
`,
      hint: "Write else: at the same indentation as the if, then an indented line that prints \"odd\".",
    },
    {
      type: "heading",
      text: "More than two paths with elif",
    },
    {
      type: "prose",
      body: "Some decisions have more than two outcomes. `elif`, short for \"else if\", adds another condition between the `if` and the `else`. You can add as many `elif` branches as you need, and the final `else` is optional.",
    },
    {
      type: "prose",
      body: "Python checks the conditions from top to bottom and runs only the first branch whose condition is `True`. It skips every branch after that one, even if their conditions are also `True`. If no condition is `True`, the `else` block runs, or nothing runs when there is no `else`.",
    },
    {
      type: "example",
      code: `temperature = 18
if temperature >= 30:
    print("Hot")
elif temperature >= 20:
    print("Warm")
elif temperature >= 10:
    print("Mild")
else:
    print("Cold")`,
    },
    {
      type: "prose",
      body: "Because the first `True` branch wins, the order of the branches matters. If `temperature >= 10` were checked first, a temperature of 35 would pass it and print Mild, and the Hot branch would never get a turn. When conditions overlap like this, put the strictest one first.",
    },
    {
      type: "exercise",
      id: "control-flow-2",
      prompt:
        "A cinema charges by age: under 12 pays 6 dollars, 65 or older pays 7 dollars, and everyone else pays 12 dollars. The variable age holds 70. Use if, elif, and else to print the price for that age. The output should be exactly: Ticket price: $7",
      starterCode: `age = 70
# print the ticket price for this age
`,
      check: { type: "stdout-exact", expected: "Ticket price: $7" },
      solution: `age = 70
if age < 12:
    print("Ticket price: $6")
elif age >= 65:
    print("Ticket price: $7")
else:
    print("Ticket price: $12")
`,
      hint: "Write three branches: if age < 12, elif age >= 65, and else. Each branch prints its own price.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting the colon at the end of an `if`, `elif`, or `else` line is the most frequent slip. Python reports `SyntaxError: expected ':'` and points at the end of that line. Every line that opens a block ends with a colon.",
    },
    {
      type: "prose",
      body: "Mixing indentation inside one block also fails. If one line starts with four spaces and the next with two, Python cannot tell which block the second line belongs to, and it reports `IndentationError: unindent does not match any outer indentation level`. Use four spaces for every line of a block.",
    },
    {
      type: "prose",
      body: "A third mistake is giving `else` a condition, as in `else temperature < 10:`. Python reports `SyntaxError: expected ':'` and points just after the word `else`, because nothing may come between `else` and its colon. When a branch needs its own condition, use `elif`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "An `if` statement runs its block only when its condition is `True`. A block is a group of lines indented by the same amount under a line that ends in a colon. `elif` adds more conditions, checked in order until one is `True`, and `else` runs when none of them were. The condition `number % 2 == 0` tells even numbers from odd ones.",
    },
    {
      type: "exercise",
      id: "control-flow-3",
      prompt:
        "In the counting game FizzBuzz, a number that divides evenly by both 3 and 5 is called FizzBuzz, one that divides evenly by 3 only is Fizz, one that divides evenly by 5 only is Buzz, and any other number is just said as itself. The variable number holds 15. Print what the game says for it. The output should be exactly: FizzBuzz",
      starterCode: `number = 15
# print FizzBuzz, Fizz, Buzz, or the number itself
`,
      check: { type: "stdout-exact", expected: "FizzBuzz" },
      solution: `number = 15
if number % 3 == 0 and number % 5 == 0:
    print("FizzBuzz")
elif number % 3 == 0:
    print("Fizz")
elif number % 5 == 0:
    print("Buzz")
else:
    print(number)
`,
      hint: "Check the both-3-and-5 case first, joining two % checks with and. If the plain divides-by-3 check comes first, 15 stops there and prints Fizz.",
    },
  ],
};

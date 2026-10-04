export default {
  slug: "functions",
  title: "Defining & Calling Functions",
  unit: "Functions",
  blocks: [
    {
      type: "prose",
      body: "You have been calling functions since the first lesson: `print()`, `len()`, `input()`, and others. Each one is a named piece of code that does one job, written by someone else. In this lesson you write your own, so you can give a set of steps a name and run them whenever you need them.",
    },
    {
      type: "prose",
      body: "Functions also keep programs short and easy to fix. Instead of copying the same lines to three places, you write them once inside a function and call it three times. When those lines need to change, you change them in one place.",
    },
    {
      type: "heading",
      text: "Defining a function",
    },
    {
      type: "prose",
      body: "You create a function with a `def` statement, short for define. Write `def`, the function's name, a pair of parentheses, and a colon. The indented lines under it are the function's body, the steps it runs. Function names follow the same rules as variable names, and snake_case is the convention.",
    },
    {
      type: "prose",
      body: "Defining a function does not run it. Python reads the `def` statement, remembers the body under that name, and moves on. The body runs only when you call the function by writing its name followed by parentheses, and it runs again every time you call it.",
    },
    {
      type: "example",
      code: `def show_menu():
    print("1. Coffee")
    print("2. Tea")
    print("3. Hot chocolate")

print("Welcome!")
show_menu()
print("Back to the start:")
show_menu()`,
    },
    {
      type: "prose",
      body: "The output starts with `Welcome!` even though the `def` comes first in the code. When a call finishes, the program carries on from the line after the call. A function must be defined before the line that calls it runs; calling it earlier stops the program with a `NameError`.",
    },
    {
      type: "heading",
      text: "Parameters and arguments",
    },
    {
      type: "prose",
      body: "A function becomes more useful when it can work with different values. A parameter is a variable name written inside the parentheses of the `def` line. An argument is the value you write inside the parentheses when you call the function. On each call, Python stores the argument in the parameter, then runs the body.",
    },
    {
      type: "prose",
      body: "A function can have several parameters, separated by commas. The arguments are matched to the parameters in order: the first argument goes into the first parameter, the second into the second, and so on. The call must give one argument for each parameter.",
    },
    {
      type: "example",
      code: `def greet(name):
    print(f"Hello, {name}!")

greet("Ada")
greet("Grace")

def show_price(item, price):
    print(f"{item}: \${price:.2f}")

show_price("Coffee", 3.5)
show_price("Bagel", 2)`,
    },
    {
      type: "prose",
      body: "A body cannot be empty. When you want to write the `def` line now and the body later, put `pass` in the body: a statement that does nothing and only holds the place. Exercises in this unit often use `pass` in their starter code, and you replace it with your own lines.",
    },
    {
      type: "exercise",
      id: "functions-1",
      prompt:
        "The function square(n) is started for you, and two calls are written below it. Replace the pass line with one line that prints n multiplied by itself. The output should be exactly two lines: 36 and then 9",
      starterCode: `def square(n):
    # print n multiplied by itself
    pass

square(6)
square(3)
`,
      check: { type: "stdout-exact", expected: "36\n9" },
      solution: `def square(n):
    print(n * n)

square(6)
square(3)
`,
      hint: "Inside the function, n holds the argument of each call. Write print(n * n) in place of pass, indented like the comment.",
    },
    {
      type: "heading",
      text: "Returning a value",
    },
    {
      type: "prose",
      body: "The `square()` function you just wrote prints its answer, so the answer goes to the screen and the rest of the program cannot use it. Most functions instead hand their result back to the code that called them, known as the caller. A `return` statement does this: `return n * n` works out `n * n` and sends that value back. The value a function sends back is called its return value.",
    },
    {
      type: "prose",
      body: "Python then treats the call as if it were the return value. You can store it in a variable, print it, or use it in a calculation, just as you use the results of `len()` and `input()`. `return` also ends the function at once, so no later line in the body runs. A function can have several `return` statements, and the first one Python reaches decides the result.",
    },
    {
      type: "example",
      code: `def square(n):
    return n * n

area = square(4)
print(area)
print(square(3) + square(4))

def describe_temperature(celsius):
    if celsius >= 25:
        return "hot"
    if celsius >= 15:
        return "mild"
    return "cold"

print(describe_temperature(30))
print(describe_temperature(18))
print(describe_temperature(5))`,
    },
    {
      type: "heading",
      text: "return versus print",
    },
    {
      type: "prose",
      body: "`print()` and `return` are easy to mix up because both seem to produce the answer. `print()` shows a value to the person reading the screen. `return` hands a value to your program. A function that prints its result but never returns it gives back `None`, the special value from Variables & Types that means no value.",
    },
    {
      type: "example",
      code: `def show_total(a, b):
    print(a + b)

def get_total(a, b):
    return a + b

shown = show_total(2, 3)
returned = get_total(2, 3)
print(shown)
print(returned)`,
    },
    {
      type: "prose",
      body: "The first line of output, `5`, is printed inside `show_total()` while it runs. That call gives back `None`, so `shown` holds `None`. Only `get_total()` hands back a number the program can keep using. Every function that ends without reaching a `return`, or reaches a `return` with no value after it, gives back `None`.",
    },
    {
      type: "prose",
      body: "From here on, many exercises ask for a function that returns a value. When you press Check, the page calls your function with a few arguments and compares each return value with the expected one. Anything your function prints is ignored, so a function that prints its answer instead of returning it is reported as having returned `None`.",
    },
    {
      type: "exercise",
      id: "functions-2",
      prompt:
        "Write a function fahrenheit(celsius) that returns the temperature converted to Fahrenheit, using the formula celsius * 9 / 5 + 32. For example, fahrenheit(100) returns 212.0. Return the value; do not print it.",
      starterCode: `def fahrenheit(celsius):
    # return the converted temperature
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "fahrenheit(100)", expected: "212.0" },
          { call: "fahrenheit(0)", expected: "32.0" },
          { call: "fahrenheit(-40)", expected: "-40.0" },
          { call: "fahrenheit(25)", expected: "77.0" },
        ],
      },
      solution: `def fahrenheit(celsius):
    return celsius * 9 / 5 + 32
`,
      hint: "Replace pass with the word return followed by the formula, using the parameter celsius.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting the parentheses is a common mistake. `square` on its own names the function without calling it, so `print(square)` shows a description starting with `<function square at` instead of a number. Write `square(4)` to run it.",
    },
    {
      type: "prose",
      body: "Giving the wrong number of arguments stops the program. Calling `square()` with nothing raises `TypeError: square() missing 1 required positional argument: 'n'`, which names the parameter that got no value. The next lesson explains the word positional.",
    },
    {
      type: "prose",
      body: "Finally, watch for printing where you meant to return. If a result shows up on the screen but a variable holding the call's result is `None`, the function printed instead of returning. Lines after a `return` in the same block never run, so make the `return` the last line of its block.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A `def` statement creates a function: a name, parameters in parentheses, a colon, and an indented body that runs each time the function is called. The arguments in a call are stored in the parameters in order. `return` ends the function and hands a value back to the caller, while `print()` only shows it, and a function that returns nothing gives back `None`.",
    },
    {
      type: "exercise",
      id: "functions-3",
      prompt:
        "A cinema charges by age: ages under 5 are free (0), ages 5 to 17 pay 8, ages 18 to 64 pay 12, and ages 65 and over pay 6. Write a function ticket_price(age) that returns the price as a whole number. For example, ticket_price(10) returns 8 and ticket_price(70) returns 6.",
      starterCode: `# write the function ticket_price(age) below
`,
      check: {
        type: "returns",
        cases: [
          { call: "ticket_price(3)", expected: "0" },
          { call: "ticket_price(5)", expected: "8" },
          { call: "ticket_price(17)", expected: "8" },
          { call: "ticket_price(18)", expected: "12" },
          { call: "ticket_price(64)", expected: "12" },
          { call: "ticket_price(65)", expected: "6" },
        ],
      },
      solution: `def ticket_price(age):
    if age < 5:
        return 0
    if age < 18:
        return 8
    if age < 65:
        return 12
    return 6
`,
      hint: "Use if statements that each return a price, checking the youngest ages first. A final return after them covers everyone left over.",
    },
  ],
};

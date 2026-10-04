export default {
  slug: "match-and-ternary",
  title: "match & Conditional Expressions",
  unit: "Decisions",
  blocks: [
    {
      type: "prose",
      body: "Many decisions compare one value against a set of fixed options: a menu choice, a traffic light color, a day of the week. You can write these with `if` and `elif`, but then the same variable name is repeated on every line. This lesson covers `match`, a statement built for exactly this kind of decision, and a short way to choose between two values on a single line.",
    },
    {
      type: "heading",
      text: "Matching a value against cases",
    },
    {
      type: "prose",
      body: "A `match` statement starts with the word `match`, the value to examine, and a colon. The value being examined is called the subject. Inside the `match` block go one or more `case` lines, and each `case` has its own block of lines to run.",
    },
    {
      type: "prose",
      body: "After the word `case` comes a pattern: a description of the values that case accepts. The simplest pattern is a literal, which is a value written directly in the code, such as `\"red\"` or `404`. A literal pattern matches when the subject equals it.",
    },
    {
      type: "prose",
      body: "Python tries the cases from top to bottom and runs the block of the first case that matches. The remaining cases are skipped, just as in an `if` and `elif` chain.",
    },
    {
      type: "example",
      code: `light = "yellow"
match light:
    case "green":
        print("Go")
    case "yellow":
        print("Slow down")
    case "red":
        print("Stop")`,
    },
    {
      type: "prose",
      body: "Notice the two levels of indentation. The `case` lines are indented under `match`, and each case's block is indented again under its `case`.",
    },
    {
      type: "heading",
      text: "Catching everything else with _",
    },
    {
      type: "prose",
      body: "If no case matches, Python skips the whole `match` and nothing happens. To handle every other value, add `case _:` as the last case. The underscore `_` is a wildcard: a pattern that matches any value at all, so this case works like `else`.",
    },
    {
      type: "example",
      code: `choice = input("Choose 1, 2, or 3: ")
match choice:
    case "1":
        print("Starting a new game")
    case "2":
        print("Loading your saved game")
    case "3":
        print("Goodbye")
    case _:
        print("Unknown choice:", choice)`,
      stdin: "4",
    },
    {
      type: "prose",
      body: "One case can also accept several literals separated by `|`, which reads as \"or\". `case \"Saturday\" | \"Sunday\":` matches either day, and the subject name does not have to be repeated.",
    },
    {
      type: "example",
      code: `day = "Sunday"
match day:
    case "Saturday" | "Sunday":
        print("Weekend")
    case "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday":
        print("Weekday")
    case _:
        print("That is not a day name")`,
    },
    {
      type: "exercise",
      id: "match-and-ternary-1",
      prompt:
        "The variable size holds \"M\", and the match statement already handles \"S\" and \"L\". Add a case for \"M\" that prints Medium and a wildcard case at the end that prints Unknown size. The output should be exactly: Medium",
      starterCode: `size = "M"
match size:
    case "S":
        print("Small")
    case "L":
        print("Large")
    # add a case for "M" and a wildcard case
`,
      check: { type: "stdout-exact", expected: "Medium" },
      solution: `size = "M"
match size:
    case "S":
        print("Small")
    case "M":
        print("Medium")
    case "L":
        print("Large")
    case _:
        print("Unknown size")
`,
      hint: "Each case line is indented under match, and its print() is indented under the case. The wildcard case is written case _: and goes last.",
    },
    {
      type: "heading",
      text: "Adding conditions with guards",
    },
    {
      type: "prose",
      body: "Sometimes a literal is not enough, because the decision depends on a range such as \"90 or more\". A guard is an `if` condition written after a case's pattern, on the same line. The case matches only when its pattern matches and its guard is `True`. In `case _ if score >= 90:`, the pattern `_` accepts any value and the guard makes the decision.",
    },
    {
      type: "example",
      code: `score = 87
match score:
    case 100:
        print("Perfect score")
    case _ if score >= 90:
        print("Excellent")
    case _ if score >= 50:
        print("Pass")
    case _:
        print("Try again")`,
    },
    {
      type: "prose",
      body: "A guard can follow a literal pattern too: `case \"admin\" if is_logged_in:` matches only when the subject is `\"admin\"` and `is_logged_in` is `True`. When nearly every case needs a guard, a plain `if` and `elif` chain is usually easier to read. `match` works best when most cases are fixed values.",
    },
    {
      type: "heading",
      text: "Choosing a value with a conditional expression",
    },
    {
      type: "prose",
      body: "An expression is any piece of code that produces a value, such as `3 + 4` or `price * 2`. A conditional expression produces one of two values, depending on a condition. It is written as `first_value if condition else second_value`, all on one line.",
    },
    {
      type: "prose",
      body: "Python checks the condition first. If it is `True`, the expression produces the value on the left of `if`; otherwise it produces the value after `else`. Because the result is a value, you can store it in a variable.",
    },
    {
      type: "example",
      code: `number = 7
parity = "even" if number % 2 == 0 else "odd"
print(number, "is", parity)

items = 1
word = "item" if items == 1 else "items"
print(f"You have {items} {word} in your cart.")`,
    },
    {
      type: "prose",
      body: "Use a conditional expression only to pick between two values. When a choice needs several lines of work, or there are more than two options, write a full `if` statement instead.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Writing a variable name after `case` does not compare the subject with that variable. A plain name in a pattern matches any value, the way `_` does, and stores the subject in that name. If such a case is not the last one, Python refuses to run the program, as the example below shows. To compare with a variable, use a guard: `case _ if score == target:`.",
    },
    {
      type: "example",
      code: `target = 10
score = 7
match score:
    case target:
        print("You hit the target")
    case _:
        print("Keep trying")`,
      showsError: true,
    },
    {
      type: "prose",
      body: "The message `name capture 'target' makes remaining patterns unreachable` means that `case target:` would catch every value, so the cases after it could never run.",
    },
    {
      type: "prose",
      body: "Watch the types of your literals. `input()` always returns text, so a menu choice must be matched with `case \"1\":`, in quotes. `case 1:` compares with the number 1, and text never equals a number, so that case never matches.",
    },
    {
      type: "prose",
      body: "A conditional expression needs both of its parts. Leaving off the `else`, as in `label = \"even\" if number % 2 == 0`, gives `SyntaxError: expected 'else' after 'if' expression`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`match` compares a subject with a series of `case` patterns and runs the first one that matches. A literal pattern matches an equal value, `|` lets one case accept several literals, `_` matches anything, and a guard adds an `if` condition to a case. A conditional expression, `first_value if condition else second_value`, picks one of two values on a single line.",
    },
    {
      type: "exercise",
      id: "match-and-ternary-2",
      prompt:
        "A cafe sells coffee in three sizes: \"small\" costs 2.50, \"medium\" costs 3.00, and \"large\" costs 3.50. An extra shot adds 0.75. Only these three sizes will ever occur, so no wildcard case is needed. The variable size holds \"large\" and extra_shot holds True. Use match to set a variable price from size, use a conditional expression to set shot_cost to 0.75 when extra_shot is True and 0 otherwise, then print the sum with two decimal places. The output should be exactly: Total: $4.25",
      starterCode: `size = "large"
extra_shot = True
# set price with match, set shot_cost with a conditional expression, then print the total
`,
      check: { type: "stdout-exact", expected: "Total: $4.25" },
      solution: `size = "large"
extra_shot = True
match size:
    case "small":
        price = 2.50
    case "medium":
        price = 3.00
    case "large":
        price = 3.50
shot_cost = 0.75 if extra_shot else 0
total = price + shot_cost
print(f"Total: \${total:.2f}")
`,
      hint: "Each case assigns price, for example price = 3.50. Then write shot_cost = 0.75 if extra_shot else 0, add the two, and print with an f-string using the format spec :.2f.",
    },
  ],
};

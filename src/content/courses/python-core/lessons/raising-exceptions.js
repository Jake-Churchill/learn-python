export default {
  slug: "raising-exceptions",
  title: "Raising Exceptions",
  unit: "Errors & Files",
  blocks: [
    {
      type: "prose",
      body: "In the last lesson, Python raised the exceptions and your code caught them. Your own functions can raise exceptions too. When a function receives a value it cannot work with, such as a negative price, it can stop and report exactly what went wrong to its caller, which is the code that called it.",
    },
    {
      type: "prose",
      body: "Why not just print a warning? A printed message is easy to miss, and the program carries on with a bad value. An exception stops the program unless something catches it, so the problem cannot be ignored by accident.",
    },
    {
      type: "heading",
      text: "The raise statement",
    },
    {
      type: "prose",
      body: "To raise an exception, write `raise`, an exception type, and a message in parentheses: `raise ValueError(\"price cannot be negative\")`. Python stops the function at that line, exactly as it does when one of its own errors happens. The message becomes the explanation on the last line of the traceback.",
    },
    {
      type: "example",
      code: `def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("insufficient funds")
    return balance - amount

print(withdraw(100, 30))
print(withdraw(50, 80))`,
      showsError: true,
    },
    {
      type: "prose",
      body: "The first call prints `70`. The second call raises the exception, and the traceback now has two `File` lines. The first, marked `in <module>`, is the line in the main program that called `withdraw()`. The last, marked `in withdraw`, is the `raise` line inside the function, where the exception started.",
    },
    {
      type: "heading",
      text: "Catching what your function raises",
    },
    {
      type: "prose",
      body: "An exception raised inside a function travels back to the line that called it. If that line sits in a `try` block with a matching `except`, the exception is caught there, just like one of Python's own. With `as e`, you can print the message you wrote.",
    },
    {
      type: "example",
      code: `def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("insufficient funds")
    return balance - amount

balance = 120
for amount in [50, 100, 30]:
    try:
        balance = withdraw(balance, amount)
        print(f"Withdrew {amount}, balance {balance}")
    except ValueError as e:
        print(f"Cannot withdraw {amount}: {e}")`,
    },
    {
      type: "prose",
      body: "When the withdrawal of 100 fails, `balance` keeps its value of 70. The function never returned, so the assignment `balance = withdraw(balance, amount)` never happened.",
    },
    {
      type: "exercise",
      id: "raising-exceptions-1",
      prompt:
        "split_bill(total, people) divides a bill evenly. Replace pass with a line that raises a ValueError with the message \"need at least one person\", so that split_bill(50, 0) raises that error instead of dividing by zero. For example, split_bill(90, 3) returns 30.0. If a call goes wrong, the check shows what it returned or raised next to what was expected, such as raised ValueError: need at least one person.",
      starterCode: `def split_bill(total, people):
    if people < 1:
        pass  # replace pass with a raise statement
    return round(total / people, 2)
`,
      check: {
        type: "returns",
        cases: [
          { call: "split_bill(90, 3)", expected: "30.0" },
          { call: "split_bill(100, 3)", expected: "33.33" },
          { call: "split_bill(50, 0)", expected: "raised ValueError: need at least one person" },
          { call: "split_bill(50, -2)", expected: "raised ValueError: need at least one person" },
        ],
      },
      solution: `def split_bill(total, people):
    if people < 1:
        raise ValueError("need at least one person")
    return round(total / people, 2)
`,
      hint: "Write raise ValueError(\"need at least one person\") in place of pass, at the same indentation.",
    },
    {
      type: "heading",
      text: "Validating arguments",
    },
    {
      type: "prose",
      body: "Checking a function's arguments before using them is called validating them. Put the checks at the top of the function, one `if` for each rule, and have each one raise an exception that names the rule it enforces. The rest of the function can then trust its values, because it runs only after every check has passed. The example in the next section validates its argument twice.",
    },
    {
      type: "heading",
      text: "Choosing an exception type",
    },
    {
      type: "prose",
      body: "Callers catch exceptions by type, so pick the built-in type whose meaning matches the problem. Raise a `ValueError` when an argument is the right kind of value but unacceptable, such as a negative age. Raise a `TypeError` when it is the wrong kind altogether, such as text where a number belongs.",
    },
    {
      type: "prose",
      body: "The next example uses both. `type(age) != int` compares the type of `age` with `int`, the type of whole numbers, and is `True` for anything else. You rarely need to raise `KeyError`, `IndexError`, or `ZeroDivisionError` yourself, because Python raises them on its own when a lookup or a division fails.",
    },
    {
      type: "example",
      code: `def ticket_price(age):
    if type(age) != int:
        raise TypeError("age must be a whole number")
    if age < 0:
        raise ValueError("age cannot be negative")
    if age < 12:
        return 5
    return 9

for age in [8, 30, -1, "thirty"]:
    try:
        print(f"Age {age} costs {ticket_price(age)}")
    except TypeError as e:
        print("Wrong type:", e)
    except ValueError as e:
        print("Bad value:", e)`,
    },
    {
      type: "exercise",
      id: "raising-exceptions-2",
      prompt:
        "Write a function apply_discount(price, percent) that validates both arguments. If price is below 0, raise a ValueError with the message \"price cannot be negative\". If percent is below 0 or above 100, raise a ValueError with the message \"percent must be from 0 to 100\". Otherwise return the price with percent percent taken off, rounded to 2 decimal places with round(). For example, apply_discount(80, 25) returns 60.0.",
      starterCode: `def apply_discount(price, percent):
    # validate price and percent, then return the discounted price
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "apply_discount(80, 25)", expected: "60.0" },
          { call: "apply_discount(19.99, 0)", expected: "19.99" },
          { call: "apply_discount(0, 50)", expected: "0.0" },
          { call: "apply_discount(-5, 10)", expected: "raised ValueError: price cannot be negative" },
          {
            call: "apply_discount(50, 120)",
            expected: "raised ValueError: percent must be from 0 to 100",
          },
          {
            call: "apply_discount(50, -5)",
            expected: "raised ValueError: percent must be from 0 to 100",
          },
        ],
      },
      solution: `def apply_discount(price, percent):
    if price < 0:
        raise ValueError("price cannot be negative")
    if not 0 <= percent <= 100:
        raise ValueError("percent must be from 0 to 100")
    return round(price * (100 - percent) / 100, 2)
`,
      hint: "Start with two if statements, each with its own raise. A chained comparison such as 0 <= percent <= 100 tests the range in one step. The discounted price is price * (100 - percent) / 100.",
    },
    {
      type: "heading",
      text: "Re-raising an exception",
    },
    {
      type: "prose",
      body: "Sometimes code needs to react to an exception without hiding it, for example by noting which input caused it. Inside an `except` block, the word `raise` on its own raises the same exception again, which is called re-raising. The exception then continues to the caller as if it had never been caught.",
    },
    {
      type: "example",
      code: `def read_score(text):
    try:
        return int(text)
    except ValueError:
        print("Could not read the score:", text)
        raise

print(read_score("42"))
print(read_score("forty"))`,
      showsError: true,
    },
    {
      type: "prose",
      body: "The output shows `42`, then the printed note, then the original `ValueError` with its original message. Without the bare `raise`, the function would reach its end and return `None` for bad text, and the caller would carry on with a missing score.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Raising a plain string is a common slip. `raise \"bad value\"` itself fails with a `TypeError`, because only exceptions can be raised. Always name an exception type and put the message in parentheses after it.",
    },
    {
      type: "prose",
      body: "Another mistake is catching your own exception inside the same function. If `withdraw()` raised a `ValueError` and then caught it, its caller would never learn that anything went wrong. Raise in the function that finds the problem, and catch in the code that knows what to do about it.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`raise` followed by an exception type and a message stops a function and reports a problem to its caller, which can catch it with `try` and `except`. Validate arguments at the top of a function, raising `ValueError` for an unacceptable value and `TypeError` for the wrong kind of value. Inside an `except` block, a bare `raise` re-raises the exception after you have reacted to it.",
    },
    {
      type: "exercise",
      id: "raising-exceptions-3",
      prompt:
        "Write a function check_password(password) that raises a ValueError with the message \"must be at least 8 characters\" when the password is shorter than 8 characters, and a ValueError with the message \"must contain a digit\" when none of its characters is a digit. Then loop over the list passwords and call check_password() on each one inside a try block. If it raises, print the password, a colon, a space, and the message. Otherwise print the password followed by \": ok\". The output should be exactly three lines: \"sunshine: must contain a digit\", \"abc1: must be at least 8 characters\", and \"garden42: ok\"",
      starterCode: `passwords = ["sunshine", "abc1", "garden42"]
# define check_password(), then check each password
`,
      check: {
        type: "stdout-exact",
        expected: "sunshine: must contain a digit\nabc1: must be at least 8 characters\ngarden42: ok",
      },
      solution: `def check_password(password):
    if len(password) < 8:
        raise ValueError("must be at least 8 characters")
    if not any(char.isdigit() for char in password):
        raise ValueError("must contain a digit")

passwords = ["sunshine", "abc1", "garden42"]
for password in passwords:
    try:
        check_password(password)
    except ValueError as e:
        print(f"{password}: {e}")
    else:
        print(f"{password}: ok")
`,
      hint: "Use len() for the length rule and any() with isdigit() for the digit rule. In the loop, call the function inside try, print the message in except ValueError as e:, and print ok in an else block.",
    },
  ],
};

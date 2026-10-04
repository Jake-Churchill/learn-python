export default {
  slug: "error-handling",
  title: "Error Handling",
  unit: "Errors & Files",
  blocks: [
    {
      type: "prose",
      body: "So far, every error has ended your program. That is a poor experience when the cause is ordinary, such as someone typing `ten` where you asked for a number. This lesson shows how to catch an error while the program runs and decide what happens next, so the program can explain the problem and carry on.",
    },
    {
      type: "prose",
      body: "An error that happens while a program is running is called an exception, and when one happens, Python is said to raise it. Every exception has a type, such as `ValueError` or `ZeroDivisionError`. The type is the name at the start of the last line of a traceback.",
    },
    {
      type: "heading",
      text: "Catching an exception with try and except",
    },
    {
      type: "prose",
      body: "Put the code that might fail in a `try` block: the word `try`, a colon, and an indented body. Below it, write an `except` block that names the type of exception to catch. If a line in the `try` block raises that type, Python skips the rest of the `try` block and runs the `except` block instead. Either way, the program then carries on after both blocks.",
    },
    {
      type: "example",
      code: `for text in ["42", "forty-two", "7"]:
    try:
        number = int(text)
        print("Converted", text, "to", number)
    except ValueError:
        print("Could not convert", text)
print("Finished")`,
    },
    {
      type: "prose",
      body: "For `forty-two`, the second line of the `try` block never ran. Python left the block at the line that failed and jumped to the `except` block. For the other two values nothing failed, so the `except` block was skipped.",
    },
    {
      type: "exercise",
      id: "error-handling-1",
      prompt:
        "The line int(\"abc\") raises a ValueError, because \"abc\" is not a number. Put that line inside a try block, and add an except ValueError block that prints exactly: invalid number",
      starterCode: `# put this line inside a try block, then catch the ValueError
number = int("abc")
`,
      check: { type: "stdout-exact", expected: "invalid number" },
      solution: `try:
    number = int("abc")
except ValueError:
    print("invalid number")
`,
      hint: "Write try: on its own line and indent the int() line under it. Then write except ValueError: with an indented print() below it.",
    },
    {
      type: "heading",
      text: "Only the named type is caught",
    },
    {
      type: "prose",
      body: "An `except` block catches only the type it names. Any other exception passes straight through and stops the program as usual. In the next example, dividing by zero raises a `ZeroDivisionError`, which `except ValueError` does not match.",
    },
    {
      type: "example",
      code: `try:
    print(10 / 0)
except ValueError:
    print("That was not a number")`,
      showsError: true,
    },
    {
      type: "prose",
      body: "So it pays to know the common types. A `ValueError` means a value of the right type with unusable contents, such as `int(\"abc\")`. A `TypeError` means a value of the wrong type, such as adding text to a number. A `ZeroDivisionError` comes from dividing by zero, a `KeyError` from a missing dictionary key, and an `IndexError` from an index past the end of a list or string.",
    },
    {
      type: "heading",
      text: "Several except blocks",
    },
    {
      type: "prose",
      body: "One `try` can have several `except` blocks, one per type. Python checks them from top to bottom, runs the first one that matches, and skips the rest. To handle two types the same way, list them in parentheses: `except (KeyError, IndexError):`. In the next example, a missing key and an index past the end of a list get the same message.",
    },
    {
      type: "example",
      code: `sizes = {"shirts": ["S", "M", "L"]}
for item, index in [("shirts", 2), ("hats", 0), ("shirts", 5)]:
    try:
        print(item, sizes[item][index])
    except (KeyError, IndexError):
        print("Not found:", item, index)`,
    },
    {
      type: "prose",
      body: "Adding `as` and a name, as in `except ValueError as e:`, stores the exception in that variable. Printing it shows the explanation from the last line of the traceback, without the type. For a `KeyError`, that explanation is just the missing key in quotes. The name `e` is a common short choice, but any variable name works.",
    },
    {
      type: "example",
      code: `prices = {"apple": 0.5, "bread": 2.25}
orders = [("apple", "6"), ("cheese", "1"), ("bread", "two")]
for item, quantity in orders:
    try:
        cost = prices[item] * int(quantity)
        print(f"{item}: {cost:.2f}")
    except KeyError as e:
        print("Not on the menu:", e)
    except ValueError as e:
        print("Bad quantity:", e)`,
    },
    {
      type: "exercise",
      id: "error-handling-2",
      prompt:
        "Each tuple in stats holds a player's name, total points, and games played, all as text. The program crashes on Grace, who played 0 games. Put the two lines inside the loop into a try block. Catch ZeroDivisionError and print the name followed by \": no games played\", and catch ValueError and print the name followed by \": missing data\". The output should be exactly three lines: \"Ada: 21.0\", \"Grace: no games played\", and \"Alan: missing data\"",
      starterCode: `stats = [("Ada", "84", "4"), ("Grace", "30", "0"), ("Alan", "n/a", "3")]
for name, points, games in stats:
    average = int(points) / int(games)
    print(f"{name}: {average:.1f}")
`,
      check: {
        type: "stdout-exact",
        expected: "Ada: 21.0\nGrace: no games played\nAlan: missing data",
      },
      solution: `stats = [("Ada", "84", "4"), ("Grace", "30", "0"), ("Alan", "n/a", "3")]
for name, points, games in stats:
    try:
        average = int(points) / int(games)
        print(f"{name}: {average:.1f}")
    except ZeroDivisionError:
        print(f"{name}: no games played")
    except ValueError:
        print(f"{name}: missing data")
`,
      hint: "Indent both lines one level deeper, under try:. Then add except ZeroDivisionError: and except ValueError: at the same indentation as try:, each with its own print().",
    },
    {
      type: "heading",
      text: "else and finally",
    },
    {
      type: "prose",
      body: "A `try` statement can end with two more blocks. An `else` block runs only when the `try` block raised nothing. It is the place for code that should run after a success, which keeps the `try` block short.",
    },
    {
      type: "prose",
      body: "A `finally` block comes last and runs every time: after a success, after a caught exception, and even when an uncaught exception is about to stop the program. Use it for work that must happen no matter what. In your code, the blocks always appear in this order: `try`, the `except` blocks, `else`, and `finally`.",
    },
    {
      type: "example",
      code: `for text in ["8", "zero"]:
    try:
        count = int(text)
    except ValueError:
        print(text, "is not a number")
    else:
        print("Read", count, "items")
    finally:
        print("Done with", text)`,
    },
    {
      type: "heading",
      text: "Asking again until the input is valid",
    },
    {
      type: "prose",
      body: "A `try` block inside a `while True:` loop makes an input-validation loop: a loop that keeps asking until the answer is usable. The conversion goes in the `try` block, followed by `break`. The `except` block explains the problem, and the loop asks again.",
    },
    {
      type: "example",
      code: `while True:
    try:
        age = int(input("Age: "))
        break
    except ValueError:
        print("Please type a whole number.")
print(f"Next year you will be {age + 1}.")`,
      stdin: "thirty\n30.5\n30",
    },
    {
      type: "prose",
      body: "The `break` comes after the conversion, so it is reached only when `int()` succeeds. For `thirty` and `30.5`, Python jumps from the failing line straight to the `except` block, skipping `break`, and the loop runs again. An answer can also convert cleanly and still be unusable, such as a negative age; check that with an `if` after the conversion.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Catching everything is the most tempting mistake. A bare `except:` with no type, or `except Exception:` (a type that covers almost every error), catches nearly every exception, including a `NameError` from a typo in your own code. The program then prints your friendly message and hides the real bug. Name the specific types you expect instead.",
    },
    {
      type: "prose",
      body: "A long `try` block causes a similar problem, because an `except` meant for one line also catches errors from all the others. Keep only the lines that might fail inside it. And remember that catching an exception does not fix anything: a variable that the failed line was meant to set may not exist afterward.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "An exception is an error raised while a program runs. A `try` block holds code that might raise one, `except` blocks catch the named types, and `as e` gives you the exception itself. `else` runs after a success and `finally` runs every time. A conversion inside `try`, in a `while True:` loop, keeps asking until the input is valid.",
    },
    {
      type: "exercise",
      id: "error-handling-3",
      prompt:
        "The program receives four lines of input: four, 0, 12, and 4. Ask for a quantity with the exact prompt \"Quantity: \" (with a space after the colon) until the answer is a whole number from 1 to 10. When the answer is not a whole number, print \"Please type a whole number.\" When it is a whole number outside 1 to 10, print \"Please choose 1 to 10.\" Once a valid quantity arrives, print \"Ordered 4 items.\" with 4 replaced by the quantity. The output should be exactly eight lines: \"Quantity: four\", \"Please type a whole number.\", \"Quantity: 0\", \"Please choose 1 to 10.\", \"Quantity: 12\", \"Please choose 1 to 10.\", \"Quantity: 4\", and \"Ordered 4 items.\"",
      starterCode: `# keep asking until the quantity is a whole number from 1 to 10
`,
      stdin: "four\n0\n12\n4",
      check: {
        type: "stdout-exact",
        expected:
          "Quantity: four\nPlease type a whole number.\nQuantity: 0\nPlease choose 1 to 10.\nQuantity: 12\nPlease choose 1 to 10.\nQuantity: 4\nOrdered 4 items.",
      },
      solution: `while True:
    try:
        quantity = int(input("Quantity: "))
    except ValueError:
        print("Please type a whole number.")
        continue
    if 1 <= quantity <= 10:
        break
    print("Please choose 1 to 10.")
print(f"Ordered {quantity} items.")
`,
      hint: "Use while True: around a try block that converts input(\"Quantity: \") with int(). In except ValueError:, print the first message and use continue. After the try, break when 1 <= quantity <= 10, and otherwise print the second message.",
    },
  ],
};

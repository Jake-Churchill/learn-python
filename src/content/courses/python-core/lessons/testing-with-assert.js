export default {
  slug: "testing-with-assert",
  title: "Testing Your Code",
  unit: "Writing Better Python",
  blocks: [
    {
      type: "prose",
      body: "So far you have checked your code by running it and reading the output. That works once, but every change to a function means checking everything again by eye, and a forgotten case lets a mistake slip through. A test is code that checks other code: it calls a function with a known input and compares the result with the answer you expect.",
    },
    {
      type: "prose",
      body: "Tests run in a moment and never forget a case, so after any change you find out at once whether a function still works. This lesson covers the `assert` statement, test functions, edge cases, and writing tests before the code they test.",
    },
    {
      type: "heading",
      text: "The assert statement",
    },
    {
      type: "prose",
      body: "An `assert` statement is the word `assert` followed by a condition. If the condition is true, nothing happens and the program carries on. If it is false, Python raises an `AssertionError`, which stops the program unless something catches it.",
    },
    {
      type: "prose",
      body: "After the condition you can add a comma and a message, as in `assert total == 10, \"total should be 10\"`. The message appears on the last line of the traceback when the check fails, so write it to say what should have happened.",
    },
    {
      type: "example",
      code: `def add_tax(price):
    return round(price * 1.08, 2)

assert add_tax(10) == 10.8
assert add_tax(0) == 0
assert add_tax(2.5) == 2.7, "add_tax(2.5) should be 2.7"
print("All checks passed")`,
    },
    {
      type: "prose",
      body: "Every condition was true, so the program reached its last line. In the next example the second check fails. The traceback points at that `assert` line, and the last line shows its message, which reveals a real bug: the function uses `>` where a score equal to the pass mark should count.",
    },
    {
      type: "example",
      code: `def count_passing(scores, pass_mark):
    count = 0
    for score in scores:
        if score > pass_mark:
            count += 1
    return count

assert count_passing([50, 70, 40], 60) == 1
assert count_passing([60, 75], 60) == 2, "a score equal to the pass mark should pass"
print("All checks passed")`,
      showsError: true,
    },
    {
      type: "exercise",
      id: "testing-with-assert-1",
      prompt:
        "The checks below describe what discount_price(price, percent) should return: the price that is left after taking percent off. The function has a bug, so the first check stops the program with an AssertionError. Fix the return line so every check passes. The output should then be exactly: All checks passed",
      starterCode: `def discount_price(price, percent):
    return price * percent / 100

assert discount_price(80, 25) == 60, "25% off 80 should be 60"
assert discount_price(50, 10) == 45, "10% off 50 should be 45"
assert discount_price(20, 0) == 20, "0% off 20 should be 20"
print("All checks passed")
`,
      check: { type: "stdout-exact", expected: "All checks passed" },
      solution: `def discount_price(price, percent):
    return price - price * percent / 100

assert discount_price(80, 25) == 60, "25% off 80 should be 60"
assert discount_price(50, 10) == 45, "10% off 50 should be 45"
assert discount_price(20, 0) == 20, "0% off 20 should be 20"
print("All checks passed")
`,
      hint: "The function returns the amount taken off, not the price that is left. Subtract that amount from price.",
    },
    {
      type: "heading",
      text: "Test functions",
    },
    {
      type: "prose",
      body: "A test function groups the checks for one behavior. Its name starts with `test_`, it takes no arguments, and its body is a few `assert` statements. Calling it runs every check, and if it returns without an error, they all passed.",
    },
    {
      type: "prose",
      body: "The `test_` prefix is a convention that testing tools rely on. A testing tool is a separate program that finds every test function in your files, runs each one, and reports every failure instead of stopping at the first. You can build a tiny version yourself: a function that calls one test inside `try` and catches `AssertionError`.",
    },
    {
      type: "example",
      code: `def initials(name):
    return ".".join(part[0] for part in name.split()) + "."

def test_two_names():
    assert initials("Ada Lovelace") == "A.L.", "Ada Lovelace gives A.L."

def test_three_names():
    assert initials("Grace Brewster Hopper") == "G.B.H.", "three names give three initials"

def test_lowercase():
    assert initials("alan turing") == "A.T.", "initials should be capitals"

def run_test(test):
    try:
        test()
        print(f"PASS {test.__name__}")
    except AssertionError as error:
        print(f"FAIL {test.__name__}: {error}")

run_test(test_two_names)
run_test(test_three_names)
run_test(test_lowercase)`,
    },
    {
      type: "prose",
      body: "`run_test()` receives a test function, calls it, and prints `PASS` with the test's `__name__`, or `FAIL` with the name and the assert's message. The third test fails, and because the runner caught the error, every result still appears. Calling `upper()` on each initial would fix the bug.",
    },
    {
      type: "heading",
      text: "Edge cases",
    },
    {
      type: "prose",
      body: "An edge case is an input at the edge of what a function handles: an empty list, zero, a negative number, a single item, or a value exactly on a boundary, such as 18 for an adult check. Bugs gather at these edges, because code is usually written with typical values in mind.",
    },
    {
      type: "prose",
      body: "For every function, ask what the smallest, emptiest, and boundary inputs are, and test each one, including both sides of every boundary. The ticket prices below change at ages 12 and 65, so the tests check 11 and 12, and 64 and 65.",
    },
    {
      type: "example",
      code: `def ticket_price(age):
    if age < 12:
        return 5
    elif age > 65:
        return 6
    return 10

def test_child():
    assert ticket_price(11) == 5, "11 pays the child price"

def test_adult():
    assert ticket_price(12) == 10, "12 pays the adult price"
    assert ticket_price(64) == 10, "64 pays the adult price"

def test_senior():
    assert ticket_price(65) == 6, "65 pays the senior price"

def run_test(test):
    try:
        test()
        print(f"PASS {test.__name__}")
    except AssertionError as error:
        print(f"FAIL {test.__name__}: {error}")

run_test(test_child)
run_test(test_adult)
run_test(test_senior)`,
    },
    {
      type: "prose",
      body: "Typical ages such as 8, 30, and 80 all get the right price, so tests that used only those would pass. The boundary test at 65 catches the bug: `>` should be `>=`.",
    },
    {
      type: "exercise",
      id: "testing-with-assert-2",
      prompt:
        "is_adult(age) should return True for ages 18 and over, but people report that 18-year-olds are refused. Before fixing anything, write a test function test_eighteen_is_adult that asserts is_adult(18) is True, with the message \"18 should count as an adult\". Leave is_adult unchanged. The bug is still there, so the output should be exactly two lines: PASS test_over_eighteen and then FAIL test_eighteen_is_adult: 18 should count as an adult",
      starterCode: `def is_adult(age):
    return age > 18

def test_over_eighteen():
    assert is_adult(30), "30 should count as an adult"

# write test_eighteen_is_adult here


def run_test(test):
    try:
        test()
        print(f"PASS {test.__name__}")
    except AssertionError as error:
        print(f"FAIL {test.__name__}: {error}")

run_test(test_over_eighteen)
run_test(test_eighteen_is_adult)
`,
      check: {
        type: "stdout-exact",
        expected: "PASS test_over_eighteen\nFAIL test_eighteen_is_adult: 18 should count as an adult",
      },
      solution: `def is_adult(age):
    return age > 18

def test_over_eighteen():
    assert is_adult(30), "30 should count as an adult"

def test_eighteen_is_adult():
    assert is_adult(18), "18 should count as an adult"


def run_test(test):
    try:
        test()
        print(f"PASS {test.__name__}")
    except AssertionError as error:
        print(f"FAIL {test.__name__}: {error}")

run_test(test_over_eighteen)
run_test(test_eighteen_is_adult)
`,
      hint: "Follow the shape of test_over_eighteen: def, the name, empty parentheses, then one indented line with assert, is_adult(18), a comma, and the message in quotes.",
    },
    {
      type: "heading",
      text: "Writing the test first",
    },
    {
      type: "prose",
      body: "You can also write the tests before the function exists. Doing so forces you to decide exactly what the function should do, edge cases included, before you think about how. Then you write the function and run the tests, fixing it until every one passes. This way of working is called test-first.",
    },
    {
      type: "prose",
      body: "Say you need `average(scores)`, and you decide that an empty list should give 0 instead of crashing. The tests below were written first to record those decisions, and the function was written afterwards to pass them. Replace the function's body with `pass` and run it again: every test fails, which proves the tests can catch a wrong answer.",
    },
    {
      type: "example",
      code: `def test_typical():
    assert average([80, 90, 100]) == 90, "80, 90 and 100 average 90"

def test_single_score():
    assert average([75]) == 75, "one score is its own average"

def test_empty():
    assert average([]) == 0, "an empty list gives 0"

def average(scores):
    if not scores:
        return 0
    return sum(scores) / len(scores)

def run_test(test):
    try:
        test()
        print(f"PASS {test.__name__}")
    except AssertionError as error:
        print(f"FAIL {test.__name__}: {error}")

run_test(test_typical)
run_test(test_single_score)
run_test(test_empty)`,
    },
    {
      type: "prose",
      body: "The tests can sit above `average()` because a function body runs only when the function is called. By the time `run_test()` calls each test, `average()` has been defined.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Wrapping an `assert` in parentheses is a subtle mistake. `assert (total == 10, \"total should be 10\")` checks a tuple of two items, and a non-empty tuple is always truthy, so the check can never fail. Python prints `SyntaxWarning: assertion is always true, perhaps remove parentheses?` and carries on, so write no parentheses around the condition and message.",
    },
    {
      type: "prose",
      body: "Do not use `assert` to check input or arguments in a finished program. Python can be started with an option that skips every `assert`, so those checks might never run. Validate arguments with `raise`, as you learned in Raising Exceptions, and keep `assert` for tests.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`assert` followed by a condition does nothing when the condition is true and raises `AssertionError` when it is false, with an optional message after a comma. A test function, named with a `test_` prefix, groups the checks for one behavior. Good tests cover edge cases such as empty inputs and both sides of each boundary, and writing the tests first pins down what a function must do before you write it.",
    },
    {
      type: "exercise",
      id: "testing-with-assert-3",
      prompt:
        "The tests for shipping_cost(total) were written first. An order under 50 costs 4.99 to ship, an order of 50 or more ships free, and an empty order, with a total of 0, costs nothing. Write shipping_cost(total) above the tests so all three pass. The output should be exactly three lines: PASS test_small_order, then PASS test_free_shipping, then PASS test_empty_order",
      starterCode: `# write shipping_cost(total) here


def test_small_order():
    assert shipping_cost(20) == 4.99, "orders under 50 pay 4.99"
    assert shipping_cost(49.99) == 4.99, "49.99 is still under 50"

def test_free_shipping():
    assert shipping_cost(50) == 0, "orders of 50 or more ship free"
    assert shipping_cost(120) == 0, "big orders ship free"

def test_empty_order():
    assert shipping_cost(0) == 0, "an empty order costs nothing"

def run_test(test):
    try:
        test()
        print(f"PASS {test.__name__}")
    except AssertionError as error:
        print(f"FAIL {test.__name__}: {error}")

run_test(test_small_order)
run_test(test_free_shipping)
run_test(test_empty_order)
`,
      check: {
        type: "stdout-exact",
        expected: "PASS test_small_order\nPASS test_free_shipping\nPASS test_empty_order",
      },
      solution: `def shipping_cost(total):
    if total == 0 or total >= 50:
        return 0
    return 4.99


def test_small_order():
    assert shipping_cost(20) == 4.99, "orders under 50 pay 4.99"
    assert shipping_cost(49.99) == 4.99, "49.99 is still under 50"

def test_free_shipping():
    assert shipping_cost(50) == 0, "orders of 50 or more ship free"
    assert shipping_cost(120) == 0, "big orders ship free"

def test_empty_order():
    assert shipping_cost(0) == 0, "an empty order costs nothing"

def run_test(test):
    try:
        test()
        print(f"PASS {test.__name__}")
    except AssertionError as error:
        print(f"FAIL {test.__name__}: {error}")

run_test(test_small_order)
run_test(test_free_shipping)
run_test(test_empty_order)
`,
      hint: "Two kinds of order ship free. Start with a version that passes one test, run it, and read which tests still fail: each FAIL message names a rule you have not handled yet.",
    },
  ],
};

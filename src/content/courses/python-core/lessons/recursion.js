export default {
  slug: "recursion",
  title: "Recursion",
  unit: "Functions",
  blocks: [
    {
      type: "prose",
      body: "Some problems contain smaller copies of themselves. A folder holds files and other folders, which hold files and more folders. A countdown from 10 is the number 10 followed by a countdown from 9. Recursion handles problems like these: a recursive function is a function that calls itself.",
    },
    {
      type: "heading",
      text: "A function that calls itself",
    },
    {
      type: "prose",
      body: "Here is a countdown written with recursion instead of a loop. `countdown(3)` prints 3, then calls `countdown(2)`, which prints 2 and calls `countdown(1)`, and so on. When `n` reaches 0, the function prints a final message and returns without calling itself again.",
    },
    {
      type: "example",
      code: `def countdown(n):
    if n == 0:
        print("Liftoff!")
        return
    print(n)
    countdown(n - 1)

countdown(3)`,
    },
    {
      type: "heading",
      text: "Base case and recursive case",
    },
    {
      type: "prose",
      body: "Every recursive function needs two parts. The base case is an input simple enough to answer directly, without another call; in `countdown()` it is `n == 0`. The recursive case handles every other input by calling the function again on a smaller problem, here `n - 1`, so each call moves closer to the base case.",
    },
    {
      type: "prose",
      body: "Recursive functions often return a value built from the smaller call's result. The factorial of a whole number is the product of every whole number from 1 up to it, so the factorial of 4 is `4 * 3 * 2 * 1`, which is 24. It is also 4 times the factorial of 3, which gives the recursive case `n * factorial(n - 1)`. The base case is the factorial of 1, which is 1.",
    },
    {
      type: "example",
      code: `def factorial(n):
    if n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(4))
print(factorial(10))`,
    },
    {
      type: "exercise",
      id: "recursion-1",
      prompt:
        "power(base, exponent) should return base multiplied by itself exponent times. The base case is written: any number to the power 0 is 1. Replace pass with the recursive case, which returns base multiplied by the power one smaller. For example, power(2, 5) returns 32.",
      starterCode: `def power(base, exponent):
    if exponent == 0:
        return 1
    # recursive case: base times a power one smaller
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "power(2, 5)", expected: "32" },
          { call: "power(3, 0)", expected: "1" },
          { call: "power(5, 3)", expected: "125" },
          { call: "power(10, 1)", expected: "10" },
        ],
      },
      solution: `def power(base, exponent):
    if exponent == 0:
        return 1
    return base * power(base, exponent - 1)
`,
      hint: "The smaller problem is power(base, exponent - 1). Multiply its result by base and return it.",
    },
    {
      type: "heading",
      text: "The call stack",
    },
    {
      type: "prose",
      body: "When a function calls another function, the first call pauses and waits for the second to return. Python keeps track of every call that has started but not yet returned; this pile of calls is the call stack. Each new call goes on top, and when a call returns, it comes off the top and the call below it carries on from where it paused.",
    },
    {
      type: "prose",
      body: "In recursion every waiting call is the same function with a different argument. The example below prints a line as each call starts and another as each one returns. The calls start in the order 3, 2, 1, but they finish in the order 1, 2, 3, because each call can only finish after the call it made has returned.",
    },
    {
      type: "example",
      code: `def factorial(n):
    print(f"factorial({n}) starts")
    if n == 1:
        result = 1
    else:
        result = n * factorial(n - 1)
    print(f"factorial({n}) returns {result}")
    return result

print(factorial(3))`,
    },
    {
      type: "heading",
      text: "The recursion limit",
    },
    {
      type: "prose",
      body: "Every waiting call takes up memory, so Python limits how deep the call stack can grow: by default, about 1,000 calls. A function that never reaches its base case would call itself forever, so Python stops it at the limit with a `RecursionError`. The example below starts at an odd number and goes down by 2, so `n` jumps from 1 to -1 and never equals 0.",
    },
    {
      type: "example",
      code: `def count_down_by_two(n):
    if n == 0:
        return "Done"
    return count_down_by_two(n - 2)

print(count_down_by_two(5))`,
      showsError: true,
    },
    {
      type: "prose",
      body: "The traceback shows the same line a few times, then a note saying the previous line was repeated nearly 1,000 times, and ends with `RecursionError: maximum recursion depth exceeded`. Checking `n <= 0` instead of `n == 0` fixes it. The limit also means a correct recursive function cannot go very deep, so a recursive countdown from 5,000 fails too.",
    },
    {
      type: "exercise",
      id: "recursion-2",
      prompt:
        "total(numbers) should return the sum of a list: 0 for an empty list, otherwise the first number plus the total of the rest of the list. As written it never reaches its base case and raises a RecursionError. Fix the recursive call so it works on the rest of the list, from index 1 onward. For example, total([4, 8, 15]) returns 27.",
      starterCode: `def total(numbers):
    if len(numbers) == 0:
        return 0
    return numbers[0] + total(numbers)
`,
      check: {
        type: "returns",
        cases: [
          { call: "total([4, 8, 15])", expected: "27" },
          { call: "total([])", expected: "0" },
          { call: "total([10])", expected: "10" },
          { call: "total([2.5, 2.5, 1])", expected: "6.0" },
        ],
      },
      solution: `def total(numbers):
    if len(numbers) == 0:
        return 0
    return numbers[0] + total(numbers[1:])
`,
      hint: "The recursive call receives the same list every time, so the problem never shrinks. A slice gives the list without its first item.",
    },
    {
      type: "heading",
      text: "Recursion or a loop?",
    },
    {
      type: "prose",
      body: "Anything recursion can do, a loop can also do. For counting and for walking along a list, a loop is usually simpler, runs faster, and has no depth limit, so prefer it there. The countdown and factorial above would be loops in a real program; they are written recursively here because they are easy to follow.",
    },
    {
      type: "prose",
      body: "Recursion pays off when data has the same shape at every level, such as folders inside folders. The function below counts the files in a folder and in every folder inside it, however deep they go. A folder with no subfolders is the base case: the loop runs zero times and the function returns without calling itself.",
    },
    {
      type: "example",
      code: `home = {
    "name": "home",
    "files": 2,
    "folders": [
        {"name": "photos", "files": 5, "folders": []},
        {"name": "work", "files": 1, "folders": [
            {"name": "reports", "files": 3, "folders": []},
        ]},
    ],
}

def count_files(folder):
    total = folder["files"]
    for subfolder in folder["folders"]:
        total += count_files(subfolder)
    return total

print(count_files(home))`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "A missing base case, or a recursive case that does not move toward it, is the most common mistake, and it ends in a `RecursionError`. Check that every recursive call gets a smaller problem and that the smallest possible input reaches the base case.",
    },
    {
      type: "prose",
      body: "Forgetting to return the result of the recursive call is the next most common. Writing `n * factorial(n - 1)` on its own line works out the value and throws it away, so that call returns `None`. The call waiting above it then fails with a `TypeError` when it tries to multiply by `None`. Write `return n * factorial(n - 1)`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A recursive function calls itself. It needs a base case that answers directly and a recursive case that calls itself on a smaller problem. Waiting calls sit on the call stack, which Python limits to about 1,000 calls, raising a `RecursionError` beyond that. Use a loop for simple repetition and recursion for data that nests inside itself.",
    },
    {
      type: "exercise",
      id: "recursion-3",
      prompt:
        "Each person in a team is a dictionary with a name and a list of reports: the people who report to them, each a dictionary of the same shape. Write a recursive function all_names(person) that returns a list of names: the person's own name first, followed by all the names from each report in order, all the way down. For example, all_names(lin) returns ['Lin'] and all_names(team) returns ['Ada', 'Grace', 'Alan', 'Linus', 'Guido', 'Lin'].",
      starterCode: `lin = {"name": "Lin", "reports": []}
team = {
    "name": "Ada",
    "reports": [
        {"name": "Grace", "reports": [
            {"name": "Alan", "reports": []},
            {"name": "Linus", "reports": []},
        ]},
        {"name": "Guido", "reports": [lin]},
    ],
}

# write all_names(person) below
`,
      check: {
        type: "returns",
        cases: [
          { call: "all_names(lin)", expected: "['Lin']" },
          { call: "all_names(team)", expected: "['Ada', 'Grace', 'Alan', 'Linus', 'Guido', 'Lin']" },
          { call: "all_names(team['reports'][0])", expected: "['Grace', 'Alan', 'Linus']" },
        ],
      },
      solution: `lin = {"name": "Lin", "reports": []}
team = {
    "name": "Ada",
    "reports": [
        {"name": "Grace", "reports": [
            {"name": "Alan", "reports": []},
            {"name": "Linus", "reports": []},
        ]},
        {"name": "Guido", "reports": [lin]},
    ],
}

def all_names(person):
    names = [person["name"]]
    for report in person["reports"]:
        names.extend(all_names(report))
    return names
`,
      hint: "Start a list holding the person's own name. Loop over their reports and extend the list with all_names() of each report. A person with no reports is the base case: the loop does nothing.",
    },
  ],
};

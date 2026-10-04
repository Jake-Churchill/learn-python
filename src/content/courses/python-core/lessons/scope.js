export default {
  slug: "scope",
  title: "Scope",
  unit: "Functions",
  blocks: [
    {
      type: "prose",
      body: "Every variable can be used in some parts of a program and not in others. The part of a program where a name can be used is called its scope. Knowing the rules explains why a variable created inside a function seems to disappear, and why changing an outside variable from inside a function goes wrong.",
    },
    {
      type: "heading",
      text: "Local variables",
    },
    {
      type: "prose",
      body: "A variable created inside a function, including each of its parameters, is a local variable. It exists only while that call runs. When the function returns, its local variables vanish, and code outside the function cannot see them. Trying to use one there stops the program with a `NameError`.",
    },
    {
      type: "example",
      code: `def order_total(prices):
    total = 0
    for price in prices:
        total += price
    return total

print(order_total([3.5, 2.25, 4.0]))
print(total)`,
      showsError: true,
    },
    {
      type: "prose",
      body: "The first `print()` works because the function returns the total, and the return value is what survives the call. The second fails with `NameError: name 'total' is not defined`, because `total` belonged to the call and vanished with it. To get information out of a function, return it.",
    },
    {
      type: "prose",
      body: "Each call also starts with fresh local variables. Nothing is remembered from one call to the next, so the function below returns 1 every time, however often you call it.",
    },
    {
      type: "example",
      code: `def add_visit():
    visits = 0
    visits += 1
    return visits

print(add_visit())
print(add_visit())`,
    },
    {
      type: "exercise",
      id: "scope-1",
      prompt:
        "count_vowels(text) counts the vowels in text in a local variable, but the count vanishes when the call ends, so the function returns None. Add one line so it returns the count. For example, count_vowels(\"banana\") returns 3.",
      starterCode: `def count_vowels(text):
    count = 0
    for letter in text.lower():
        if letter in "aeiou":
            count += 1
    # return the count here, after the loop
`,
      check: {
        type: "returns",
        cases: [
          { call: 'count_vowels("banana")', expected: "3" },
          { call: 'count_vowels("Sky")', expected: "0" },
          { call: 'count_vowels("AUDIO")', expected: "4" },
        ],
      },
      solution: `def count_vowels(text):
    count = 0
    for letter in text.lower():
        if letter in "aeiou":
            count += 1
    return count
`,
      hint: "Write return count on the line after the loop, lined up with the for line, so it runs once after the loop finishes.",
    },
    {
      type: "heading",
      text: "Global variables",
    },
    {
      type: "prose",
      body: "A variable created at the top level of a program, outside every function, is a global variable. Its scope is the whole program, so any function can read it. This suits values that stay the same while the program runs, such as a tax rate.",
    },
    {
      type: "example",
      code: `tax_rate = 0.08

def with_tax(price):
    return round(price * (1 + tax_rate), 2)

print(with_tax(10))
print(with_tax(25))`,
    },
    {
      type: "heading",
      text: "Shadowing",
    },
    {
      type: "prose",
      body: "Assigning to a name inside a function creates a local variable, even when a global variable has the same name, unless the function declares the name global, as shown below. The local one shadows the global one: inside the function, the name means the local variable, and the global is hidden but unchanged. When the call ends, the local vanishes and the global is still there.",
    },
    {
      type: "example",
      code: `name = "Ada"

def greet():
    name = "Grace"
    print("Inside:", name)

greet()
print("Outside:", name)`,
    },
    {
      type: "prose",
      body: "Python decides which names are local before the function runs: a name assigned anywhere in a function is local everywhere in it. That causes a confusing error when you try to update a global. In `count += 1`, `count` is assigned, so it is local, and Python cannot read a local that has no value yet.",
    },
    {
      type: "example",
      code: `count = 0

def add_one():
    count += 1

add_one()`,
      showsError: true,
    },
    {
      type: "prose",
      body: "The message reads `UnboundLocalError: cannot access local variable 'count' where it is not associated with a value`. Unbound means the name has no value attached to it yet.",
    },
    {
      type: "heading",
      text: "Why global is discouraged",
    },
    {
      type: "prose",
      body: "Writing `global count` as the first line of a function tells Python that `count` in that function means the global variable, so assigning to it changes the global. It works, but it makes programs harder to understand. Any function might change the variable, so to know its value you have to read every function, and a function that changes a global is tied to that one variable and cannot be reused on other data.",
    },
    {
      type: "prose",
      body: "The better habit is to pass values in as arguments and hand results back with `return`. Then everything a function uses is visible in its call, and everything it produces is its return value. Both versions below add points to `score`, but only the second can be understood by reading its call.",
    },
    {
      type: "example",
      code: `score = 0

def add_points_global(points):
    global score
    score += points

add_points_global(10)
print(score)

def add_points(current, points):
    return current + points

score = add_points(score, 5)
print(score)`,
    },
    {
      type: "exercise",
      id: "scope-2",
      prompt:
        "The function add_expense uses global to update spent. Rewrite it as add_expense(spent, amount), a function that takes the amount spent so far and a new expense and returns the new total, without using global. For example, add_expense(20, 7.5) returns 27.5.",
      starterCode: `spent = 0

def add_expense(amount):
    global spent
    spent += amount
`,
      check: {
        type: "returns",
        cases: [
          { call: "add_expense(20, 7.5)", expected: "27.5" },
          { call: "add_expense(0, 12)", expected: "12" },
          { call: "add_expense(100, 0)", expected: "100" },
        ],
      },
      solution: `def add_expense(spent, amount):
    return spent + amount
`,
      hint: "Give the def line two parameters, delete the global line, and return the sum of the two parameters.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Expecting a function to change an outside variable by assigning to it is the most common scope mistake. The assignment only creates a local variable. Return the new value instead and assign it where you make the call: `score = add_points(score, 5)`.",
    },
    {
      type: "prose",
      body: "Reusing one name for a global variable and a local variable is allowed but confusing, because the same word means two things in different places. Give them different names. And remember that a function's local variables are gone once it returns, so reading one after the call raises a `NameError`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Scope is the part of a program where a name can be used. Variables created inside a function, including parameters, are local: they start fresh on every call and vanish when it ends. Variables created outside every function are global and can be read anywhere, and assigning to a name inside a function creates a local that shadows any global of that name. Pass values in and return results instead of using `global`.",
    },
    {
      type: "exercise",
      id: "scope-3",
      prompt:
        "Write a function warmest(temps) that returns the highest temperature in the list temps. Use a loop and a local variable called highest that starts at the first temperature, without using max(). The starter code has a global variable that is also called highest, and it must still be 0 after your function runs. For example, warmest([18, 21, 25, 19]) returns 25.",
      starterCode: `highest = 0

# write the function warmest(temps) below
`,
      check: {
        type: "returns",
        cases: [
          { call: "warmest([18, 21, 25, 19])", expected: "25" },
          { call: "warmest([-5, -2, -9])", expected: "-2" },
          { call: "warmest([7])", expected: "7" },
          { call: "highest", expected: "0" },
        ],
      },
      solution: `highest = 0

def warmest(temps):
    highest = temps[0]
    for temp in temps:
        if temp > highest:
            highest = temp
    return highest
`,
      hint: "Inside the function, set highest = temps[0], then loop and replace highest whenever a temperature is bigger. Assigning inside the function creates a local highest that shadows the global one, so do not write global.",
    },
  ],
};

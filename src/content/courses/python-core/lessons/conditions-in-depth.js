export default {
  slug: "conditions-in-depth",
  title: "Combining & Nesting Conditions",
  unit: "Decisions",
  blocks: [
    {
      type: "prose",
      body: "Real decisions often depend on more than one fact. A museum lets a visitor in free if they are a child or a senior. A website shows its admin page only to someone who is logged in and is an admin. This lesson shows how to nest and combine conditions, and which values Python treats as true or false.",
    },
    {
      type: "heading",
      text: "Nested if statements",
    },
    {
      type: "prose",
      body: "An `if` statement can sit inside the block of another `if`. This is called nesting. The inner `if` is indented one level further, four more spaces, and Python checks it only when the outer condition was `True`.",
    },
    {
      type: "example",
      code: `has_ticket = True
age = 15
if has_ticket:
    print("Ticket checked.")
    if age >= 18:
        print("Enjoy the film.")
    else:
        print("This film is for adults only.")
else:
    print("Please buy a ticket first.")`,
    },
    {
      type: "prose",
      body: "Read the indentation to see which `else` belongs to which `if`. The inner `else` lines up with the inner `if`, and the outer `else` lines up with the outer `if`. Code nested three or four levels deep gets hard to follow, so the next section shows a way to flatten it.",
    },
    {
      type: "heading",
      text: "Combining conditions with and and or",
    },
    {
      type: "prose",
      body: "In the Booleans & Comparisons lesson you met `and`, `or`, and `not`. They work after `if` like any other condition. `and` is `True` only when both sides are `True`, so it can replace an `if` nested directly inside another. `or` is `True` when at least one side is `True`.",
    },
    {
      type: "example",
      code: `is_logged_in = True
is_admin = False
if is_logged_in and is_admin:
    print("Showing the admin page.")
else:
    print("Admins only.")

day = "Sunday"
if day == "Saturday" or day == "Sunday":
    print("The shop opens at 10.")
else:
    print("The shop opens at 8.")`,
    },
    {
      type: "prose",
      body: "When one condition mixes `and` with `or`, Python works out the `and` parts first, the way it does multiplication before addition. Parentheses make the order clear to anyone reading the code, as in `(age < 12 or age >= 65) and has_id`.",
    },
    {
      type: "exercise",
      id: "conditions-in-depth-1",
      prompt:
        "A museum lets children under 12 and visitors aged 65 or older in for free. The variable age holds 70. Replace False in the starter code with one condition that uses or, so the program prints exactly: Free entry",
      starterCode: `age = 70
if False:
    print("Free entry")
else:
    print("Paid entry")
`,
      check: { type: "stdout-exact", expected: "Free entry" },
      solution: `age = 70
if age < 12 or age >= 65:
    print("Free entry")
else:
    print("Paid entry")
`,
      hint: "Write two comparisons, age < 12 and age >= 65, joined by or.",
    },
    {
      type: "heading",
      text: "Checking for text with in",
    },
    {
      type: "prose",
      body: "The String Methods lesson introduced `in`: `\"cat\" in \"concatenate\"` is `True`, because the text on the left appears inside the text on the right. Since `in` produces `True` or `False`, it works directly as a condition. Its opposite, `not in`, is `True` when the text does not appear.",
    },
    {
      type: "example",
      code: `letter = "e"
if letter in "aeiou":
    print(letter, "is a vowel")

email = "ada.example.com"
if "@" not in email:
    print("That email address is missing an @.")`,
    },
    {
      type: "prose",
      body: "`in` is case-sensitive, just like `==`, so `\"A\" in \"aeiou\"` is `False`. When capital letters should count too, convert the text with `.lower()` before you check it.",
    },
    {
      type: "heading",
      text: "Truthy and falsy values",
    },
    {
      type: "prose",
      body: "A condition does not have to be a comparison. You can put any value after `if`, and Python decides whether that value counts as true or false. Values that count as false are called falsy, and every other value is called truthy.",
    },
    {
      type: "prose",
      body: "The falsy values you know so far are `False`, `0`, `0.0`, the empty string `\"\"`, and `None`. Everything else is truthy, including negative numbers, the string `\"0\"`, and a string that holds only a space. Later lessons add a few more empty values to the falsy list.",
    },
    {
      type: "prose",
      body: "The built-in function `bool()` shows how Python sees a value: it converts the value to `True` or `False`.",
    },
    {
      type: "example",
      code: `print(bool(0))
print(bool(42))
print(bool(""))
print(bool("0"))
print(bool(None))`,
    },
    {
      type: "prose",
      body: "The most common use is checking whether a string has anything in it. `if nickname:` is the usual way to write `if nickname != \"\":`, and `if not nickname:` asks whether it is empty.",
    },
    {
      type: "example",
      code: `nickname = ""
if nickname:
    print("Hello,", nickname)
else:
    print("Hello, guest")`,
    },
    {
      type: "exercise",
      id: "conditions-in-depth-2",
      prompt:
        "The variable username holds \"ada lovelace\". Check it against these rules, in this order, and print only the message for the first rule that applies. If username is empty, print Username is required. If it contains a space, print Usernames cannot contain spaces. If it is shorter than 3 characters, print Username is too short. Otherwise print Username saved. For this username the output is exactly: Usernames cannot contain spaces",
      starterCode: `username = "ada lovelace"
# check the rules in order and print one message
`,
      check: { type: "stdout-exact", expected: "Usernames cannot contain spaces" },
      solution: `username = "ada lovelace"
if not username:
    print("Username is required")
elif " " in username:
    print("Usernames cannot contain spaces")
elif len(username) < 3:
    print("Username is too short")
else:
    print("Username saved")
`,
      hint: "Start with if not username: for the empty check, then add elif branches that use in and len().",
    },
    {
      type: "heading",
      text: "= versus ==",
    },
    {
      type: "prose",
      body: "One `=` and two `==` look alike but do different jobs. A single `=` is assignment: it stores a value in a variable. A double `==` is a comparison: it asks whether two values are equal and produces `True` or `False`.",
    },
    {
      type: "prose",
      body: "An assignment stores a value but does not produce one to test, so a single `=` after `if` is a `SyntaxError`. The message ends with `Maybe you meant '==' or ':=' instead of '='?`. The `:=` it mentions is an advanced operator this course does not use, so the fix is `==`.",
    },
    {
      type: "example",
      code: `score = 10
if score = 10:
    print("Perfect score")`,
      showsError: true,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "The most surprising mistake looks like this: `if day == \"Saturday\" or \"Sunday\":`. It reads like plain English, but Python sees two separate conditions joined by `or`: `day == \"Saturday\"`, and `\"Sunday\"` on its own. A non-empty string is truthy, so the second condition always counts as true, and the `if` passes on every day of the week.",
    },
    {
      type: "example",
      code: `day = "Tuesday"
if day == "Saturday" or "Sunday":
    print("Weekend")
else:
    print("Weekday")`,
    },
    {
      type: "prose",
      body: "Python shows no error here, which makes the mistake hard to spot. The fix is to write the full comparison on both sides of `or`: `if day == \"Saturday\" or day == \"Sunday\":`. Numbers behave the same way: `x == 1 or 2` is always truthy, and the correct form is `x == 1 or x == 2`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "An `if` can be nested inside another `if`, and `and` or `or` can often replace that nesting with a single condition. `in` and `not in` check whether text appears inside a string. Any value can be a condition: `False`, `0`, `0.0`, `\"\"`, and `None` are falsy, and everything else is truthy. Use `==` to compare and `=` to assign, and repeat the full comparison on each side of `or`.",
    },
    {
      type: "exercise",
      id: "conditions-in-depth-3",
      prompt:
        "A library is open from 9 to 17 on weekdays and from 10 to 14 on Saturday and Sunday. Open means the hour is at least the opening hour and less than the closing hour. The variable day holds \"Monday\" and hour holds 9. Print Open if the library is open on that day at that hour, and Closed otherwise. For these values the output is exactly: Open",
      starterCode: `day = "Monday"
hour = 9
# print Open or Closed
`,
      check: { type: "stdout-exact", expected: "Open" },
      solution: `day = "Monday"
hour = 9
if day == "Saturday" or day == "Sunday":
    if 10 <= hour < 14:
        print("Open")
    else:
        print("Closed")
else:
    if 9 <= hour < 17:
        print("Open")
    else:
        print("Closed")
`,
      hint: "First check whether day is Saturday or Sunday, writing the full comparison on both sides of or. Inside each branch, nest an if that checks the hour with a chained comparison such as 9 <= hour < 17.",
    },
  ],
};

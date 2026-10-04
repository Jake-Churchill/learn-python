export default {
  slug: "review-variables-control-flow",
  title: "Review: Variables & Decisions",
  unit: "Decisions",
  blocks: [
    {
      type: "prose",
      body: "This review combines the first three units: variables and types, input and output, numbers and strings, f-strings, and decisions with `if`, `match`, and conditional expressions. Each exercise is a small complete program that reads its input, works something out, and prints a result.",
    },
    {
      type: "heading",
      text: "A worked example",
    },
    {
      type: "prose",
      body: "The program below reads a test score, turns it into a letter grade, and reports whether the student passed. Read it line by line and predict the output before you run it. It receives the input 82.",
    },
    {
      type: "example",
      code: `score = int(input("Score? "))
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
result = "passed" if grade != "F" else "did not pass"
print(f"Score {score}: grade {grade}, {result}")`,
      stdin: "82",
    },
    {
      type: "prose",
      body: "Three habits make programs like this easier to write. Convert the input to a number as soon as you read it. Let each branch store its answer in a variable instead of printing. Then print once at the end with an f-string, so the output format is written in only one place.",
    },
    {
      type: "prose",
      body: "The first habit prevents a common error. If you compare the text from `input()` with a number, as in `age < 18`, Python stops with `TypeError: '<' not supported between instances of 'str' and 'int'`. The message means it cannot compare text with a number. Wrapping `input()` in `int()` or `float()` fixes it.",
    },
    {
      type: "heading",
      text: "Age groups",
    },
    {
      type: "prose",
      body: "The first exercise is the grade example in miniature: read a number, choose a label with `if`, `elif`, and `else`, and print it.",
    },
    {
      type: "exercise",
      id: "review-variables-control-flow-1",
      prompt:
        "The program receives the input 20, and the input line is written for you. Use if, elif, and else to set a variable status to Minor when age is under 18, Adult when age is under 65, and Senior otherwise. Then print status with an f-string. The output should be exactly two lines: Age? 20 and then Status: Adult",
      starterCode: `age = int(input("Age? "))
# set status with if, elif, and else, then print it
`,
      stdin: "20",
      check: { type: "stdout-exact", expected: "Age? 20\nStatus: Adult" },
      solution: `age = int(input("Age? "))
if age < 18:
    status = "Minor"
elif age < 65:
    status = "Adult"
else:
    status = "Senior"
print(f"Status: {status}")
`,
      hint: "Each branch assigns status, for example status = \"Minor\". After the whole if statement, print(f\"Status: {status}\").",
    },
    {
      type: "heading",
      text: "Tip calculator",
    },
    {
      type: "prose",
      body: "People type answers in whatever capitals they like. Converting text with `.lower()` before you match it means `Great`, `GREAT`, and `great` all reach the same case.",
    },
    {
      type: "exercise",
      id: "review-variables-control-flow-2",
      prompt:
        "The program receives two lines of input: 48.50 and then Great. Both input lines are written for you. Use match on the rating converted to lowercase to choose a tip percentage: great is 20, good is 15, and anything else is 10. Work out the tip as the bill times the percentage divided by 100, and the total as the bill plus the tip. Print both with two decimal places. The output should be exactly four lines: Bill? 48.50, then Service? Great, then Tip: $9.70, then Total: $58.20",
      starterCode: `bill = float(input("Bill? "))
rating = input("Service? ")
# choose the percentage with match, then print the tip and the total
`,
      stdin: "48.50\nGreat",
      check: {
        type: "stdout-exact",
        expected: "Bill? 48.50\nService? Great\nTip: $9.70\nTotal: $58.20",
      },
      solution: `bill = float(input("Bill? "))
rating = input("Service? ")
match rating.lower():
    case "great":
        percent = 20
    case "good":
        percent = 15
    case _:
        percent = 10
tip = bill * percent / 100
total = bill + tip
print(f"Tip: \${tip:.2f}")
print(f"Total: \${total:.2f}")
`,
      hint: "Write match rating.lower(): and give each case a line such as percent = 20, with case _: for everything else. Then print with f-strings that use the format spec :.2f.",
    },
    {
      type: "heading",
      text: "Leap years",
    },
    {
      type: "prose",
      body: "The last exercise needs a condition built from several `%` checks joined with `and` and `or`. Work out the rule on paper first, then turn each part of it into code.",
    },
    {
      type: "exercise",
      id: "review-variables-control-flow-3",
      prompt:
        "The program receives the input 1900. Ask for a year with the exact prompt Year? (followed by a space) and convert the answer to a whole number. A year is a leap year when it divides evenly by 4, except that a year dividing evenly by 100 is not a leap year unless it also divides evenly by 400. Print the year followed by either is a leap year or is not a leap year. The output should be exactly two lines: Year? 1900 and then 1900 is not a leap year",
      starterCode: `# ask for the year, decide, and print the result
`,
      stdin: "1900",
      check: { type: "stdout-exact", expected: "Year? 1900\n1900 is not a leap year" },
      solution: `year = int(input("Year? "))
is_leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
result = "is a leap year" if is_leap else "is not a leap year"
print(year, result)
`,
      hint: "Start with year % 4 == 0. Join it with and to a part in parentheses that is True when the year does not divide evenly by 100 or does divide evenly by 400. Check your rule in your head: 2024 and 2000 are leap years, 1900 and 2023 are not.",
    },
  ],
};

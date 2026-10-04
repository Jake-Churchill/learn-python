export default {
  slug: "loop-patterns",
  title: "Common Loop Patterns",
  unit: "Loops",
  blocks: [
    {
      type: "prose",
      body: "Most loops you will write follow a few familiar patterns. Each one uses a variable that is set up before the loop, updated inside it, and read after it ends. Once you know the patterns, you can tell which one a problem needs and write it quickly.",
    },
    {
      type: "prose",
      body: "You have already met one of them: adding up a total. This lesson covers counting, summing only some values, finding the largest and smallest value, building a string, and recording whether something happened.",
    },
    {
      type: "heading",
      text: "Counting",
    },
    {
      type: "prose",
      body: "A counter is a variable that starts at 0 and goes up by one each time the loop finds what you are looking for. An `if` inside the loop decides what counts. After the loop, the counter holds the number of matches.",
    },
    {
      type: "example",
      code: `sentence = "Loops make repeated work easy"
vowels = 0
for letter in sentence.lower():
    if letter in "aeiou":
        vowels += 1
print("Vowels:", vowels)`,
    },
    {
      type: "prose",
      body: "Calling `.lower()` first means capital vowels are counted too. The condition `letter in \"aeiou\"` is `True` when the letter is one of those five characters.",
    },
    {
      type: "heading",
      text: "Summing selected values",
    },
    {
      type: "prose",
      body: "Summing works like counting, except that you add the value itself instead of 1. Putting the addition inside an `if` totals only some of the values. One loop can count and sum at the same time by keeping two variables.",
    },
    {
      type: "example",
      code: `order = "Table 4 ordered 2 soups and 3 salads"
digit_count = 0
digit_total = 0
for char in order:
    if char.isdigit():
        digit_count += 1
        digit_total += int(char)
print(digit_count, "digits adding up to", digit_total)`,
    },
    {
      type: "exercise",
      id: "loop-patterns-1",
      prompt:
        "The loop below counts every character in message. Put the counting line inside an if that uses .isdigit(), so only digits are counted. The output should be exactly: 8",
      starterCode: `message = "Call 555-0142 after 6"
digits = 0
for char in message:
    digits += 1
print(digits)
`,
      check: { type: "stdout-exact", expected: "8" },
      solution: `message = "Call 555-0142 after 6"
digits = 0
for char in message:
    if char.isdigit():
        digits += 1
print(digits)
`,
      hint: "Add the line if char.isdigit(): inside the loop, and indent digits += 1 one more level so it belongs to the if.",
    },
    {
      type: "heading",
      text: "Largest and smallest",
    },
    {
      type: "prose",
      body: "To find the largest value, keep a variable that holds the largest value seen so far. Each time the loop sees a new value, compare it with that variable, and replace the variable when the new value is bigger. The smallest value works the same way with `<`. This is called tracking a running maximum or a running minimum.",
    },
    {
      type: "prose",
      body: "The starting value matters. The safest choice is the first value itself, because it is real data. Starting the maximum at 0 would give a wrong answer if every value were negative, such as a week of winter temperatures.",
    },
    {
      type: "example",
      code: `first = int(input("Temperature: "))
highest = first
lowest = first
for day in range(4):
    temperature = int(input("Temperature: "))
    if temperature > highest:
        highest = temperature
    if temperature < lowest:
        lowest = temperature
print(f"High: {highest}, low: {lowest}")`,
      stdin: "-3\n2\n-8\n5\n0",
    },
    {
      type: "prose",
      body: "This example receives five temperatures. The first one sets both `highest` and `lowest`, and the loop reads the other four. The loop variable `day` is never used in the body; the loop only needs to run four times.",
    },
    {
      type: "exercise",
      id: "loop-patterns-2",
      prompt:
        "The string scores holds one judge's score per character. Both highest and lowest start at the first score. Write a loop that updates them so the program prints exactly two lines: Highest: 9 and then Lowest: 3",
      starterCode: `scores = "6849375"
highest = int(scores[0])
lowest = int(scores[0])
# loop over the scores and update highest and lowest
print("Highest:", highest)
print("Lowest:", lowest)
`,
      check: { type: "stdout-exact", expected: "Highest: 9\nLowest: 3" },
      solution: `scores = "6849375"
highest = int(scores[0])
lowest = int(scores[0])
for score in scores:
    value = int(score)
    if value > highest:
        highest = value
    if value < lowest:
        lowest = value
print("Highest:", highest)
print("Lowest:", lowest)
`,
      hint: "Each character is text, so convert it with int() before comparing. Use one if with > to update highest and another with < to update lowest.",
    },
    {
      type: "heading",
      text: "Building a string",
    },
    {
      type: "prose",
      body: "A loop can build a new string piece by piece. Start with an empty string, written `\"\"`, and add to it with `+=` inside the loop. Strings cannot be changed, so each `+=` makes a longer string and stores it back in the variable.",
    },
    {
      type: "example",
      code: `phone = "(555) 867-5309"
digits_only = ""
for char in phone:
    if char.isdigit():
        digits_only += char
print(digits_only)

word = "stressed"
backwards = ""
for letter in word:
    backwards = letter + backwards
print(backwards)`,
    },
    {
      type: "prose",
      body: "The order of the addition matters. `digits_only += char` puts each new character at the end, so the original order is kept. `backwards = letter + backwards` puts each new letter at the front, so the word comes out reversed.",
    },
    {
      type: "heading",
      text: "Flag variables",
    },
    {
      type: "prose",
      body: "A flag is a `bool` variable that records whether something has happened. It starts as `False`, and the loop sets it to `True` when it finds what you are looking for. After the loop, an `if` on the flag decides what to do.",
    },
    {
      type: "example",
      code: `password = "tulip2024"
has_digit = False
for char in password:
    if char.isdigit():
        has_digit = True
if has_digit:
    print("Contains a digit")
else:
    print("Add at least one digit")`,
    },
    {
      type: "prose",
      body: "Once the flag is `True`, nothing in the loop sets it back, so one match anywhere in the string is enough. If the flag is all you need, you can also `break` as soon as you set it, because the rest of the characters cannot change the answer.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Setting up the variable inside the loop is the most common mistake. A line such as `count = 0` in the body resets the count on every iteration, so the final count can never be more than 1. Create counters, totals, strings, and flags before the loop starts.",
    },
    {
      type: "prose",
      body: "With a flag, do not add an `else` that sets it back to `False`. The flag would then describe only the last character, not the whole string. Set it to `True` when you find a match and leave it alone otherwise.",
    },
    {
      type: "prose",
      body: "For a running maximum or minimum, start from a real value in the data. A made-up starting value such as 0 can be larger or smaller than every real value, and then it wins every comparison.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A counter starts at 0 and adds 1 for each match, and a sum adds the matching values themselves. A running maximum or minimum starts from the first value and is replaced whenever a bigger or smaller value appears. A string is built by starting from `\"\"` and adding with `+=`, and a flag is a `bool` that starts as `False` and becomes `True` when something is found.",
    },
    {
      type: "exercise",
      id: "loop-patterns-3",
      prompt:
        "The variable password holds \"sunflowers\". Use two flag variables to check whether it contains at least one letter and at least one digit. A password is strong when it has at least 8 characters, a letter, and a digit. Print exactly three lines: Has letter: True, then Has digit: False, then Weak password (a strong password would print Strong password instead).",
      starterCode: `password = "sunflowers"
# use two flags, then print the three lines
`,
      check: {
        type: "stdout-exact",
        expected: "Has letter: True\nHas digit: False\nWeak password",
      },
      solution: `password = "sunflowers"
has_letter = False
has_digit = False
for char in password:
    if char.isalpha():
        has_letter = True
    if char.isdigit():
        has_digit = True
print("Has letter:", has_letter)
print("Has digit:", has_digit)
if len(password) >= 8 and has_letter and has_digit:
    print("Strong password")
else:
    print("Weak password")
`,
      hint: "Start has_letter and has_digit at False before the loop. Inside it, set one with .isalpha() and the other with .isdigit(). After the loop, print both flags, then use and to combine len(password) >= 8 with the two flags.",
    },
  ],
};

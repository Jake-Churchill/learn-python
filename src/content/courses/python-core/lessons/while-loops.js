export default {
  slug: "while-loops",
  title: "while Loops & Loop Control",
  unit: "Loops",
  blocks: [
    {
      type: "prose",
      body: "A `for` loop runs a known number of times: once per character, or once per number in a range. Sometimes you cannot know the count in advance. A program might need to keep reading prices until the person says they are done, or keep doubling a number until it passes a target.",
    },
    {
      type: "prose",
      body: "A `while` loop handles these cases, because it repeats for as long as a condition stays true. This lesson also covers `break` and `continue`, two words that change how any loop runs.",
    },
    {
      type: "heading",
      text: "The while loop",
    },
    {
      type: "prose",
      body: "A `while` loop starts with the word `while`, a condition, and a colon, followed by an indented body. Python checks the condition first. If it is `True`, Python runs the body and then goes back to check the condition again. When the condition is `False`, Python skips the body and carries on with the rest of the program.",
    },
    {
      type: "prose",
      body: "Something in the body must change a value the condition depends on, or the condition would stay true forever. In the next example, `count -= 1` lowers `count` by one on each pass, so `count > 0` eventually becomes `False`.",
    },
    {
      type: "example",
      code: `count = 3
while count > 0:
    print(count)
    count -= 1
print("Go!")`,
    },
    {
      type: "prose",
      body: "If the condition is `False` the very first time, the body never runs at all. The next example cannot know in advance how many passes it needs. A colony of 100 bacteria doubles every hour, and the loop counts the hours until the colony reaches at least 1000.",
    },
    {
      type: "example",
      code: `bacteria = 100
hours = 0
while bacteria < 1000:
    bacteria *= 2
    hours += 1
print(f"After {hours} hours there are {bacteria} bacteria")`,
    },
    {
      type: "heading",
      text: "Avoiding infinite loops",
    },
    {
      type: "prose",
      body: "A loop whose condition never becomes `False` is called an infinite loop, because it never ends on its own. Leaving out `count -= 1` in the countdown above would print 3 over and over, since `count` would always be 3.",
    },
    {
      type: "prose",
      body: "On this site, a program that runs for more than 8 seconds is stopped, and a message tells you to check for an infinite loop. Before you run a `while` loop, find the line in its body that moves the condition toward `False`.",
    },
    {
      type: "exercise",
      id: "while-loops-1",
      prompt:
        "A game character starts with 100 health and loses 15 health per hit. The loop already stops once health falls to 0 or below, but it never counts the hits. Add the missing line so hits increases by 1 on every pass. The output should be exactly: Knocked out after 7 hits",
      starterCode: `health = 100
hits = 0
while health > 0:
    health -= 15
    # add 1 to hits here
print(f"Knocked out after {hits} hits")
`,
      check: { type: "stdout-exact", expected: "Knocked out after 7 hits" },
      solution: `health = 100
hits = 0
while health > 0:
    health -= 15
    hits += 1
print(f"Knocked out after {hits} hits")
`,
      hint: "Use += to add 1 to hits. The new line must be indented like health -= 15 so it runs on every pass.",
    },
    {
      type: "heading",
      text: "Leaving a loop early with break",
    },
    {
      type: "prose",
      body: "The word `break` ends a loop immediately. Python skips the rest of the body, does not check the condition again, and continues with the first line after the loop. You almost always put `break` inside an `if`, so the loop ends only when something specific happens. It works in `for` loops too.",
    },
    {
      type: "example",
      code: `for letter in "Mississippi":
    if letter == "s":
        print("Found the first s")
        break
    print(letter)`,
    },
    {
      type: "prose",
      body: "A common way to use `break` is a loop written as `while True:`. The condition `True` can never become `False`, so this loop ends only when it reaches a `break`. It is safe as long as the body is sure to reach that `break` eventually.",
    },
    {
      type: "heading",
      text: "Skipping ahead with continue",
    },
    {
      type: "prose",
      body: "The word `continue` ends only the current iteration. Python skips the rest of the body and moves straight on: a `for` loop takes its next value, and a `while` loop checks its condition again. The next example uses `%` to skip every multiple of 3.",
    },
    {
      type: "example",
      code: `for number in range(1, 11):
    if number % 3 == 0:
        continue
    print(number, end=" ")
print()`,
    },
    {
      type: "prose",
      body: "Be careful with `continue` in a `while` loop. If it comes before the line that updates the condition, that update is skipped too, and the loop can run forever.",
    },
    {
      type: "heading",
      text: "Reading input until a sentinel",
    },
    {
      type: "prose",
      body: "A sentinel is a special value that means stop, such as the word `done` or the number 0. It lets a program read any number of answers: the person types values one at a time and then types the sentinel. The usual shape is a `while True:` loop that reads one answer, uses `break` if it is the sentinel, and otherwise handles it.",
    },
    {
      type: "example",
      code: `total = 0
while True:
    entry = input("Price, or done to finish: ")
    if entry == "done":
        break
    total += float(entry)
print(f"Total: {total:.2f}")`,
      stdin: "4.50\n2.25\n3.10\ndone",
    },
    {
      type: "prose",
      body: "This example receives three prices followed by `done`, and each call to `input()` uses up one of those lines. Notice the order inside the loop. The program checks for the sentinel before converting the entry, so the word `done` never reaches `float()` and is never added to the total.",
    },
    {
      type: "exercise",
      id: "while-loops-2",
      prompt:
        "The program receives four lines of input: Ada, Grace, Alan, and quit. The loop already asks for a name and greets it. Add an if with break so the loop stops when the name is quit, before quit is greeted. The output should be exactly eight lines: Name: Ada then Hello, Ada! then Name: Grace then Hello, Grace! then Name: Alan then Hello, Alan! then Name: quit then Goodbye",
      starterCode: `while True:
    name = input("Name: ")
    # stop the loop here when name is "quit"
    print(f"Hello, {name}!")
print("Goodbye")
`,
      stdin: "Ada\nGrace\nAlan\nquit",
      check: {
        type: "stdout-exact",
        expected:
          "Name: Ada\nHello, Ada!\nName: Grace\nHello, Grace!\nName: Alan\nHello, Alan!\nName: quit\nGoodbye",
      },
      solution: `while True:
    name = input("Name: ")
    if name == "quit":
        break
    print(f"Hello, {name}!")
print("Goodbye")
`,
      hint: "Compare name with the text \"quit\" using ==. The if and its break must come before the print() call, so quit is never greeted.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting to update the condition is the classic mistake, and it causes an infinite loop. Check that every `while` loop changes something its condition depends on, and that no `continue` can skip that change.",
    },
    {
      type: "prose",
      body: "Comparing input with the wrong type is another. `input()` always returns text, so if the sentinel is 0, compare the text with `\"0\"`, or convert it first and compare the number with `0`. While `entry` holds text, `entry == 0` is always `False`, so that `break` never runs.",
    },
    {
      type: "prose",
      body: "When the sentinel is a word such as `done`, check for it before converting: `float(\"done\")` stops the program with a `ValueError`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A `while` loop repeats its body as long as its condition is `True`, and something in the body must move that condition toward `False`. `break` ends a loop at once, and `continue` skips to the next iteration. A sentinel loop uses `while True:` to read values until a stop value arrives, and it checks for the sentinel before using each value.",
    },
    {
      type: "exercise",
      id: "while-loops-3",
      prompt:
        "A step counter sends one daily count per line and ends with the sentinel 0. The program receives the lines 4200, -1, 6100, 3800, and 0. Read each count with the exact prompt Steps: (with a space after the colon) until the 0 arrives. A negative count is a sensor error: skip it without adding it. Then print the total. The output should be exactly six lines: Steps: 4200, Steps: -1, Steps: 6100, Steps: 3800, Steps: 0, Total steps: 14100",
      starterCode: `# read step counts until 0, skip negative counts, then print the total
`,
      stdin: "4200\n-1\n6100\n3800\n0",
      check: {
        type: "stdout-exact",
        expected:
          "Steps: 4200\nSteps: -1\nSteps: 6100\nSteps: 3800\nSteps: 0\nTotal steps: 14100",
      },
      solution: `total = 0
while True:
    steps = int(input("Steps: "))
    if steps == 0:
        break
    if steps < 0:
        continue
    total += steps
print(f"Total steps: {total}")
`,
      hint: "Start a total at 0, then use while True: with int(input(\"Steps: \")). Use break when the count is 0 and continue when it is below 0. Add every other count to the total, and print it after the loop.",
    },
  ],
};

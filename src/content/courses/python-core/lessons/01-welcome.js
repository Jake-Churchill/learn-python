export default {
  slug: "welcome",
  title: "Welcome & Your First Script",
  unit: "Getting Started",
  blocks: [
    {
      type: "prose",
      body: "A program is a list of instructions that a computer follows, one after another. Python is a language for writing those instructions. In this course you will write short programs, run them, and read what they produce.",
    },
    {
      type: "prose",
      body: "You do not need to install anything. Python runs inside this web page, so each code box below is a small editor with a button that runs what you typed. The first time the page loads, the button may say \"Loading Python…\" for a few seconds. Anything you run here stays inside this page.",
    },
    {
      type: "heading",
      text: "How the code boxes work",
    },
    {
      type: "prose",
      body: "A box labeled \"Try it\" holds an example. You can edit the code in the box and press the Run button to see what the program prints. The text a program prints is called its output, and it appears below the box. Your edits are not saved, so experiment freely.",
    },
    {
      type: "prose",
      body: "A box labeled \"Prove it\" is an exercise. It describes a small task and gives you a place to write the code. Press the Check button and the page runs your code, then tells you whether the output matches what the task asked for. If it does not match, the page shows what your code printed next to what was expected.",
    },
    {
      type: "heading",
      text: "Your first instruction",
    },
    {
      type: "prose",
      body: "The first instruction to learn is `print()`. It shows something on the screen. `print` is a function: a named instruction that does one job. You use a function by writing its name followed by parentheses, which is called calling the function.",
    },
    {
      type: "prose",
      body: "Whatever you put between the parentheses is what the function works with. In `print(\"Hello, world!\")`, that is the text `Hello, world!` written inside quotation marks. Text like this is called a string. The quotation marks tell Python where the string starts and ends, and they are not printed.",
    },
    {
      type: "example",
      code: `print("Hello, world!")`,
    },
    {
      type: "prose",
      body: "Try changing the text inside the quotation marks and running the example again. You can use double quotes, like `\"this\"`, or single quotes, like `'this'`. Both work, as long as the opening and closing quote match.",
    },
    {
      type: "heading",
      text: "Instructions run in order",
    },
    {
      type: "prose",
      body: "A program runs from the top line to the bottom line, one line at a time. Python finishes a line before it starts the next one. Each call to `print()` puts its text on a new line of output.",
    },
    {
      type: "example",
      code: `print("Python reads this line first.")
print("Then it reads this one.")`,
    },
    {
      type: "prose",
      body: "To leave a blank line in the output, call `print()` with nothing between the parentheses.",
    },
    {
      type: "example",
      code: `print("First line")
print()
print("Third line, after a blank line")`,
    },
    {
      type: "exercise",
      id: "welcome-1",
      prompt: "Use print() to output exactly this line: Python is fun",
      starterCode: `# write your code below
`,
      check: { type: "stdout-exact", expected: "Python is fun" },
      solution: `print("Python is fun")
`,
      hint: "Put the text inside quotation marks, between the parentheses of print().",
    },
    {
      type: "heading",
      text: "Comments",
    },
    {
      type: "prose",
      body: "A comment is a note in your code that Python ignores. It starts with a `#` symbol, and everything after the `#` on that line is skipped. Comments are written for people: they explain what the code does or why it is there.",
    },
    {
      type: "example",
      code: `# This whole line is a comment. Python skips it.
print("This line runs.")  # A comment can also follow code.`,
    },
    {
      type: "prose",
      body: "Python has no special symbol for commenting out several lines at once. To skip several lines, start each one with its own `#`.",
    },
    {
      type: "exercise",
      id: "welcome-2",
      prompt:
        "The first line of a three-line message is already written. Add two more print() calls so the program prints exactly these three lines, in this order: Dear Sam, then Welcome to the course. then See you soon!",
      starterCode: `print("Dear Sam,")
# add the other two lines below
`,
      check: {
        type: "stdout-exact",
        expected: "Dear Sam,\nWelcome to the course.\nSee you soon!",
      },
      solution: `print("Dear Sam,")
print("Welcome to the course.")
print("See you soon!")
`,
      hint: "Each line of output needs its own print() call, written in the same order as the output.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Leaving out the quotation marks is the most common mistake. `print(Hello)` makes Python look for something named Hello instead of printing the word, and it fails. Write `print(\"Hello\")` instead.",
    },
    {
      type: "prose",
      body: "Starting a string with one kind of quote and ending it with the other, as in `print(\"Hello')`, also fails because Python never finds the end of the text. Capital letters matter too: `Print(\"Hello\")` is not the same as `print(\"Hello\")`. The next lesson shows how to read the message Python gives you when something like this goes wrong.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A program is a list of instructions that Python runs from the top line to the bottom line. `print()` is a function that shows text, and text written inside quotation marks is called a string. A comment starts with `#` and is ignored by Python.",
    },
    {
      type: "exercise",
      id: "welcome-3",
      prompt:
        "Print a four-line card exactly as shown, one print() call per line. Line 1: Ada Lovelace. Line 2: Mathematician. Line 3: ada@example.com. Line 4: Born 1815.",
      starterCode: `# print the four lines of the card
`,
      check: {
        type: "stdout-exact",
        expected: "Ada Lovelace\nMathematician\nada@example.com\nBorn 1815",
      },
      solution: `print("Ada Lovelace")
print("Mathematician")
print("ada@example.com")
print("Born 1815")
`,
      hint: "Call print() four times. Each call prints one line, and its text goes inside quotation marks.",
    },
  ],
};

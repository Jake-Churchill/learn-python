export default {
  slug: "reading-errors",
  title: "Reading Error Messages",
  unit: "Getting Started",
  blocks: [
    {
      type: "prose",
      body: "Every programmer sees error messages, every day. An error does not mean you are bad at programming. It means Python found something it could not run and is telling you where to look.",
    },
    {
      type: "prose",
      body: "When Python meets a problem, it stops the program and prints a message called a traceback. The message looks long at first, but it follows the same pattern every time. Learning to read that pattern is one of the most useful skills you can build early.",
    },
    {
      type: "heading",
      text: "Anatomy of an error message",
    },
    {
      type: "prose",
      body: "The example below misspells `print`. Run it and read the red text that appears. The first line, `Traceback (most recent call last):`, only announces that an error follows. The line that begins with `File` tells you where the problem is: `line 1` means the first line of your code.",
    },
    {
      type: "example",
      code: `prnt("Hello")`,
      showsError: true,
    },
    {
      type: "prose",
      body: "The most important line is the last one: `NameError: name 'prnt' is not defined`. It starts with the kind of error, `NameError`, followed by a plain-English explanation. Python even suggests the word you probably meant. Always read the last line first, then use the line number to find the code it is talking about.",
    },
    {
      type: "prose",
      body: "The words `in <module>` mean the problem is in the main part of your program. You will see other words there later, but you can ignore them for now.",
    },
    {
      type: "heading",
      text: "NameError",
    },
    {
      type: "prose",
      body: "A `NameError` means Python met a word it does not recognize. The usual causes are a misspelled name, a capital letter in the wrong place, or a string with its quotation marks left off. Here the quotation marks are missing, so Python reads `Hello` as a name instead of text.",
    },
    {
      type: "example",
      code: `print(Hello)`,
      showsError: true,
    },
    {
      type: "heading",
      text: "SyntaxError",
    },
    {
      type: "prose",
      body: "Syntax means the rules for how code must be written. A `SyntaxError` means a line breaks those rules, so Python cannot even start running the program. Python shows the offending line with a `^` marker under the spot where it got confused. The next example opens a string but never closes it.",
    },
    {
      type: "example",
      code: `print("Hello)`,
      showsError: true,
    },
    {
      type: "prose",
      body: "The message says `unterminated string literal`. That is a technical way of saying that a string started and never ended. A missing closing quotation mark or a missing closing parenthesis are the most common syntax errors.",
    },
    {
      type: "exercise",
      id: "reading-errors-1",
      prompt:
        "This program has a syntax error. Fix it so it prints exactly: Good morning",
      starterCode: `print("Good morning)
`,
      check: { type: "stdout-exact", expected: "Good morning" },
      solution: `print("Good morning")
`,
      hint: "Read the last line of the error. A string that starts with a quotation mark needs a closing one.",
    },
    {
      type: "heading",
      text: "IndentationError",
    },
    {
      type: "prose",
      body: "Python cares about the spaces at the start of a line. For now, every line of your program should start at the very left edge. If a line starts with extra spaces, Python raises an `IndentationError`, which means it stops the program and reports that kind of error. The message says `unexpected indent`. Later lessons will show where indentation is required.",
    },
    {
      type: "example",
      code: `print("First step")
    print("Second step")`,
      showsError: true,
    },
    {
      type: "heading",
      text: "TypeError",
    },
    {
      type: "prose",
      body: "A `TypeError` means you asked Python to do something with a kind of value that does not support it. In the next example, the `+` sign is used between a piece of text and the number 5. Python cannot mix the two, and the message says so. You will learn how `+` works in Unit 2.",
    },
    {
      type: "example",
      code: `print("Total: " + 5)`,
      showsError: true,
    },
    {
      type: "exercise",
      id: "reading-errors-2",
      prompt:
        "This program has a misspelled function name. Fix it so it prints exactly: Learning to read errors",
      starterCode: `prnt("Learning to read errors")
`,
      check: { type: "stdout-exact", expected: "Learning to read errors" },
      solution: `print("Learning to read errors")
`,
      hint: "The last line of the error suggests the word you probably meant.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Do not start with the first line of the traceback. It is the same every time and tells you nothing new. Read the last line, then look at the line number.",
    },
    {
      type: "prose",
      body: "When a program has several mistakes, Python reports only the first one it finds. After you fix it, run the program again, because another error may appear. Fixing one error at a time is normal and does not mean you are making progress slowly.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A traceback ends with the kind of error and a short explanation, and the line number points at the code to check. A `NameError` is an unknown word, a `SyntaxError` is a line that breaks the writing rules, an `IndentationError` is a line that starts with unexpected spaces, and a `TypeError` is a value used in a way it does not support.",
    },
    {
      type: "exercise",
      id: "reading-errors-3",
      prompt:
        "This program has two mistakes. Fix both so it prints exactly two lines: Step one and then Step two",
      starterCode: `print("Step one")
prnt("Step two)
`,
      check: { type: "stdout-exact", expected: "Step one\nStep two" },
      solution: `print("Step one")
print("Step two")
`,
      hint: "Fix one error at a time. Run the program, read the last line of the message, fix what it points at, then run it again.",
    },
  ],
};

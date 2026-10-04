export default {
  slug: "input-and-output",
  title: "Input & Output",
  unit: "Getting Started",
  blocks: [
    {
      type: "prose",
      body: "A program becomes useful when it can talk to the person using it. Output is what a program shows, and you already know how to produce it with `print()`. Input is what a program receives, and Python reads it with a function called `input()`. This lesson covers both.",
    },
    {
      type: "heading",
      text: "Printing several values",
    },
    {
      type: "prose",
      body: "You can give `print()` more than one value by separating them with commas. Python prints them on one line with a single space between each. The values can be different types, and numbers are printed as ordinary text, so you do not need to convert them first.",
    },
    {
      type: "example",
      code: `name = "Ada"
age = 30
print("Name:", name)
print("Age:", age)
print(name, "is", age, "years old")`,
    },
    {
      type: "heading",
      text: "Changing how print separates and ends",
    },
    {
      type: "prose",
      body: "The space between values is called the separator. You can choose a different one by adding `sep=` at the end of the call, followed by the text to use. For example, `sep=\"-\"` puts a hyphen between values. Writing `sep=\"\"` puts nothing between them.",
    },
    {
      type: "prose",
      body: "By default, `print()` finishes its output with a line break, which is why each call appears on its own line. The `end=` option replaces that line break with whatever text you give it. The next example uses both options.",
    },
    {
      type: "example",
      code: `print("2025", "06", "30", sep="-")
print("Loading", end="...")
print("done")`,
    },
    {
      type: "heading",
      text: "Asking for input",
    },
    {
      type: "prose",
      body: "The `input()` function pauses the program and waits for someone to type an answer. Text placed inside the parentheses is shown first as a question, called a prompt. Whatever the person types is handed back to your program, so you normally store it in a variable.",
    },
    {
      type: "prose",
      body: "On this site you cannot type while a program runs. Instead, every example and exercise that uses `input()` comes with the answer it will receive, and the page feeds that answer to the program. The output shows the answer right after the prompt, just as it would appear on a real screen.",
    },
    {
      type: "example",
      code: `name = input("What is your name? ")
print("Hello,", name)`,
      stdin: "Ada",
    },
    {
      type: "prose",
      body: "This example receives the answer `Ada`. The first line of output is the prompt followed by that answer, and the second line is the greeting. Every call to `input()` uses up one line of the supplied answers. If a program asks for more lines than it was given, Python stops with an `EOFError`.",
    },
    {
      type: "exercise",
      id: "input-and-output-1",
      prompt:
        "The program receives the input Ada. The first line is written for you. Add a print() call with two values, the text Hello, and then the name, so the output is exactly two lines: Name? Ada and then Hello, Ada",
      starterCode: `name = input("Name? ")
# print the greeting below
`,
      stdin: "Ada",
      check: { type: "stdout-exact", expected: "Name? Ada\nHello, Ada" },
      solution: `name = input("Name? ")
print("Hello,", name)
`,
      hint: "Give print() two values separated by a comma: the text \"Hello,\" and the variable name.",
    },
    {
      type: "heading",
      text: "Input is always text",
    },
    {
      type: "prose",
      body: "Even when someone types digits, `input()` hands them back as text, which has the type `str`. The text `\"30\"` is not a number yet. To use it as a number, convert it with `int()` for whole numbers or `float()` for decimals, which you met in the last lesson.",
    },
    {
      type: "example",
      code: `age_text = input("How old are you? ")
print(type(age_text))
age = int(age_text)
print(type(age))`,
      stdin: "30",
    },
    {
      type: "prose",
      body: "You can combine the two steps by placing `input()` inside `int()`, as in `int(input(\"Age? \"))`. Python runs the inside first and then converts its result. If the answer is not a valid number, the conversion fails with a `ValueError`.",
    },
    {
      type: "example",
      code: `age = int(input("How old are you? "))`,
      stdin: "abc",
      showsError: true,
    },
    {
      type: "exercise",
      id: "input-and-output-2",
      prompt:
        "The program receives two lines of input: Paris and then France. Both input() lines are written for you. Add one print() call that prints the city and the country on one line, separated by a comma and a space. The output should be exactly three lines: City? Paris, then Country? France, then Paris, France",
      starterCode: `city = input("City? ")
country = input("Country? ")
# print the city and country on one line
`,
      stdin: "Paris\nFrance",
      check: {
        type: "stdout-exact",
        expected: "City? Paris\nCountry? France\nParis, France",
      },
      solution: `city = input("City? ")
country = input("Country? ")
print(city, country, sep=", ")
`,
      hint: "Use the sep option: sep=\", \" puts a comma and a space between the values.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting to convert is the most common mistake. A value read with `input()` is text even if it looks like a number, so it must go through `int()` or `float()` before you treat it as a number. Printing it unconverted will not show an error, which makes the mistake easy to miss.",
    },
    {
      type: "prose",
      body: "Two smaller mistakes are worth remembering. A prompt does not add its own space, so end it with a space, as in `\"Name? \"`, or the answer will touch the question. And `sep` and `end` must be written with their names and an `=` sign, as in `sep=\"-\"`. Without the name, Python prints the text as another value.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`print()` accepts several values separated by commas, and the `sep` and `end` options change what goes between and after them. `input()` shows a prompt and hands back whatever was typed, always as text. Convert that text with `int()` or `float()` when you need a number.",
    },
    {
      type: "exercise",
      id: "input-and-output-3",
      prompt:
        "The program receives the input 7. Write a program that asks for a number using the exact prompt Number? (a question mark followed by a space), converts the answer to a whole number with int(), and prints the type of the converted value. The output should be exactly two lines: Number? 7 and then <class 'int'>",
      starterCode: `# ask for the number, convert it, and print its type
`,
      stdin: "7",
      check: { type: "stdout-exact", expected: "Number? 7\n<class 'int'>" },
      solution: `number = int(input("Number? "))
print(type(number))
`,
      hint: "Put input(\"Number? \") inside int(), store the result in a variable, and give that variable to type() inside print().",
    },
  ],
};

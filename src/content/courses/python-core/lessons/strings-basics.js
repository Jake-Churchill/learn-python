export default {
  slug: "strings-basics",
  title: "Working with Strings",
  unit: "Numbers & Text",
  blocks: [
    {
      type: "prose",
      body: "Text is everywhere in programs: names, messages, addresses, and codes. You already know that text written in quotation marks is a string. This lesson shows how to write strings that contain special characters, how to join and repeat them, and how to pull out single characters or whole pieces.",
    },
    {
      type: "heading",
      text: "Single, double, and triple quotes",
    },
    {
      type: "prose",
      body: "A string can use single quotes or double quotes, and both create exactly the same kind of value. Having two kinds is useful when the text itself contains a quote. Wrap text that has an apostrophe in double quotes, as in `\"It's raining\"`, and wrap text that has double quotes in single quotes.",
    },
    {
      type: "prose",
      body: "For text that spans several lines, put three quotation marks in a row at each end, either `\"\"\"` or `'''`. This is called a triple-quoted string. Every line break you type inside it becomes part of the string.",
    },
    {
      type: "example",
      code: `print("It's raining")
print('She said "hello"')
address = """Ada Lovelace
12 Park Road
London"""
print(address)`,
    },
    {
      type: "heading",
      text: "Escape sequences",
    },
    {
      type: "prose",
      body: "Some characters are hard to type inside a string. A backslash, `\\`, starts an escape sequence: a backslash and the character after it, which together stand for one special character. `\\n` is a line break and `\\t` is a tab, a wide gap used to line up text.",
    },
    {
      type: "prose",
      body: "`\\\"` and `\\'` are quotation marks that do not end the string, so any string can contain either kind of quote. Because the backslash is special, a real backslash is written as two: `\\\\`.",
    },
    {
      type: "example",
      code: `print("Name:\\tAda")
print("Line one\\nLine two")
print("She said \\"hi\\"")
print("C:\\\\Users\\\\ada")`,
    },
    {
      type: "heading",
      text: "Joining, repeating, and measuring",
    },
    {
      type: "prose",
      body: "The `+` operator joins two strings end to end, which is called concatenation. It adds no space of its own, so put one inside the quotes when you need it. The `*` operator repeats a string a given number of times, so `\"-\" * 10` gives ten hyphens.",
    },
    {
      type: "prose",
      body: "`+` only joins a string to another string. `\"Age: \" + 36` stops with `TypeError: can only concatenate str (not \"int\") to str`, the error you met in the Reading Error Messages lesson. Convert the number first with `str()`, as in `\"Age: \" + str(36)`.",
    },
    {
      type: "prose",
      body: "The built-in function `len()` gives the length of a string: the number of characters it contains. Spaces and punctuation count as characters too, so `len(\"Ada Lovelace\")` is `12`.",
    },
    {
      type: "example",
      code: `first = "Ada"
last = "Lovelace"
full_name = first + " " + last
print(full_name)
print("=" * 12)
print("Age: " + str(36))
print(len(full_name))`,
    },
    {
      type: "exercise",
      id: "strings-basics-1",
      prompt:
        "The variable title holds \"Menu\". Replace the empty string so that line holds 8 equals signs, built with the * operator. The output should be exactly three lines: ======== then Menu then ========",
      starterCode: `title = "Menu"
line = ""  # build 8 equals signs here with *
print(line)
print(title)
print(line)
`,
      check: { type: "stdout-exact", expected: "========\nMenu\n========" },
      solution: `title = "Menu"
line = "=" * 8
print(line)
print(title)
print(line)
`,
      hint: "Multiplying a string by a number repeats it: \"=\" * 8.",
    },
    {
      type: "heading",
      text: "Indexing: one character at a time",
    },
    {
      type: "prose",
      body: "Each character in a string has a position number called an index. Counting starts at 0, not 1, so the first character is at index 0 and the second at index 1. You read a character by writing its index in square brackets after the string or variable: `word[0]`. In a word of 6 characters, the last one is at index 5.",
    },
    {
      type: "prose",
      body: "Python can also count from the end with negative indexes. `word[-1]` is the last character, `word[-2]` is the one before it, and so on. Asking for an index that does not exist, such as `word[10]` on a six-letter word, stops with `IndexError: string index out of range`.",
    },
    {
      type: "example",
      code: `word = "Python"
print(word[0])
print(word[1])
print(word[5])
print(word[-1])
print(word[-2])`,
    },
    {
      type: "heading",
      text: "Slicing: pieces of a string",
    },
    {
      type: "prose",
      body: "A slice takes a piece of a string. Write two indexes separated by a colon: `word[start:stop]`. The slice begins at `start` and ends just before `stop`, so `word[0:3]` gives the characters at indexes 0, 1, and 2. The number of characters in a slice is `stop` minus `start`.",
    },
    {
      type: "prose",
      body: "Either index can be left out. Without a start, the slice begins at the first character, and without a stop, it runs to the end. Negative indexes work in slices too, so `word[-3:]` gives the last three characters. A slice that reaches past the end gives a shorter piece instead of an error.",
    },
    {
      type: "example",
      code: `word = "Python"
print(word[0:2])
print(word[2:6])
print(word[:3])
print(word[3:])
print(word[-3:])`,
    },
    {
      type: "exercise",
      id: "strings-basics-2",
      prompt:
        "The variable phone holds \"555-867-5309\". Using slices, print its first three characters on one line and its last four characters on the next. The output should be exactly: 555 and then 5309",
      starterCode: `phone = "555-867-5309"
# print the first three characters, then the last four
`,
      check: { type: "stdout-exact", expected: "555\n5309" },
      solution: `phone = "555-867-5309"
print(phone[:3])
print(phone[-4:])
`,
      hint: "phone[:3] gives the first three characters. A negative start index counts from the end of the string.",
    },
    {
      type: "heading",
      text: "Strings cannot be changed",
    },
    {
      type: "prose",
      body: "Once a string is created, its characters cannot be changed. This property is called immutability, and we say strings are immutable. Trying to replace one character with `word[0] = \"b\"` stops with `TypeError: 'str' object does not support item assignment`.",
    },
    {
      type: "example",
      code: `animal = "cat"
animal[0] = "b"`,
      showsError: true,
    },
    {
      type: "prose",
      body: "To get a different string, build a new one from pieces of the old one and assign it to the variable. The variable then holds the new string, and the old one is simply no longer used.",
    },
    {
      type: "example",
      code: `animal = "cat"
animal = "b" + animal[1:]
print(animal)`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Being off by one is the most common slicing mistake. Because the stop index is not included, `word[0:3]` gives three characters, not four. When a slice comes out one character short or long, check the stop index first.",
    },
    {
      type: "prose",
      body: "Mixing up quotes is the second. A string that starts with a single quote ends at the next single quote, so `'It's raining'` ends after `It` and causes a `SyntaxError`. Use double quotes around text that contains an apostrophe, or escape the apostrophe as `\\'`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Strings use single, double, or triple quotes, and a backslash starts an escape sequence such as `\\n`. `+` joins strings, `*` repeats them, and `len()` counts their characters. Indexes start at 0, negative indexes count from the end, and a slice `[start:stop]` takes a piece that ends just before `stop`. Strings are immutable, so changing one means building a new string.",
    },
    {
      type: "exercise",
      id: "strings-basics-3",
      prompt:
        "The variable date holds \"2026-10-02\", written as year-month-day. Use slices and + to print it in day/month/year order. The output should be exactly: 02/10/2026",
      starterCode: `date = "2026-10-02"
# print the date as day/month/year
`,
      check: { type: "stdout-exact", expected: "02/10/2026" },
      solution: `date = "2026-10-02"
print(date[8:] + "/" + date[5:7] + "/" + date[:4])
`,
      hint: "The year is at indexes 0 to 3, the month at 5 and 6, and the day at 8 and 9. A slice ends just before its second index, so the month is date[5:7].",
    },
  ],
};

export default {
  slug: "string-methods",
  title: "String Methods",
  unit: "Numbers & Text",
  blocks: [
    {
      type: "prose",
      body: "Text that comes from people is rarely tidy. Names arrive in the wrong case, answers have stray spaces, and you often need to know whether one piece of text contains another. Strings come with built-in tools for all of these jobs, and this lesson covers the ones you will use most.",
    },
    {
      type: "heading",
      text: "What a method is",
    },
    {
      type: "prose",
      body: "A method is a function that belongs to a value. You call it by writing the value, a dot, the method's name, and parentheses: `name.upper()`. The dot connects the method to the string it works on, so that string does not go between the parentheses.",
    },
    {
      type: "prose",
      body: "Strings are immutable, so a string method never changes the original string. Instead it returns a new string, which means it hands the new string back as the result of the call. To keep that result, print it or store it in a variable, often the same one: `name = name.upper()`.",
    },
    {
      type: "heading",
      text: "Changing case",
    },
    {
      type: "prose",
      body: "`upper()` returns a copy in capital letters and `lower()` returns a copy in small letters. `title()` capitalizes the first letter of every word and makes the other letters small. These are useful for tidying names and for making text consistent before you work with it.",
    },
    {
      type: "example",
      code: `name = "ada LOVELACE"
print(name.upper())
print(name.lower())
print(name.title())
print(name)`,
    },
    {
      type: "prose",
      body: "The last line shows that `name` itself did not change. Each method made a new string, printed it, and left the original alone.",
    },
    {
      type: "heading",
      text: "Removing spaces",
    },
    {
      type: "prose",
      body: "`strip()` removes whitespace from both ends of a string. Whitespace means characters you cannot see, such as spaces, tabs, and line breaks. Whitespace in the middle of the string is kept.",
    },
    {
      type: "prose",
      body: "You can call a method on the result of another method, which is called chaining. `answer.strip().upper()` strips the spaces first, then makes the stripped copy uppercase. Python works through a chain from left to right.",
    },
    {
      type: "example",
      code: `answer = "   yes please   "
print("[" + answer + "]")
print("[" + answer.strip() + "]")
print(answer.strip().upper())`,
    },
    {
      type: "exercise",
      id: "string-methods-1",
      prompt:
        "The variable s holds \"  hello world  \". Change the print() call so it prints s with the spaces at both ends removed and in capital letters, on one line. The output should be exactly: HELLO WORLD",
      starterCode: `s = "  hello world  "
print(s)  # chain strip() and upper() onto s
`,
      check: { type: "stdout-exact", expected: "HELLO WORLD" },
      solution: `s = "  hello world  "
print(s.strip().upper())
`,
      hint: "Chain the two methods with dots: s.strip().upper().",
    },
    {
      type: "heading",
      text: "Replacing, finding, and counting",
    },
    {
      type: "prose",
      body: "`replace(old, new)` returns a copy with every occurrence of `old` swapped for `new`. The two values in the parentheses are separated by a comma, just as in `print()`. Replacing text with an empty string, `\"\"`, deletes it.",
    },
    {
      type: "prose",
      body: "`find(text)` returns the index where `text` first appears, counting from 0 just as indexing does. If the text is not there, it returns `-1`. `count(text)` returns how many times `text` appears. All three methods match capital letters exactly, so `\"Hello\".find(\"h\")` is `-1`.",
    },
    {
      type: "example",
      code: `sentence = "the cat sat on the mat"
print(sentence.replace("cat", "dog"))
print(sentence.replace(" ", ""))
print(sentence.find("sat"))
print(sentence.find("dog"))
print(sentence.count("at"))`,
    },
    {
      type: "heading",
      text: "Checking text",
    },
    {
      type: "prose",
      body: "Some methods answer a yes-or-no question by returning a `bool`, either `True` or `False`. `startswith(text)` checks the beginning of a string and `endswith(text)` checks the end. Both match capital letters exactly.",
    },
    {
      type: "prose",
      body: "`isdigit()` returns `True` when every character is a digit, and `isalpha()` returns `True` when every character is a letter. Both return `False` for an empty string. `isdigit()` is useful for checking typed input before converting it with `int()`, but notice that `\"12.5\"` and `\"-5\"` both give `False`, because a decimal point and a minus sign are not digits. It is a quick check, not a guarantee.",
    },
    {
      type: "prose",
      body: "To ask whether one string appears anywhere inside another, use the `in` operator rather than a method: `\"cat\" in sentence`. It also gives `True` or `False`, and it also matches capital letters exactly.",
    },
    {
      type: "example",
      code: `filename = "report.pdf"
print(filename.endswith(".pdf"))
print(filename.startswith("Report"))
print("42".isdigit())
print("12.5".isdigit())
print("Ada".isalpha())
print("Ada Lovelace".isalpha())
print("port" in filename)`,
    },
    {
      type: "exercise",
      id: "string-methods-2",
      prompt:
        "The variable review holds \"great food, great service, slow delivery\". Print how many times \"great\" appears, then print the review with \"slow\" replaced by \"fast\". The output should be exactly two lines: 2 and then great food, great service, fast delivery",
      starterCode: `review = "great food, great service, slow delivery"
# print the count of "great", then the review with "slow" replaced by "fast"
`,
      check: {
        type: "stdout-exact",
        expected: "2\ngreat food, great service, fast delivery",
      },
      solution: `review = "great food, great service, slow delivery"
print(review.count("great"))
print(review.replace("slow", "fast"))
`,
      hint: "count() takes the text to count. replace() takes the old text, a comma, and the new text.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Calling a method and ignoring its result is the most common mistake. The line `name.upper()` on its own creates an uppercase copy and throws it away, so `name` is unchanged. Store the result with `name = name.upper()` or use the call directly inside `print()`.",
    },
    {
      type: "prose",
      body: "Forgetting the parentheses is the second. `name.upper` without `()` does not call the method, and printing it shows a description of the method instead of any text. Also remember that `find()` gives `-1` when the text is missing, and `-1` is a valid index for the last character, so a missed search can quietly point at the wrong place.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A method is a function called on a value with a dot, and string methods return new strings instead of changing the original. `upper()`, `lower()`, and `title()` change case, `strip()` trims whitespace from the ends, `replace()` swaps text, `find()` locates it, and `count()` counts it. `startswith()`, `endswith()`, `isdigit()`, `isalpha()`, and the `in` operator answer yes-or-no questions with `True` or `False`.",
    },
    {
      type: "exercise",
      id: "string-methods-3",
      prompt:
        "The variable email holds \"  Ada@Example.COM \". Clean it by removing the spaces at both ends and making it all small letters. Then print three lines: the cleaned email, whether the cleaned email ends with \".com\", and the index of the \"@\" in the cleaned email. The output should be exactly: ada@example.com, then True, then 3",
      starterCode: `email = "  Ada@Example.COM "
# clean the email, then print the three lines
`,
      check: { type: "stdout-exact", expected: "ada@example.com\nTrue\n3" },
      solution: `email = "  Ada@Example.COM "
clean = email.strip().lower()
print(clean)
print(clean.endswith(".com"))
print(clean.find("@"))
`,
      hint: "Store email.strip().lower() in a new variable first. Then call endswith() and find() on that variable, not on email.",
    },
  ],
};

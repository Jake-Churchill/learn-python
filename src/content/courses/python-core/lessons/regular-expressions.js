export default {
  slug: "regular-expressions",
  title: "Regular Expressions",
  unit: "Modules & Standard Library",
  blocks: [
    {
      type: "prose",
      body: "Some text jobs are hard with string methods alone: finding every phone number in a message, pulling the numbers out of a receipt, or reading the hours and minutes from a time. A regular expression is a short pattern that describes the text you are looking for, and the `re` module searches text for it. Patterns can look cryptic, so this lesson keeps them simple and reads each one piece by piece.",
    },
    {
      type: "heading",
      text: "Raw strings first",
    },
    {
      type: "prose",
      body: "Patterns use the backslash, `\\`, a lot. In an ordinary string, a backslash starts an escape sequence, such as `\\n` for a line break or `\\t` for a tab, so Python would change the pattern before `re` ever saw it. A raw string, written with an `r` just before the opening quote, keeps every backslash exactly as typed.",
    },
    {
      type: "example",
      code: `print("Tab:\\there")
print(r"Tab:\\there")
print(len("\\n"), len(r"\\n"))`,
    },
    {
      type: "prose",
      body: "In the ordinary string, `\\t` became a tab. In the raw string it stayed a backslash and a t, which is why `r\"\\n\"` has two characters. Write every pattern in this lesson as a raw string. Without the `r`, Python also prints a warning when a backslash comes before a character it does not recognize, such as the `d` in `\\d`.",
    },
    {
      type: "heading",
      text: "Searching with re.search",
    },
    {
      type: "prose",
      body: "`re.search(pattern, text)` looks through the text for the first place where the pattern matches. If it finds one, it returns a match object, a value describing what matched; if not, it returns `None`. The match object's `group()` method gives back the matched text.",
    },
    {
      type: "prose",
      body: "Plain letters in a pattern match themselves, so `r\"ships\"` finds the word ships. Special pieces match kinds of characters. `\\d` matches any one digit, from 0 to 9. A `+` after a piece means one or more of it, as many as possible, so `r\"\\d+\"` matches a run of digits such as `4521`.",
    },
    {
      type: "example",
      code: `import re

text = "Order 4521 ships in 3 days"
match = re.search(r"\\d+", text)
print(match.group())
print(re.search(r"ships", text).group())
print(re.search(r"refund", text))`,
    },
    {
      type: "prose",
      body: "The search stopped at the first run of digits, `4521`, so the `3` was never reached. The last line prints `None` because the text has no `refund`. Calling `group()` on `None` fails, so check the result with `if match:` whenever the pattern might not be found.",
    },
    {
      type: "exercise",
      id: "regular-expressions-1",
      prompt:
        "Use re.search() with the raw string pattern r\"\\d+\" to find the order number in message, then print the matched text. The output should be exactly: 80417",
      starterCode: `import re

message = "Your order number is 80417. Thank you!"
# search message with a raw string pattern, then print the matched text
`,
      check: { type: "stdout-exact", expected: "80417" },
      solution: `import re

message = "Your order number is 80417. Thank you!"
match = re.search(r"\\d+", message)
print(match.group())
`,
      hint: "Store re.search(r\"\\d+\", message) in a variable called match, then print match.group().",
    },
    {
      type: "heading",
      text: "More pattern pieces",
    },
    {
      type: "prose",
      body: "`\\w` matches one word character: a letter, a digit, or an underscore. `\\s` matches one whitespace character, such as a space or a tab. A dot, `.`, matches any one character except a line break.",
    },
    {
      type: "prose",
      body: "Square brackets match one character from a set you list, so `[aeiou]` matches one vowel and `[A-Z]` matches one capital letter. A number in curly braces repeats the piece before it exactly that many times, so `\\d{3}` matches exactly three digits. To match a character that has a special meaning, such as `.` or `+`, put a backslash before it: `\\.` matches a real full stop.",
    },
    {
      type: "example",
      code: `import re

message = "Call 555-0142 or 555-0199 before 5pm."
print(re.search(r"\\d{3}-\\d{4}", message).group())
print(re.search(r"[aeiou]", "rhythm and blues").group())
print(re.search(r"\\w+@\\w+\\.com", "Write to ada@example.com today").group())`,
    },
    {
      type: "prose",
      body: "Read `r\"\\d{3}-\\d{4}\"` as three digits, a hyphen, then four digits. Read `r\"\\w+@\\w+\\.com\"` as one or more word characters, an `@`, one or more word characters, a real full stop, and the letters com. Breaking a pattern into pieces like this is the way to read any regular expression.",
    },
    {
      type: "heading",
      text: "Matching at the start with re.match",
    },
    {
      type: "prose",
      body: "`re.match(pattern, text)` works like `re.search()`, but it only tries the very beginning of the text. Use it to check how a piece of text starts. Printing a match object shows its `span`, the positions where the match starts and stops, followed by the matched text.",
    },
    {
      type: "example",
      code: `import re

print(re.match(r"\\d+", "42 apples"))
print(re.match(r"\\d+", "apples: 42"))
print(re.search(r"\\d+", "apples: 42").group())`,
    },
    {
      type: "heading",
      text: "Finding every match with re.findall",
    },
    {
      type: "prose",
      body: "`re.findall(pattern, text)` returns a list of every match, as strings, from left to right. When nothing matches, it returns an empty list, so there is no `None` to check. The matches are text, so convert them with `int()` before doing arithmetic.",
    },
    {
      type: "example",
      code: `import re

receipt = "Bread 3, milk 2, eggs 12"
numbers = re.findall(r"\\d+", receipt)
print(numbers)
print(sum(int(number) for number in numbers))
print(re.findall(r"[A-Z]\\w+", "Ada met Alan and Grace in London"))`,
    },
    {
      type: "heading",
      text: "Groups",
    },
    {
      type: "prose",
      body: "Parentheses in a pattern form a group, which captures part of the match on its own. On a match object, `group(1)` is the text of the first group, `group(2)` the second, and `groups()` returns them all as a tuple. `group()` with no number is still the whole match.",
    },
    {
      type: "prose",
      body: "Groups also change what `re.findall()` returns: with several groups, the list holds one tuple per match. In the last line below, `$` has a special meaning in patterns, so `\\$` matches a real dollar sign.",
    },
    {
      type: "example",
      code: `import re

match = re.search(r"(\\d+):(\\d+)", "The train leaves at 18:05.")
print(match.group())
print(match.group(1), match.group(2))
print(match.groups())

prices = "tea $3, cake $4, soup $6"
print(re.findall(r"(\\w+) \\$(\\d+)", prices))`,
    },
    {
      type: "exercise",
      id: "regular-expressions-2",
      prompt:
        "Write a function parse_time(text) that finds the first time written as hours, a colon, and minutes, such as 18:05, and returns a tuple of the hours and minutes as ints. The hours may have one or two digits, as in 9:30 or 18:05. If the text holds no time, return None. Use a raw string for the pattern. For example, parse_time(\"Leaves at 18:05 sharp\") returns (18, 5).",
      starterCode: `import re

def parse_time(text):
    # search with a raw string pattern that has two groups
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "parse_time('Leaves at 18:05 sharp')", expected: "(18, 5)" },
          { call: "parse_time('Doors open 9:30')", expected: "(9, 30)" },
          { call: "parse_time('No time given')", expected: "None" },
        ],
      },
      solution: `import re

def parse_time(text):
    match = re.search(r"(\\d+):(\\d+)", text)
    if match:
        return int(match.group(1)), int(match.group(2))
    return None
`,
      hint: "The pattern r\"(\\d+):(\\d+)\" has one group for the hours and one for the minutes. Check if match: before converting match.group(1) and match.group(2) with int().",
    },
    {
      type: "heading",
      text: "Replacing with re.sub",
    },
    {
      type: "prose",
      body: "`re.sub(pattern, replacement, text)` returns a new string in which every match is replaced by the replacement text. It works like the string method `replace()`, except that what gets replaced is described by a pattern instead of fixed text.",
    },
    {
      type: "example",
      code: `import re

note = "Card 4111 2222 3333 4444 expires soon"
print(re.sub(r"\\d", "#", note))
print(re.sub(r"\\s+", " ", "too    many     spaces"))`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting the `r` is the most common mistake. Without it, backslashes are read as escape sequences before `re` sees the pattern, so `\"\\n\"` becomes a line break and `\"\\d\"` brings a warning. Write every pattern as a raw string, even one without a backslash, so the habit sticks.",
    },
    {
      type: "prose",
      body: "Calling `group()` straight after `re.search()` or `re.match()` fails when nothing matched, with `AttributeError: 'NoneType' object has no attribute 'group'`. And remember that `.` matches any character, so `r\"3.50\"` also matches `3x50`. Write `r\"3\\.50\"` to match a real full stop.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Write patterns as raw strings, such as `r\"\\d+\"`. `\\d`, `\\w`, `\\s`, `.`, and square brackets each match one character, `+` means one or more, and `{3}` means exactly three. `re.search()` finds the first match anywhere, `re.match()` only at the start, `re.findall()` returns every match, and `re.sub()` replaces them. Parentheses form groups, which `group(1)` and `groups()` read back.",
    },
    {
      type: "exercise",
      id: "regular-expressions-3",
      prompt:
        "Write a function hide_phone_numbers(text) that returns the text with every phone number replaced by XXX-XXXX. A phone number here is three digits, a hyphen, and four digits, as in 555-0142. Use a raw string for the pattern. For example, hide_phone_numbers(\"Call 555-0142 or 555-0199.\") returns 'Call XXX-XXXX or XXX-XXXX.'",
      starterCode: `import re

# write hide_phone_numbers(text) here
`,
      check: {
        type: "returns",
        cases: [
          { call: "hide_phone_numbers('Call 555-0142 or 555-0199.')", expected: "'Call XXX-XXXX or XXX-XXXX.'" },
          { call: "hide_phone_numbers('Room 12, extension 4521')", expected: "'Room 12, extension 4521'" },
          { call: "hide_phone_numbers('555-0100')", expected: "'XXX-XXXX'" },
        ],
      },
      solution: `import re

def hide_phone_numbers(text):
    return re.sub(r"\\d{3}-\\d{4}", "XXX-XXXX", text)
`,
      hint: "Build the pattern from pieces: \\d{3} for three digits, a hyphen, and \\d{4} for four digits, inside r\"...\". Return re.sub() with that pattern, \"XXX-XXXX\", and text.",
    },
  ],
};

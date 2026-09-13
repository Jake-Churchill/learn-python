export default {
  slug: "string-methods",
  title: "String Methods & Formatting",
  blocks: [
    {
      type: "prose",
      body: "Strings come with built-in methods for common transformations: `.upper()` converts to uppercase, `.strip()` removes leading and trailing whitespace, and `.split(\",\")` breaks a string into a list of pieces wherever the given separator appears. To check whether one string contains another, use the `in` operator rather than a method: `\"lo\" in \"hello\"`.",
    },
    {
      type: "prose",
      body: "To combine a list of strings back into one string with a separator in between, call `.join()` on the separator, not the list: `\", \".join(words)` puts `\", \"` between each item in `words`. It can feel backwards at first, but the separator string is what's doing the joining.",
    },
    {
      type: "prose",
      body: "f-strings support format specs for controlling how a value is displayed: `f\"{price:.2f}\"` rounds `price` to exactly 2 decimal places. The `:` after the variable name introduces the format spec, and `.2f` means \"fixed-point number, 2 digits after the decimal.\"",
    },
    {
      type: "example",
      code: `name = "  Ada Lovelace  "
print(name.strip().upper())
words = name.strip().split(" ")
print(", ".join(words))
price = 19.5
print(f"\${price:.2f}")`,
    },
    {
      type: "exercise",
      id: "string-methods-1",
      prompt: "s = \"  hello world  \" is given. Print it stripped of whitespace and fully uppercase, on one line.",
      starterCode: `s = "  hello world  "
`,
      check: { type: "stdout-exact", expected: "HELLO WORLD" },
    },
  ],
};

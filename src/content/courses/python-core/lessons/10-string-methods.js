export default {
  slug: "string-methods",
  title: "String Methods & Formatting",
  blocks: [
    {
      type: "prose",
      body: "Many string methods map directly: JS's `.toUpperCase()` becomes Python's `.upper()`; `.trim()` becomes `.strip()`; `.includes()` becomes the `in` operator, e.g. `\"lo\" in \"hello\"`; `.split(\",\")` is spelled and behaves the same way in both.",
    },
    {
      type: "prose",
      body: "Joining is flipped: JS does `arr.join(\", \")`; Python does `\", \".join(arr)` — the separator string calls `.join()`, not the list.",
    },
    {
      type: "prose",
      body: "f-strings support format specs too: `f\"{price:.2f}\"` rounds a float to 2 decimal places, similar to JS's `price.toFixed(2)` but written inline in the string.",
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

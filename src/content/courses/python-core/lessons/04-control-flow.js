export default {
  slug: "control-flow",
  title: "Control Flow",
  blocks: [
    {
      type: "prose",
      body: "Python groups lines of code into blocks using indentation instead of curly braces. A colon `:` marks the start of a block, and every line indented underneath it (by the same amount, usually 4 spaces) belongs to that block. Get the indentation wrong and Python raises an IndentationError — whitespace is part of the syntax here, not just style.",
    },
    {
      type: "prose",
      body: "To run code only when a condition is true, use `if`. Add `elif` (short for \"else if\") for additional conditions, and `else` for a fallback that runs when none of them matched. Python checks each condition in order and runs only the first block whose condition is true.",
    },
    {
      type: "prose",
      body: "A condition doesn't have to be an explicit comparison like `x > 5` — any value can be tested directly, because every value counts as either \"truthy\" or \"falsy\". The falsy values are `0`, `0.0`, an empty string `\"\"`, `None`, and empty collections like `[]` or `{}`; everything else is truthy — including the string \"0\", which is a non-empty string.",
    },
    {
      type: "example",
      code: `temperature = 75
if temperature > 80:
    print("hot")
elif temperature > 60:
    print("mild")
else:
    print("cold")`,
    },
    {
      type: "prose",
      body: "The `%` (modulo) operator gives you the remainder left over from division: `7 % 2` is `1`, because 7 divided by 2 leaves a remainder of 1. It's the standard way to check whether a number is even or odd — `x % 2 == 0` is true exactly when `x` is even.",
    },
    {
      type: "exercise",
      id: "control-flow-1",
      prompt: "x = 7 is given. Print \"even\" if x is even, otherwise print \"odd\". (Hint: use x % 2 == 0 to check whether x is evenly divisible by 2.)",
      starterCode: `x = 7
`,
      check: { type: "stdout-exact", expected: "odd" },
    },
  ],
};

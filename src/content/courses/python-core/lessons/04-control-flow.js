export default {
  slug: "control-flow",
  title: "Control Flow",
  blocks: [
    {
      type: "prose",
      body: "JS wraps blocks in `{}`; Python uses indentation instead. A colon `:` starts a block, and every line indented under it belongs to that block — get the indentation wrong and you get an IndentationError.",
    },
    {
      type: "prose",
      body: "JS's if / else if / else becomes Python's `if` / `elif` / `else` — note `elif`, not \"else if\".",
    },
    {
      type: "prose",
      body: "Falsy values differ slightly from JS: `0`, `0.0`, an empty string, `None`, and empty lists/dicts are all falsy; everything else — including the string \"0\" — is truthy.",
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
      type: "exercise",
      id: "control-flow-1",
      prompt: "x = 7 is given. Print \"even\" if x is even, otherwise print \"odd\". (Hint: x % 2 == 0 checks evenness, same as JS.)",
      starterCode: `x = 7
`,
      check: { type: "stdout-exact", expected: "odd" },
    },
  ],
};

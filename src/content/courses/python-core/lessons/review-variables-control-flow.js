export default {
  slug: "review-variables-control-flow",
  title: "Review: Variables & Control Flow",
  blocks: [
    {
      type: "prose",
      body: "Before moving on to loops, let's combine what you've learned so far: variables, f-strings, and `if`/`elif`/`else` — all in one program.",
    },
    {
      type: "example",
      code: `score = 82
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
print(f"Score {score}: grade {grade}")`,
    },
    {
      type: "exercise",
      id: "review-variables-control-flow-1",
      prompt:
        "age = 20 is given. Using if/elif/else, set a variable status to \"Minor\" if age < 18, \"Adult\" if age < 65, else \"Senior\". Then print it with an f-string as: Status: <status>",
      starterCode: `age = 20
`,
      check: { type: "stdout-exact", expected: "Status: Adult" },
    },
  ],
};

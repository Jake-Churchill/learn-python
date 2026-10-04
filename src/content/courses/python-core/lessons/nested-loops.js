export default {
  slug: "nested-loops",
  title: "Nested Loops & Patterns",
  unit: "Loops",
  blocks: [
    {
      type: "prose",
      body: "The body of a loop can hold any code, including another loop. A loop inside another loop's body is called a nested loop. Nested loops are the natural tool for anything laid out in rows and columns, such as a seating chart, a calendar, or a multiplication table.",
    },
    {
      type: "heading",
      text: "A loop inside a loop",
    },
    {
      type: "prose",
      body: "The first loop is called the outer loop, and the loop in its body is called the inner loop. Each time the outer loop runs once, the inner loop runs all the way through. If the outer loop runs 2 times and the inner loop runs 3 times, the body of the inner loop runs 2 × 3 = 6 times.",
    },
    {
      type: "example",
      code: `for row in range(1, 3):
    for seat in "ABC":
        print(f"Row {row}, seat {seat}")`,
    },
    {
      type: "prose",
      body: "Read the output from top to bottom. While `row` is 1, `seat` takes the values A, B, and C. Only after the inner loop finishes does the outer loop move on, and `row` becomes 2 for the next three lines.",
    },
    {
      type: "prose",
      body: "Indentation shows which loop a line belongs to. The `print()` above is indented under both loops, so it runs once for every seat in every row. A line indented under only the outer loop runs once per row, and a line with no indentation runs once, after both loops finish.",
    },
    {
      type: "heading",
      text: "Printing a grid",
    },
    {
      type: "prose",
      body: "A grid needs several values on each line. In Unit 1 you saw that `end=` replaces the line break `print()` adds, so `end=\"\"` keeps the next output on the same line. In a grid, the inner loop prints the cells of one row with `end=\"\"`, and a plain `print()` after the inner loop ends that row.",
    },
    {
      type: "example",
      code: `for row in range(3):
    for column in range(5):
        print("#", end="")
    print()`,
    },
    {
      type: "prose",
      body: "The `print()` with nothing in its parentheses is indented under the outer loop only. It runs three times, once after each row is complete. You could print one row of the same character with `\"#\" * 5`, but the loop version lets every cell be different, which the next sections rely on.",
    },
    {
      type: "exercise",
      id: "nested-loops-1",
      prompt:
        "The outer loop runs once per row and ends each row with print(). Add an inner loop that prints * five times on the same line, so the output is exactly three lines, each one *****",
      starterCode: `for row in range(3):
    # add an inner loop here that prints * five times with end=""
    print()
`,
      check: { type: "stdout-exact", expected: "*****\n*****\n*****" },
      solution: `for row in range(3):
    for star in range(5):
        print("*", end="")
    print()
`,
      hint: "Write a for loop over range(5) above the print() line, with the same indentation. In its body, call print(\"*\", end=\"\").",
    },
    {
      type: "heading",
      text: "Multiplication tables",
    },
    {
      type: "prose",
      body: "The body of the inner loop can use both loop variables. In a multiplication table, the outer variable picks the row, the inner variable picks the column, and each cell holds their product. A width in the f-string, such as `{row * column:4}`, gives every number the same amount of space, so the columns line up.",
    },
    {
      type: "example",
      code: `for row in range(1, 6):
    for column in range(1, 6):
        print(f"{row * column:4}", end="")
    print()`,
    },
    {
      type: "prose",
      body: "In the first row, `row` stays 1 while `column` runs from 1 to 5. In the second row, `row` is 2 and `column` runs from 1 to 5 again. The inner loop starts over from the beginning every time the outer loop begins a new row.",
    },
    {
      type: "exercise",
      id: "nested-loops-2",
      prompt:
        "Use nested loops to print the 2 and 3 times tables from 1 to 4, one fact per line, in the form 2 x 1 = 2 (a lowercase x with a space on each side). The output should be exactly eight lines: 2 x 1 = 2, 2 x 2 = 4, 2 x 3 = 6, 2 x 4 = 8, 3 x 1 = 3, 3 x 2 = 6, 3 x 3 = 9, 3 x 4 = 12",
      starterCode: `# print the 2 and 3 times tables, from x 1 to x 4
`,
      check: {
        type: "stdout-exact",
        expected:
          "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12",
      },
      solution: `for table in range(2, 4):
    for times in range(1, 5):
        print(f"{table} x {times} = {table * times}")
`,
      hint: "The outer loop goes over the tables, range(2, 4). The inner loop goes over range(1, 5). An f-string can hold both loop variables and their product.",
    },
    {
      type: "heading",
      text: "Text patterns",
    },
    {
      type: "prose",
      body: "The inner loop does not have to run the same number of times on every row. When its `range()` depends on the outer loop variable, each row can have a different length. That is how you print triangles and other text patterns.",
    },
    {
      type: "example",
      code: `for row in range(1, 5):
    for star in range(row):
        print("*", end="")
    print()`,
    },
    {
      type: "prose",
      body: "On row 1 the inner loop is `range(1)`, which runs once. On row 4 it is `range(4)`, which runs four times. The next example prints numbers instead of stars, so you can see the inner loop variable on every row.",
    },
    {
      type: "example",
      code: `for row in range(1, 5):
    for number in range(1, row + 1):
        print(number, end=" ")
    print()`,
    },
    {
      type: "prose",
      body: "The inner range stops at `row + 1` because the stop value is left out. Without the `+ 1`, row 1 would print nothing and row 4 would stop at 3.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Misplaced indentation is the most common problem. If the row-ending `print()` sits inside the inner loop, every cell lands on its own line. If it has no indentation at all, it runs only once, after everything, and all the cells end up on a single line.",
    },
    {
      type: "prose",
      body: "Give each loop its own variable name. If the inner loop reuses the outer loop's name, it overwrites the outer value, and any line after the inner loop sees the wrong number. Descriptive names such as `row` and `column` prevent this.",
    },
    {
      type: "prose",
      body: "A `break` inside the inner loop ends only the inner loop. The outer loop carries on with its next iteration, so a single `break` cannot stop both loops at once.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A nested loop is a loop inside another loop's body, and the inner loop runs all the way through for each iteration of the outer loop. For grids and tables, the inner loop prints one row using `end`, and a `print()` under the outer loop ends the row. When the inner `range()` depends on the outer variable, rows can change length to form patterns.",
    },
    {
      type: "exercise",
      id: "nested-loops-3",
      prompt:
        "Print this countdown triangle of five lines, with one space between the numbers on each line: 5 4 3 2 1, then 4 3 2 1, then 3 2 1, then 2 1, then 1",
      starterCode: `# print the countdown triangle
`,
      check: {
        type: "stdout-exact",
        expected: "5 4 3 2 1\n4 3 2 1\n3 2 1\n2 1\n1",
      },
      solution: `for row in range(5, 0, -1):
    for number in range(row, 0, -1):
        print(number, end=" ")
    print()
`,
      hint: "The outer loop counts down from 5 to 1 with a step of -1. The inner loop counts down from the outer variable to 1, printing each number with end=\" \". End each row with print().",
    },
  ],
};

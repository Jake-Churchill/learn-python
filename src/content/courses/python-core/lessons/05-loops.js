export default {
  slug: "loops",
  title: "for Loops & range",
  unit: "Loops",
  blocks: [
    {
      type: "prose",
      body: "Programs often need to do the same thing many times: print every letter of a name, count from 1 to 100, or add up a week of exercise. Writing one line for every repetition would be slow and easy to get wrong. A loop is code that repeats a block of instructions for you.",
    },
    {
      type: "prose",
      body: "This lesson covers the `for` loop, which repeats once for each item in a sequence. A sequence is a series of values in a fixed order, such as the characters of a string or a run of numbers.",
    },
    {
      type: "heading",
      text: "Looping over a string",
    },
    {
      type: "prose",
      body: "A `for` loop starts with a line such as `for letter in \"Ada\":`. The name after `for` is the loop variable, and you choose it. The value after `in` is what to loop over. The colon at the end starts the block that repeats, which is called the body of the loop.",
    },
    {
      type: "prose",
      body: "Python runs the body once for each character in the string. Before each pass, it stores the next character in the loop variable, so the body sees `A` the first time, `d` the second time, and `a` the third. One pass through the body is called an iteration.",
    },
    {
      type: "example",
      code: `for letter in "Ada":
    print(letter)
print("Done")`,
    },
    {
      type: "prose",
      body: "The body is every indented line under the `for` line, just like the block under an `if`. The final `print(\"Done\")` is not indented, so it is not part of the loop. It runs once, after the loop has handled every character. Spaces and punctuation are characters too, so a loop over `\"Hi there\"` runs eight times.",
    },
    {
      type: "heading",
      text: "Counting with range",
    },
    {
      type: "prose",
      body: "To repeat something a set number of times, loop over `range()`. The call `range(5)` produces the whole numbers from 0 up to, but not including, 5. That is 0, 1, 2, 3, and 4: five numbers, so the body runs five times.",
    },
    {
      type: "example",
      code: `for number in range(5):
    print(number)`,
    },
    {
      type: "prose",
      body: "Starting at 0 surprises most beginners. Python counts string positions from 0, as you saw with indexes, and `range()` follows the same habit. The number you give it is called the stop value, and the stop value itself is never produced.",
    },
    {
      type: "prose",
      body: "Give `range()` two numbers to choose where it starts: `range(start, stop)`. The call `range(3, 7)` produces 3, 4, 5, and 6. The start value is included and the stop value is not, so the loop runs `stop - start` times.",
    },
    {
      type: "example",
      code: `for floor in range(3, 7):
    print("Floor", floor)`,
    },
    {
      type: "exercise",
      id: "loops-1",
      prompt:
        "Change the two numbers in range() so the loop prints the numbers 1 through 4, each on its own line.",
      starterCode: `for number in range(0, 0):
    print(number)
`,
      check: { type: "stdout-exact", expected: "1\n2\n3\n4" },
      solution: `for number in range(1, 5):
    print(number)
`,
      hint: "The start value is included, but the stop value is not, so the stop must be one more than the last number you want.",
    },
    {
      type: "heading",
      text: "Counting in steps",
    },
    {
      type: "prose",
      body: "A third number sets the step, which is the amount added to get from one value to the next: `range(start, stop, step)`. The call `range(0, 20, 5)` produces 0, 5, 10, and 15. When you leave the step out, it is 1.",
    },
    {
      type: "prose",
      body: "A negative step counts down. The call `range(5, 0, -1)` produces 5, 4, 3, 2, and 1, and the stop value 0 is again left out. When you count down, the start must be larger than the stop.",
    },
    {
      type: "example",
      code: `for minutes in range(0, 20, 5):
    print(minutes, end=" ")
print()

for seconds in range(5, 0, -1):
    print(seconds)
print("Liftoff!")`,
    },
    {
      type: "prose",
      body: "The `print()` with nothing inside ends that line, so the countdown starts on a line of its own.",
    },
    {
      type: "heading",
      text: "Accumulating a total",
    },
    {
      type: "prose",
      body: "Loops often build up a result one piece at a time. A variable used this way is called an accumulator. You create it before the loop with a starting value, update it in the body, and use it after the loop ends.",
    },
    {
      type: "prose",
      body: "To add up numbers, start the accumulator at 0 and use `+=` in the body. Suppose you run 1 km on the first day of a week, 2 km on the second, and so on up to 7 km on the last day. The next example adds up the whole week.",
    },
    {
      type: "example",
      code: `total = 0
for km in range(1, 8):
    total += km
print("Weekly distance:", total, "km")`,
    },
    {
      type: "prose",
      body: "Trace it by hand: `total` starts at 0, then becomes 1, 3, 6, 10, 15, 21, and finally 28. The `print()` line is not indented, so it runs once after the loop and shows only the final total.",
    },
    {
      type: "prose",
      body: "The same pattern works with a string. Each character of `\"2024\"` is itself a string, so `int()` converts it to a number before it is added.",
    },
    {
      type: "example",
      code: `digits = "2024"
total = 0
for digit in digits:
    total += int(digit)
print(total)`,
    },
    {
      type: "exercise",
      id: "loops-2",
      prompt:
        "Use a for loop and range() to add up the whole numbers from 1 to 100, then print the total. The output should be exactly: 5050",
      starterCode: `total = 0
# add a loop here that adds each number from 1 to 100 to total
print(total)
`,
      check: { type: "stdout-exact", expected: "5050" },
      solution: `total = 0
for number in range(1, 101):
    total += number
print(total)
`,
      hint: "The stop value is left out, so the range must stop at 101 to include 100. Inside the loop, add the loop variable to total with +=.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "An off-by-one error is the most common loop mistake: the loop runs one time too many or one too few. Because the stop value is left out, `range(1, 10)` ends at 9. To include a number, set the stop one past it.",
    },
    {
      type: "prose",
      body: "Indentation decides what repeats. A `print()` indented under the loop runs on every iteration, so you see the total growing instead of only the final value. Creating the accumulator inside the body is another trap: `total = 0` would then reset the total on every pass.",
    },
    {
      type: "prose",
      body: "Printing a range does not list its numbers: `print(range(5))` shows `range(0, 5)`. Loop over the range to see each value. A range whose start is already past its stop, such as `range(5, 2)`, is empty, so a loop over it never runs its body and gives no error.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A `for` loop runs its body once for each item in a sequence, storing the current item in the loop variable. Looping over a string gives one character at a time. `range(stop)`, `range(start, stop)`, and `range(start, stop, step)` give numbers and always leave out the stop value. To total values, create an accumulator before the loop, add to it in the body, and use it after the loop.",
    },
    {
      type: "exercise",
      id: "loops-3",
      prompt:
        "Use a for loop with a step to add up every multiple of 5 from 5 to 50 (5, 10, 15, and so on up to 50), then print exactly: Total: 275",
      starterCode: `# add up the multiples of 5 from 5 to 50, then print the total
`,
      check: { type: "stdout-exact", expected: "Total: 275" },
      solution: `total = 0
for number in range(5, 51, 5):
    total += number
print("Total:", total)
`,
      hint: "Use range() with a start, a stop, and a step of 5. The stop must be past 50 so that 50 is included. Start an accumulator at 0 before the loop.",
    },
  ],
};

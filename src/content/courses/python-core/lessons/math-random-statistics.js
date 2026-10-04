export default {
  slug: "math-random-statistics",
  title: "math, random & statistics",
  unit: "Modules & Standard Library",
  blocks: [
    {
      type: "prose",
      body: "Three standard library modules cover most of the number work a beginner needs. `math` holds mathematical functions, `random` makes choices by chance, and `statistics` sums up a list of numbers with values such as the average. This lesson tours the most useful parts of each.",
    },
    {
      type: "heading",
      text: "More from math",
    },
    {
      type: "prose",
      body: "You already know `math.sqrt()`, `math.floor()`, `math.ceil()`, and `math.pi`. `math.factorial(n)` multiplies every whole number from 1 up to n, so `math.factorial(5)` is 5 times 4 times 3 times 2 times 1, which is 120. `math.prod()` multiplies all the numbers in a list, the way `sum()` adds them.",
    },
    {
      type: "prose",
      body: "`math.gcd(a, b)` gives the greatest common divisor of two whole numbers: the largest number that divides both with no remainder. `math.isclose(a, b)` tells you whether two floats are equal apart from the tiny errors that decimal arithmetic leaves behind. You saw that `0.1 + 0.2 == 0.3` is `False`; `math.isclose()` gives `True` for the same two values.",
    },
    {
      type: "example",
      code: `import math

print(math.factorial(5))
print(math.prod([2, 3, 4]))
print(math.gcd(12, 18))
print(0.1 + 0.2 == 0.3)
print(math.isclose(0.1 + 0.2, 0.3))

guests = 23
print("Tables of 4 needed:", math.ceil(guests / 4))`,
    },
    {
      type: "prose",
      body: "The last line shows a common use of `math.ceil()`. Twenty-three guests at tables of 4 fill five tables and leave three people over, so you need a sixth table. Rounding up gives that answer directly.",
    },
    {
      type: "exercise",
      id: "math-random-statistics-1",
      prompt:
        "Complete the function boxes_needed(items, per_box) so it returns how many boxes are needed to pack items things when each box holds per_box of them. A partly filled box still counts, so round up with math.ceil(). For example, boxes_needed(23, 4) returns 6.",
      starterCode: `import math

def boxes_needed(items, per_box):
    # divide, then round up with math.ceil()
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "boxes_needed(23, 4)", expected: "6" },
          { call: "boxes_needed(8, 4)", expected: "2" },
          { call: "boxes_needed(1, 12)", expected: "1" },
        ],
      },
      solution: `import math

def boxes_needed(items, per_box):
    return math.ceil(items / per_box)
`,
      hint: "items / per_box gives a float such as 5.75. Pass it to math.ceil() and return the result.",
    },
    {
      type: "heading",
      text: "Random choices with random",
    },
    {
      type: "prose",
      body: "The `random` module is useful for games, quizzes, and simulations. `random.randint(a, b)` gives a whole number from a to b, including both a and b. `random.choice()` picks one item from a list, and `random.random()` gives a float from 0 up to, but not including, 1.",
    },
    {
      type: "prose",
      body: "A computer does not really choose by chance. It runs a fixed calculation that produces numbers that look random, starting from a value called the seed. `random.seed(42)` sets the seed to 42, and every run that starts from the same seed gets the same numbers. Without a seed, Python picks a new starting point each run, so the results change every time.",
    },
    {
      type: "example",
      code: `import random

random.seed(42)
print(random.randint(1, 6), random.randint(1, 6), random.randint(1, 6))

random.seed(42)
print(random.randint(1, 6), random.randint(1, 6), random.randint(1, 6))
print(random.choice(["rock", "paper", "scissors"]))`,
    },
    {
      type: "prose",
      body: "Both lines print the same three rolls, because both start from seed 42. Every example and exercise in this course sets a seed first, so your output matches the output the lesson expects. Try changing the seed to see a different sequence.",
    },
    {
      type: "prose",
      body: "`random.shuffle()` mixes up a list in place: it changes the list itself, as `sort()` does, and returns `None`. `random.sample(items, k)` gives back a new list of k different items picked at random and leaves the original alone. It accepts a range as well as a list, which makes it handy for lottery numbers.",
    },
    {
      type: "example",
      code: `import random

random.seed(3)
cards = ["A", "K", "Q", "J", "10"]
random.shuffle(cards)
print(cards)
print(random.sample(range(1, 50), 6))`,
    },
    {
      type: "exercise",
      id: "math-random-statistics-2",
      prompt:
        "Simulate five rolls of a die. Call random.seed(7) first, then make five rolls with random.randint(1, 6) and append each one to the list rolls. The two print() lines at the bottom are written for you, so the output should be exactly two lines: [3, 2, 4, 6, 1] and then Total: 16",
      starterCode: `import random

# set the seed to 7 here

rolls = []
# make five rolls and append each one to rolls

print(rolls)
print("Total:", sum(rolls))
`,
      check: { type: "stdout-exact", expected: "[3, 2, 4, 6, 1]\nTotal: 16" },
      solution: `import random

random.seed(7)

rolls = []
for turn in range(5):
    rolls.append(random.randint(1, 6))

print(rolls)
print("Total:", sum(rolls))
`,
      hint: "Write random.seed(7) before the list is created. Then loop with for turn in range(5): and append random.randint(1, 6) to rolls inside the loop.",
    },
    {
      type: "heading",
      text: "Summaries with statistics",
    },
    {
      type: "prose",
      body: "The `statistics` module describes a group of numbers with a single value. `statistics.mean()` gives the mean, which is the average: the total divided by how many values there are. `statistics.median()` sorts the values and gives the middle one; with an even count, it gives the average of the two middle values. `statistics.mode()` gives the value that appears most often.",
    },
    {
      type: "example",
      code: `import statistics

scores = [72, 85, 90, 85, 68, 95, 85]
print(statistics.mean(scores))
print(statistics.median(scores))
print(statistics.mode(scores))

waits = [4, 5, 5, 6, 40]
print(statistics.mean(waits), statistics.median(waits))`,
    },
    {
      type: "prose",
      body: "The waiting times show why the median matters. One long wait of 40 minutes pulls the mean up to 12, while the median stays at 5, much closer to a typical wait. When a few values are far from the rest, the median usually describes the group better.",
    },
    {
      type: "prose",
      body: "`mode()` works on text too, so `statistics.mode([\"red\", \"blue\", \"red\"])` gives `'red'`. When two values tie for most common, it gives the one that appears first in the list.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting the seed is the most common mistake when output must be repeatable, as it must be in the exercises here. Call `random.seed()` once, before the first random call. Calling it again later restarts the sequence from the beginning, as the first random example showed.",
    },
    {
      type: "prose",
      body: "`random.randint(1, 6)` includes 6, but `range(1, 6)` stops before 6, so do not mix up their end points. `random.shuffle()` returns `None`, so `cards = random.shuffle(cards)` replaces your list with `None`; call it on its own line. And `statistics.mean([])` stops with `statistics.StatisticsError: mean requires at least one data point`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`math` adds functions such as `factorial()`, `prod()`, `gcd()`, and `isclose()` to the ones you knew. `random` gives `randint()`, `choice()`, `random()`, `shuffle()`, and `sample()`, and `random.seed()` makes their results repeatable. `statistics` sums up a list with `mean()`, `median()`, and `mode()`, and the median is less affected by values far from the rest.",
    },
    {
      type: "exercise",
      id: "math-random-statistics-3",
      prompt:
        "Write a function summarize(scores) that returns a tuple of three values, in this order: the mean of scores rounded to 1 decimal place, the median, and the mode. For example, summarize([72, 85, 90, 85, 68, 95, 85]) returns (82.9, 85, 85).",
      starterCode: `import statistics

# write summarize(scores) here
`,
      check: {
        type: "returns",
        cases: [
          { call: "summarize([72, 85, 90, 85, 68, 95, 85])", expected: "(82.9, 85, 85)" },
          { call: "summarize([3, 1, 4, 1, 5, 9])", expected: "(3.8, 3.5, 1)" },
          { call: "summarize([20.5, 22.0, 22.0, 19.5])", expected: "(21.0, 21.25, 22.0)" },
        ],
      },
      solution: `import statistics

def summarize(scores):
    average = round(statistics.mean(scores), 1)
    return average, statistics.median(scores), statistics.mode(scores)
`,
      hint: "Use round(statistics.mean(scores), 1) for the first value. Return the three values separated by commas, which makes a tuple.",
    },
  ],
};

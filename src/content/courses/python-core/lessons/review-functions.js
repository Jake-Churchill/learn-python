export default {
  slug: "review-functions",
  title: "Review: Functions & Collections",
  unit: "Functions",
  blocks: [
    {
      type: "prose",
      body: "This review brings the Functions unit together with everything before it: strings, decisions, loops, and collections. Every exercise asks for a function that returns a value, and the Check button calls it with several different arguments, so think about every kind of input, including empty lists.",
    },
    {
      type: "heading",
      text: "Building a program from small functions",
    },
    {
      type: "prose",
      body: "Real programs are made of many small functions, each doing one job and returning its result. A function that does one job is easy to name, easy to try out with a quick call, and easy to reuse. The main part of the program then reads like a list of steps: call one function, pass its result to the next, and print at the end.",
    },
    {
      type: "prose",
      body: "The example below turns a line of scores into a report. `parse_scores()` converts the text to numbers, `average()` works out the average, and `letter_grade()` picks a grade. None of them prints; the last few lines do all the printing.",
    },
    {
      type: "example",
      code: `def parse_scores(line):
    scores = []
    for piece in line.split(","):
        scores.append(int(piece))
    return scores

def average(numbers):
    return sum(numbers) / len(numbers)

def letter_grade(score):
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    return "F"

scores = parse_scores("88,92,79,95")
mean = average(scores)
print(f"Scores: {scores}")
print(f"Average: {mean:.1f}")
print(f"Grade: {letter_grade(mean)}")`,
    },
    {
      type: "exercise",
      id: "review-functions-1",
      prompt:
        "Write the body of summarize(items) so it returns a tuple of two values: a dictionary counting how many times each value appears in items, with keys in the order the values first appear, and the number of different values. For example, summarize([1, 2, 2, 3, 3, 3]) returns ({1: 1, 2: 2, 3: 3}, 3).",
      starterCode: `def summarize(items):
    counts = {}
    # count each item, then return the dictionary and the number of different values
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "summarize([1, 2, 2, 3, 3, 3])", expected: "({1: 1, 2: 2, 3: 3}, 3)" },
          { call: 'summarize(["tea", "cake", "tea"])', expected: "({'tea': 2, 'cake': 1}, 2)" },
          { call: "summarize([])", expected: "({}, 0)" },
        ],
      },
      solution: `def summarize(items):
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts, len(counts)
`,
      hint: "Use the counting pattern counts[item] = counts.get(item, 0) + 1 inside a loop. Each different value is one key, so len(counts) is the number of different values.",
    },
    {
      type: "heading",
      text: "Functions with options",
    },
    {
      type: "prose",
      body: "Defaults and keyword arguments let one function serve several needs, and returning a tuple hands back more than one answer. The function below returns the lowest and highest prices, shown with a dollar sign unless the caller names another currency.",
    },
    {
      type: "example",
      code: `def price_range(prices, currency="$"):
    low = f"{currency}{min(prices):.2f}"
    high = f"{currency}{max(prices):.2f}"
    return low, high

low, high = price_range([4.5, 12, 7.25])
print(low, "to", high)
low, high = price_range([3, 9.5], currency="£")
print(low, "to", high)`,
    },
    {
      type: "exercise",
      id: "review-functions-2",
      prompt:
        "Write the body of clean_names(text, sep=\",\") so it splits text on sep, removes the spaces around each name, gives each name a capital first letter and lowercase for the rest with title(), drops repeated names, and returns the names as a sorted list. For example, clean_names(\" ada,GRACE , alan,Ada\") returns ['Ada', 'Alan', 'Grace'], and clean_names(\"linus;guido\", sep=\";\") returns ['Guido', 'Linus'].",
      starterCode: `def clean_names(text, sep=","):
    # split, tidy each name, drop repeats, and return a sorted list
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: 'clean_names(" ada,GRACE , alan,Ada")', expected: "['Ada', 'Alan', 'Grace']" },
          { call: 'clean_names("linus;guido", sep=";")', expected: "['Guido', 'Linus']" },
          { call: 'clean_names("Zoe")', expected: "['Zoe']" },
        ],
      },
      solution: `def clean_names(text, sep=","):
    names = set()
    for piece in text.split(sep):
        names.add(piece.strip().title())
    return sorted(names)
`,
      hint: "Loop over text.split(sep) and add piece.strip().title() to a set, which drops repeats. sorted() of a set gives a sorted list.",
    },
    {
      type: "heading",
      text: "Functions that work together",
    },
    {
      type: "prose",
      body: "A hard task gets easier when each step becomes a helper function: a small function that another function calls to do part of its job. The last exercise works with a list of dictionaries, the nested data from the Collections unit. A helper that works out one student's average keeps the main function short, and a lambda key does the sorting.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Printing inside a function that should return is the mistake the Check button catches most often: the call returns `None`. Changing a list or dictionary that was passed in, when the task asks for a new one, is the next most common, because the caller's data changes too. Build the new list or dictionary inside the function and return it.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Good programs are built from small functions that take arguments, return results, and leave the printing to the main program. Defaults and keyword arguments make functions flexible, a tuple returns several values, and key functions and lambdas control sorting. A hard task becomes easier when each step is its own helper function, and one function can call another.",
    },
    {
      type: "exercise",
      id: "review-functions-3",
      prompt:
        "students is a list of dictionaries, each with a name and a list of scores. Write a function report(students) that returns a list of (name, average) tuples, with each average rounded to 1 decimal place, ordered from highest average to lowest. For example, report([{\"name\": \"Alan\", \"scores\": [70, 80]}, {\"name\": \"Ada\", \"scores\": [90, 95]}]) returns [('Ada', 92.5), ('Alan', 75.0)].",
      starterCode: `# write report(students) below; a helper function for the average may help
`,
      check: {
        type: "returns",
        cases: [
          {
            call: 'report([{"name": "Alan", "scores": [70, 80]}, {"name": "Ada", "scores": [90, 95]}])',
            expected: "[('Ada', 92.5), ('Alan', 75.0)]",
          },
          {
            call: 'report([{"name": "Grace", "scores": [88, 92, 90]}, {"name": "Linus", "scores": [100, 61]}, {"name": "Guido", "scores": [79]}])',
            expected: "[('Grace', 90.0), ('Linus', 80.5), ('Guido', 79.0)]",
          },
          { call: "report([])", expected: "[]" },
        ],
      },
      solution: `def average(numbers):
    return sum(numbers) / len(numbers)

def report(students):
    rows = []
    for student in students:
        rows.append((student["name"], round(average(student["scores"]), 1)))
    return sorted(rows, key=lambda row: row[1], reverse=True)
`,
      hint: "Write a helper average(numbers). In report(), loop over students and append a (name, rounded average) tuple to a list. Return that list sorted by a lambda that picks row[1], with reverse=True.",
    },
  ],
};

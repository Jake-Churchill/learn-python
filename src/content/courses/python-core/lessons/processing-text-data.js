export default {
  slug: "processing-text-data",
  title: "Processing Text Data",
  unit: "Errors & Files",
  blocks: [
    {
      type: "prose",
      body: "A great deal of data is stored as plain text: lists of readings, logs, and tables exported from spreadsheets. This lesson combines files, strings, and dictionaries to read such data one line at a time, pull the values out of each line, count things, and write the results up as a report.",
    },
    {
      type: "heading",
      text: "Looping over the lines of a file",
    },
    {
      type: "prose",
      body: "A file object is an iterator, the kind of value you met in Iterators & Generators, and each value it hands out is one line. So a `for` loop over an open file runs once per line. The loop reads the file as it goes instead of loading it all at once, which is the usual way to process a file line by line.",
    },
    {
      type: "prose",
      body: "Each line still ends with `\\n`, so call `strip()` on it first. A line that is empty after stripping was a blank line, and `if not line:` with `continue` skips it, because an empty string counts as false.",
    },
    {
      type: "example",
      code: `with open("temps.txt", "w") as file:
    file.write("21.5\\n19.0\\n\\n24.5\\n")

readings = []
with open("temps.txt") as file:
    for line in file:
        line = line.strip()
        if not line:
            continue
        readings.append(float(line))

print(readings)
print(f"Average: {sum(readings) / len(readings):.1f}")`,
    },
    {
      type: "exercise",
      id: "processing-text-data-1",
      prompt:
        "The program writes four daily step counts to steps.txt, one per line, and loops over the file. Replace pass with a line that converts the current line to a whole number and adds it to total. The output should be exactly: Total steps: 19400",
      starterCode: `with open("steps.txt", "w") as file:
    file.write("4200\\n6100\\n3800\\n5300\\n")

total = 0
with open("steps.txt") as file:
    for line in file:
        pass  # add this line's steps to total

print("Total steps:", total)
`,
      check: { type: "stdout-exact", expected: "Total steps: 19400" },
      solution: `with open("steps.txt", "w") as file:
    file.write("4200\\n6100\\n3800\\n5300\\n")

total = 0
with open("steps.txt") as file:
    for line in file:
        total += int(line.strip())

print("Total steps:", total)
`,
      hint: "Strip the line, convert it with int(), and add the result to total with +=.",
    },
    {
      type: "heading",
      text: "Parsing delimited lines",
    },
    {
      type: "prose",
      body: "Text data often packs several values into each line, separated by a fixed character called a delimiter, as in `Ada,92`. A file of comma-separated values is called a CSV file, and its first line is often a header that names the columns. Parsing a line means taking it apart into values your program can use.",
    },
    {
      type: "prose",
      body: "For each line, `split(\",\")` gives the fields as strings, and unpacking stores them in named variables. Convert the number fields with `int()` or `float()`. To skip the header, call `next()` on the file once before the loop, which reads one line and discards it.",
    },
    {
      type: "prose",
      body: "Real data has bad lines. Unpacking raises a `ValueError` when a line has the wrong number of fields, and so does `int()` on text that is not a number. One `try` block can catch both, so a single bad line is reported and skipped instead of stopping the program.",
    },
    {
      type: "example",
      code: `with open("scores.csv", "w") as file:
    file.write("name,score\\nAda,92\\nGrace,88\\nAlan\\nLinus,seventy\\nGuido,75\\n")

scores = {}
with open("scores.csv") as file:
    next(file)
    for line in file:
        try:
            name, score = line.strip().split(",")
            scores[name] = int(score)
        except ValueError:
            print("Skipping bad line:", line.strip())

print(scores)`,
    },
    {
      type: "exercise",
      id: "processing-text-data-2",
      prompt:
        "The program writes sales.csv: a header line, then one line per item with the item, the quantity sold, and the price of one. Skip the header, then for each line print the item, a colon, a space, and the quantity times the price with 2 decimal places. Finally print Total: and the sum of all those amounts with 2 decimal places. The output should be exactly four lines: coffee: 7.00 then bagel: 6.75 then juice: 4.00 then Total: 17.75",
      starterCode: `with open("sales.csv", "w") as file:
    file.write("item,quantity,price\\ncoffee,2,3.50\\nbagel,3,2.25\\njuice,1,4.00\\n")

# read sales.csv, print each item's amount, then the total
`,
      check: {
        type: "stdout-exact",
        expected: "coffee: 7.00\nbagel: 6.75\njuice: 4.00\nTotal: 17.75",
      },
      solution: `with open("sales.csv", "w") as file:
    file.write("item,quantity,price\\ncoffee,2,3.50\\nbagel,3,2.25\\njuice,1,4.00\\n")

total = 0
with open("sales.csv") as file:
    next(file)
    for line in file:
        item, quantity, price = line.strip().split(",")
        amount = int(quantity) * float(price)
        total += amount
        print(f"{item}: {amount:.2f}")

print(f"Total: {total:.2f}")
`,
      hint: "Open the file with with, call next(file) once, then loop over the file. Unpack line.strip().split(\",\") into three names, convert quantity with int() and price with float(), and use :.2f in an f-string.",
    },
    {
      type: "heading",
      text: "Counting words",
    },
    {
      type: "prose",
      body: "Word counting combines steps you already know: read the text, split it into words, and count each word with a dictionary. Two clean-ups make the count honest. `lower()` makes `The` and `the` the same word. `strip()` with characters in its parentheses removes those characters from both ends, so `word.strip(\".,!?\")` turns `cat.` into `cat`.",
    },
    {
      type: "prose",
      body: "To list the most common words, sort the dictionary's items by their counts with `sorted()` and a `key`, as in Lambda & Higher-Order Functions, and slice off the first few.",
    },
    {
      type: "example",
      code: `with open("story.txt", "w") as file:
    file.write("The cat sat. The cat slept!\\nThe dog sat, and the cat ran.\\n")

counts = {}
with open("story.txt") as file:
    for line in file:
        for word in line.lower().split():
            word = word.strip(".,!?")
            counts[word] = counts.get(word, 0) + 1

top = sorted(counts.items(), key=lambda pair: pair[1], reverse=True)
for word, count in top[:3]:
    print(word, count)`,
    },
    {
      type: "heading",
      text: "Building a report",
    },
    {
      type: "prose",
      body: "A report turns computed results into neat, readable text. The format specs from f-strings & Formatting line up columns: `{category:<8}` left-aligns text in a space 8 characters wide, and `{total:>8.2f}` right-aligns a number with two decimal places. Writing the report to a file saves it, and reading it back shows exactly what was saved.",
    },
    {
      type: "example",
      code: `with open("expenses.txt", "w") as file:
    file.write("food,12.50\\ntravel,30.00\\nfood,8.25\\nbooks,15.99\\ntravel,4.50\\n")

totals = {}
with open("expenses.txt") as file:
    for line in file:
        category, amount = line.strip().split(",")
        totals[category] = totals.get(category, 0) + float(amount)

with open("report.txt", "w") as report:
    report.write("Expense report\\n")
    for category, total in totals.items():
        report.write(f"{category:<8}{total:>8.2f}\\n")
    report.write(f"{'Total':<8}{sum(totals.values()):>8.2f}\\n")

with open("report.txt") as report:
    print(report.read())`,
    },
    {
      type: "prose",
      body: "The totals are built in one pass over the data file, using the counting pattern with amounts instead of 1. The report is written in a second step, so the calculation and the formatting stay separate and each is easy to change.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting `strip()` is the most common mistake. The last field of every line keeps its `\\n`, so a field read as `\"75\\n\"` does not equal `\"75\"` and makes a different dictionary key. `int()` happens to accept the line break, which hides the problem until you compare or store the text.",
    },
    {
      type: "prose",
      body: "Forgetting the header is another. Without `next(file)`, the first pass tries to convert the word `score` to a number and raises a `ValueError`. And a blank line splits into a single empty field, so skip blank lines before unpacking.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A `for` loop over a file reads it one line at a time; strip each line and skip blank ones. `split()` with a delimiter breaks a line into fields, unpacking names them, and `next(file)` skips a header. Word counting lowers and strips each word before counting it in a dictionary, and f-string format specs turn results into an aligned report.",
    },
    {
      type: "exercise",
      id: "processing-text-data-3",
      prompt:
        "The program writes a short customer review to review.txt. Count how often each word appears, ignoring capital letters and removing the punctuation characters \".\", \",\", and \"!\" from the ends of each word. Then print the three most common words, most common first, each as the word, a colon, a space, and its count. The output should be exactly three lines: good: 4 then coffee: 3 then cake: 2",
      starterCode: `with open("review.txt", "w") as file:
    file.write("Good coffee and good cake.\\nHot coffee, good cake, fresh bread.\\nGood coffee!\\n")

# count the words, then print the three most common
`,
      check: { type: "stdout-exact", expected: "good: 4\ncoffee: 3\ncake: 2" },
      solution: `with open("review.txt", "w") as file:
    file.write("Good coffee and good cake.\\nHot coffee, good cake, fresh bread.\\nGood coffee!\\n")

counts = {}
with open("review.txt") as file:
    for line in file:
        for word in line.lower().split():
            word = word.strip(".,!")
            counts[word] = counts.get(word, 0) + 1

top = sorted(counts.items(), key=lambda pair: pair[1], reverse=True)
for word, count in top[:3]:
    print(f"{word}: {count}")
`,
      hint: "Loop over the file, then over line.lower().split(). Clean each word with strip(\".,!\") and count it with counts.get(word, 0) + 1. Sort counts.items() by the count with key=lambda pair: pair[1] and reverse=True, then print the first three.",
    },
  ],
};

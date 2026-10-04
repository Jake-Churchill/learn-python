export default {
  slug: "project-word-counter",
  title: "Word Frequency Counter",
  unit: "Projects",
  blocks: [
    {
      type: "prose",
      body: "This project builds a word frequency counter: a program that reads a text file, counts how often each word appears, and writes a short report. The report gives the total number of words, the number of different words, and the most common words with their counts. Writers use counts like these to spot words they repeat too often.",
    },
    {
      type: "prose",
      body: "The program is made of four small functions, each doing one job, and each of the four stages adds one of them. The starter code for each stage is the solution to the stage before, so work through them in order. The first three stages check what your function returns, and the last checks the report the finished program prints.",
    },
    {
      type: "heading",
      text: "How the pieces fit",
    },
    {
      type: "prose",
      body: "Small functions are easier to get right than one long program, because you can test each one on its own. You can check that `clean_words()` handles a single sentence before any file exists. The last function then only connects the others: `count_words(clean_words(text))` passes the result of one function straight into the next.",
    },
    {
      type: "heading",
      text: "Stage 1: Clean the words",
    },
    {
      type: "prose",
      body: "Counting the raw results of `split()` gives wrong answers. `The` and `the` would count as different words, and `rain,` with its comma would not match `rain`. Cleaning fixes both: lower the whole text first, then remove punctuation from both ends of each word with `strip()`.",
    },
    {
      type: "prose",
      body: "`strip()` only touches the ends of a string, so the hyphen inside `well-known` stays. A dash standing alone between spaces, though, strips down to an empty string. An empty string is not a word, so leave it out of the list.",
    },
    {
      type: "exercise",
      id: "project-word-counter-1",
      prompt:
        "Finish clean_words(text) so that it returns a list of the words in text, in order, each in lowercase and with the characters . , ; : ! ? and - stripped from both ends. Leave out any word that is empty after stripping. For example, clean_words(\"Wait - what? WAIT!\") returns ['wait', 'what', 'wait'].",
      starterCode: `def clean_words(text):
    words = []
    for word in text.lower().split():
        pass  # strip the punctuation, then keep the word if it is not empty
    return words
`,
      check: {
        type: "returns",
        cases: [
          { call: "clean_words(\"The cat sat.\")", expected: "['the', 'cat', 'sat']" },
          { call: "clean_words(\"Wait - what? WAIT!\")", expected: "['wait', 'what', 'wait']" },
          { call: "clean_words(\"well-known; hard-won\")", expected: "['well-known', 'hard-won']" },
          { call: "clean_words(\"\")", expected: "[]" },
        ],
      },
      solution: `def clean_words(text):
    words = []
    for word in text.lower().split():
        word = word.strip(".,;:!?-")
        if word:
            words.append(word)
    return words
`,
      hint: "Inside the loop, reassign word = word.strip(\".,;:!?-\"). Then append it only if it is not empty: an empty string counts as false, so if word: is enough.",
    },
    {
      type: "heading",
      text: "Stage 2: Count the words",
    },
    {
      type: "prose",
      body: "Counting uses the dictionary pattern from Dictionary Methods & Patterns. Each word is a key, and its value is how many times the word has appeared so far. `counts.get(word, 0) + 1` reads the current count, using 0 for a word not seen yet, and adds one.",
    },
    {
      type: "prose",
      body: "A dictionary keeps its keys in the order they were first added, so the result lists words in the order they first appear in the text. The next stage puts them in a more useful order.",
    },
    {
      type: "exercise",
      id: "project-word-counter-2",
      prompt:
        "Add a function count_words(words) that takes a list of words and returns a dictionary mapping each word to the number of times it appears in the list, with the words in the order they first appear. For example, count_words(['the', 'cat', 'the']) returns {'the': 2, 'cat': 1}.",
      starterCode: `def clean_words(text):
    words = []
    for word in text.lower().split():
        word = word.strip(".,;:!?-")
        if word:
            words.append(word)
    return words
`,
      check: {
        type: "returns",
        cases: [
          { call: "count_words(['the', 'cat', 'the'])", expected: "{'the': 2, 'cat': 1}" },
          {
            call: "count_words(clean_words(\"Rain, rain, go away!\"))",
            expected: "{'rain': 2, 'go': 1, 'away': 1}",
          },
          { call: "count_words([])", expected: "{}" },
        ],
      },
      solution: `def clean_words(text):
    words = []
    for word in text.lower().split():
        word = word.strip(".,;:!?-")
        if word:
            words.append(word)
    return words


def count_words(words):
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts
`,
      hint: "Start with counts = {}, loop over words, and set counts[word] = counts.get(word, 0) + 1. Return counts after the loop, not inside it.",
    },
    {
      type: "heading",
      text: "Stage 3: Find the most common words",
    },
    {
      type: "prose",
      body: "Sorting the dictionary's `items()` with `key=lambda pair: pair[1]` and `reverse=True` puts the most common words first. A slice such as `[:3]` then keeps the first three pairs, and a slice that runs past the end of a list simply stops at the end.",
    },
    {
      type: "prose",
      body: "Ties need a rule, or words with the same count come out in the order they first appeared. Sorting keeps items with equal keys in the order they already had, and that stays true with `reverse=True`. So sort twice: first by word, with `key=lambda pair: pair[0]`, then sort that result by count. Words with the same count stay in alphabetical order.",
    },
    {
      type: "exercise",
      id: "project-word-counter-3",
      prompt:
        "Add a function top_words(counts, n) that takes a dictionary like the one count_words() returns and returns a list of the n most common (word, count) pairs, most common first. Words with the same count go in alphabetical order. If there are fewer than n words, return them all. For example, top_words({'rain': 2, 'go': 1, 'away': 1}, 3) returns [('rain', 2), ('away', 1), ('go', 1)].",
      starterCode: `def clean_words(text):
    words = []
    for word in text.lower().split():
        word = word.strip(".,;:!?-")
        if word:
            words.append(word)
    return words


def count_words(words):
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts
`,
      check: {
        type: "returns",
        cases: [
          { call: "top_words({'the': 3, 'cat': 2, 'sat': 1}, 2)", expected: "[('the', 3), ('cat', 2)]" },
          {
            call: "top_words({'rain': 2, 'go': 1, 'away': 1}, 3)",
            expected: "[('rain', 2), ('away', 1), ('go', 1)]",
          },
          { call: "top_words({'sun': 1, 'moon': 1}, 5)", expected: "[('moon', 1), ('sun', 1)]" },
        ],
      },
      solution: `def clean_words(text):
    words = []
    for word in text.lower().split():
        word = word.strip(".,;:!?-")
        if word:
            words.append(word)
    return words


def count_words(words):
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts


def top_words(counts, n):
    pairs = sorted(counts.items(), key=lambda pair: pair[0])
    pairs.sort(key=lambda pair: pair[1], reverse=True)
    return pairs[:n]
`,
      hint: "Build pairs = sorted(counts.items(), key=lambda pair: pair[0]) for alphabetical order. Then call pairs.sort() with key=lambda pair: pair[1] and reverse=True, and return pairs[:n].",
    },
    {
      type: "heading",
      text: "Stage 4: Read the file and write the report",
    },
    {
      type: "prose",
      body: "The last function connects the others to files. It reads the whole source file with `read()`, passes the text through `clean_words()` and `count_words()`, and writes the report line by line with `write()`, ending each line with `\\n` because `write()` adds no line break of its own.",
    },
    {
      type: "prose",
      body: "The total number of words is the sum of all the counts, and the number of different words is the number of keys in the dictionary. A format spec such as `{word:<10}` pads the word with spaces to 10 characters, which lines the counts up in a column.",
    },
    {
      type: "exercise",
      id: "project-word-counter-4",
      prompt:
        "The starter now writes weather.txt and, at the bottom, calls write_report() and prints report.txt. Write write_report(source, destination, n) where the comment shows. It reads the text of the file named source, counts its words with your three functions, and writes the file named destination with these lines: Words: followed by a space and the total number of words; Different words: followed by a space and the number of different words; then one line for each of the n most common words, made of the word padded with spaces to 10 characters (use the format spec :<10) followed directly by its count. The output should be exactly five lines: Words: 30, then Different words: 18, then the word the with the count 7, then rain with 3, then was with 3.",
      starterCode: `def clean_words(text):
    words = []
    for word in text.lower().split():
        word = word.strip(".,;:!?-")
        if word:
            words.append(word)
    return words


def count_words(words):
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts


def top_words(counts, n):
    pairs = sorted(counts.items(), key=lambda pair: pair[0])
    pairs.sort(key=lambda pair: pair[1], reverse=True)
    return pairs[:n]


# write write_report(source, destination, n) here


with open("weather.txt", "w") as file:
    file.write("The rain came early. The garden drank the rain,\\nand the roses lifted their heads - the rain was warm!\\nBy noon the sun was out, and the garden was green.\\n")

write_report("weather.txt", "report.txt", 3)
with open("report.txt") as file:
    print(file.read())
`,
      check: {
        type: "stdout-exact",
        expected: "Words: 30\nDifferent words: 18\nthe       7\nrain      3\nwas       3",
      },
      solution: `def clean_words(text):
    words = []
    for word in text.lower().split():
        word = word.strip(".,;:!?-")
        if word:
            words.append(word)
    return words


def count_words(words):
    counts = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts


def top_words(counts, n):
    pairs = sorted(counts.items(), key=lambda pair: pair[0])
    pairs.sort(key=lambda pair: pair[1], reverse=True)
    return pairs[:n]


def write_report(source, destination, n):
    with open(source) as file:
        counts = count_words(clean_words(file.read()))
    with open(destination, "w") as report:
        report.write(f"Words: {sum(counts.values())}\\n")
        report.write(f"Different words: {len(counts)}\\n")
        for word, count in top_words(counts, n):
            report.write(f"{word:<10}{count}\\n")


with open("weather.txt", "w") as file:
    file.write("The rain came early. The garden drank the rain,\\nand the roses lifted their heads - the rain was warm!\\nBy noon the sun was out, and the garden was green.\\n")

write_report("weather.txt", "report.txt", 3)
with open("report.txt") as file:
    print(file.read())
`,
      hint: "Open source with with and build counts = count_words(clean_words(file.read())). Then open destination with the mode \"w\" and write three kinds of line: f\"Words: {sum(counts.values())}\\n\", f\"Different words: {len(counts)}\\n\", and, in a loop over top_words(counts, n), f\"{word:<10}{count}\\n\".",
    },
    {
      type: "heading",
      text: "Extending the program",
    },
    {
      type: "prose",
      body: "Common words such as `the`, `and`, and `was` crowd out the words that say something about a text. Keep a set of such words and skip them while counting, so the report shows `rain` and `garden` at the top. Other ideas to try: report the longest words, add each word's share of the total as a percentage, or combine the counts from several files into one report.",
    },
  ],
};

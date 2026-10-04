export default {
  slug: "files",
  title: "Reading & Writing Files",
  unit: "Errors & Files",
  blocks: [
    {
      type: "prose",
      body: "Every variable disappears when a program ends. A file keeps its text after the program is over, so a later program can read it back. Files are how programs save notes, scores, settings, and reports.",
    },
    {
      type: "prose",
      body: "On this site, files live in your browser's memory, not in a folder on your computer. A file you create stays available while the page is open, even between runs, and disappears when you reload the page or when Python restarts after a run times out. No files exist until a program creates one, so every example in this lesson writes its file before reading it.",
    },
    {
      type: "heading",
      text: "Opening, writing, and closing",
    },
    {
      type: "prose",
      body: "The built-in function `open()` takes a file name and a mode, a short string that says what you plan to do with the file. The mode `\"w\"` means write: Python creates the file, or empties it if it already exists. `open()` gives back a file object, a value that stands for the open file and has methods for working with it.",
    },
    {
      type: "prose",
      body: "The `write()` method adds text to the file. It does not add a line break the way `print()` does, so end each line with `\\n` yourself. When you are done, call `close()`, because Python may hold written text in memory and save it to the file only when the file is closed.",
    },
    {
      type: "prose",
      body: "To read the file back, open it again with the mode `\"r\"`, which means read. The `read()` method gives back everything in the file as one string.",
    },
    {
      type: "example",
      code: `file = open("notes.txt", "w")
file.write("Buy milk\\n")
file.write("Call Ada\\n")
file.close()

file = open("notes.txt", "r")
text = file.read()
file.close()
print(text)`,
    },
    {
      type: "prose",
      body: "The output ends with a blank line. The text already ends with `\\n`, and `print()` adds a line break of its own.",
    },
    {
      type: "heading",
      text: "The with statement",
    },
    {
      type: "prose",
      body: "Forgetting `close()` is easy, and an exception between `open()` and `close()` skips it entirely. The `with` statement solves both problems. Write `with open(\"todo.txt\") as file:` followed by an indented block. Inside the block, `file` is the open file, and Python closes it as soon as the block ends, even if an exception is raised inside it.",
    },
    {
      type: "prose",
      body: "Leaving out the mode, as in the second `with` below, means `\"r\"`. From now on, open every file with `with`.",
    },
    {
      type: "example",
      code: `with open("todo.txt", "w") as file:
    file.write("Water the plants\\n")
    file.write("Pay the rent\\n")

with open("todo.txt") as file:
    print(file.read())`,
    },
    {
      type: "exercise",
      id: "files-1",
      prompt:
        "The first with block writes one line to greeting.txt. Add a second with block that opens greeting.txt for reading and prints its contents with read(). The output should be exactly: Hello from a file",
      starterCode: `with open("greeting.txt", "w") as file:
    file.write("Hello from a file\\n")

# open greeting.txt for reading and print what it holds
`,
      check: { type: "stdout-exact", expected: "Hello from a file" },
      solution: `with open("greeting.txt", "w") as file:
    file.write("Hello from a file\\n")

with open("greeting.txt") as file:
    print(file.read())
`,
      hint: "Write with open(\"greeting.txt\") as file: and, indented below it, print(file.read()).",
    },
    {
      type: "heading",
      text: "Modes: read, write, and append",
    },
    {
      type: "prose",
      body: "The mode decides what `open()` does. `\"r\"` reads a file that already exists, and it is the default. `\"w\"` writes, creating the file or wiping out whatever it held. `\"a\"` means append: it creates the file if needed and adds new text after what is already there.",
    },
    {
      type: "example",
      code: `with open("log.txt", "w") as file:
    file.write("Mon: ran 5 km\\n")

with open("log.txt", "a") as file:
    file.write("Tue: ran 3 km\\n")
    file.write("Wed: rested\\n")

with open("log.txt") as file:
    print(file.read())`,
    },
    {
      type: "prose",
      body: "Reading a file that does not exist raises a `FileNotFoundError`. You can catch it with `try` and `except` like any other exception, which suits a program that may be running for the first time.",
    },
    {
      type: "example",
      code: `try:
    with open("saved_game.txt") as file:
        print(file.read())
except FileNotFoundError:
    print("No saved game yet. Starting a new one.")`,
    },
    {
      type: "heading",
      text: "Reading one line or a list of lines",
    },
    {
      type: "prose",
      body: "`readline()` reads a single line, including the `\\n` at its end, and each call moves on to the next line. At the end of the file it gives back an empty string. `readlines()` reads every remaining line into a list of strings.",
    },
    {
      type: "prose",
      body: "Because each line keeps its `\\n`, printing one shows an extra blank line. `strip()` removes it, along with any spaces at either end.",
    },
    {
      type: "example",
      code: `with open("planets.txt", "w") as file:
    file.write("Mercury\\nVenus\\nEarth\\nMars\\n")

with open("planets.txt") as file:
    first = file.readline()
    second = file.readline()
    rest = file.readlines()

print(first.strip())
print(second.strip())
print(rest)`,
    },
    {
      type: "prose",
      body: "The two `readline()` calls used up the first two lines, so `readlines()` started at `Earth`. A file object remembers how far it has read, and every read continues from that point.",
    },
    {
      type: "exercise",
      id: "files-2",
      prompt:
        "The program writes three lines to runs.txt. Open runs.txt in append mode and add the line \"Thu: 6 km\" with a line break at the end. Then read the file with readlines() and print two lines: the number of lines followed by the word lines, and \"Last:\" followed by the last line with strip() applied. The output should be exactly two lines: \"4 lines\" and \"Last: Thu: 6 km\"",
      starterCode: `with open("runs.txt", "w") as file:
    file.write("Mon: 5 km\\nTue: 3 km\\nWed: 4 km\\n")

# append Thu: 6 km, then read the lines and print the two results
`,
      check: { type: "stdout-exact", expected: "4 lines\nLast: Thu: 6 km" },
      solution: `with open("runs.txt", "w") as file:
    file.write("Mon: 5 km\\nTue: 3 km\\nWed: 4 km\\n")

with open("runs.txt", "a") as file:
    file.write("Thu: 6 km\\n")

with open("runs.txt") as file:
    lines = file.readlines()

print(len(lines), "lines")
print("Last:", lines[-1].strip())
`,
      hint: "Use the mode \"a\" to append. readlines() gives a list, so len() counts the lines and the index -1 gives the last one.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Using `\"w\"` when you meant `\"a\"` is the costliest mistake, because `\"w\"` empties the file the moment it opens, before you write anything. Use `\"a\"` to add to a file and `\"w\"` only to start it fresh.",
    },
    {
      type: "prose",
      body: "`write()` accepts only strings, so `file.write(95)` raises a `TypeError`. Convert numbers with `str()` or an f-string first. And a file opened without `with` and never closed may not hold what you wrote yet, so reading it back can give an empty string.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`open()` takes a file name and a mode: `\"r\"` to read, `\"w\"` to write from scratch, and `\"a\"` to append. `write()` adds text without a line break, and `read()`, `readline()`, and `readlines()` give back the whole file, one line, or a list of lines. A `with` block closes the file for you, even when an exception happens.",
    },
    {
      type: "exercise",
      id: "files-3",
      prompt:
        "The list scores holds three game scores. Write them to a file called scores.txt opened in write mode (\"w\"), one score per line, using a loop. Then open the file again, read its lines, convert each one to a whole number, and print exactly two lines: Games: 3 and then Best: 95",
      starterCode: `scores = [72, 95, 88]
# write each score on its own line, then read them back and print the results
`,
      check: { type: "stdout-exact", expected: "Games: 3\nBest: 95" },
      solution: `scores = [72, 95, 88]
with open("scores.txt", "w") as file:
    for score in scores:
        file.write(f"{score}\\n")

with open("scores.txt") as file:
    saved = [int(line) for line in file.readlines()]

print("Games:", len(saved))
print("Best:", max(saved))
`,
      hint: "write() needs text, so write f\"{score}\\n\" for each score. After reading the lines with readlines(), convert each one with int(), then use len() and max().",
    },
  ],
};

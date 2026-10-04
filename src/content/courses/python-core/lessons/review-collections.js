export default {
  slug: "review-collections",
  title: "Review: Collections",
  unit: "Collections",
  blocks: [
    {
      type: "prose",
      body: "This review brings the Collections unit together with everything before it: input, strings, decisions, and loops. You now have four collections, and much of the skill lies in picking the right one for the job. Each exercise reads its data with `input()` and says exactly what it receives and which prompt to use.",
    },
    {
      type: "heading",
      text: "Choosing the right collection",
    },
    {
      type: "prose",
      body: "Use a list when order matters or items can repeat: a playlist, the steps of a recipe, a week of temperatures. Use a tuple for a small fixed group whose parts each have a set meaning, such as a date or a pair of coordinates.",
    },
    {
      type: "prose",
      body: "Use a set when only presence matters: removing duplicates, checking membership quickly, or comparing two groups. Use a dictionary when you look things up by a label, such as prices by item, scores by name, or counts by word.",
    },
    {
      type: "prose",
      body: "Most programs combine them. The next example reads a sign-in sheet. The list keeps every sign-in in order, duplicates included, the set answers how many different people came, and the dictionary answers how many times each person signed in.",
    },
    {
      type: "example",
      code: `line = input("Sign-ins: ")
names = line.split(",")
visits = {}
for name in names:
    visits[name] = visits.get(name, 0) + 1
print("Total sign-ins:", len(names))
print("Different people:", len(set(names)))
for name, count in visits.items():
    print(f"{name}: {count}")`,
      stdin: "Ada,Alan,Ada,Grace,Ada",
    },
    {
      type: "heading",
      text: "Reading several values from one line",
    },
    {
      type: "prose",
      body: "`input()` always gives back one string. `split()` breaks that string into a list of strings, and a loop that applies `int()` or `float()` to each piece turns them into numbers. Build the list of numbers with `append()` as you go.",
    },
    {
      type: "example",
      code: `line = input("Prices: ")
prices = []
for piece in line.split():
    prices.append(float(piece))
print(prices)
print(f"Total: \${sum(prices):.2f}")`,
      stdin: "3.50 2.25 4.00",
    },
    {
      type: "exercise",
      id: "review-collections-1",
      prompt:
        "The program receives one line of input: 72 88 95 60 88. The input() line is written for you. Convert the scores into a list of whole numbers, then print four lines: Count: with the number of scores, Average: with the average to one decimal place, Highest: with the highest score, and Unique: with the number of different scores. The output should be exactly five lines, the first being the prompt with the echoed input: Scores: 72 88 95 60 88, then Count: 5, then Average: 80.6, then Highest: 95, then Unique: 4",
      starterCode: `line = input("Scores: ")
scores = []
# convert each piece of line to an int and append it, then print the four lines
`,
      stdin: "72 88 95 60 88",
      check: {
        type: "stdout-exact",
        expected: "Scores: 72 88 95 60 88\nCount: 5\nAverage: 80.6\nHighest: 95\nUnique: 4",
      },
      solution: `line = input("Scores: ")
scores = []
for piece in line.split():
    scores.append(int(piece))
average = sum(scores) / len(scores)
print("Count:", len(scores))
print(f"Average: {average:.1f}")
print("Highest:", max(scores))
print("Unique:", len(set(scores)))
`,
      hint: "Loop over line.split() and append int(piece). The average is sum(scores) / len(scores), shown with :.1f in an f-string. A set of the scores drops the repeated 88.",
    },
    {
      type: "heading",
      text: "Collecting input until a stop word",
    },
    {
      type: "prose",
      body: "The sentinel pattern from the Loops unit fits collections well: keep asking with a `while` loop, `break` when the stop word arrives, and store every other answer. A set beside the list makes it cheap to notice an answer you have already seen.",
    },
    {
      type: "exercise",
      id: "review-collections-2",
      prompt:
        "The program receives five lines of input: milk, bread, milk, eggs, and done. Use a while loop that asks for each item with the exact prompt Item: (a colon followed by a space) and stops when the answer is done. Store each new item in a list. When an item is already on the list, print Already on the list: followed by the item instead of adding it. After the loop, print Shopping list: followed by the items joined with a comma and a space. The output should be exactly seven lines: Item: milk, then Item: bread, then Item: milk, then Already on the list: milk, then Item: eggs, then Item: done, then Shopping list: milk, bread, eggs",
      starterCode: `items = []
seen = set()
# ask for items until done, then print the shopping list
`,
      stdin: "milk\nbread\nmilk\neggs\ndone",
      check: {
        type: "stdout-exact",
        expected:
          "Item: milk\nItem: bread\nItem: milk\nAlready on the list: milk\nItem: eggs\nItem: done\nShopping list: milk, bread, eggs",
      },
      solution: `items = []
seen = set()
while True:
    item = input("Item: ")
    if item == "done":
        break
    if item in seen:
        print("Already on the list:", item)
    else:
        seen.add(item)
        items.append(item)
print("Shopping list:", ", ".join(items))
`,
      hint: "Use while True: with item = input(\"Item: \") as the first line inside. Check for done first and break. Then check item in seen: print the message, or else add the item to both seen and items.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting that every piece from `split()` is a string causes quiet bugs: `max([\"9\", \"10\"])` gives `\"9\"`, because strings compare character by character and \"9\" comes after \"1\". Convert the pieces before doing math or comparing them. Also check which separator the input uses, because `split()` with nothing in the parentheses splits on spaces and `split(\",\")` splits on commas.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Lists keep order and duplicates, tuples hold small fixed groups, sets keep each value once and check membership fast, and dictionaries look values up by key. Text from `input()` becomes a list with `split()`, and each piece needs converting before you use it as a number. Most real programs combine several collections, each answering a different question.",
    },
    {
      type: "exercise",
      id: "review-collections-3",
      prompt:
        "The program receives two lines of input: Ada=92,Grace=88,Alan=75 and then Grace,Linus. Both input() lines, with their prompts, are written for you. Build a dictionary that maps each name to its score as a whole number. Then, for each name in the second line, print the name, a colon, a space, and its score, or no score if the name is not in the dictionary. Finally, print Average: with the average of all scores to one decimal place. The output should be exactly five lines: Scores: Ada=92,Grace=88,Alan=75, then Look up: Grace,Linus, then Grace: 88, then Linus: no score, then Average: 85.0",
      starterCode: `score_line = input("Scores: ")
lookup_line = input("Look up: ")
# build the dictionary, print the lookups, then print the average
`,
      stdin: "Ada=92,Grace=88,Alan=75\nGrace,Linus",
      check: {
        type: "stdout-exact",
        expected:
          "Scores: Ada=92,Grace=88,Alan=75\nLook up: Grace,Linus\nGrace: 88\nLinus: no score\nAverage: 85.0",
      },
      solution: `score_line = input("Scores: ")
lookup_line = input("Look up: ")
scores = {}
for pair in score_line.split(","):
    name, score = pair.split("=")
    scores[name] = int(score)
for name in lookup_line.split(","):
    print(f"{name}: {scores.get(name, 'no score')}")
average = sum(scores.values()) / len(scores)
print(f"Average: {average:.1f}")
`,
      hint: "Split score_line on commas to get pieces like Ada=92, then split each piece on = and unpack it into a name and a score. For the lookups, get() with the default 'no score' handles the missing name. The average is sum(scores.values()) / len(scores).",
    },
  ],
};

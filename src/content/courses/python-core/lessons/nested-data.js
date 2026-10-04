export default {
  slug: "nested-data",
  title: "Nested Data",
  unit: "Collections",
  blocks: [
    {
      type: "prose",
      body: "Real information rarely fits in one flat list or dictionary. A library has many books, and each book has a title, an author, and a year. Python handles this by putting collections inside other collections, which is called nesting. This lesson shows how to build nested data, reach into it, and loop over it.",
    },
    {
      type: "heading",
      text: "Lists of dictionaries",
    },
    {
      type: "prose",
      body: "A list of dictionaries is the most common way to store a table of records. Each dictionary is one record, such as one book, and every record uses the same keys. The list keeps the records in order.",
    },
    {
      type: "prose",
      body: "Long collections are easier to read spread over several lines, one item per line. Python keeps reading until it finds the closing bracket, so the line breaks inside are allowed, and a comma after the last item is allowed too.",
    },
    {
      type: "example",
      code: `books = [
    {"title": "Dune", "year": 1965},
    {"title": "Emma", "year": 1815},
    {"title": "Ubik", "year": 1969},
]
print(books[1])
print(books[1]["title"])
print(len(books))`,
    },
    {
      type: "prose",
      body: "To reach a value, read the path from left to right. `books[1]` is the second dictionary in the list, and `books[1][\"title\"]` is the title stored in that dictionary. Each pair of brackets takes one step deeper.",
    },
    {
      type: "prose",
      body: "Every step is an ordinary lookup, so the methods from the last lesson work at the end of a path. Real records are not always complete, and `books[0].get(\"author\", \"unknown\")` gives a fallback instead of a `KeyError` when a book has no author key.",
    },
    {
      type: "exercise",
      id: "nested-data-1",
      prompt:
        "The list orders holds three orders. Print the item of the last order, using a negative index and then the key. The output should be exactly: juice",
      starterCode: `orders = [
    {"item": "coffee", "qty": 2},
    {"item": "bagel", "qty": 1},
    {"item": "juice", "qty": 3},
]
# print the item of the last order
`,
      check: { type: "stdout-exact", expected: "juice" },
      solution: `orders = [
    {"item": "coffee", "qty": 2},
    {"item": "bagel", "qty": 1},
    {"item": "juice", "qty": 3},
]
print(orders[-1]["item"])
`,
      hint: "orders[-1] is the last dictionary. Add [\"item\"] after it to read the item.",
    },
    {
      type: "heading",
      text: "Looping over records",
    },
    {
      type: "prose",
      body: "A `for` loop over a list of dictionaries gives you one record at a time. Inside the loop, read its values by key. This is how you filter, total, or report on a table of records.",
    },
    {
      type: "prose",
      body: "The loop variable is another name for the dictionary stored in the list, not a copy of it. Changing a record through the loop variable, such as adding a key, changes the record inside the list.",
    },
    {
      type: "example",
      code: `books = [
    {"title": "Dune", "year": 1965},
    {"title": "Emma", "year": 1815},
    {"title": "Ubik", "year": 1969},
]
for book in books:
    if book["year"] > 1900:
        print(book["title"], "was published in", book["year"])

for book in books:
    book["old"] = book["year"] < 1900
print(books[1])`,
    },
    {
      type: "prose",
      body: "To put a dictionary value inside an f-string written with double quotes, write the key in single quotes, as in `f\"{book['title']}\"`. Using double quotes for both can confuse the reader, even where Python accepts it.",
    },
    {
      type: "exercise",
      id: "nested-data-2",
      prompt:
        "Loop over orders and, for each order, print the item, an x, the quantity, and the cost (quantity times price) with two decimal places, in the form coffee x2: $7.00. Then print the total of all costs. The output should be exactly four lines: coffee x2: $7.00, then bagel x1: $2.25, then juice x3: $12.00, then Total: $21.25",
      starterCode: `orders = [
    {"item": "coffee", "qty": 2, "price": 3.5},
    {"item": "bagel", "qty": 1, "price": 2.25},
    {"item": "juice", "qty": 3, "price": 4.0},
]
total = 0
# print one line per order, then the total
`,
      check: {
        type: "stdout-exact",
        expected: "coffee x2: $7.00\nbagel x1: $2.25\njuice x3: $12.00\nTotal: $21.25",
      },
      solution: `orders = [
    {"item": "coffee", "qty": 2, "price": 3.5},
    {"item": "bagel", "qty": 1, "price": 2.25},
    {"item": "juice", "qty": 3, "price": 4.0},
]
total = 0
for order in orders:
    cost = order["qty"] * order["price"]
    total += cost
    print(f"{order['item']} x{order['qty']}: \${cost:.2f}")
print(f"Total: \${total:.2f}")
`,
      hint: "Inside the loop, store order[\"qty\"] * order[\"price\"] in a variable called cost and add it to total. In the f-string, :.2f gives two decimal places.",
    },
    {
      type: "heading",
      text: "Dictionaries of lists",
    },
    {
      type: "prose",
      body: "The other common shape is a dictionary whose values are lists, which you built with `setdefault()` in the last lesson. Each key names a group, and its list holds the members. `classes[\"math\"]` is a list, so `classes[\"math\"][0]` is the first student in it.",
    },
    {
      type: "prose",
      body: "Because each value is a real list, list methods work on it directly: `classes[\"art\"].append(\"Linus\")` adds to that one group. To visit every member, loop over `items()` for the groups and put a second loop inside it for the members.",
    },
    {
      type: "example",
      code: `classes = {
    "math": ["Ada", "Alan"],
    "art": ["Grace"],
}
print(classes["math"][0])
classes["art"].append("Linus")
for subject, students in classes.items():
    print(subject, "has", len(students), "students")
    for student in students:
        print(" -", student)`,
    },
    {
      type: "heading",
      text: "Going deeper",
    },
    {
      type: "prose",
      body: "Nesting can go as deep as the data needs. A dictionary can hold a list and another dictionary, and a list of lists makes a grid, where `grid[row][column]` picks one cell. However long the path, read it one step at a time.",
    },
    {
      type: "example",
      code: `student = {
    "name": "Ada",
    "grades": [90, 85, 97],
    "address": {"city": "London", "postcode": "N1"},
}
print(student["grades"][-1])
print(student["address"]["city"])

grid = [
    [1, 2, 3],
    [4, 5, 6],
]
print(grid[1][2])`,
    },
    {
      type: "prose",
      body: "A nested loop visits every cell of a grid. The outer loop hands you one row, which is a list, and the inner loop hands you each number in that row.",
    },
    {
      type: "example",
      code: `grid = [
    [1, 2, 3],
    [4, 5, 6],
]
total = 0
for row in grid:
    print("Row total:", sum(row))
    for cell in row:
        total += cell
print("Grid total:", total)`,
    },
    {
      type: "prose",
      body: "When a long path fails, the last line of the error tells you what kind of step went wrong. A `KeyError` names the missing key, an `IndexError` means a position past the end of a list, and a `TypeError` usually means a key was used on a list.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Skipping a step in the path is the most common mistake. `books[\"title\"]` fails because `books` is a list, which needs a position before a key, and Python reports `TypeError: list indices must be integers or slices, not str`. When a path fails, print each step on its own to see what shape it has.",
    },
    {
      type: "prose",
      body: "Copying is the other trap. `copy()` copies only the outer collection, so the copy and the original still share the same inner lists and dictionaries. Changing an inner list through one shows up in the other, so copy each inner collection as well when you need fully separate data.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Nested data puts collections inside collections. A list of dictionaries stores records, and a dictionary of lists stores groups. Each pair of brackets in a path such as `books[1][\"title\"]` takes one step deeper, and nested loops visit every inner item.",
    },
    {
      type: "exercise",
      id: "nested-data-3",
      prompt:
        "The list players holds one dictionary per player. Build a dictionary called teams that maps each team name to a list of its players' names, in the order they appear. Then print one line per team with the team, a colon, and the names joined by a comma and a space. The output should be exactly three lines: red: Ada, Grace, then blue: Alan, Linus, then green: Guido",
      starterCode: `players = [
    {"name": "Ada", "team": "red"},
    {"name": "Alan", "team": "blue"},
    {"name": "Grace", "team": "red"},
    {"name": "Linus", "team": "blue"},
    {"name": "Guido", "team": "green"},
]
# build teams, then print one line per team
`,
      check: {
        type: "stdout-exact",
        expected: "red: Ada, Grace\nblue: Alan, Linus\ngreen: Guido",
      },
      solution: `players = [
    {"name": "Ada", "team": "red"},
    {"name": "Alan", "team": "blue"},
    {"name": "Grace", "team": "red"},
    {"name": "Linus", "team": "blue"},
    {"name": "Guido", "team": "green"},
]
teams = {}
for player in players:
    teams.setdefault(player["team"], []).append(player["name"])
for team, names in teams.items():
    print(f"{team}: {', '.join(names)}")
`,
      hint: "First loop: setdefault(player[\"team\"], []).append(player[\"name\"]) builds the groups. Second loop: go over teams.items() and use \", \".join(names) for the names.",
    },
  ],
};

export default {
  slug: "attributes-and-methods",
  title: "Attributes & Methods in Depth",
  unit: "Object-Oriented Python",
  blocks: [
    {
      type: "prose",
      body: "Every attribute so far belonged to one instance, and every method worked on one instance. Some information belongs to the class as a whole, such as a base price shared by every pizza. Some functions belong with a class without needing any one instance. This lesson covers both, along with objects that hold whole lists and dictionaries.",
    },
    {
      type: "heading",
      text: "Class attributes",
    },
    {
      type: "prose",
      body: "A variable assigned directly in the class body, outside any method, is a class attribute. It belongs to the class itself, so every instance shares the same value. Attributes set through `self` inside a method are instance attributes, and each instance has its own.",
    },
    {
      type: "prose",
      body: "When you read `margherita.base_price`, Python looks on the instance first and then on its class. That is why every pizza sees the class value. To change a class attribute, assign it through the class name, as in `Pizza.made += 1`.",
    },
    {
      type: "example",
      code: `class Pizza:
    base_price = 8.0
    made = 0

    def __init__(self, topping):
        self.topping = topping
        Pizza.made += 1

margherita = Pizza("basil")
pepperoni = Pizza("pepperoni")
print(margherita.base_price, pepperoni.base_price)
print(Pizza.made)

pepperoni.base_price = 9.5
print(margherita.base_price, pepperoni.base_price, Pizza.base_price)`,
    },
    {
      type: "prose",
      body: "The last lines show a trap. Assigning `pepperoni.base_price = 9.5` does not change the class attribute. It creates a new instance attribute on `pepperoni` alone, which hides the class value for that one pizza.",
    },
    {
      type: "heading",
      text: "Objects that hold lists and dictionaries",
    },
    {
      type: "prose",
      body: "An attribute can hold any value, including a list or a dictionary. A team can keep its members in a list, and a gradebook can keep scores in a dictionary keyed by student name. Methods then add to the collection and summarize it.",
    },
    {
      type: "prose",
      body: "Create the collection inside `__init__`, as in `self.scores = {}`. That line runs once per instance, so each object gets its own new, empty collection. A list or dictionary written as a class attribute would be one collection shared by every instance, so adding to it through one object would change it for all of them.",
    },
    {
      type: "example",
      code: `class Gradebook:
    def __init__(self, course):
        self.course = course
        self.scores = {}

    def record(self, student, score):
        self.scores[student] = score

    def average(self):
        return sum(self.scores.values()) / len(self.scores)

math_class = Gradebook("Math")
art_class = Gradebook("Art")
math_class.record("Ada", 92)
math_class.record("Alan", 78)
art_class.record("Grace", 85)
print(math_class.scores)
print(art_class.scores)
print(math_class.average())`,
    },
    {
      type: "exercise",
      id: "attributes-and-methods-1",
      prompt:
        "The Team class creates an empty list called members in __init__. Replace pass in add() so that it appends the name to that team's members list. The code at the bottom adds two players to red and one to blue, so the output should be exactly two lines: ['Ada', 'Grace'] and then ['Alan']",
      starterCode: `class Team:
    def __init__(self, color):
        self.color = color
        self.members = []

    def add(self, name):
        pass

red = Team("red")
blue = Team("blue")
red.add("Ada")
blue.add("Alan")
red.add("Grace")
print(red.members)
print(blue.members)
`,
      check: { type: "stdout-exact", expected: "['Ada', 'Grace']\n['Alan']" },
      solution: `class Team:
    def __init__(self, color):
        self.color = color
        self.members = []

    def add(self, name):
        self.members.append(name)

red = Team("red")
blue = Team("blue")
red.add("Ada")
blue.add("Alan")
red.add("Grace")
print(red.members)
print(blue.members)
`,
      hint: "The list is reached through self, so the line is self.members.append(name).",
    },
    {
      type: "heading",
      text: "Mutating or returning",
    },
    {
      type: "prose",
      body: "To mutate an object means to change it in place. A method that mutates, such as one that adds a song to a playlist, usually returns nothing, which means it returns `None`. A method that returns builds a new value, such as a total, hands it back, and leaves the object as it was.",
    },
    {
      type: "prose",
      body: "You have seen both kinds already: `songs.sort()` mutates the list and returns `None`, while `sorted(songs)` returns a new sorted list and leaves `songs` alone. Follow the same habit in your own classes, and choose method names that make the kind clear.",
    },
    {
      type: "example",
      code: `class Playlist:
    def __init__(self, name):
        self.name = name
        self.songs = []

    def add(self, title, seconds):
        self.songs.append((title, seconds))

    def total_minutes(self):
        return sum(seconds for title, seconds in self.songs) / 60

    def longer_than(self, limit):
        return [title for title, seconds in self.songs if seconds > limit]

road = Playlist("Road trip")
road.add("Drive", 240)
road.add("Holiday", 180)
road.add("Highway", 300)
print(road.add("Sunrise", 120))
print(road.total_minutes())
print(road.longer_than(200))
print(len(road.songs))`,
    },
    {
      type: "prose",
      body: "`print(road.add(\"Sunrise\", 120))` prints `None` because `add()` changes the playlist and returns nothing. `total_minutes()` and `longer_than()` hand back new values, and the playlist still holds all four songs afterwards.",
    },
    {
      type: "heading",
      text: "Class methods and static methods",
    },
    {
      type: "prose",
      body: "A line that starts with `@`, written directly above a `def`, is a marker that changes how the function behaves. You will meet several markers in this unit, and Unit 11 shows how they are built. Two markers change what a method receives as its first parameter.",
    },
    {
      type: "prose",
      body: "`@classmethod` makes a method receive the class itself instead of an instance. By habit that parameter is named `cls`, and calling `cls(...)` inside the method creates a new instance. Class methods are often used as extra ways to build an object, such as building a product from a line of text.",
    },
    {
      type: "prose",
      body: "`@staticmethod` makes a method receive neither the instance nor the class. It is an ordinary function kept inside the class because it belongs there, such as a helper that formats a price. You can call both kinds on the class name, as in `Product.from_line(...)`, without making an instance first.",
    },
    {
      type: "example",
      code: `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    @classmethod
    def from_line(cls, line):
        name, price = line.split(",")
        return cls(name, float(price))

    @staticmethod
    def format_price(amount):
        return f"\${amount:.2f}"

lamp = Product.from_line("lamp,24.5")
print(lamp.name, lamp.price)
print(Product.format_price(lamp.price))
print(Product.format_price(3))`,
    },
    {
      type: "exercise",
      id: "attributes-and-methods-2",
      prompt:
        "Add a class method from_text(cls, text) to the Book class. It receives text such as Dune;412, splits it on the semicolon, and returns a new Book whose title is the first part and whose pages is the second part converted to a whole number. Also add a static method is_long(pages) that returns True when pages is more than 400 and False otherwise.",
      starterCode: `class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    # add the class method from_text here

    # add the static method is_long here
`,
      check: {
        type: "returns",
        cases: [
          { call: "Book.from_text('Dune;412').title", expected: "'Dune'" },
          { call: "Book.from_text('Dune;412').pages", expected: "412" },
          { call: "Book.from_text('Emma;180').pages", expected: "180" },
          { call: "Book.is_long(412)", expected: "True" },
          { call: "Book.is_long(180)", expected: "False" },
        ],
      },
      solution: `class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    @classmethod
    def from_text(cls, text):
        title, pages = text.split(";")
        return cls(title, int(pages))

    @staticmethod
    def is_long(pages):
        return pages > 400
`,
      hint: "Put @classmethod on the line above def from_text(cls, text):, unpack text.split(\";\") into title and pages, and return cls(title, int(pages)). Put @staticmethod above def is_long(pages): and return pages > 400.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Writing a list or dictionary as a class attribute when each object needs its own is the most common mistake. Every instance then shares one collection, and a change made through one object shows up in all of them. Create per-object collections in `__init__` with `self`.",
    },
    {
      type: "prose",
      body: "Using the result of a mutating method is the second. `count = red.add(\"Ada\")` stores `None` in `count`. Forgetting the `@classmethod` marker is the third: calling `Book.from_text(\"Dune;412\")` then fills `cls` with the text and leaves `text` empty, so Python stops with a `TypeError` about a missing argument.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Class attributes live on the class and are shared by every instance, while instance attributes set through `self` belong to one object. Collections that each object owns are created in `__init__`. Mutating methods change the object and return `None`, and returning methods hand back a new value. A `@classmethod` receives the class as `cls`, and a `@staticmethod` receives neither the class nor an instance.",
    },
    {
      type: "exercise",
      id: "attributes-and-methods-3",
      prompt:
        "Write a class Pantry whose __init__ takes no extra parameters and creates an empty dictionary called self.items. Add a mutating method add(item, quantity) that adds quantity to the item's count, starting from 0 for a new item. Add a returning method count(item) that returns the item's count, or 0 if the item is missing, and a returning method total() that returns the sum of all counts. The code at the bottom uses your class, so the output should be exactly three lines: 5, then 0, then 7",
      starterCode: `# write the Pantry class here


pantry = Pantry()
pantry.add("rice", 2)
pantry.add("beans", 2)
pantry.add("rice", 3)
print(pantry.count("rice"))
print(pantry.count("salt"))
print(pantry.total())
`,
      check: { type: "stdout-exact", expected: "5\n0\n7" },
      solution: `class Pantry:
    def __init__(self):
        self.items = {}

    def add(self, item, quantity):
        self.items[item] = self.items.get(item, 0) + quantity

    def count(self, item):
        return self.items.get(item, 0)

    def total(self):
        return sum(self.items.values())


pantry = Pantry()
pantry.add("rice", 2)
pantry.add("beans", 2)
pantry.add("rice", 3)
print(pantry.count("rice"))
print(pantry.count("salt"))
print(pantry.total())
`,
      hint: "__init__ only needs self, and sets self.items = {}. In add(), store self.items.get(item, 0) + quantity under the item. count() can return self.items.get(item, 0), and total() can return sum(self.items.values()).",
    },
  ],
};

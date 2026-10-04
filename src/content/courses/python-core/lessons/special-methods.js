export default {
  slug: "special-methods",
  title: "Special Methods",
  unit: "Object-Oriented Python",
  blocks: [
    {
      type: "prose",
      body: "Built-in values work with Python's everyday tools. You can `print()` a list, compare two numbers with `<`, ask for the `len()` of a string, and join two lists with `+`. Your own classes can work with those same tools.",
    },
    {
      type: "prose",
      body: "The way in is a set of methods with special names, wrapped in two underscores on each side, like `__init__`. They are called special methods, or dunder methods, short for double underscore. You do not call them yourself: Python calls them when you use the matching operation.",
    },
    {
      type: "heading",
      text: "Printing objects: __str__ and __repr__",
    },
    {
      type: "prose",
      body: "Printing an instance of a plain class shows something like `<__main__.Point object at 0x...>`: the class name and a memory address, a number for where the object is stored, which changes from run to run. A method named `__str__` replaces that with text you choose. It takes only `self` and must return a string, which `print()`, `str()`, and f-strings then use.",
    },
    {
      type: "prose",
      body: "`__repr__` is a second text form, meant for programmers checking their work. It should look like the code that would build the object again, such as `Point(3, 4)`. Python uses it when the object sits inside a list or another collection, and the built-in function `repr()` returns it directly. If a class defines only `__repr__`, `print()` uses that too.",
    },
    {
      type: "example",
      code: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

home = Point(3, 4)
print(home)
print(f"Home is at {home}")
print(repr(home))
print([home, Point(0, 0)])`,
    },
    {
      type: "exercise",
      id: "special-methods-1",
      prompt:
        "Replace pass in the Book class's __str__ method so that it returns the title, the word by, and the author, separated by spaces, as in Dune by Frank Herbert. The check calls str() on Book instances.",
      starterCode: `class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "str(Book('Dune', 'Frank Herbert'))", expected: "'Dune by Frank Herbert'" },
          { call: "str(Book('Emma', 'Jane Austen'))", expected: "'Emma by Jane Austen'" },
        ],
      },
      solution: `class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        return f"{self.title} by {self.author}"
`,
      hint: "Return an f-string built from self.title and self.author. Use return, not print().",
    },
    {
      type: "heading",
      text: "Comparing objects: __eq__ and __lt__",
    },
    {
      type: "prose",
      body: "By default, `==` between two instances is `True` only when both sides are the very same object, so two separate points with the same coordinates are not equal. Defining `__eq__(self, other)` changes that. For `a == b`, Python calls it with `a` as `self` and `b` as `other`, and the method returns `True` or `False`. Once `__eq__` exists, `!=` gives the opposite answer automatically.",
    },
    {
      type: "prose",
      body: "`__lt__` defines `<`, short for less than. Python also uses it for `>` by swapping the two sides, and `sorted()`, `min()`, and `max()` rely on it, so one method makes a whole list sortable. `<=` and `>=` need methods of their own, `__le__` and `__ge__`.",
    },
    {
      type: "example",
      code: `class Runner:
    def __init__(self, name, seconds):
        self.name = name
        self.seconds = seconds

    def __eq__(self, other):
        return self.seconds == other.seconds

    def __lt__(self, other):
        return self.seconds < other.seconds

    def __repr__(self):
        return f"Runner('{self.name}', {self.seconds})"

ada = Runner("Ada", 312)
alan = Runner("Alan", 298)
grace = Runner("Grace", 312)
print(ada == grace)
print(ada != alan)
print(ada < alan)
print(ada > alan)
print(sorted([ada, alan, grace]))
print(min([ada, alan, grace]).name)`,
    },
    {
      type: "prose",
      body: "Here two runners count as equal when their times match, even though their names differ. You decide what equal means for your class, so write `__eq__` to compare whatever matters.",
    },
    {
      type: "exercise",
      id: "special-methods-2",
      prompt:
        "The Product class already has a __repr__. Add __eq__ so that two products are equal when both their names and their prices match, and __lt__ so that one product is less than another when its price is lower. The check compares products and sorts a list of them.",
      starterCode: `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __repr__(self):
        return f"Product('{self.name}', {self.price})"

    # add __eq__ and __lt__ here
`,
      check: {
        type: "returns",
        cases: [
          { call: "Product('pen', 1.5) == Product('pen', 1.5)", expected: "True" },
          { call: "Product('pen', 1.5) == Product('pen', 2.0)", expected: "False" },
          { call: "Product('pen', 1.5) == Product('cap', 1.5)", expected: "False" },
          { call: "Product('lamp', 24.5) < Product('pen', 1.5)", expected: "False" },
          {
            call: "sorted([Product('lamp', 24.5), Product('pen', 1.5), Product('mug', 8.0)])",
            expected: "[Product('pen', 1.5), Product('mug', 8.0), Product('lamp', 24.5)]",
          },
        ],
      },
      solution: `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __repr__(self):
        return f"Product('{self.name}', {self.price})"

    def __eq__(self, other):
        return self.name == other.name and self.price == other.price

    def __lt__(self, other):
        return self.price < other.price
`,
      hint: "Both methods take self and other. __eq__ returns self.name == other.name and self.price == other.price. __lt__ returns self.price < other.price.",
    },
    {
      type: "heading",
      text: "Length and addition: __len__ and __add__",
    },
    {
      type: "prose",
      body: "`__len__` lets `len()` work on your object. It must return a whole number, usually the size of a collection the object holds. It also affects conditions: an object whose length is 0 counts as falsy, just like an empty list.",
    },
    {
      type: "prose",
      body: "`__add__(self, other)` defines `+`. It should build and return a new object and leave both sides unchanged, the same way `+` on two lists makes a new list. In the terms of the last lesson, it is a returning method, not a mutating one.",
    },
    {
      type: "example",
      code: `class Playlist:
    def __init__(self, name, songs):
        self.name = name
        self.songs = songs

    def __len__(self):
        return len(self.songs)

    def __add__(self, other):
        return Playlist(self.name + " + " + other.name, self.songs + other.songs)

    def __str__(self):
        return f"{self.name}: {len(self)} songs"

road = Playlist("Road trip", ["Drive", "Highway", "Holiday"])
calm = Playlist("Calm", ["Sunrise"])
both = road + calm
print(len(road))
print(both)
print(both.songs)
print(road)
if not Playlist("Empty", []):
    print("Nothing to play")`,
    },
    {
      type: "prose",
      body: "In `__add__`, `self` is the object on the left of `+` and `other` is the one on the right, so `road + calm` is the same as calling `road.__add__(calm)`. It made a third playlist, and `road` still has its three songs. Inside `__str__`, `len(self)` calls the class's own `__len__`.",
    },
    {
      type: "prose",
      body: "The same left-and-right rule holds for `__eq__` and `__lt__`. Each of these methods assumes `other` is the same kind of object, so comparing a runner with a plain number would fail inside the method with an `AttributeError`. Compare objects of the same class.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Printing inside `__str__` instead of returning is the most common mistake. `__str__` must return a string, and if it returns nothing, `print()` fails with `TypeError: __str__ returned non-string (type NoneType)`. The same rule holds for `__repr__`.",
    },
    {
      type: "prose",
      body: "Changing `self` inside `__add__` is the second: `a + b` should never change `a`, so build a new object and return it. Finally, sorting objects whose class has no `__lt__` fails with a message such as `TypeError: '<' not supported between instances of 'Runner' and 'Runner'`, which tells you which method to add.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Special methods have names wrapped in double underscores, and Python calls them for you. `__str__` gives the friendly text used by `print()` and f-strings, and `__repr__` gives the code-like text shown inside collections and by `repr()`. `__eq__` and `__lt__` define `==` and `<`, which also make sorting work. `__len__` serves `len()`, and `__add__` serves `+` by returning a new object.",
    },
    {
      type: "exercise",
      id: "special-methods-3",
      prompt:
        "Write a class Duration whose __init__ takes a number of minutes and stores it in self.minutes. Add __str__ returning the whole hours and the leftover minutes in the form 1h 25m, __add__ returning a new Duration that holds the two durations' minutes added together, and __eq__ returning True when two durations hold the same number of minutes. For example, str(Duration(85)) returns '1h 25m' and str(Duration(45)) returns '0h 45m'.",
      starterCode: `# write the Duration class here
`,
      check: {
        type: "returns",
        cases: [
          { call: "str(Duration(85))", expected: "'1h 25m'" },
          { call: "str(Duration(45))", expected: "'0h 45m'" },
          { call: "str(Duration(50) + Duration(40))", expected: "'1h 30m'" },
          { call: "Duration(90) == Duration(50) + Duration(40)", expected: "True" },
          { call: "Duration(30) == Duration(45)", expected: "False" },
        ],
      },
      solution: `class Duration:
    def __init__(self, minutes):
        self.minutes = minutes

    def __str__(self):
        hours, minutes = divmod(self.minutes, 60)
        return f"{hours}h {minutes}m"

    def __add__(self, other):
        return Duration(self.minutes + other.minutes)

    def __eq__(self, other):
        return self.minutes == other.minutes
`,
      hint: "divmod(self.minutes, 60) gives the hours and the leftover minutes as a pair you can unpack. __add__ returns Duration(self.minutes + other.minutes), and __eq__ compares self.minutes with other.minutes.",
    },
  ],
};

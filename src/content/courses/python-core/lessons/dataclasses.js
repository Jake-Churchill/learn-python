export default {
  slug: "dataclasses",
  title: "Dataclasses & Type Hints",
  unit: "Object-Oriented Python",
  blocks: [
    {
      type: "prose",
      body: "Many classes exist mainly to hold data, such as a book with a title, an author, and a page count. For each one you write the same `__init__` that copies parameters onto `self`, and often a `__repr__` and an `__eq__` as well. Python can write those methods for you. This lesson shows how, starting with the type hints that the feature relies on.",
    },
    {
      type: "heading",
      text: "Type hints",
    },
    {
      type: "prose",
      body: "A type hint is a note that says what type a value is meant to have. You write it after a name with a colon, as in `name: str`, and you write a function's return type after an arrow, as in `-> str`. Hints make code easier to read, and separate checking tools can use them to catch mistakes before a program runs.",
    },
    {
      type: "prose",
      body: "Python itself does not enforce type hints. The example below passes text where the hint asks for an `int`, and Python runs it anyway.",
    },
    {
      type: "example",
      code: `def describe(name: str, age: int) -> str:
    return f"{name} is {age}"

print(describe("Ada", 36))
print(describe("Ada", "thirty-six"))

price: float = 4.5
print(price)`,
    },
    {
      type: "heading",
      text: "Defining a dataclass",
    },
    {
      type: "prose",
      body: "A dataclass is a class that Python sets up from a list of fields. The line `from dataclasses import dataclass` brings in the `dataclass` marker, which is not available until you ask for it; this form lets you write `dataclass` on its own, without a `dataclasses.` prefix, and Unit 10 covers it fully. A marker can also sit above a class, and writing `@dataclass` above one turns each line of the form `name: type` in its body into a field.",
    },
    {
      type: "prose",
      body: "From the fields, the marker writes `__init__` with one parameter per field in order, `__repr__` showing every field, and `__eq__` comparing every field. You can still add your own methods, exactly as in any class.",
    },
    {
      type: "example",
      code: `from dataclasses import dataclass

@dataclass
class Book:
    title: str
    author: str
    pages: int

    def is_long(self):
        return self.pages > 400

dune = Book("Dune", "Frank Herbert", 412)
print(dune)
print(dune.title, dune.is_long())
print(dune == Book("Dune", "Frank Herbert", 412))`,
    },
    {
      type: "exercise",
      id: "dataclasses-1",
      prompt:
        "The Product class lists two fields, name and price, but it is not a dataclass yet, so Product('pen', 1.5) fails. Add the @dataclass marker on the line directly above the class.",
      starterCode: `from dataclasses import dataclass

class Product:
    name: str
    price: float
`,
      check: {
        type: "returns",
        cases: [
          { call: "Product('pen', 1.5)", expected: "Product(name='pen', price=1.5)" },
          { call: "Product('pen', 1.5) == Product('pen', 1.5)", expected: "True" },
          { call: "Product('mug', 8.0).price", expected: "8.0" },
        ],
      },
      solution: `from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float
`,
      hint: "Write @dataclass on its own line, between the import line and class Product:.",
    },
    {
      type: "heading",
      text: "Default values",
    },
    {
      type: "prose",
      body: "A field can have a default value, written after the type, as in `shipping: float = 4.99`. That parameter then becomes optional when you create an instance. Fields without defaults must come before fields with them, or Python stops with an error such as `TypeError: non-default argument 'name' follows default argument 'quantity'`.",
    },
    {
      type: "prose",
      body: "A list or dictionary cannot be a plain default, because every instance would share the same one, so Python refuses it with a `ValueError`. Write `field(default_factory=list)` instead, importing `field` on the same line as `dataclass`. You pass the function `list` itself, without parentheses, and the dataclass calls it for each new instance, so every object gets its own empty list.",
    },
    {
      type: "example",
      code: `from dataclasses import dataclass, field

@dataclass
class Order:
    customer: str
    shipping: float = 4.99
    items: list = field(default_factory=list)

    def add(self, item):
        self.items.append(item)

first = Order("Ada")
second = Order("Alan", shipping=0.0)
first.add("lamp")
print(first)
print(second)`,
    },
    {
      type: "heading",
      text: "Frozen dataclasses",
    },
    {
      type: "prose",
      body: "Options go in parentheses after the marker. `@dataclass(frozen=True)` makes instances that cannot be changed after they are created, the way a tuple cannot. Frozen instances can also go into a set or be used as dictionary keys, which instances of an ordinary dataclass cannot.",
    },
    {
      type: "example",
      code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int

home = Point(0, 0)
visited = {home, Point(2, 3), Point(0, 0)}
print(len(visited))
print(Point(2, 3) in visited)
moved = Point(home.x + 5, home.y)
print(moved)`,
    },
    {
      type: "prose",
      body: "The set holds two points, because the two `Point(0, 0)` values are equal. To get a changed point, create a new one, as `moved` does. Assigning to a field of a frozen instance fails, and the last line of the error reads `dataclasses.FrozenInstanceError: cannot assign to field 'x'`.",
    },
    {
      type: "example",
      code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int

home = Point(0, 0)
home.x = 5`,
      showsError: true,
    },
    {
      type: "heading",
      text: "Ordering",
    },
    {
      type: "prose",
      body: "`@dataclass(order=True)` adds `<`, `>`, `<=`, and `>=`, so `sorted()`, `min()`, and `max()` work. Instances are compared field by field, in the order the fields are written: the first field decides, and the next field only breaks a tie. Put the field you want to sort by first, and combine options when you need both, as in `@dataclass(frozen=True, order=True)`.",
    },
    {
      type: "example",
      code: `from dataclasses import dataclass

@dataclass(order=True)
class Result:
    seconds: int
    name: str

results = [Result(312, "Ada"), Result(298, "Alan"), Result(312, "Grace"), Result(305, "Ann")]
for result in sorted(results):
    print(result.name, result.seconds)
print(min(results))`,
    },
    {
      type: "exercise",
      id: "dataclasses-2",
      prompt:
        "Write a dataclass Entry with the fields points (an int) and name (a str), in that order. Instances must support ordering and must not be changeable after they are created, which also lets them go into a set.",
      starterCode: `from dataclasses import dataclass

# write the Entry dataclass here
`,
      check: {
        type: "returns",
        cases: [
          { call: "Entry(10, 'Ada') < Entry(12, 'Alan')", expected: "True" },
          {
            call: "max([Entry(7, 'Grace'), Entry(12, 'Alan'), Entry(10, 'Ada')])",
            expected: "Entry(points=12, name='Alan')",
          },
          {
            call: "sorted([Entry(9, 'Linus'), Entry(9, 'Ada')])",
            expected: "[Entry(points=9, name='Ada'), Entry(points=9, name='Linus')]",
          },
          { call: "len({Entry(7, 'Grace'), Entry(7, 'Grace')})", expected: "1" },
        ],
      },
      solution: `from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Entry:
    points: int
    name: str
`,
      hint: "Use @dataclass(frozen=True, order=True) above class Entry:, then list points: int and name: str in the body.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Leaving out the type hint is the most common mistake. A line such as `price = 0.0` without `: float` is not a field, only a class attribute, so `__init__` has no parameter for it and `Product(\"pen\", 1.5)` fails with a `TypeError`. Every field needs the `name: type` form.",
    },
    {
      type: "prose",
      body: "Forgetting the import line gives `NameError: name 'dataclass' is not defined`. And remember that type hints are notes, not rules: a dataclass happily stores `Book(\"Dune\", \"Frank Herbert\", \"many\")`, so check values yourself where they matter.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Type hints such as `name: str` and `-> str` describe intended types, and Python does not enforce them. `@dataclass` turns `name: type` lines into fields and writes `__init__`, `__repr__`, and `__eq__` for you. Defaults come after the fields without them, using `field(default_factory=list)` for lists. `frozen=True` makes instances unchangeable, and `order=True` compares them field by field so they sort.",
    },
    {
      type: "exercise",
      id: "dataclasses-3",
      prompt:
        "Write a dataclass Recipe with three fields in this order: name (a str), servings (an int that defaults to 2), and ingredients (a list that defaults to a new empty list for each recipe). Add a method add(ingredient) that appends to ingredients, and a method summary() that returns the name, serves, the servings, a colon, and the ingredients joined by a comma and a space, as in Soup serves 2: leeks, potatoes. The code at the bottom uses the class, so the output should be exactly two lines: Soup serves 2: leeks, potatoes and then Recipe(name='Salad', servings=4, ingredients=[])",
      starterCode: `from dataclasses import dataclass, field

# write the Recipe dataclass here


soup = Recipe("Soup")
soup.add("leeks")
soup.add("potatoes")
print(soup.summary())
print(Recipe("Salad", 4))
`,
      check: {
        type: "stdout-exact",
        expected: "Soup serves 2: leeks, potatoes\nRecipe(name='Salad', servings=4, ingredients=[])",
      },
      solution: `from dataclasses import dataclass, field

@dataclass
class Recipe:
    name: str
    servings: int = 2
    ingredients: list = field(default_factory=list)

    def add(self, ingredient):
        self.ingredients.append(ingredient)

    def summary(self):
        return f"{self.name} serves {self.servings}: {', '.join(self.ingredients)}"


soup = Recipe("Soup")
soup.add("leeks")
soup.add("potatoes")
print(soup.summary())
print(Recipe("Salad", 4))
`,
      hint: "The fields are name: str, servings: int = 2, and ingredients: list = field(default_factory=list). In summary(), \", \".join(self.ingredients) builds the list part; inside an f-string written with double quotes, write it as ', '.join(self.ingredients).",
    },
  ],
};

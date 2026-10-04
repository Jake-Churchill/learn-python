export default {
  slug: "project-inventory",
  title: "Inventory System",
  unit: "Projects",
  blocks: [
    {
      type: "prose",
      body: "This project builds an inventory system for a small shop: a program that tracks what is in the stockroom, how many of each item there are, and what the stock is worth. The finished program prints a stock report grouped by category, with a total value at the bottom and a list of items that are running low.",
    },
    {
      type: "prose",
      body: "It brings together a dataclass, a class that holds other objects, and two containers from the `collections` module. You build it in four stages, and the starter code for each stage is the solution to the stage before, so work through them in order. The first three stages check what your classes return, and the last checks the report the program prints.",
    },
    {
      type: "heading",
      text: "Planning the classes",
    },
    {
      type: "prose",
      body: "An item is mostly data: a name, a category, a price, and a quantity. That makes it a good fit for a dataclass. The inventory has rules, such as merging two deliveries of the same item, so it is an ordinary class that holds items. This is composition: an inventory has items, and it is not a kind of item.",
    },
    {
      type: "prose",
      body: "The inventory stores its items in a dictionary keyed by name. Finding an item by name is then a single lookup, and a second delivery of pens finds the pens already stored instead of creating a duplicate.",
    },
    {
      type: "heading",
      text: "Stage 1: The Item dataclass",
    },
    {
      type: "prose",
      body: "`@dataclass` writes `__init__` and `__repr__` from the fields. Writing `quantity: int = 0` gives the last field a default, so a product can be listed before any stock arrives. A field with a default must come after the fields without one.",
    },
    {
      type: "prose",
      body: "The value of an item's stock is its price times its quantity, and it must stay correct whenever the quantity changes. A property recalculates it on every read, so it can never fall out of date the way a stored field could.",
    },
    {
      type: "exercise",
      id: "project-inventory-1",
      prompt:
        "The Item dataclass has three fields. Add a fourth field, quantity, an int that defaults to 0, and a read-only property value that returns the price times the quantity. For example, Item('pen', 'office', 1.5, 10).value is 15.0 and Item('mug', 'kitchen', 8.0).quantity is 0.",
      starterCode: `from dataclasses import dataclass


@dataclass
class Item:
    name: str
    category: str
    price: float
    # add the quantity field and the value property here
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "Item('pen', 'office', 1.5, 10)",
            expected: "Item(name='pen', category='office', price=1.5, quantity=10)",
          },
          { call: "Item('mug', 'kitchen', 8.0).quantity", expected: "0" },
          { call: "Item('pen', 'office', 1.5, 10).value", expected: "15.0" },
          { call: "Item('mug', 'kitchen', 8.0).value", expected: "0.0" },
        ],
      },
      solution: `from dataclasses import dataclass


@dataclass
class Item:
    name: str
    category: str
    price: float
    quantity: int = 0

    @property
    def value(self):
        return self.price * self.quantity
`,
      hint: "Add quantity: int = 0 below price. Then, with a blank line before it, write @property above def value(self): and return self.price * self.quantity.",
    },
    {
      type: "heading",
      text: "Stage 2: The Inventory class",
    },
    {
      type: "prose",
      body: "`__init__` takes a list of items, starts an empty dictionary, and passes each item to `add()`, so the merging rule lives in exactly one place. `add()` checks whether the item's name is already a key. If it is, the new quantity is added to the stored item; if not, the item is stored under its name.",
    },
    {
      type: "prose",
      body: "`__len__` makes `len(inventory)` give the number of different items. `total_value()` adds up every stored item's `value`, which `sum()` over a generator expression does in one line.",
    },
    {
      type: "exercise",
      id: "project-inventory-2",
      prompt:
        "Add a class Inventory below Item. Its __init__ takes a list of items, creates an empty dictionary in self.items, and calls self.add() on each item. add(item) stores the item in self.items under its name, or, if an item with that name is already stored, adds the new item's quantity to the stored item's quantity. Add __len__, returning the number of different items, and total_value(), returning the sum of every item's value. For example, Inventory([Item('pen', 'office', 1.5, 10), Item('pen', 'office', 1.5, 5)]) holds one item, the pen, with a quantity of 15.",
      starterCode: `from dataclasses import dataclass


@dataclass
class Item:
    name: str
    category: str
    price: float
    quantity: int = 0

    @property
    def value(self):
        return self.price * self.quantity
`,
      check: {
        type: "returns",
        cases: [
          { call: "len(Inventory([Item('pen', 'office', 1.5, 10), Item('mug', 'kitchen', 8.0, 3)]))", expected: "2" },
          { call: "len(Inventory([Item('pen', 'office', 1.5, 10), Item('pen', 'office', 1.5, 5)]))", expected: "1" },
          {
            call: "Inventory([Item('pen', 'office', 1.5, 10), Item('pen', 'office', 1.5, 5)]).items['pen'].quantity",
            expected: "15",
          },
          {
            call: "Inventory([Item('pen', 'office', 1.5, 10), Item('mug', 'kitchen', 8.0, 3)]).total_value()",
            expected: "39.0",
          },
          { call: "Inventory([]).total_value() == 0", expected: "True" },
        ],
      },
      solution: `from dataclasses import dataclass


@dataclass
class Item:
    name: str
    category: str
    price: float
    quantity: int = 0

    @property
    def value(self):
        return self.price * self.quantity


class Inventory:
    def __init__(self, items):
        self.items = {}
        for item in items:
            self.add(item)

    def add(self, item):
        if item.name in self.items:
            self.items[item.name].quantity += item.quantity
        else:
            self.items[item.name] = item

    def __len__(self):
        return len(self.items)

    def total_value(self):
        return sum(item.value for item in self.items.values())
`,
      hint: "In add(), test if item.name in self.items:. When it is, increase self.items[item.name].quantity by item.quantity; otherwise store self.items[item.name] = item. total_value() can return sum(item.value for item in self.items.values()).",
    },
    {
      type: "heading",
      text: "Stage 3: Questions about the stock",
    },
    {
      type: "prose",
      body: "A `Counter` is a dictionary made for counting, and `totals[key] += n` works even for a key it has not seen yet, starting from 0. Adding each item's quantity under its category gives the total stock in every category. `most_common()` then lists the categories from the largest total to the smallest, and looking up a category with no items gives 0.",
    },
    {
      type: "prose",
      body: "`low_stock()` answers a simpler question: which items have fewer than a given number left? `sorted()` over a generator expression that picks out those names gives them in alphabetical order.",
    },
    {
      type: "exercise",
      id: "project-inventory-3",
      prompt:
        "Add from collections import Counter at the top of the program and two methods to Inventory. low_stock(limit) returns a list of the names of the items whose quantity is below limit, in alphabetical order. category_totals() returns a Counter mapping each category to the total quantity of all its items. For example, for an inventory holding 25 pens and 12 notebooks in office and 3 mugs in kitchen, category_totals().most_common() returns [('office', 37), ('kitchen', 3)].",
      starterCode: `from dataclasses import dataclass


@dataclass
class Item:
    name: str
    category: str
    price: float
    quantity: int = 0

    @property
    def value(self):
        return self.price * self.quantity


class Inventory:
    def __init__(self, items):
        self.items = {}
        for item in items:
            self.add(item)

    def add(self, item):
        if item.name in self.items:
            self.items[item.name].quantity += item.quantity
        else:
            self.items[item.name] = item

    def __len__(self):
        return len(self.items)

    def total_value(self):
        return sum(item.value for item in self.items.values())
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "Inventory([Item('pen', 'office', 1.5, 25), Item('mug', 'kitchen', 8.0, 3), Item('trowel', 'garden', 12.5, 2)]).low_stock(5)",
            expected: "['mug', 'trowel']",
          },
          {
            call: "Inventory([Item('pen', 'office', 1.5, 25), Item('mug', 'kitchen', 8.0, 3), Item('trowel', 'garden', 12.5, 2)]).low_stock(2)",
            expected: "[]",
          },
          {
            call: "Inventory([Item('pen', 'office', 1.5, 25), Item('mug', 'kitchen', 8.0, 3), Item('notebook', 'office', 3.5, 12)]).category_totals().most_common()",
            expected: "[('office', 37), ('kitchen', 3)]",
          },
          {
            call: "Inventory([Item('pen', 'office', 1.5, 25)]).category_totals()['garden']",
            expected: "0",
          },
        ],
      },
      solution: `from collections import Counter
from dataclasses import dataclass


@dataclass
class Item:
    name: str
    category: str
    price: float
    quantity: int = 0

    @property
    def value(self):
        return self.price * self.quantity


class Inventory:
    def __init__(self, items):
        self.items = {}
        for item in items:
            self.add(item)

    def add(self, item):
        if item.name in self.items:
            self.items[item.name].quantity += item.quantity
        else:
            self.items[item.name] = item

    def __len__(self):
        return len(self.items)

    def total_value(self):
        return sum(item.value for item in self.items.values())

    def low_stock(self, limit):
        return sorted(item.name for item in self.items.values() if item.quantity < limit)

    def category_totals(self):
        totals = Counter()
        for item in self.items.values():
            totals[item.category] += item.quantity
        return totals
`,
      hint: "low_stock() can return sorted(item.name for item in self.items.values() if item.quantity < limit). In category_totals(), start with totals = Counter(), loop over self.items.values(), add each item.quantity to totals[item.category], and return totals.",
    },
    {
      type: "heading",
      text: "Stage 4: The stock report",
    },
    {
      type: "prose",
      body: "The report lists the items category by category. A `defaultdict(list)` groups them in one pass: `groups[item.category].append(item)` creates an empty list the first time a category appears. Sorting the items by name before grouping keeps each group in alphabetical order, and because `sorted()` of a dictionary gives its keys in order, looping over `sorted(groups)` puts the categories in order too.",
    },
    {
      type: "prose",
      body: "The report reuses everything built so far: each item's `value`, `category_totals()` for the section headings, `total_value()` for the last-but-one line, and `low_stock()` for the warning at the end. `\", \".join()` turns the list of low-stock names into one line of text.",
    },
    {
      type: "exercise",
      id: "project-inventory-4",
      prompt:
        "Change the collections import to from collections import Counter, defaultdict and add a method report(limit) to Inventory that prints the stock report. For each category, in alphabetical order, print the category, a space, and then, in parentheses, its total quantity from category_totals() and the word items, as in \"garden (42 items)\". Below it, for each item in that category in alphabetical order, print two spaces, the name, a colon and a space, the quantity, a space, x, a space, the price with 2 decimal places, a space, =, a space, and the value with 2 decimal places, as in \"pen: 25 x 1.50 = 37.50\" after the two spaces. After all the categories, print Total value: followed by a space and the total value with 2 decimal places. Last, print Low stock: followed by a space and the names from low_stock(limit) joined by a comma and a space, or the word none if there are no such items. The code at the bottom uses the classes, so the output should be exactly these ten lines, where each item line also starts with two spaces: \"garden (42 items)\", then \"seeds: 40 x 2.50 = 100.00\", then \"trowel: 2 x 12.50 = 25.00\", then \"kitchen (4 items)\", then \"mug: 4 x 8.00 = 32.00\", then \"office (37 items)\", then \"notebook: 12 x 3.50 = 42.00\", then \"pen: 25 x 1.50 = 37.50\", then \"Total value: 236.50\", then \"Low stock: mug, trowel\"",
      starterCode: `from collections import Counter
from dataclasses import dataclass


@dataclass
class Item:
    name: str
    category: str
    price: float
    quantity: int = 0

    @property
    def value(self):
        return self.price * self.quantity


class Inventory:
    def __init__(self, items):
        self.items = {}
        for item in items:
            self.add(item)

    def add(self, item):
        if item.name in self.items:
            self.items[item.name].quantity += item.quantity
        else:
            self.items[item.name] = item

    def __len__(self):
        return len(self.items)

    def total_value(self):
        return sum(item.value for item in self.items.values())

    def low_stock(self, limit):
        return sorted(item.name for item in self.items.values() if item.quantity < limit)

    def category_totals(self):
        totals = Counter()
        for item in self.items.values():
            totals[item.category] += item.quantity
        return totals


inventory = Inventory([
    Item("pen", "office", 1.5, 25),
    Item("mug", "kitchen", 8.0, 3),
    Item("seeds", "garden", 2.5, 40),
    Item("notebook", "office", 3.5, 12),
    Item("trowel", "garden", 12.5, 2),
])
inventory.add(Item("mug", "kitchen", 8.0, 1))
inventory.report(5)
`,
      check: {
        type: "stdout-exact",
        expected:
          "garden (42 items)\n  seeds: 40 x 2.50 = 100.00\n  trowel: 2 x 12.50 = 25.00\nkitchen (4 items)\n  mug: 4 x 8.00 = 32.00\noffice (37 items)\n  notebook: 12 x 3.50 = 42.00\n  pen: 25 x 1.50 = 37.50\nTotal value: 236.50\nLow stock: mug, trowel",
      },
      solution: `from collections import Counter, defaultdict
from dataclasses import dataclass


@dataclass
class Item:
    name: str
    category: str
    price: float
    quantity: int = 0

    @property
    def value(self):
        return self.price * self.quantity


class Inventory:
    def __init__(self, items):
        self.items = {}
        for item in items:
            self.add(item)

    def add(self, item):
        if item.name in self.items:
            self.items[item.name].quantity += item.quantity
        else:
            self.items[item.name] = item

    def __len__(self):
        return len(self.items)

    def total_value(self):
        return sum(item.value for item in self.items.values())

    def low_stock(self, limit):
        return sorted(item.name for item in self.items.values() if item.quantity < limit)

    def category_totals(self):
        totals = Counter()
        for item in self.items.values():
            totals[item.category] += item.quantity
        return totals

    def report(self, limit):
        groups = defaultdict(list)
        for item in sorted(self.items.values(), key=lambda item: item.name):
            groups[item.category].append(item)
        totals = self.category_totals()
        for category in sorted(groups):
            print(f"{category} ({totals[category]} items)")
            for item in groups[category]:
                print(f"  {item.name}: {item.quantity} x {item.price:.2f} = {item.value:.2f}")
        print(f"Total value: {self.total_value():.2f}")
        low = self.low_stock(limit)
        print("Low stock:", ", ".join(low) if low else "none")


inventory = Inventory([
    Item("pen", "office", 1.5, 25),
    Item("mug", "kitchen", 8.0, 3),
    Item("seeds", "garden", 2.5, 40),
    Item("notebook", "office", 3.5, 12),
    Item("trowel", "garden", 12.5, 2),
])
inventory.add(Item("mug", "kitchen", 8.0, 1))
inventory.report(5)
`,
      hint: "Build groups = defaultdict(list) by looping over sorted(self.items.values(), key=lambda item: item.name) and appending each item to groups[item.category]. Store totals = self.category_totals(), then loop over sorted(groups) to print each heading and, in an inner loop, each item line with an f-string using :.2f. Finish with the Total value line and the Low stock line.",
    },
    {
      type: "heading",
      text: "Extending the program",
    },
    {
      type: "prose",
      body: "A shop also sells things. Try a `sell(name, quantity)` method that lowers the stock and raises a `ValueError` when there is not enough of the item, or a `restock(target)` method that returns how many of each low item to order to bring it up to the target. You could also save the inventory to a JSON file by turning each item into a dictionary first, and load it back at the start.",
    },
  ],
};

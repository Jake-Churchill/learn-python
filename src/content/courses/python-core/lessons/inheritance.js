export default {
  slug: "inheritance",
  title: "Inheritance",
  unit: "Object-Oriented Python",
  blocks: [
    {
      type: "prose",
      body: "Some classes are special kinds of other classes. A manager is an employee who also has a team, and a savings account is an account that also earns interest. Inheritance lets a new class start with everything an existing class has, then add or change only what is different.",
    },
    {
      type: "heading",
      text: "Subclasses",
    },
    {
      type: "prose",
      body: "You create a subclass by writing an existing class's name in parentheses after the new class's name, as in `class Intern(Employee):`. The existing class is called the parent class, and the new one is the child class, or subclass. The child inherits all of the parent's methods, including `__init__`, which means every instance of the child can use them.",
    },
    {
      type: "example",
      code: `class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def describe(self):
        return f"{self.name} earns {self.salary}"

    def give_raise(self, amount):
        self.salary += amount

class Intern(Employee):
    pass

sam = Intern("Sam", 20000)
sam.give_raise(1500)
print(sam.describe())`,
    },
    {
      type: "prose",
      body: "`Intern` has nothing in its body except `pass`, yet it works. Python did not find `__init__`, `give_raise()`, or `describe()` in `Intern`, so it looked in the parent, `Employee`, and used those. A child can also add new methods of its own, and only the child's instances get them.",
    },
    {
      type: "heading",
      text: "Overriding and super()",
    },
    {
      type: "prose",
      body: "When a child defines a method with the same name as one in its parent, the child's version is used for the child's instances. This is called overriding. Python always looks in the object's own class first and moves up to the parent only when the name is missing.",
    },
    {
      type: "prose",
      body: "Often the child wants to do what the parent does plus a little more. `super()` gives you the parent's version of a method, so `super().__init__(name, salary)` runs the parent's setup from inside the child's own `__init__`. After that line, the child stores its extra attributes.",
    },
    {
      type: "example",
      code: `class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def describe(self):
        return f"{self.name} earns {self.salary}"

class Manager(Employee):
    def __init__(self, name, salary, team):
        super().__init__(name, salary)
        self.team = team

    def describe(self):
        return super().describe() + f" and manages {len(self.team)} people"

ada = Employee("Ada", 52000)
grace = Manager("Grace", 68000, ["Ada", "Alan"])
print(ada.describe())
print(grace.describe())
print(grace.name, grace.team)`,
    },
    {
      type: "prose",
      body: "`Manager.describe()` overrides the parent's method but still calls it through `super().describe()`, then adds to the result. The shared part stays in one place: if `Employee.describe()` changes, managers pick up the change too.",
    },
    {
      type: "exercise",
      id: "inheritance-1",
      prompt:
        "Shape.describe() calls self.area(), which returns 0 in Shape. Square is a subclass of Shape. Add an area() method to Square that overrides the parent's and returns the side times itself. Square(3).area() should then return 9, and Square(3).describe() should return 'square with area 9' without any change to Shape.",
      starterCode: `class Shape:
    def __init__(self, name):
        self.name = name

    def area(self):
        return 0

    def describe(self):
        return f"{self.name} with area {self.area()}"

class Square(Shape):
    def __init__(self, side):
        super().__init__("square")
        self.side = side

    # override area() here
`,
      check: {
        type: "returns",
        cases: [
          { call: "Square(3).area()", expected: "9" },
          { call: "Square(3).describe()", expected: "'square with area 9'" },
          { call: "Shape('blob').describe()", expected: "'blob with area 0'" },
        ],
      },
      solution: `class Shape:
    def __init__(self, name):
        self.name = name

    def area(self):
        return 0

    def describe(self):
        return f"{self.name} with area {self.area()}"

class Square(Shape):
    def __init__(self, side):
        super().__init__("square")
        self.side = side

    def area(self):
        return self.side * self.side
`,
      hint: "Inside Square, define def area(self): and return self.side * self.side.",
    },
    {
      type: "prose",
      body: "`describe()` is written only once, in `Shape`, yet it reports the square's area. When it calls `self.area()`, `self` is the square, so Python finds the square's own `area()` first.",
    },
    {
      type: "heading",
      text: "Checking types with isinstance",
    },
    {
      type: "prose",
      body: "The built-in function `isinstance(value, SomeClass)` returns `True` when the value is an instance of that class or of any subclass of it. A manager is an employee, so `isinstance(grace, Employee)` is `True`, while `isinstance(ada, Manager)` is `False`. It works with built-in types too, and a tuple of classes checks several at once, as in `isinstance(price, (int, float))`.",
    },
    {
      type: "prose",
      body: "Comparing with `type()` is stricter: `type(grace) == Employee` ignores subclasses, so it is `False` for a manager. Use `isinstance()` whenever a subclass should count.",
    },
    {
      type: "example",
      code: `class Employee:
    def __init__(self, name):
        self.name = name

class Manager(Employee):
    pass

ada = Employee("Ada")
grace = Manager("Grace")
print(isinstance(grace, Employee))
print(isinstance(ada, Manager))
print(type(grace) == Employee)
print(isinstance(4.5, (int, float)))
print(isinstance("4.5", (int, float)))
for person in [ada, grace]:
    if isinstance(person, Manager):
        print(person.name, "is a manager")
    else:
        print(person.name, "is an employee")`,
    },
    {
      type: "heading",
      text: "Your own exception classes",
    },
    {
      type: "prose",
      body: "Exceptions are classes too, and `ValueError`, `KeyError`, and the rest are all subclasses of a class called `Exception`. Writing your own subclass of `Exception` gives you a new kind of error whose name describes your program's problem. The body is usually just `pass`, because the parent already knows how to carry a message.",
    },
    {
      type: "prose",
      body: "You raise a custom exception like any other, and an `except` clause catches it by name. An `except` clause also catches every subclass of the class it names, so `except Exception` would catch it as well. End the name with `Error`, as the built-in ones do.",
    },
    {
      type: "example",
      code: `class InsufficientFundsError(Exception):
    pass

class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise InsufficientFundsError(f"cannot take {amount}, balance is {self.balance}")
        self.balance -= amount

account = Account("Ada", 100)
for amount in [30, 90]:
    try:
        account.withdraw(amount)
        print("Took", amount)
    except InsufficientFundsError as error:
        print("Refused:", error)
print(account.balance)`,
    },
    {
      type: "exercise",
      id: "inheritance-2",
      prompt:
        "Define an exception class OutOfStockError that is a subclass of Exception. Then complete buy() so that, when quantity is more than the available amount, it raises OutOfStockError with a message made of only, the available amount, the item, and left, separated by spaces, as in only 2 pear left. Raising must happen before the stock changes. The output should be exactly three lines: Bought 3 apple, then Sorry: only 2 pear left, then {'apple': 2, 'pear': 2}",
      starterCode: `# define OutOfStockError here

class Shop:
    def __init__(self, stock):
        self.stock = stock

    def buy(self, item, quantity):
        available = self.stock.get(item, 0)
        # raise OutOfStockError here when quantity is more than available
        self.stock[item] = available - quantity

shop = Shop({"apple": 5, "pear": 2})
for item, quantity in [("apple", 3), ("pear", 4)]:
    try:
        shop.buy(item, quantity)
        print(f"Bought {quantity} {item}")
    except OutOfStockError as error:
        print("Sorry:", error)
print(shop.stock)
`,
      check: {
        type: "stdout-exact",
        expected: "Bought 3 apple\nSorry: only 2 pear left\n{'apple': 2, 'pear': 2}",
      },
      solution: `class OutOfStockError(Exception):
    pass

class Shop:
    def __init__(self, stock):
        self.stock = stock

    def buy(self, item, quantity):
        available = self.stock.get(item, 0)
        if quantity > available:
            raise OutOfStockError(f"only {available} {item} left")
        self.stock[item] = available - quantity

shop = Shop({"apple": 5, "pear": 2})
for item, quantity in [("apple", 3), ("pear", 4)]:
    try:
        shop.buy(item, quantity)
        print(f"Bought {quantity} {item}")
    except OutOfStockError as error:
        print("Sorry:", error)
print(shop.stock)
`,
      hint: "The class is two lines: class OutOfStockError(Exception): and an indented pass. In buy(), write if quantity > available: and raise OutOfStockError(f\"only {available} {item} left\") above the line that changes the stock.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting `super().__init__(...)` in a child's `__init__` is the most common mistake. The child's `__init__` replaces the parent's, so the parent's attributes are never set, and using one later gives an `AttributeError`. Write `super()` with its parentheses, because `super.__init__(...)` does not work.",
    },
    {
      type: "prose",
      body: "With several `except` clauses, put a subclass before its parent. Python uses the first clause that matches, so an `except Exception` written first would catch your custom error before its own clause got a chance. And use inheritance only when the child really is a kind of the parent; the next lesson shows the alternative.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A subclass names its parent in parentheses and inherits all of the parent's methods. A method with the same name in the child overrides the parent's, and `super()` calls the parent's version from inside the child. `isinstance()` checks whether a value belongs to a class or any of its subclasses. A custom exception is a subclass of `Exception`, raised and caught by its own name.",
    },
    {
      type: "exercise",
      id: "inheritance-3",
      prompt:
        "Account is written for you. Write a subclass SavingsAccount whose __init__ takes owner, balance, and rate, passes owner and balance to the parent's __init__ with super(), and stores rate in self.rate. Add a method interest() that returns the balance times the rate divided by 100. Override describe() so that it returns the parent's description followed by a space and (savings, 2%), using the account's own rate, as in Ada: $1000.00 (savings, 2%).",
      starterCode: `class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def describe(self):
        return f"{self.owner}: \${self.balance:.2f}"

# write SavingsAccount below
`,
      check: {
        type: "returns",
        cases: [
          { call: "SavingsAccount('Ada', 1000, 2).balance", expected: "1000" },
          { call: "SavingsAccount('Ada', 1000, 2).interest()", expected: "20.0" },
          {
            call: "SavingsAccount('Ada', 1000, 2).describe()",
            expected: "'Ada: $1000.00 (savings, 2%)'",
          },
          {
            call: "SavingsAccount('Alan', 250, 4).describe()",
            expected: "'Alan: $250.00 (savings, 4%)'",
          },
          { call: "Account('Grace', 50).describe()", expected: "'Grace: $50.00'" },
          { call: "isinstance(SavingsAccount('Ada', 1000, 2), Account)", expected: "True" },
        ],
      },
      solution: `class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def describe(self):
        return f"{self.owner}: \${self.balance:.2f}"

class SavingsAccount(Account):
    def __init__(self, owner, balance, rate):
        super().__init__(owner, balance)
        self.rate = rate

    def interest(self):
        return self.balance * self.rate / 100

    def describe(self):
        return super().describe() + f" (savings, {self.rate}%)"
`,
      hint: "Start with class SavingsAccount(Account):. Its __init__ calls super().__init__(owner, balance) and then sets self.rate = rate. The new describe() returns super().describe() plus an f-string that holds self.rate.",
    },
  ],
};

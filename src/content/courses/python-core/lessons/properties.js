export default {
  slug: "properties",
  title: "Encapsulation & Properties",
  unit: "Object-Oriented Python",
  blocks: [
    {
      type: "prose",
      body: "Any code can change any attribute. Nothing stops a line such as `account.balance = -500` or `thermostat.target = 900`, and the object is then in a state that makes no sense. Encapsulation means keeping an object's data valid by controlling how it is read and changed. This lesson shows Python's tools for it.",
    },
    {
      type: "heading",
      text: "The underscore convention",
    },
    {
      type: "prose",
      body: "An attribute whose name starts with one underscore, such as `self._balance`, is marked as private: meant for the class's own methods, not for code outside the class. Python does not enforce this. It is a convention, a habit that Python programmers agree to follow, and reading `account._balance` from outside still works.",
    },
    {
      type: "prose",
      body: "The underscore tells other people, and your future self, that the attribute may change or break if it is touched directly. Outside code should use the class's methods instead, and those methods can check every change.",
    },
    {
      type: "example",
      code: `class Account:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self._balance += amount

    def balance(self):
        return self._balance

account = Account("Ada")
account.deposit(50)
try:
    account.deposit(-20)
except ValueError as error:
    print("Error:", error)
print(account.balance())`,
    },
    {
      type: "heading",
      text: "Properties",
    },
    {
      type: "prose",
      body: "Calling `account.balance()` with parentheses works, but reading a value should look like reading an attribute. The `@property` marker does that. Written above a method that takes only `self`, it lets you read the method's result with no parentheses, as `account.balance`, and the method runs every time you read it.",
    },
    {
      type: "prose",
      body: "Properties suit two jobs. They give read-only access to private data, and they compute a value from other attributes, so the answer is always up to date. In the next example, `area` is recalculated after the width changes.",
    },
    {
      type: "example",
      code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

room = Rectangle(4, 3)
print(room.area)
room.width = 5
print(room.area)`,
    },
    {
      type: "prose",
      body: "A property with only this one method is read-only. Assigning to it fails, and the last line of the error reads `AttributeError: property 'area' of 'Rectangle' object has no setter`.",
    },
    {
      type: "prose",
      body: "Read-only properties pair well with the underscore convention. The `Account` class above could keep `_balance`, change it only inside `deposit()`, and offer `balance` as a property with no setter. Outside code could then read `account.balance` but never assign to it.",
    },
    {
      type: "example",
      code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

room = Rectangle(4, 3)
room.area = 20`,
      showsError: true,
    },
    {
      type: "exercise",
      id: "properties-1",
      prompt:
        "Make full_name a property of the Person class: put the @property marker above it and replace pass so that it returns the first name, a space, and the last name. Person('Ada', 'Lovelace').full_name, with no parentheses, should give 'Ada Lovelace'.",
      starterCode: `class Person:
    def __init__(self, first, last):
        self.first = first
        self.last = last

    def full_name(self):
        pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "Person('Ada', 'Lovelace').full_name", expected: "'Ada Lovelace'" },
          { call: "Person('Alan', 'Turing').full_name", expected: "'Alan Turing'" },
        ],
      },
      solution: `class Person:
    def __init__(self, first, last):
        self.first = first
        self.last = last

    @property
    def full_name(self):
        return f"{self.first} {self.last}"
`,
      hint: "Write @property on its own line directly above def full_name(self):, and return f\"{self.first} {self.last}\".",
    },
    {
      type: "heading",
      text: "Setters with validation",
    },
    {
      type: "prose",
      body: "A setter is a method that runs when you assign to a property. You write it as a second method with the same name, marked with `@name.setter`, where `name` is the property's name. It receives the new value, checks it, and stores it in the private attribute, or raises an error to refuse it.",
    },
    {
      type: "prose",
      body: "In the example, `target` is the property and `_target` holds the real data. Even the assignment `self.target = target` inside `__init__` goes through the setter, so an invalid starting value is refused too.",
    },
    {
      type: "example",
      code: `class Thermostat:
    def __init__(self, target):
        self.target = target

    @property
    def target(self):
        return self._target

    @target.setter
    def target(self, value):
        if not 10 <= value <= 30:
            raise ValueError(f"target must be from 10 to 30, got {value}")
        self._target = value

home = Thermostat(21)
home.target = 24
print(home.target)
try:
    home.target = 90
except ValueError as error:
    print("Error:", error)
print(home.target)`,
    },
    {
      type: "prose",
      body: "The refused value never reached `_target`, so the thermostat still holds 24. Code that uses the class writes `home.target = 24` as if it were a plain attribute, yet every change is checked.",
    },
    {
      type: "exercise",
      id: "properties-2",
      prompt:
        "The Product class has a price property but no setter, so __init__ fails. Add a setter for price that raises ValueError(\"price cannot be negative\") when the value is below 0, and otherwise stores the value in self._price. The code at the bottom uses the class, so the output should be exactly four lines: 2.5, then 3, then Error: price cannot be negative, then 3",
      starterCode: `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    @property
    def price(self):
        return self._price

    # add the price setter here


pen = Product("pen", 2.5)
print(pen.price)
pen.price = 3
print(pen.price)
try:
    pen.price = -1
except ValueError as error:
    print("Error:", error)
print(pen.price)
`,
      check: {
        type: "stdout-exact",
        expected: "2.5\n3\nError: price cannot be negative\n3",
      },
      solution: `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value < 0:
            raise ValueError("price cannot be negative")
        self._price = value


pen = Product("pen", 2.5)
print(pen.price)
pen.price = 3
print(pen.price)
try:
    pen.price = -1
except ValueError as error:
    print("Error:", error)
print(pen.price)
`,
      hint: "Write @price.setter above def price(self, value):. Inside, raise the ValueError when value < 0, and on the next line store self._price = value.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Storing the value under the property's own name inside the setter is the most common mistake. `self.target = value` inside the `target` setter calls the setter again, which calls it again, until the program crashes. Store the data in the underscore name, `self._target`. The setter method must also have exactly the property's name; under any other name, the property stays read-only and assigning to it still fails.",
    },
    {
      type: "prose",
      body: "Calling a property with parentheses is the second. `room.area` is already the number, so `room.area()` tries to call a number and fails with `TypeError: 'int' object is not callable`. Finally, do not turn every attribute into a property. A plain attribute is fine until you need a rule or a computed value, and switching to a property later does not change the code that reads it.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A leading underscore marks an attribute as private by convention, and Python does not enforce it. `@property` turns a method into a value you read without parentheses, for computed values or read-only access. A setter marked with `@name.setter` runs on every assignment, validates the value, and stores it in the private attribute.",
    },
    {
      type: "exercise",
      id: "properties-3",
      prompt:
        "Write a class Student whose __init__ takes name and grade. grade must be a property whose setter raises ValueError(\"grade must be from 0 to 100\") for a value below 0 or above 100, and stores valid values in self._grade. Add a read-only property letter that returns A for a grade of 90 or more, B for 80 or more, C for 70 or more, and F otherwise. The code at the bottom uses the class, so the output should be exactly four lines: Ada 95 A, then Ada 72 C, then Error: grade must be from 0 to 100, then 72",
      starterCode: `# write the Student class here


student = Student("Ada", 95)
print(student.name, student.grade, student.letter)
student.grade = 72
print(student.name, student.grade, student.letter)
try:
    student.grade = 105
except ValueError as error:
    print("Error:", error)
print(student.grade)
`,
      check: {
        type: "stdout-exact",
        expected: "Ada 95 A\nAda 72 C\nError: grade must be from 0 to 100\n72",
      },
      solution: `class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    @property
    def grade(self):
        return self._grade

    @grade.setter
    def grade(self, value):
        if not 0 <= value <= 100:
            raise ValueError("grade must be from 0 to 100")
        self._grade = value

    @property
    def letter(self):
        if self._grade >= 90:
            return "A"
        elif self._grade >= 80:
            return "B"
        elif self._grade >= 70:
            return "C"
        return "F"


student = Student("Ada", 95)
print(student.name, student.grade, student.letter)
student.grade = 72
print(student.name, student.grade, student.letter)
try:
    student.grade = 105
except ValueError as error:
    print("Error:", error)
print(student.grade)
`,
      hint: "Follow the Thermostat example: __init__ assigns self.grade = grade so the setter checks it, the grade property returns self._grade, and the setter stores self._grade. letter is a second @property with an if/elif chain that returns the letter.",
    },
  ],
};

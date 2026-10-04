export default {
  slug: "classes-and-oop",
  title: "Classes & Objects",
  unit: "Object-Oriented Python",
  blocks: [
    {
      type: "prose",
      body: "So far your programs have kept related information in separate variables or in a dictionary, with separate functions to work on it. A class lets you define a new type of value that carries its own data and its own functions together. Building a program out of such values is called object-oriented programming, or OOP for short.",
    },
    {
      type: "prose",
      body: "You have used this idea already. Every string is a value of the type `str`, and it brings methods such as `upper()` with it. In this lesson you define your own types, give them data, and give them methods.",
    },
    {
      type: "heading",
      text: "Classes and instances",
    },
    {
      type: "prose",
      body: "A class is a blueprint for a new type of value. You write the keyword `class`, a name, and a colon, then an indented body that describes what every value of that type holds and can do. Class names use CapWords style: each word starts with a capital letter and there are no underscores, as in `Dog` or `BankAccount`.",
    },
    {
      type: "prose",
      body: "A value built from a class is called an instance of that class, or an object. You create one by calling the class like a function, as in `Dog(\"Rex\", 3)`. Every call builds a new, separate instance.",
    },
    {
      type: "heading",
      text: "Setting up an instance with __init__",
    },
    {
      type: "prose",
      body: "Inside a class body you define functions with `def`, as usual. One function has a special name, `__init__`, with two underscores on each side. Python calls it automatically every time you create an instance, so it is where the new object gets its starting data.",
    },
    {
      type: "prose",
      body: "The first parameter of `__init__` is named `self`, and it refers to the new instance being set up. Python fills it in for you, so `Dog(\"Rex\", 3)` passes `\"Rex\"` to `name` and `3` to `age`. The line `self.name = name` stores a value on the instance. A value stored on an instance is called an attribute, and you read it with a dot, as in `rex.name`.",
    },
    {
      type: "example",
      code: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

rex = Dog("Rex", 3)
fido = Dog("Fido", 7)
print(rex.name, rex.age)
print(fido.name, fido.age)
rex.age = 4
print(rex.age, fido.age)
print(type(rex))`,
    },
    {
      type: "prose",
      body: "Each instance keeps its own attributes, so changing `rex.age` leaves `fido.age` alone. You can change an attribute from outside with ordinary assignment, as `rex.age = 4` shows. The last line reports the new type: `__main__` is the name Python gives to the program you are running, so it reads as the `Dog` class from your own program.",
    },
    {
      type: "heading",
      text: "Methods",
    },
    {
      type: "prose",
      body: "A function defined inside a class is called a method. Every method takes `self` as its first parameter, and you call it on an instance with a dot, as in `ada.introduce()`. Python passes the instance in as `self` automatically, so the method can read that instance's attributes, such as `self.name`.",
    },
    {
      type: "example",
      code: `class Student:
    def __init__(self, name, year):
        self.name = name
        self.year = year

    def introduce(self):
        print(f"Hi, I'm {self.name}, in year {self.year}")

    def greet(self, other_name):
        print(f"{self.name} says hello to {other_name}")

ada = Student("Ada", 2)
alan = Student("Alan", 3)
ada.introduce()
alan.introduce()
ada.greet("Grace")`,
    },
    {
      type: "prose",
      body: "`ada.introduce()` passes nothing between its parentheses, yet the method has one parameter, `self`, which Python fills with `ada`. `ada.greet(\"Grace\")` passes one value, which goes to `other_name`. The values you pass always fill the parameters after `self`.",
    },
    {
      type: "prose",
      body: "As in the Functions unit, the starter code below holds `pass`, the statement that does nothing, where your code goes. Replace it with your own line.",
    },
    {
      type: "exercise",
      id: "classes-and-oop-1",
      prompt:
        "The Dog class stores a name in __init__. Replace pass in the bark() method so that it prints the dog's name followed by says woof. The code at the bottom creates a Dog named Rex and calls bark(), so the output should be exactly: Rex says woof",
      starterCode: `class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        pass

rex = Dog("Rex")
rex.bark()
`,
      check: { type: "stdout-exact", expected: "Rex says woof" },
      solution: `class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        print(f"{self.name} says woof")

rex = Dog("Rex")
rex.bark()
`,
      hint: "Read the name with self.name inside the method. An f-string such as f\"{self.name} says woof\" builds the line.",
    },
    {
      type: "heading",
      text: "Methods that return or change values",
    },
    {
      type: "prose",
      body: "A method can return a value, just like any function. Returning is often more useful than printing, because the caller decides what to do with the result: print it, store it, or use it in a calculation. A method can also call another method of the same instance through `self`, as `describe()` does below with `self.area()`.",
    },
    {
      type: "prose",
      body: "A method can also change attributes. A line such as `self.width *= factor` inside a method updates the instance the method was called on, and the new value stays after the method finishes.",
    },
    {
      type: "example",
      code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def describe(self):
        return f"{self.width} by {self.height}, area {self.area()}"

    def scale(self, factor):
        self.width *= factor
        self.height *= factor

room = Rectangle(4, 3)
print(room.area())
print(room.perimeter())
print(room.describe())
room.scale(2)
print(room.describe())`,
    },
    {
      type: "exercise",
      id: "classes-and-oop-2",
      prompt:
        "Add a method to_fahrenheit() to the Temperature class. It returns the temperature in degrees Fahrenheit, which is the Celsius value times 9, divided by 5, plus 32. For example, Temperature(100).to_fahrenheit() returns 212.0 and Temperature(25).to_fahrenheit() returns 77.0.",
      starterCode: `class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    # add the to_fahrenheit method here
`,
      check: {
        type: "returns",
        cases: [
          { call: "Temperature(100).to_fahrenheit()", expected: "212.0" },
          { call: "Temperature(25).to_fahrenheit()", expected: "77.0" },
          { call: "Temperature(-40).to_fahrenheit()", expected: "-40.0" },
        ],
      },
      solution: `class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    def to_fahrenheit(self):
        return self.celsius * 9 / 5 + 32
`,
      hint: "Define it inside the class with def to_fahrenheit(self): and return self.celsius * 9 / 5 + 32.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Leaving `self` out of a method's parameters is the most common mistake. If `bark` is written as `def bark():`, then `rex.bark()` fails with `TypeError: Dog.bark() takes 0 positional arguments but 1 was given`. The one argument that was given is the instance, which Python passes in automatically.",
    },
    {
      type: "prose",
      body: "Inside a method, attributes are reached through `self`. Writing `name` instead of `self.name` looks for an ordinary variable and gives a `NameError`, and Python's message usually suggests `self.name`. Reading an attribute that was never set gives an `AttributeError`, such as `AttributeError: 'Dog' object has no attribute 'weight'`.",
    },
    {
      type: "prose",
      body: "Misspelling `__init__`, for example with one underscore on each side, means Python never calls it, so `Dog(\"Rex\")` fails with `TypeError: Dog() takes no arguments`. Forgetting the parentheses on a method call, as in `room.area`, does not run the method at all.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A class defines a new type, and each instance made from it holds its own attributes. `__init__` runs when an instance is created and stores its starting data on `self`. Methods are functions defined in the class that take `self` first; you call them on an instance with a dot, and they can print, return values, or change attributes.",
    },
    {
      type: "exercise",
      id: "classes-and-oop-3",
      prompt:
        "Write a class Player. Its __init__ takes a name, stores it in self.name, and sets self.score to 0. Add a method add_points(points) that adds points to the score, and a method summary() that returns the name, a colon and a space, the score, a space, and the word points, as in Ada: 15 points. The code at the bottom of the starter uses your class, so the output should be exactly two lines: Ada: 15 points and then Alan: 0 points",
      starterCode: `# write the Player class here


ada = Player("Ada")
alan = Player("Alan")
ada.add_points(10)
ada.add_points(5)
print(ada.summary())
print(alan.summary())
`,
      check: { type: "stdout-exact", expected: "Ada: 15 points\nAlan: 0 points" },
      solution: `class Player:
    def __init__(self, name):
        self.name = name
        self.score = 0

    def add_points(self, points):
        self.score += points

    def summary(self):
        return f"{self.name}: {self.score} points"


ada = Player("Ada")
alan = Player("Alan")
ada.add_points(10)
ada.add_points(5)
print(ada.summary())
print(alan.summary())
`,
      hint: "__init__ sets two attributes, but only the name comes from a parameter: the score starts as self.score = 0. In add_points(), use self.score += points. summary() returns an f-string built from self.name and self.score.",
    },
  ],
};

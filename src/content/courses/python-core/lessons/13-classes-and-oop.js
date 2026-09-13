export default {
  slug: "classes-and-oop",
  title: "Classes & Basic OOP",
  blocks: [
    {
      type: "prose",
      body: "A class is a blueprint for creating objects that bundle related data and behavior together. Define one with `class Person:`, then give it an `__init__` method — a special method Python calls automatically every time you create a new object from the class — to set up whatever data that object should start with. Every method inside a class, including `__init__`, takes `self` as its first parameter: `self` refers to the specific object the method is being called on, and Python passes it in automatically.",
    },
    {
      type: "prose",
      body: "Inside `__init__`, a line like `self.name = name` stores `name` as an attribute on the object — a piece of data that belongs to it and sticks around after `__init__` finishes running. Read or change that attribute later from any other method the same way: `self.name`.",
    },
    {
      type: "prose",
      body: "To create an object from a class, call the class name like a function: `Person(\"Ada\")` builds a new `Person` object, passing `\"Ada\"` in as the `name` argument to `__init__`. Each object created this way is called an instance, and it has its own independent copy of the attributes — creating a second `Person` doesn't affect the first one. Call a method on an instance with dot notation, `p.greet()`, and Python automatically passes `p` in as that method's `self`.",
    },
    {
      type: "example",
      code: `class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print(f"Hi, I'm {self.name}")

p = Person("Ada")
p.greet()`,
    },
    {
      type: "exercise",
      id: "classes-and-oop-1",
      prompt: "Define a class Dog with an __init__ that takes name and stores it as self.name, and a method bark() that prints \"{name} says woof\". Create a Dog named \"Rex\" and call bark() on it.",
      starterCode: `class Dog:
    # your code here
    pass
`,
      check: { type: "stdout-exact", expected: "Rex says woof" },
    },
  ],
};

export default {
  slug: "classes-and-oop",
  title: "Classes & Basic OOP",
  blocks: [
    {
      type: "prose",
      body: "Java's constructor — `public Person(String name) { this.name = name; }` — becomes Python's `__init__` method. Every instance method explicitly takes `self` as its first parameter; Python never hides it the way Java hides `this`.",
    },
    {
      type: "prose",
      body: "Attributes are set with `self.name = name` inside `__init__`, and read the same way everywhere else: `self.name`. There's no separate field-declaration section like a Java class body has.",
    },
    {
      type: "prose",
      body: "Creating an instance drops the `new` keyword entirely — Java's `new Person(\"Ada\")` is just `Person(\"Ada\")` in Python.",
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

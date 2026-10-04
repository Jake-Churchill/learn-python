export default {
  slug: "review-oop",
  title: "Review: Object-Oriented Python",
  unit: "Object-Oriented Python",
  blocks: [
    {
      type: "prose",
      body: "This review brings the Object-Oriented Python unit together with everything before it: functions, comprehensions, error handling, and files. Each exercise asks you to design a small class, or a few cooperating ones, and use it in a short program.",
    },
    {
      type: "heading",
      text: "Objects with the rest of Python",
    },
    {
      type: "prose",
      body: "Objects fit into everything you already know. A list can hold objects, a comprehension can build one value from each object, and `sorted()`, `min()`, and `max()` with a `key` can order objects by any attribute or method. Inside a method you can use `math`, loops, and dictionaries as in any other function.",
    },
    {
      type: "example",
      code: `import math

class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

    def __repr__(self):
        return f"Circle({self.radius})"

circles = [Circle(3), Circle(1), Circle(2)]
areas = [round(circle.area(), 1) for circle in circles]
print(areas)
print(sorted(circles, key=lambda circle: circle.radius))
print(max(circles, key=lambda circle: circle.area()))`,
    },
    {
      type: "exercise",
      id: "review-oop-1",
      prompt:
        "math is already imported. Add a method area() to the Circle class that returns int(math.pi * self.radius ** 2), the area with its decimal part dropped. Then write a function areas(radii) that uses a list comprehension to return a list of the areas of circles with the given radii, in the same order. For example, Circle(2).area() returns 12 and areas([1, 2, 3]) returns [3, 12, 28].",
      starterCode: `import math

class Circle:
    def __init__(self, radius):
        self.radius = radius

    # add area() here


# write areas(radii) here
`,
      check: {
        type: "returns",
        cases: [
          { call: "Circle(2).area()", expected: "12" },
          { call: "Circle(10).area()", expected: "314" },
          { call: "areas([1, 2, 3])", expected: "[3, 12, 28]" },
          { call: "areas([])", expected: "[]" },
        ],
      },
      solution: `import math

class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return int(math.pi * self.radius ** 2)


def areas(radii):
    return [Circle(radius).area() for radius in radii]
`,
      hint: "area() is one line: return int(math.pi * self.radius ** 2). In areas(), build a Circle for each radius and call area() on it: [Circle(radius).area() for radius in radii].",
    },
    {
      type: "heading",
      text: "Loading objects from a file",
    },
    {
      type: "prose",
      body: "Programs often build objects from text, with one line of a file becoming one object. A class method is a tidy place for the parsing, and `try` with `except` lets the program skip a bad line instead of crashing. The example writes its own small file first, because no file exists until a program creates one.",
    },
    {
      type: "example",
      code: `from dataclasses import dataclass

@dataclass
class Expense:
    category: str
    amount: float

    @classmethod
    def from_line(cls, line):
        category, amount = line.strip().split(",")
        return cls(category, float(amount))

with open("expenses.csv", "w") as file:
    file.write("food,12.50\\nrent,800\\nfood,oops\\nfun,30\\n")

expenses = []
with open("expenses.csv") as file:
    for line in file:
        try:
            expenses.append(Expense.from_line(line))
        except ValueError:
            print("Skipped:", line.strip())

print(expenses[0])
print(sum(expense.amount for expense in expenses))`,
    },
    {
      type: "exercise",
      id: "review-oop-2",
      prompt:
        "The starter writes scores.txt, with one name and score per line, separated by a comma. Write a dataclass Score with the fields name (a str) and points (an int). Read the file line by line and build a Score from each line; when the points part is not a whole number, int() raises ValueError, so catch it and print Skipped: followed by the stripped line. Then print the scores from highest to lowest, numbered from 1, in the form 1. Alan 95. The output should be exactly four lines: Skipped: Grace,x, then 1. Alan 95, then 2. Ada 88, then 3. Linus 72",
      starterCode: `from dataclasses import dataclass

with open("scores.txt", "w") as file:
    file.write("Ada,88\\nAlan,95\\nGrace,x\\nLinus,72\\n")

# write the Score dataclass, read the file, and print the ranking
`,
      check: {
        type: "stdout-exact",
        expected: "Skipped: Grace,x\n1. Alan 95\n2. Ada 88\n3. Linus 72",
      },
      solution: `from dataclasses import dataclass

with open("scores.txt", "w") as file:
    file.write("Ada,88\\nAlan,95\\nGrace,x\\nLinus,72\\n")

@dataclass
class Score:
    name: str
    points: int

scores = []
with open("scores.txt") as file:
    for line in file:
        name, points = line.strip().split(",")
        try:
            scores.append(Score(name, int(points)))
        except ValueError:
            print("Skipped:", line.strip())

ranked = sorted(scores, key=lambda score: score.points, reverse=True)
for rank, score in enumerate(ranked, start=1):
    print(f"{rank}. {score.name} {score.points}")
`,
      hint: "Inside the loop, split line.strip() on the comma into name and points, then put Score(name, int(points)) inside try. For the ranking, sort with key=lambda score: score.points and reverse=True, and number the lines with enumerate(..., start=1).",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Most bugs in object-oriented code come from a few slips covered in this unit: a missing `self` parameter, a method that prints when it should return, a list created as a class attribute instead of in `__init__`, and a forgotten `super().__init__()`. When an error mentions an attribute, check where that attribute is set. When a value comes back as `None`, check whether the method returns anything.",
    },
    {
      type: "prose",
      body: "Design choices matter too. Choose a dataclass when an object mostly holds data, and a regular class when it needs rules, such as validation in a property setter. Use inheritance only for true is-a relationships and composition for has-a ones.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A class bundles data and behavior, and its instances work with lists, comprehensions, sorting, and files like any other value. Special methods connect objects to Python's operators, properties guard their data, and custom exceptions name their problems. Inheritance and composition combine classes, and dataclasses remove the repetitive setup code.",
    },
    {
      type: "exercise",
      id: "review-oop-3",
      prompt:
        "Write an exception class CourseFullError that is a subclass of Exception, and a class Course. Course's __init__ takes a name and a capacity and creates an empty list of students. enroll(student) appends the student, or raises CourseFullError with the message Python 101 is full (the course name followed by is full) when the course already holds capacity students. Add __len__ returning the number of students, a read-only property spaces_left returning capacity minus the number of students, and __str__ returning the name, a colon, and the count over the capacity, as in Python 101: 2/2 students. The code at the bottom uses the class, so the output should be exactly six lines: Enrolled Ada, then Enrolled Alan, then Error: Python 101 is full, then 2, then 0, then Python 101: 2/2 students",
      starterCode: `# write CourseFullError and Course here


course = Course("Python 101", 2)
for name in ["Ada", "Alan", "Grace"]:
    try:
        course.enroll(name)
        print("Enrolled", name)
    except CourseFullError as error:
        print("Error:", error)
print(len(course))
print(course.spaces_left)
print(course)
`,
      check: {
        type: "stdout-exact",
        expected:
          "Enrolled Ada\nEnrolled Alan\nError: Python 101 is full\n2\n0\nPython 101: 2/2 students",
      },
      solution: `class CourseFullError(Exception):
    pass

class Course:
    def __init__(self, name, capacity):
        self.name = name
        self.capacity = capacity
        self.students = []

    def enroll(self, student):
        if len(self.students) >= self.capacity:
            raise CourseFullError(f"{self.name} is full")
        self.students.append(student)

    def __len__(self):
        return len(self.students)

    @property
    def spaces_left(self):
        return self.capacity - len(self.students)

    def __str__(self):
        return f"{self.name}: {len(self.students)}/{self.capacity} students"


course = Course("Python 101", 2)
for name in ["Ada", "Alan", "Grace"]:
    try:
        course.enroll(name)
        print("Enrolled", name)
    except CourseFullError as error:
        print("Error:", error)
print(len(course))
print(course.spaces_left)
print(course)
`,
      hint: "In enroll(), check len(self.students) >= self.capacity before appending, and raise CourseFullError(f\"{self.name} is full\") when it is true. spaces_left needs @property above it, and __str__ returns an f-string built from the name, the number of students, and the capacity.",
    },
  ],
};

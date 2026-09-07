export default {
  slug: "review-modules-classes-comprehensions",
  title: "Review: Modules, Classes & Comprehensions",
  blocks: [
    {
      type: "prose",
      body: "One more combination before you're through the whole course: imports, classes, and list comprehensions together — the kind of code you'll actually write once you start building real programs.",
    },
    {
      type: "example",
      code: `import math

class Square:
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2

sides = [2, 3, 4]
areas = [Square(s).area() for s in sides]
print(areas)
print(round(math.sqrt(sum(areas)), 2))`,
    },
    {
      type: "exercise",
      id: "review-modules-classes-comprehensions-1",
      prompt:
        "math is already imported. Define a class Circle with __init__(self, radius) storing self.radius, and a method area(self) that returns int(math.pi * self.radius ** 2). Then use a list comprehension over radii to build a list of areas, and print it.",
      starterCode: `import math

radii = [1, 2, 3]
`,
      check: { type: "stdout-exact", expected: "[3, 12, 28]" },
    },
  ],
};

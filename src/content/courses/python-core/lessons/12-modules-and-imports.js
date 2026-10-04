export default {
  slug: "modules-and-imports",
  title: "Modules & Imports",
  unit: "Modules & Standard Library",
  blocks: [
    {
      type: "prose",
      body: "Python comes with hundreds of ready-made tools, for math, dates, random numbers, and much more, but a program starts without them. You ask for the ones you need with `import`. This lesson explains what it does, the ways to write it, and how Python finds what you ask for.",
    },
    {
      type: "heading",
      text: "What a module is",
    },
    {
      type: "prose",
      body: "A module is a file of Python code, with a name ending in `.py`, whose variables, functions, and classes other programs can reuse. The modules that come with Python make up the standard library, and `math` is one of them.",
    },
    {
      type: "prose",
      body: "`import math` finds the `math` module, runs its code, and stores it in a variable named `math`. That variable holds a module object, whose attributes are everything the module defines. You reach them with a dot: `math.sqrt` is the `sqrt` function inside `math`.",
    },
    {
      type: "example",
      code: `import math

print(math.sqrt(81))
print(math.ceil(4.2))
print(math.pi)
print(type(math))`,
    },
    {
      type: "prose",
      body: "`math.ceil()` rounds up to the next whole number, and the last line shows that `math` is a value with its own type, `module`.",
    },
    {
      type: "exercise",
      id: "modules-and-imports-1",
      prompt: "Import the math module, then print the result of math.floor(7.9). The output should be exactly: 7",
      starterCode: `# import the math module on the first line

# then print math.floor(7.9)
`,
      check: { type: "stdout-exact", expected: "7" },
      solution: `import math

print(math.floor(7.9))
`,
      hint: "Write import math on the first line. Then call math.floor(7.9) inside print().",
    },
    {
      type: "heading",
      text: "Importing names directly",
    },
    {
      type: "prose",
      body: "The form `from math import sqrt` copies one name out of the module into your program, so you can write `sqrt(81)` with no `math.` prefix. To bring in several names, separate them with commas: `from math import sqrt, pi`.",
    },
    {
      type: "prose",
      body: "This form does not create a variable named `math`; only the names you listed exist. Both styles are common: the prefix shows where each name came from, and the direct form keeps code short.",
    },
    {
      type: "example",
      code: `from math import sqrt, pi

radius = 2
print(sqrt(16))
print(round(pi * radius ** 2, 2))`,
    },
    {
      type: "heading",
      text: "Renaming with as",
    },
    {
      type: "prose",
      body: "Adding `as` gives an imported module or name a different name in your program: `import math as m` makes the module available as `m`, and `from math import floor as round_down` brings in `floor` as `round_down`.",
    },
    {
      type: "prose",
      body: "Renaming helps when a module's name is long, or when an imported name would clash with one of your own. Below, the program uses `floor` as a variable for a building floor, so it imports the function as `round_down` and both can exist.",
    },
    {
      type: "example",
      code: `import math as m
from math import floor as round_down

print(m.sqrt(64))
floor = 3
print("Lift going to floor", floor)
print(round_down(19.75))`,
    },
    {
      type: "heading",
      text: "Exploring a module with dir and help",
    },
    {
      type: "prose",
      body: "The built-in function `dir()` takes a module and gives back a list of the names inside it, in alphabetical order. Names starting with an underscore are for Python's own use, so the example skips them. Many of the rest are advanced math terms, but you will recognize `ceil`, `floor`, `pi`, and `sqrt`.",
    },
    {
      type: "prose",
      body: "`help()` takes a function, or any other value, and prints its documentation: a short description written by whoever made it. Pass the function itself, without parentheses after its name.",
    },
    {
      type: "example",
      code: `import math

public = [name for name in dir(math) if not name.startswith("_")]
print(public)
help(math.ceil)`,
    },
    {
      type: "prose",
      body: "The line `ceil(x, /)` shows how to call the function: it takes one value, `x`, and the `/` means `x` must be passed by position, not by name. Integral is a math word for a whole number.",
    },
    {
      type: "exercise",
      id: "modules-and-imports-2",
      prompt:
        "This program stops with NameError: name 'sqrt' is not defined, because import math does not create the names sqrt and floor on their own. Change only the import line, using from … import, so the program prints exactly two lines: 7.0 and then 2",
      starterCode: `import math

print(sqrt(49))
print(floor(2.5))
`,
      check: { type: "stdout-exact", expected: "7.0\n2" },
      solution: `from math import sqrt, floor

print(sqrt(49))
print(floor(2.5))
`,
      hint: "Replace the first line with from math import followed by the two names the program uses, separated by a comma.",
    },
    {
      type: "heading",
      text: "Your own modules",
    },
    {
      type: "prose",
      body: "Any `.py` file is a module. If you save functions in `temperature.py`, another program in the same folder can write `import temperature` and call them with `temperature.` in front. Splitting a long program into files keeps each one short and lets programs share code.",
    },
    {
      type: "prose",
      body: "This site has a single code box, so the next example creates the second file itself with `open()` and `write()`. The text it writes is Python code inside a triple-quoted string. Once the file exists, `import` can find it.",
    },
    {
      type: "example",
      code: `code = '''
def to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32

print("Inside temperature.py, __name__ is", __name__)
'''

with open("temperature.py", "w") as file:
    file.write(code)

import temperature

print(temperature.to_fahrenheit(100))
print("In the main program, __name__ is", __name__)`,
    },
    {
      type: "heading",
      text: "Running a file directly",
    },
    {
      type: "prose",
      body: "Importing a module runs every line in it. That is how its functions get defined, but any `print()` calls in the file run too, as the first line of output shows. You rarely want a module to print test results whenever another program imports it.",
    },
    {
      type: "prose",
      body: "Python gives every module a variable called `__name__`. When a file is imported, its `__name__` holds the module's name, such as `\"temperature\"`. When a file is run directly, its `__name__` is `\"__main__\"`. So code inside `if __name__ == \"__main__\":` runs when you run the file yourself and is skipped when another program imports it.",
    },
    {
      type: "example",
      code: `code = '''
def to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32

if __name__ == "__main__":
    print("Testing:", to_fahrenheit(0))
'''

with open("temperature.py", "w") as file:
    file.write(code)

import temperature

print(temperature.to_fahrenheit(37))`,
    },
    {
      type: "prose",
      body: "The test line did not run, because inside `temperature.py` the name was `\"temperature\"`.",
    },
    {
      type: "heading",
      text: "How Python finds modules",
    },
    {
      type: "prose",
      body: "When a program imports a module, Python first checks whether the program already imported it. If so, Python reuses it, so a module's code runs only once, however many times it is imported.",
    },
    {
      type: "prose",
      body: "Otherwise, Python searches the folders listed in `sys.path`, in order, for a file with a matching name. `sys.path` lives in the `sys` module. Its first entry is the program's own folder, shown here as an empty string, which means the current folder. The next entries hold the standard library, and the last holds add-on packages.",
    },
    {
      type: "example",
      code: `import sys

print(sys.path)`,
    },
    {
      type: "prose",
      body: "If no folder holds the module, the import fails with an error such as `ModuleNotFoundError: No module named 'maths'`.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Naming your own file after a standard module causes confusing errors. When you run files on your own computer, a file called `random.py` in your program's folder is found before the real `random` module, because that folder is searched first, so the functions you expected seem to be missing. Give your files names that no standard module uses.",
    },
    {
      type: "prose",
      body: "Mixing up the two import styles is the other common mistake. After `import math`, write `math.sqrt()`, because plain `sqrt()` gives `NameError: name 'sqrt' is not defined`. After `from math import sqrt`, write `sqrt()`, because the name `math` does not exist.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A module is a `.py` file whose names other programs can reuse, and the modules that come with Python form the standard library. `import math` gives you the module, `from math import sqrt` copies names out of it, and `as` renames either one. `dir()` lists a module's names, `help()` prints documentation, and Python looks for modules in the folders of `sys.path`. Code under `if __name__ == \"__main__\":` runs only when the file is run directly.",
    },
    {
      type: "exercise",
      id: "modules-and-imports-3",
      prompt:
        "The starter writes a module file units.py containing a function km_to_miles(km) and a test line, print(km_to_miles(1)), that runs on every import. First, inside the module code, move the test line under an if __name__ == \"__main__\": check, so it runs only when units.py is run directly. Then, at the end of the program, import the module under the shorter name u and print u.km_to_miles(10). With the test line guarded, the import prints nothing, so the output should be exactly one line: 6.21",
      starterCode: `module_code = '''
def km_to_miles(km):
    return round(km * 0.621371, 2)

# move this test line under an if __name__ == "__main__": check
print(km_to_miles(1))
'''

with open("units.py", "w") as file:
    file.write(module_code)

# import units as u, then print u.km_to_miles(10)
`,
      check: { type: "stdout-exact", expected: "6.21" },
      solution: `module_code = '''
def km_to_miles(km):
    return round(km * 0.621371, 2)

if __name__ == "__main__":
    print(km_to_miles(1))
'''

with open("units.py", "w") as file:
    file.write(module_code)

import units as u

print(u.km_to_miles(10))
`,
      hint: "Inside the triple-quoted string, write the if __name__ == \"__main__\": line just above the test line, then indent the test line under it. After the with block, write import units as u, then call u.km_to_miles(10) inside print().",
    },
  ],
};

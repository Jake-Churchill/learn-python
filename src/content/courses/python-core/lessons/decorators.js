export default {
  slug: "decorators",
  title: "Decorators",
  unit: "Writing Better Python",
  blocks: [
    {
      type: "prose",
      body: "Since the classes unit you have written lines such as `@classmethod`, `@property`, and `@dataclass` above a definition and called them markers. Their proper name is decorators. A decorator takes the function or class defined below it and returns a changed version, and the ones you write yourself are ordinary functions. They let you add the same behavior, such as printing a line on every call, to many functions without editing each one.",
    },
    {
      type: "heading",
      text: "Functions inside functions",
    },
    {
      type: "prose",
      body: "A `def` can sit inside another function's body. The inner function is created each time the outer function runs. Because functions are values, the outer function can return the inner one, and the caller can store it and call it later.",
    },
    {
      type: "prose",
      body: "The inner function can use the outer function's parameters and variables, and it keeps that access after the outer call has ended. Below, `make_greeting()` has already returned when `say_hello()` runs, yet the inner function still remembers that `greeting` was `\"Hello\"`. Each call to `make_greeting()` creates a separate inner function with its own remembered value.",
    },
    {
      type: "example",
      code: `def make_greeting(greeting):
    def greet(name):
        return f"{greeting}, {name}!"
    return greet

say_hello = make_greeting("Hello")
say_hi = make_greeting("Hi")
print(say_hello("Ada"))
print(say_hi("Alan"))`,
    },
    {
      type: "heading",
      text: "Functions that wrap functions",
    },
    {
      type: "prose",
      body: "A wrapper is a function that calls another function and adds something before or after it. A decorator is a function that takes a function as its argument and returns a wrapper around it. The wrapper is an inner function, so it remembers the function it wraps.",
    },
    {
      type: "example",
      code: `def announce(func):
    def wrapper():
        print("Starting")
        func()
        print("Finished")
    return wrapper

def make_tea():
    print("Boiling water")

make_tea = announce(make_tea)
make_tea()`,
    },
    {
      type: "prose",
      body: "The line `make_tea = announce(make_tea)` passes the original function to `announce()` and stores the returned wrapper under the old name. Calling `make_tea()` now runs the wrapper, which prints its lines around a call to the original.",
    },
    {
      type: "heading",
      text: "The @ line",
    },
    {
      type: "prose",
      body: "Writing `@announce` on the line directly above `def make_tea():` does exactly what that assignment did. Python creates the function, passes it to the decorator, and stores whatever the decorator returns under the function's name. This is called decorating the function, and one decorator can serve many functions.",
    },
    {
      type: "example",
      code: `def announce(func):
    def wrapper():
        print("Starting")
        func()
        print("Finished")
    return wrapper

@announce
def make_tea():
    print("Boiling water")

@announce
def make_toast():
    print("Heating bread")

make_tea()
make_toast()`,
    },
    {
      type: "prose",
      body: "That is all the markers have been doing. `@classmethod` and `@property` receive the method you wrote and return a new object built around it, and `@dataclass` receives the class and returns it with `__init__` and other methods added. When a decorator line has parentheses, as in `@dataclass(frozen=True)`, Python first makes that call, and its result is the decorator that gets applied.",
    },
    {
      type: "exercise",
      id: "decorators-1",
      prompt:
        "The decorator shout(func) should make a decorated function return its result in capital letters. Replace pass in wrapper so it calls func with text and returns that result converted with upper(). Then greet(\"ada\") returns 'HELLO, ADA' and farewell(\"Alan\") returns 'GOODBYE, ALAN'.",
      starterCode: `def shout(func):
    def wrapper(text):
        # call func with text and return its result in capital letters
        pass
    return wrapper

@shout
def greet(name):
    return f"hello, {name}"

@shout
def farewell(name):
    return f"goodbye, {name}"
`,
      check: {
        type: "returns",
        cases: [
          { call: 'greet("ada")', expected: "'HELLO, ADA'" },
          { call: 'farewell("Alan")', expected: "'GOODBYE, ALAN'" },
        ],
      },
      solution: `def shout(func):
    def wrapper(text):
        return func(text).upper()
    return wrapper

@shout
def greet(name):
    return f"hello, {name}"

@shout
def farewell(name):
    return f"goodbye, {name}"
`,
      hint: "Call the original as func(text), then call upper() on its result: return func(text).upper().",
    },
    {
      type: "heading",
      text: "Wrapping any function",
    },
    {
      type: "prose",
      body: "The wrappers so far take a fixed number of arguments, so they fit only matching functions. To wrap any function, give the wrapper `*args` and `**kwargs`, pass them straight on with `func(*args, **kwargs)`, and return the result.",
    },
    {
      type: "prose",
      body: "Logging means recording what a program does while it runs, such as which functions it called and with what arguments. Every function has a `__name__` attribute holding its name as a string, which keeps a log readable.",
    },
    {
      type: "example",
      code: `def log_calls(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with {args} {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

@log_calls
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

total = add(3, 4)
message = greet("Ada", greeting="Hi")
print(total, message)
print(add.__name__)`,
    },
    {
      type: "heading",
      text: "Keeping the name with functools.wraps",
    },
    {
      type: "prose",
      body: "The logging example's last line shows a problem: `add` now refers to the wrapper, so `add.__name__` is `'wrapper'`. Every function decorated this way reports that same wrong name, for example in `help()`.",
    },
    {
      type: "prose",
      body: "The `functools` module provides the fix, `wraps`. Writing `@wraps(func)` directly above `def wrapper` copies the original function's name, and a few other details, onto the wrapper. Like `@dataclass(frozen=True)`, it is called with an argument first, and the result decorates the wrapper.",
    },
    {
      type: "heading",
      text: "Timing a function",
    },
    {
      type: "prose",
      body: "A timing decorator measures how long each call takes. `time.perf_counter()`, from the `time` module, returns a count of seconds from a fixed starting point, so subtracting a reading taken before the call from one taken after gives the time in between. The exact time changes on every run, so this example only reports whether the call took under a second. Thanks to `@wraps(func)`, its last line prints the real name.",
    },
    {
      type: "example",
      code: `import time
from functools import wraps

def timed(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        if elapsed < 1:
            print(f"{func.__name__} took under a second")
        else:
            print(f"{func.__name__} took a second or more")
        return result
    return wrapper

@timed
def total_up_to(n):
    return sum(range(n + 1))

print(total_up_to(100000))
print(total_up_to.__name__)`,
    },
    {
      type: "heading",
      text: "Caching with functools.lru_cache",
    },
    {
      type: "prose",
      body: "Caching means saving a function's results, so that a repeated call with the same arguments returns the saved result instead of running the body again. `functools.lru_cache` is a ready-made caching decorator. LRU stands for least recently used: once the cache holds 128 results, it discards the one used longest ago.",
    },
    {
      type: "prose",
      body: "The body prints a line each time it actually runs, and the second call with 4 skips it. `cache_info()` reports hits, the calls answered from the cache, misses, the calls that ran the body, and `currsize`, how many results are saved.",
    },
    {
      type: "example",
      code: `from functools import lru_cache

@lru_cache
def slow_square(n):
    print(f"Computing {n}")
    return n * n

print(slow_square(4))
print(slow_square(4))
print(slow_square(5))
print(slow_square.cache_info())`,
    },
    {
      type: "prose",
      body: "Without the cache, the recursive `fib(80)` below would make tens of quadrillions of calls, recomputing the same smaller values. With it, each value from 0 to 80 is computed once.",
    },
    {
      type: "example",
      code: `from functools import lru_cache

@lru_cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(80))
print(fib.cache_info())`,
    },
    {
      type: "prose",
      body: "Cache only functions that always return the same result for the same arguments, because a cached call never runs the body again. Every argument must be a value that could be a dictionary key, such as a number, a string, or a tuple; passing a list raises `TypeError: unhashable type: 'list'`.",
    },
    {
      type: "exercise",
      id: "decorators-2",
      prompt:
        "km_from_london(city) prints a line each time its body runs. The code at the bottom asks for Paris twice and Rome once. Import lru_cache from functools and decorate km_from_london with it, so the body runs only once per city. The output should be exactly five lines: Looking up Paris, then 344, then 344, then Looking up Rome, then 1434",
      starterCode: `# import lru_cache here

def km_from_london(city):
    print(f"Looking up {city}")
    distances = {"Paris": 344, "Rome": 1434, "Berlin": 932}
    return distances[city]

print(km_from_london("Paris"))
print(km_from_london("Paris"))
print(km_from_london("Rome"))
`,
      check: {
        type: "stdout-exact",
        expected: "Looking up Paris\n344\n344\nLooking up Rome\n1434",
      },
      solution: `from functools import lru_cache

@lru_cache
def km_from_london(city):
    print(f"Looking up {city}")
    distances = {"Paris": 344, "Rome": 1434, "Berlin": 932}
    return distances[city]

print(km_from_london("Paris"))
print(km_from_london("Paris"))
print(km_from_london("Rome"))
`,
      hint: "Write from functools import lru_cache on the first line, and @lru_cache on the line directly above def km_from_london(city):.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting `return wrapper` at the end of a decorator is the most common mistake. The decorator then returns `None`, the function's name holds `None`, and calling it fails with `TypeError: 'NoneType' object is not callable`. Forgetting `return` inside the wrapper is quieter: the decorated function runs but always returns `None`.",
    },
    {
      type: "prose",
      body: "Adding parentheses to a decorator that takes no arguments is another. `@announce()` calls `announce` without a function and fails with `TypeError: announce() missing 1 required positional argument: 'func'`. Write `@announce`, and keep parentheses for decorators such as `@wraps(func)` that are meant to be called first.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "A decorator is a function that takes a function and returns a replacement, usually an inner wrapper that remembers the original and calls it with `*args` and `**kwargs`. Writing `@name` above a `def` is shorthand for `func = name(func)`. `@wraps(func)` keeps the original name on the wrapper, and `@lru_cache` saves results so repeated calls skip the work.",
    },
    {
      type: "exercise",
      id: "decorators-3",
      prompt:
        "Write a decorator non_negative(func). Its wrapper accepts any number of positional arguments. If any of them is below 0, it raises ValueError(\"arguments must not be negative\"); otherwise it returns the result of calling func with them. Use @wraps(func) so the decorated function keeps its name. The starter decorates area(width, height), so area(3, 4) returns 12, area(-1, 4) raises that ValueError, and area.__name__ is 'area'.",
      starterCode: `from functools import wraps

# write the non_negative decorator here


@non_negative
def area(width, height):
    return width * height
`,
      check: {
        type: "returns",
        cases: [
          { call: "area(3, 4)", expected: "12" },
          { call: "area(0, 5)", expected: "0" },
          { call: "area(-1, 4)", expected: "raised ValueError: arguments must not be negative" },
          { call: "area(2, -3)", expected: "raised ValueError: arguments must not be negative" },
          { call: "area.__name__", expected: "'area'" },
        ],
      },
      solution: `from functools import wraps

def non_negative(func):
    @wraps(func)
    def wrapper(*args):
        if any(arg < 0 for arg in args):
            raise ValueError("arguments must not be negative")
        return func(*args)
    return wrapper


@non_negative
def area(width, height):
    return width * height
`,
      hint: "Follow the shape of the timed decorator: an inner wrapper marked with @wraps(func), returned at the end. Inside the wrapper, any() over the arguments can tell you whether one is negative before you decide whether to raise or to call func.",
    },
  ],
};

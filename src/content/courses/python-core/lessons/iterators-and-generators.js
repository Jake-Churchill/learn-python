export default {
  slug: "iterators-and-generators",
  title: "Iterators & Generators",
  unit: "Comprehensions & Iteration",
  blocks: [
    {
      type: "prose",
      body: "A `for` loop works on lists, strings, tuples, sets, dictionaries, and ranges. This lesson shows the mechanism behind that: each of them can hand out its items one at a time. You will also write your own sources of items, called generators, which produce each value only when it is asked for.",
    },
    {
      type: "heading",
      text: "Iterables and iterators",
    },
    {
      type: "prose",
      body: "An iterable is any value you can loop over with `for`. Lists, strings, tuples, sets, dictionaries, and ranges are all iterables. An iterator is the value that does the handing out: it gives you one item at a time and remembers its place between items.",
    },
    {
      type: "prose",
      body: "The built-in function `iter()` takes an iterable and gives back an iterator for it. The function `next()` takes an iterator and gives back its next item. Each call to `next()` moves the iterator one step forward, and there is no way to step back.",
    },
    {
      type: "example",
      code: `queue = ["Ada", "Grace", "Alan"]
waiting = iter(queue)
print(next(waiting))
print(next(waiting))
print(next(waiting))
print(next(waiting, "Nobody left"))
print(queue)`,
    },
    {
      type: "prose",
      body: "When an iterator has run out, calling `next()` stops the program with an error that names `StopIteration`. Giving `next()` a second value, as on the second-to-last line, makes it give back that value instead. The list itself is untouched, because the iterator only reads it.",
    },
    {
      type: "prose",
      body: "This is exactly what a `for` loop does. It calls `iter()` on whatever you loop over, then calls `next()` again and again, running the body once per item. When `StopIteration` arrives, the loop ends quietly instead of stopping the program.",
    },
    {
      type: "exercise",
      id: "iterators-and-generators-1",
      prompt:
        "The first ticket is already printed with next(). Add three more print() calls that use next() on tickets, giving the last one the default \"Sold out\", so the output is exactly four lines: Seat A1, then Seat A2, then Seat A3, then Sold out",
      starterCode: `seats = ["Seat A1", "Seat A2", "Seat A3"]
tickets = iter(seats)
print(next(tickets))
# add three more lines that call next(tickets)
`,
      check: { type: "stdout-exact", expected: "Seat A1\nSeat A2\nSeat A3\nSold out" },
      solution: `seats = ["Seat A1", "Seat A2", "Seat A3"]
tickets = iter(seats)
print(next(tickets))
print(next(tickets))
print(next(tickets))
print(next(tickets, "Sold out"))
`,
      hint: "Copy the print(next(tickets)) line twice. On the last line, pass \"Sold out\" to next() as a second value, after tickets.",
    },
    {
      type: "heading",
      text: "Iterators get used up",
    },
    {
      type: "prose",
      body: "An iterator can be read only once. After it has handed out its last item, looping over it again gives nothing, because it is still at the end. An iterable such as a list is different: every `for` loop over it starts a fresh iterator from the beginning.",
    },
    {
      type: "prose",
      body: "`zip()`, `enumerate()`, `reversed()`, `map()`, and `filter()` all give back iterators, not lists. That is why printing one shows a short description instead of its items, and why `list()` is needed to see them all at once. It also means you can use each result only once.",
    },
    {
      type: "example",
      code: `names = ["Ada", "Grace"]
scores = [92, 88]
pairs = zip(names, scores)
print(list(pairs))
print(list(pairs))

for name in names:
    print(name)
for name in names:
    print(name)`,
    },
    {
      type: "heading",
      text: "Generator functions and yield",
    },
    {
      type: "prose",
      body: "A generator function is a function that contains the word `yield`. Calling it does not run its body. Instead, it gives back a generator, which is an iterator whose items come from the function's own code.",
    },
    {
      type: "prose",
      body: "Each time the generator is asked for an item, the function runs until it reaches a `yield`. The value after `yield` is handed out, and the function pauses right there, keeping all its variables. The next request resumes it on the line after that `yield`, and when the function reaches its end, the generator is used up.",
    },
    {
      type: "example",
      code: `def three_steps():
    print("Starting")
    yield 1
    print("Resuming")
    yield 2
    print("Finishing")

steps = three_steps()
print("Generator created")
print(next(steps))
print(next(steps))
print(next(steps, "Used up"))`,
    },
    {
      type: "prose",
      body: "Nothing inside the function ran until the first `next()`. Usually you will not call `next()` yourself; you loop over the generator with `for`, or pass it to `list()`. A loop inside a generator function can yield as many values as it likes.",
    },
    {
      type: "example",
      code: `def countdown(start):
    while start > 0:
        yield start
        start -= 1

for number in countdown(3):
    print(number)
print("Liftoff!")
print(list(countdown(5)))`,
    },
    {
      type: "exercise",
      id: "iterators-and-generators-2",
      prompt:
        "Write a generator function running_totals(amounts) that yields the running total after each amount: the first amount, then the first two added together, and so on. For example, list(running_totals([5, 10, 3])) gives [5, 15, 18]. It must yield each total, not return a list.",
      starterCode: `def running_totals(amounts):
    total = 0
    for amount in amounts:
        # add amount to total, then yield the total
        pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "list(running_totals([5, 10, 3]))", expected: "[5, 15, 18]" },
          { call: "next(running_totals([7, 1]))", expected: "7" },
          { call: "list(running_totals([]))", expected: "[]" },
        ],
      },
      solution: `def running_totals(amounts):
    total = 0
    for amount in amounts:
        total += amount
        yield total
`,
      hint: "Inside the loop, add the amount with total += amount, then write yield total on the next line.",
    },
    {
      type: "heading",
      text: "Generator expressions and lazy evaluation",
    },
    {
      type: "prose",
      body: "A generator expression is a comprehension written in parentheses: `(n * n for n in numbers)`. It looks like a list comprehension, but instead of building a list it gives back a generator. The generator works out each value only when something asks for it.",
    },
    {
      type: "prose",
      body: "Working out values only when they are needed is called lazy evaluation. A list comprehension is eager: it computes every item at once and keeps them all in memory. A generator keeps only its place, so it needs the same small amount of memory whether it will produce ten values or ten million.",
    },
    {
      type: "example",
      code: `def shout(word):
    print("Shouting", word)
    return word.upper()

words = ["tea", "jam", "toast"]
eager = [shout(word) for word in words]
print("List built:", eager)

lazy = (shout(word) for word in words)
print("Generator built")
print(next(lazy))
for loud in lazy:
    print(loud)`,
    },
    {
      type: "prose",
      body: "The list comprehension called `shout()` three times before the list was printed. The generator expression called it once per request, and the `for` loop picked up where `next()` left off. Because a generator stores no items, it can even be endless, as long as the code using it stops asking.",
    },
    {
      type: "example",
      code: `def ticket_numbers():
    number = 1
    while True:
        yield number
        number += 1

for ticket in ticket_numbers():
    if ticket > 4:
        break
    print("Ticket", ticket)`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Reusing an iterator is the most common mistake. If a second loop over a `zip()`, a `map()`, or a generator prints nothing, the first loop used it up. Create a new one, or store the items with `list()` when you need them more than once.",
    },
    {
      type: "prose",
      body: "Calling `next()` on a list fails with `TypeError: 'list' object is not an iterator`, because a list is iterable but is not itself an iterator; call `iter()` on it first. Printing a generator shows a description beginning `<generator object` instead of its values, so loop over it or wrap it in `list()`.",
    },
    {
      type: "prose",
      body: "Finally, `yield` and `return` are different. `return` gives back one value and ends the function, while `yield` hands out a value and pauses. A function needs at least one `yield` to be a generator function; with only `return`, it is an ordinary function.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "An iterable is anything you can loop over, and an iterator hands out its items one at a time: `iter()` makes an iterator and `next()` takes the next item. A function that contains `yield` is a generator function, and calling it gives a generator that runs the body one step at a time. Generator expressions, written in parentheses, are lazy, and like every iterator they can be used only once.",
    },
    {
      type: "exercise",
      id: "iterators-and-generators-3",
      prompt:
        "Write a generator function tables(guests, size) that yields the guests in groups of size, each group as a list, in their original order. The last group holds whoever is left. For example, list(tables([\"Ada\", \"Alan\", \"Grace\", \"Guido\", \"Linus\"], 2)) gives [['Ada', 'Alan'], ['Grace', 'Guido'], ['Linus']]. It must yield each group, not return a list.",
      starterCode: `def tables(guests, size):
    # yield one list of guests at a time
    pass
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "list(tables([\"Ada\", \"Alan\", \"Grace\", \"Guido\", \"Linus\"], 2))",
            expected: "[['Ada', 'Alan'], ['Grace', 'Guido'], ['Linus']]",
          },
          {
            call: "next(tables([\"Ada\", \"Alan\", \"Grace\"], 3))",
            expected: "['Ada', 'Alan', 'Grace']",
          },
          {
            call: "list(tables([\"Ada\", \"Alan\", \"Grace\", \"Guido\"], 3))",
            expected: "[['Ada', 'Alan', 'Grace'], ['Guido']]",
          },
          {
            call: "list(tables([\"Ada\", \"Alan\", \"Grace\", \"Guido\"], 2))",
            expected: "[['Ada', 'Alan'], ['Grace', 'Guido']]",
          },
        ],
      },
      solution: `def tables(guests, size):
    for start in range(0, len(guests), size):
        yield guests[start:start + size]
`,
      hint: "range(0, len(guests), size) gives the index where each group starts. Yield the slice guests[start:start + size] for each one; a slice that runs past the end of the list simply stops at the end.",
    },
  ],
};

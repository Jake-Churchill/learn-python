export default {
  slug: "itertools-functools",
  title: "itertools & functools",
  unit: "Modules & Standard Library",
  blocks: [
    {
      type: "prose",
      body: "Some loops come up again and again: going through two lists one after the other, pairing every item of one list with every item of another, or listing every possible pair from a group. The `itertools` module has a ready-made tool for each. The `functools` module holds tools that work with functions themselves. This lesson covers five tools from the first module and two from the second.",
    },
    {
      type: "heading",
      text: "Joining iterables with chain",
    },
    {
      type: "prose",
      body: "Each `itertools` tool in this lesson returns an iterator, so it hands out its items one at a time and can be used only once, just like `zip()` and `map()`. Loop over the result with `for`, or wrap it in `list()` to see every item at once.",
    },
    {
      type: "prose",
      body: "`chain()` takes several iterables and hands out every item of the first, then every item of the second, and so on. When you only need to loop over the items, it saves building a new combined list with `+`.",
    },
    {
      type: "example",
      code: `from itertools import chain

morning = ["Ada", "Alan"]
evening = ["Grace", "Linus", "Guido"]
for name in chain(morning, evening):
    print(name)
print(list(chain(morning, evening, ["Margaret"])))`,
    },
    {
      type: "heading",
      text: "Every pairing with product",
    },
    {
      type: "prose",
      body: "`product()` pairs every item of one iterable with every item of another and hands out the pairs as tuples. It does the same job as two nested loops. With 2 sizes and 3 colors, it produces 2 times 3, which is 6 tuples.",
    },
    {
      type: "example",
      code: `from itertools import product

sizes = ["S", "M"]
colors = ["red", "blue", "green"]
for size, color in product(sizes, colors):
    print(size, color)`,
    },
    {
      type: "heading",
      text: "Choosing items: combinations and permutations",
    },
    {
      type: "prose",
      body: "`combinations(items, r)` gives every way to choose r of the items when order does not matter, as tuples. Choosing two players from Ada, Alan, and Grace gives three pairs, because Ada with Alan is the same pair as Alan with Ada. No item appears twice in the same tuple.",
    },
    {
      type: "prose",
      body: "`permutations(items, r)` treats order as important, so (Ada, Alan) and (Alan, Ada) are different arrangements. Use combinations for things like matches or teams, and permutations for rankings such as first and second place. Leaving out r makes `permutations()` arrange all the items.",
    },
    {
      type: "example",
      code: `from itertools import combinations, permutations

players = ["Ada", "Alan", "Grace"]
print(list(combinations(players, 2)))
print(list(permutations(players, 2)))
print(len(list(permutations(players))))`,
    },
    {
      type: "exercise",
      id: "itertools-functools-1",
      prompt:
        "Four teams each play every other team once. Replace the empty list so the loop goes over combinations(teams, 2). The output should be exactly six lines: Lions vs Tigers, Lions vs Bears, Lions vs Wolves, Tigers vs Bears, Tigers vs Wolves, Bears vs Wolves",
      starterCode: `from itertools import combinations

teams = ["Lions", "Tigers", "Bears", "Wolves"]
matches = []  # replace [] with the pairs of teams
for first, second in matches:
    print(first, "vs", second)
`,
      check: {
        type: "stdout-exact",
        expected:
          "Lions vs Tigers\nLions vs Bears\nLions vs Wolves\nTigers vs Bears\nTigers vs Wolves\nBears vs Wolves",
      },
      solution: `from itertools import combinations

teams = ["Lions", "Tigers", "Bears", "Wolves"]
matches = combinations(teams, 2)
for first, second in matches:
    print(first, "vs", second)
`,
      hint: "Write matches = combinations(teams, 2). The loop already unpacks each pair into first and second.",
    },
    {
      type: "heading",
      text: "Grouping neighbors with groupby",
    },
    {
      type: "prose",
      body: "`groupby(items, key=function)` walks through the items and gathers neighbors that share the same key into a group. It hands out (key, group) pairs, where group is an iterator over the items in that run. Without `key`, the items themselves are compared.",
    },
    {
      type: "prose",
      body: "`groupby()` only looks at neighbors. If items with the same key are scattered, each run becomes a separate group, so sort the items by the same key first. The example shows both cases.",
    },
    {
      type: "example",
      code: `from itertools import groupby

orders = [("fruit", "apple"), ("fruit", "pear"), ("bread", "bagel"), ("fruit", "plum")]
for category, group in groupby(orders, key=lambda order: order[0]):
    print(category, list(group))

orders.sort(key=lambda order: order[0])
for category, group in groupby(orders, key=lambda order: order[0]):
    print(category, [item for kind, item in group])`,
    },
    {
      type: "heading",
      text: "Combining items with reduce",
    },
    {
      type: "prose",
      body: "`functools.reduce(function, items)` combines all the items into one value, two at a time. It calls the function with the first two items, then with that result and the third item, and so on until the items run out. With the prices 4, 2, 5, and 3 and a function that adds, it works out 4 + 2 = 6, then 6 + 5 = 11, then 11 + 3 = 14.",
    },
    {
      type: "prose",
      body: "`sum()` already adds, so `reduce()` is for jobs with no built-in function, such as finding the days that appear in every set of free days. A third argument gives a starting value, which is also the result when the list is empty.",
    },
    {
      type: "example",
      code: `from functools import reduce

prices = [4, 2, 5, 3]
print(reduce(lambda total, price: total + price, prices))

free_days = [{"Mon", "Tue", "Fri"}, {"Tue", "Fri"}, {"Tue", "Wed", "Fri"}]
common = reduce(lambda shared, days: shared & days, free_days)
print(sorted(common))
print(reduce(lambda total, price: total + price, [], 0))`,
    },
    {
      type: "heading",
      text: "Presetting arguments with partial",
    },
    {
      type: "prose",
      body: "`functools.partial(function, ...)` builds a new function from an existing one, with some arguments already filled in. Calling the new function calls the original with the preset arguments plus whatever you pass now. It suits a function you call many times with one argument that never changes.",
    },
    {
      type: "example",
      code: `from functools import partial

def add_tax(price, rate):
    return round(price * (1 + rate), 2)

uk_price = partial(add_tax, rate=0.2)
japan_price = partial(add_tax, rate=0.1)
print(uk_price(10.0))
print(japan_price(10.0))
print(uk_price(4.99))`,
    },
    {
      type: "prose",
      body: "`uk_price(10.0)` calls `add_tax(10.0, rate=0.2)`. Presetting arguments by keyword, as here, is the clearest way, because the name shows which parameter is fixed.",
    },
    {
      type: "exercise",
      id: "itertools-functools-2",
      prompt:
        "Use partial() to create two functions from apply_discount: half_price, which presets percent to 50, and tenth_off, which presets percent to 10. For example, half_price(80.0) returns 40.0 and tenth_off(80.0) returns 72.0.",
      starterCode: `from functools import partial

def apply_discount(price, percent):
    return price * (100 - percent) / 100

# create half_price and tenth_off here
`,
      check: {
        type: "returns",
        cases: [
          { call: "half_price(80.0)", expected: "40.0" },
          { call: "tenth_off(80.0)", expected: "72.0" },
          { call: "tenth_off(25.0)", expected: "22.5" },
        ],
      },
      solution: `from functools import partial

def apply_discount(price, percent):
    return price * (100 - percent) / 100

half_price = partial(apply_discount, percent=50)
tenth_off = partial(apply_discount, percent=10)
`,
      hint: "Each one is a single assignment, such as half_price = partial(apply_discount, percent=50).",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Forgetting to sort before `groupby()` is the classic mistake. Scattered items with the same key come out as several groups, as the first loop in the `groupby()` example showed. Sort by the same key you pass to `groupby()`.",
    },
    {
      type: "prose",
      body: "An `itertools` result is used up after one pass, and printing one shows a description beginning `<itertools.chain object at` instead of its items. Each group from `groupby()` is also emptied once the loop moves on to the next group, so read it while you are on it. And `reduce()` with an empty list and no starting value stops with `TypeError: reduce() of empty iterable with no initial value`.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`chain()` goes through several iterables in turn, `product()` pairs every item with every other, and `combinations()` and `permutations()` choose items without and with order. `groupby()` groups neighbors with the same key, so sort first. `reduce()` combines items into one value two at a time, and `partial()` makes a new function with some arguments preset.",
    },
    {
      type: "exercise",
      id: "itertools-functools-3",
      prompt:
        "Write a function compress(text) that describes each run of repeated letters as the letter followed by the length of the run, joined into one string. For example, compress(\"aaabccdd\") returns 'a3b1c2d2', and compress(\"\") returns ''.",
      starterCode: `from itertools import groupby

# write compress(text) here
`,
      check: {
        type: "returns",
        cases: [
          { call: "compress('aaabccdd')", expected: "'a3b1c2d2'" },
          { call: "compress('abc')", expected: "'a1b1c1'" },
          { call: "compress('zzzzzzzzzzzz')", expected: "'z12'" },
          { call: "compress('')", expected: "''" },
        ],
      },
      solution: `from itertools import groupby

def compress(text):
    result = ""
    for letter, group in groupby(text):
        result += letter + str(len(list(group)))
    return result
`,
      hint: "Without a key, groupby(text) groups runs of the same letter. Loop with for letter, group in groupby(text):, and use len(list(group)) for the length of each run.",
    },
  ],
};

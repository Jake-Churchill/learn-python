export default {
  slug: "lambda-and-higher-order",
  title: "Lambda & Higher-Order Functions",
  unit: "Functions",
  blocks: [
    {
      type: "prose",
      body: "`sorted()` puts words in alphabetical order, but what if you want them by length, or a list of products by price? You tell `sorted()` what to sort by when you hand it a function. This lesson shows that functions are values you can pass around, how to write a small function in one line with `lambda`, and two built-in functions that take a function as an argument.",
    },
    {
      type: "heading",
      text: "Functions are values",
    },
    {
      type: "prose",
      body: "A function's name without parentheses refers to the function itself, a value like any other. You can store it in another variable, put it in a list, or pass it as an argument. Adding parentheses calls whatever function the name refers to.",
    },
    {
      type: "prose",
      body: "A function that takes another function as an argument, or returns one, is called a higher-order function. Below, `apply_twice()` is one: it calls whatever function it is given two times.",
    },
    {
      type: "example",
      code: `def shout(text):
    return text.upper() + "!"

speak = shout
print(speak("hello"))

def double(n):
    return n * 2

def apply_twice(func, value):
    return func(func(value))

print(apply_twice(shout, "hey"))
print(apply_twice(double, 5))`,
    },
    {
      type: "heading",
      text: "Sorting with a key",
    },
    {
      type: "prose",
      body: "`sorted()` and the `sort()` method accept a `key` argument: a function that Python calls once on each item. The items are then ordered by those results instead of by the items themselves. With `key=len`, words are ordered by their length, but the result still holds the words.",
    },
    {
      type: "prose",
      body: "Items whose keys are equal keep the order they had before sorting. `key` combines with `reverse=True` to sort from largest to smallest. You can write your own key function with `def`, as long as it takes one item and returns the value to sort by.",
    },
    {
      type: "example",
      code: `words = ["banana", "fig", "cherry", "kiwi"]
print(sorted(words))
print(sorted(words, key=len))
print(sorted(words, key=len, reverse=True))

def last_letter(word):
    return word[-1]

print(sorted(words, key=last_letter))`,
    },
    {
      type: "exercise",
      id: "lambda-and-higher-order-1",
      prompt:
        "cheapest_first(products) sorts a list of (name, price) tuples using get_price as the key. Complete get_price(product) so it returns the price, the second item of the tuple. Then cheapest_first([(\"Tea\", 2.5), (\"Cake\", 3.75), (\"Water\", 1.0)]) returns [('Water', 1.0), ('Tea', 2.5), ('Cake', 3.75)].",
      starterCode: `def get_price(product):
    # return the second item of the tuple
    pass

def cheapest_first(products):
    return sorted(products, key=get_price)
`,
      check: {
        type: "returns",
        cases: [
          { call: 'get_price(("Tea", 2.5))', expected: "2.5" },
          {
            call: 'cheapest_first([("Tea", 2.5), ("Cake", 3.75), ("Water", 1.0)])',
            expected: "[('Water', 1.0), ('Tea', 2.5), ('Cake', 3.75)]",
          },
        ],
      },
      solution: `def get_price(product):
    return product[1]

def cheapest_first(products):
    return sorted(products, key=get_price)
`,
      hint: "The second item of a tuple is at index 1.",
    },
    {
      type: "heading",
      text: "Writing small functions with lambda",
    },
    {
      type: "prose",
      body: "A key function is often a single expression used in one place, and a full `def` for it feels long. A lambda is a small function without a name, written in one line: the word `lambda`, the parameters, a colon, and one expression. The value of that expression is returned automatically, with no `return` statement.",
    },
    {
      type: "prose",
      body: "`lambda product: product[1]` does the same job as `get_price()` above. Write it directly where the function is needed, such as after `key=`. A lambda can hold only one expression, so anything that needs several lines belongs in a `def`. A lambda written inside a function can also use that function's parameters.",
    },
    {
      type: "example",
      code: `products = [("Tea", 2.5), ("Cake", 3.75), ("Water", 1.0)]
print(sorted(products, key=lambda product: product[1]))
print(sorted(products, key=lambda product: product[1], reverse=True))

names = ["grace", "Ada", "Zoe"]
print(sorted(names))
print(sorted(names, key=lambda name: name.lower()))`,
    },
    {
      type: "prose",
      body: "The last two lines show a common use. Plain sorting puts every capital letter before every lowercase letter, so `Zoe` lands ahead of `grace`. Sorting by the lowercase version of each name gives alphabetical order while keeping the names as they were written.",
    },
    {
      type: "heading",
      text: "Sorting a dictionary by value",
    },
    {
      type: "prose",
      body: "Sorting a dictionary directly gives its keys in order. To order it by value, sort its `items()`, the (key, value) pairs, with a key function that picks out the value: `lambda pair: pair[1]`. The result is a list of pairs, which a `for` loop can unpack.",
    },
    {
      type: "prose",
      body: "To turn that list of pairs back into a dictionary, pass it to `dict()`, which turns a list of (key, value) pairs into a dictionary. The new dictionary keeps the sorted order.",
    },
    {
      type: "example",
      code: `scores = {"Ada": 92, "Grace": 88, "Alan": 95}
print(sorted(scores))
ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
print(ranked)
for name, score in ranked:
    print(f"{name}: {score}")
print(dict(ranked))`,
    },
    {
      type: "exercise",
      id: "lambda-and-higher-order-2",
      prompt:
        "The dictionary sales maps each product to the number sold. Write the body of top_sellers(sales) so it returns a list of the product names only, ordered from most sold to least sold. For example, top_sellers({\"tea\": 40, \"cake\": 65, \"water\": 12}) returns ['cake', 'tea', 'water'].",
      starterCode: `def top_sellers(sales):
    # sort the pairs by value, highest first, then collect the names
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: 'top_sellers({"tea": 40, "cake": 65, "water": 12})', expected: "['cake', 'tea', 'water']" },
          { call: 'top_sellers({"pen": 3})', expected: "['pen']" },
          { call: "top_sellers({})", expected: "[]" },
        ],
      },
      solution: `def top_sellers(sales):
    ranked = sorted(sales.items(), key=lambda pair: pair[1], reverse=True)
    names = []
    for name, count in ranked:
        names.append(name)
    return names
`,
      hint: "Sort sales.items() with a lambda that picks pair[1], and reverse=True. Then loop over the sorted pairs and append each name to a new list.",
    },
    {
      type: "heading",
      text: "map and filter",
    },
    {
      type: "prose",
      body: "`map(function, items)` calls the function on each item and hands out the results, in order. `filter(function, items)` calls the function on each item and hands out only the items for which it returns a truthy value, such as `True`. Both hand out their results one at a time, as `zip()` does, so wrap them in `list()` to get a list.",
    },
    {
      type: "prose",
      body: "Each one replaces a common loop. `map()` does the job of a loop that appends a changed version of every item, and `filter()` does the job of a loop that appends only the items that pass a test. Both work with a lambda or with an existing function, such as `len`, or `str` to turn numbers into text before `join()`.",
    },
    {
      type: "example",
      code: `prices = [4.0, 12.5, 7.25, 19.99]
with_tax = list(map(lambda price: round(price * 1.08, 2), prices))
print(with_tax)

cheap = list(filter(lambda price: price < 10, prices))
print(cheap)

words = ["apple", "fig", "banana"]
print(list(map(len, words)))
print(", ".join(map(str, [3, 1, 2])))`,
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Calling a function when you mean to pass it is the most common mistake. `sorted(words, key=len())` calls `len()` with nothing and fails with `TypeError: len() takes exactly one argument (0 given)`. Write `key=len`, without parentheses, so `sorted()` can call it on each item itself.",
    },
    {
      type: "prose",
      body: "Printing `map()` or `filter()` directly shows a description starting with `<map object at` or `<filter object at` instead of the results; wrap it in `list()`. And sorting `items()` gives a list of pairs, not a dictionary, so pass it to `dict()` when you need a dictionary again.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Functions are values: a name without parentheses can be stored, passed, and called later, and a function that takes or returns a function is higher-order. `lambda` writes a one-expression function in place. `sorted()` with `key=` orders items by a function's results, and sorting `items()` by `pair[1]` orders a dictionary by value. `map()` changes every item and `filter()` keeps the items that pass a test.",
    },
    {
      type: "exercise",
      id: "lambda-and-higher-order-3",
      prompt:
        "results maps each student to a score. Write a function passing_names(results, pass_mark) that returns a list of the names of students whose score is at least pass_mark, ordered from highest score to lowest. For example, passing_names({\"Ada\": 92, \"Grace\": 58, \"Alan\": 75, \"Linus\": 81}, 60) returns ['Ada', 'Linus', 'Alan'].",
      starterCode: `# write passing_names(results, pass_mark) below
`,
      check: {
        type: "returns",
        cases: [
          {
            call: 'passing_names({"Ada": 92, "Grace": 58, "Alan": 75, "Linus": 81}, 60)',
            expected: "['Ada', 'Linus', 'Alan']",
          },
          {
            call: 'passing_names({"Ada": 92, "Grace": 58, "Alan": 75, "Linus": 81}, 80)',
            expected: "['Ada', 'Linus']",
          },
          { call: 'passing_names({"Sam": 50, "Kim": 49}, 50)', expected: "['Sam']" },
          { call: 'passing_names({"Sam": 40}, 50)', expected: "[]" },
        ],
      },
      solution: `def passing_names(results, pass_mark):
    passed = filter(lambda pair: pair[1] >= pass_mark, results.items())
    ranked = sorted(passed, key=lambda pair: pair[1], reverse=True)
    return list(map(lambda pair: pair[0], ranked))
`,
      hint: "Use filter() on results.items() to keep the pairs whose score, pair[1], is at least pass_mark. Sort what is left by score with reverse=True, then use map() to keep only the names, and wrap the result in list().",
    },
  ],
};

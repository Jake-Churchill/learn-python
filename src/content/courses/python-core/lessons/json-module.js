export default {
  slug: "json-module",
  title: "Working with JSON",
  unit: "Modules & Standard Library",
  blocks: [
    {
      type: "prose",
      body: "Programs often need to save data or pass it to another program: a list of contacts, a table of high scores, or the settings someone chose. JSON is a text format made for this, and it is one of the most common ways programs exchange data. The `json` module converts between Python values and JSON text.",
    },
    {
      type: "heading",
      text: "What JSON looks like",
    },
    {
      type: "prose",
      body: "JSON writes data as plain text. It has objects, written in curly braces with `\"key\": value` pairs, and arrays, written in square brackets. Its other values are strings in double quotes, numbers, `true`, `false`, and `null`.",
    },
    {
      type: "prose",
      body: "That looks almost like Python's dictionaries and lists, with a few differences. JSON strings always use double quotes, `true`, `false`, and `null` are lowercase, and object keys must be strings. Because JSON is only text, it can be saved in a file or sent across a network and read back later.",
    },
    {
      type: "heading",
      text: "Turning Python values into JSON",
    },
    {
      type: "prose",
      body: "`json.dumps()` takes a Python value and returns a string of JSON text; the s at the end stands for string. A dictionary becomes an object, and a list or a tuple becomes an array. `True`, `False`, and `None` become `true`, `false`, and `null`.",
    },
    {
      type: "example",
      code: `import json

book = {"title": "Dune", "year": 1965, "in_stock": True, "rating": None, "tags": ("sci-fi", "classic")}
text = json.dumps(book)
print(text)
print(type(text))`,
    },
    {
      type: "prose",
      body: "The result is one long line, which is compact but hard to read. Passing `indent=2` puts each item on its own line, indented by two spaces for each level of nesting.",
    },
    {
      type: "example",
      code: `import json

order = {"customer": "Ada", "items": ["lamp", "desk"], "paid": False}
print(json.dumps(order, indent=2))`,
    },
    {
      type: "exercise",
      id: "json-module-1",
      prompt:
        "The dictionary player is written for you. Print it as JSON text using json.dumps(). The output should be exactly: {\"name\": \"Grace\", \"level\": 7, \"online\": true}",
      starterCode: `import json

player = {"name": "Grace", "level": 7, "online": True}
# print player as JSON text
`,
      check: { type: "stdout-exact", expected: "{\"name\": \"Grace\", \"level\": 7, \"online\": true}" },
      solution: `import json

player = {"name": "Grace", "level": 7, "online": True}
print(json.dumps(player))
`,
      hint: "Give player to json.dumps(), and give the result to print().",
    },
    {
      type: "heading",
      text: "Turning JSON into Python values",
    },
    {
      type: "prose",
      body: "`json.loads()` does the reverse: it takes a string of JSON text and returns the matching Python value, usually a dictionary or a list. The result is ordinary Python data, so you use keys and indexes on it as usual, and nested JSON becomes nested Python data. The JSON text below sits inside single quotes, which lets it contain double quotes.",
    },
    {
      type: "example",
      code: `import json

text = '{"name": "Ada", "scores": [90, 85], "member": false, "nickname": null}'
data = json.loads(text)
print(data)
print(type(data))
print(data["scores"][0] + data["scores"][1])`,
    },
    {
      type: "prose",
      body: "A round trip through JSON does not always give back exactly what you started with. A tuple comes back as a list, and number keys come back as strings, because JSON keys must be strings. A value that JSON has no form for, such as a set, cannot be converted at all, and `json.dumps()` stops with `TypeError: Object of type set is not JSON serializable`.",
    },
    {
      type: "example",
      code: `import json

stock = {1: "lamp", 2: "desk"}
copy = json.loads(json.dumps(stock))
print(copy)
print(copy == stock)`,
    },
    {
      type: "exercise",
      id: "json-module-2",
      prompt:
        "Write a function total_price(json_text) that takes JSON text holding an array of objects, each with a \"price\" key, and returns the total of the prices. Start the total at 0, so an empty array gives 0. For example, total_price('[{\"item\": \"pen\", \"price\": 1.5}, {\"item\": \"mug\", \"price\": 8.0}]') returns 9.5.",
      starterCode: `import json

def total_price(json_text):
    # load the JSON text, then add up the prices
    pass
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "total_price('[{\"item\": \"pen\", \"price\": 1.5}, {\"item\": \"mug\", \"price\": 8.0}]')",
            expected: "9.5",
          },
          { call: "total_price('[{\"item\": \"lamp\", \"price\": 25}]')", expected: "25" },
          { call: "total_price('[]')", expected: "0" },
        ],
      },
      solution: `import json

def total_price(json_text):
    items = json.loads(json_text)
    return sum(item["price"] for item in items)
`,
      hint: "json.loads(json_text) gives a list of dictionaries. Add up item[\"price\"] for every item, with a loop or with sum() and a generator expression.",
    },
    {
      type: "heading",
      text: "JSON in files",
    },
    {
      type: "prose",
      body: "To keep data after a program ends, write the JSON to a file. `json.dump(value, file)`, without the s, writes a value as JSON straight into an open file, and `json.load(file)` reads a whole file of JSON back into a Python value. Both take the file object from a `with open(...)` block, and `json.dump()` accepts `indent` too.",
    },
    {
      type: "example",
      code: `import json

settings = {"theme": "dark", "font_size": 14}
with open("settings.json", "w") as file:
    json.dump(settings, file, indent=2)

with open("settings.json") as file:
    print(file.read())

with open("settings.json") as file:
    loaded = json.load(file)
print(loaded["font_size"] + 2)`,
    },
    {
      type: "prose",
      body: "Files that hold JSON usually have names ending in `.json`. The middle block shows the text that was saved, and the last block loads it back as a dictionary. A program can save its data this way when it ends and load it again the next time it runs. On this site, files last only while the page stays open.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Mixing up the four function names is the most common mistake. The two ending in s, `dumps()` and `loads()`, work with strings, while `dump()` and `load()` work with files. Passing a file to `loads()`, or a string to `load()`, stops with an error.",
    },
    {
      type: "prose",
      body: "JSON written by hand must use double quotes. `json.loads(\"{'name': 'Ada'}\")` stops with an error ending in `Expecting property name enclosed in double quotes: line 1 column 2 (char 1)`, because single quotes are not valid JSON. Printing a dictionary also shows Python's form, not JSON, so use `json.dumps()` whenever you need real JSON text.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "JSON is a text format with objects, arrays, strings, numbers, `true`, `false`, and `null`. `json.dumps()` turns a Python value into JSON text, `indent` makes it readable, and `json.loads()` turns JSON text back into Python values. `json.dump()` and `json.load()` do the same with files, and a round trip turns tuples into lists and number keys into strings.",
    },
    {
      type: "exercise",
      id: "json-module-3",
      prompt:
        "Write a function save_and_load(data, filename) that saves data to the file named filename with json.dump(), then opens the file again, reads it with json.load(), and returns the loaded value. For example, save_and_load({\"point\": (1, 2)}, \"p.json\") returns {'point': [1, 2]}, because the tuple comes back as a list.",
      starterCode: `import json

# write save_and_load(data, filename) here
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "save_and_load({'theme': 'dark', 'volume': 7}, 'settings.json')",
            expected: "{'theme': 'dark', 'volume': 7}",
          },
          { call: "save_and_load({'point': (1, 2)}, 'p.json')", expected: "{'point': [1, 2]}" },
          { call: "save_and_load({1: 'one', 'ok': None}, 'n.json')", expected: "{'1': 'one', 'ok': None}" },
        ],
      },
      solution: `import json

def save_and_load(data, filename):
    with open(filename, "w") as file:
        json.dump(data, file)
    with open(filename) as file:
        loaded = json.load(file)
    return loaded
`,
      hint: "Use two with blocks: one that opens filename with \"w\" and calls json.dump(data, file), and one that opens it for reading and stores json.load(file) in a variable. Return that variable.",
    },
  ],
};

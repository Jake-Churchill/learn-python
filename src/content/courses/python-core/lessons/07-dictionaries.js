export default {
  slug: "dictionaries",
  title: "Dictionaries",
  blocks: [
    {
      type: "prose",
      body: "A dictionary stores values under keys you choose, rather than positions: `person = {\"name\": \"Ada\", \"age\": 30}`. Keys are usually written as strings, in quotes, each followed by a colon and its value.",
    },
    {
      type: "prose",
      body: "Look up a value by its key using square brackets: `person[\"name\"]` gives `\"Ada\"`. Dictionaries are always accessed with this bracket-and-key syntax — there's no shortcut like `person.name`.",
    },
    {
      type: "prose",
      body: "Add a new key or update an existing one the same way: `person[\"age\"] = 31`. To check whether a key exists before using it, use the `in` operator: `\"age\" in person` gives back `True` or `False`.",
    },
    {
      type: "example",
      code: `person = {"name": "Ada", "age": 30}
person["age"] = 31
print(person["name"])
print(person)
print("age" in person)`,
    },
    {
      type: "exercise",
      id: "dictionaries-1",
      prompt: "book = {\"title\": \"Dune\"} is given. Add a key \"author\" with value \"Herbert\", then print the dictionary.",
      starterCode: `book = {"title": "Dune"}
`,
      check: { type: "stdout-exact", expected: "{'title': 'Dune', 'author': 'Herbert'}" },
    },
  ],
};

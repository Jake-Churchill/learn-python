export default {
  slug: "dictionaries",
  title: "Dictionaries",
  blocks: [
    {
      type: "prose",
      body: "Python dicts are like JS objects (or Maps): `person = {\"name\": \"Ada\", \"age\": 30}`. Keys are written as strings with quotes — there's no unquoted-key shortcut like JS object literals have.",
    },
    {
      type: "prose",
      body: "Access is bracket-only: `person[\"name\"]` — there's no dot-access shortcut like JS's `person.name`.",
    },
    {
      type: "prose",
      body: "Add or update a key the same way as JS: `person[\"age\"] = 31`. Check whether a key exists with `\"age\" in person`, which reads almost exactly like JS's `\"age\" in person`.",
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

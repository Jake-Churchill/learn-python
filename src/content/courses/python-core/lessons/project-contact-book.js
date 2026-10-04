export default {
  slug: "project-contact-book",
  title: "Contact Book",
  unit: "Projects",
  blocks: [
    {
      type: "prose",
      body: "This project builds a contact book: a program that stores names, phone numbers, and email addresses. It can add, update, delete, and search contacts, and it saves the whole book to a file, so the contacts are still there the next time the program runs.",
    },
    {
      type: "prose",
      body: "You build it in four stages, and the starter code for each stage is the solution to the stage before, so work through them in order. The first three stages each add a pair of functions and check what they return. The last stage runs two sessions of the finished program, one after the other, to prove that the second session finds what the first one saved.",
    },
    {
      type: "heading",
      text: "Planning the data",
    },
    {
      type: "prose",
      body: "You look a contact up by name, so the book is a dictionary whose keys are names. Each value is a second dictionary holding that person's details, as in `{\"Ada Lovelace\": {\"phone\": \"555-0101\", \"email\": \"ada@example.com\"}}`. A dictionary of dictionaries like this also converts to JSON directly, which will make saving easy.",
    },
    {
      type: "prose",
      body: "Phone numbers are stored as strings, not numbers. They are never added up, and `int()` would reject the dash in `555-0101` and drop the leading zero of a number such as `0161`.",
    },
    {
      type: "heading",
      text: "Stage 1: Add and delete contacts",
    },
    {
      type: "prose",
      body: "`add_contact()` is written for you. Assigning to `book[name]` adds a new contact or replaces an existing one, so the function checks with `in` beforehand and reports which of the two happened. Each function returns its message instead of printing it, which lets the later stages decide what to do with the text.",
    },
    {
      type: "prose",
      body: "`delete_contact()` must check before it deletes, because `del` on a missing key raises a `KeyError`. A name that is not in the book should get a polite message instead.",
    },
    {
      type: "exercise",
      id: "project-contact-book-1",
      prompt:
        "add_contact() is written for you. Finish delete_contact(book, name): if name is in book, delete that entry and return Deleted followed by a space and the name; otherwise return No contact named followed by a space and the name. For example, delete_contact({}, 'Grace Hopper') returns 'No contact named Grace Hopper'.",
      starterCode: `def add_contact(book, name, phone, email):
    message = "Updated" if name in book else "Added"
    book[name] = {"phone": phone, "email": email}
    return f"{message} {name}"


def delete_contact(book, name):
    pass  # delete the contact and return the right message
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "add_contact({}, 'Ada Lovelace', '555-0101', 'ada@example.com')",
            expected: "'Added Ada Lovelace'",
          },
          {
            call: "delete_contact({'Alan Turing': {'phone': '555-0199', 'email': 'alan@example.com'}}, 'Alan Turing')",
            expected: "'Deleted Alan Turing'",
          },
          { call: "delete_contact({}, 'Grace Hopper')", expected: "'No contact named Grace Hopper'" },
        ],
      },
      solution: `def add_contact(book, name, phone, email):
    message = "Updated" if name in book else "Added"
    book[name] = {"phone": phone, "email": email}
    return f"{message} {name}"


def delete_contact(book, name):
    if name in book:
        del book[name]
        return f"Deleted {name}"
    return f"No contact named {name}"
`,
      hint: "Use if name in book:, then del book[name] and return f\"Deleted {name}\". After the if block, return f\"No contact named {name}\"; it runs only when the name was not found.",
    },
    {
      type: "heading",
      text: "Stage 2: Search the book",
    },
    {
      type: "prose",
      body: "A search should forgive capital letters: typing `ada` ought to find `Ada Lovelace`. Lowering both the search text and each name before comparing with `in` does that. Because `in` checks for a piece of a string, `hop` finds `Grace Hopper` too.",
    },
    {
      type: "prose",
      body: "`sorted()` of a dictionary gives its keys in order, so looping over `sorted(book)` visits the names in alphabetical order and the results come out in a predictable order. Each match is turned into one line of text by a small `format_contact()` function, which the last stage reuses when it prints the results.",
    },
    {
      type: "exercise",
      id: "project-contact-book-2",
      prompt:
        "Add two functions. format_contact(name, info) takes a name and that contact's details dictionary and returns the name, a colon, a space, the phone, a comma, a space, and the email, as in Ada Lovelace: 555-0101, ada@example.com. find_contacts(book, text) returns a list with format_contact() applied to every contact whose name contains text, ignoring capital letters, in alphabetical order of name. If nothing matches, it returns an empty list.",
      starterCode: `def add_contact(book, name, phone, email):
    message = "Updated" if name in book else "Added"
    book[name] = {"phone": phone, "email": email}
    return f"{message} {name}"


def delete_contact(book, name):
    if name in book:
        del book[name]
        return f"Deleted {name}"
    return f"No contact named {name}"
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "format_contact('Ada Lovelace', {'phone': '555-0101', 'email': 'ada@example.com'})",
            expected: "'Ada Lovelace: 555-0101, ada@example.com'",
          },
          {
            call: "find_contacts({'Grace Hopper': {'phone': '555-0142', 'email': 'grace@example.com'}, 'Ada Lovelace': {'phone': '555-0101', 'email': 'ada@example.com'}}, 'A')",
            expected: "['Ada Lovelace: 555-0101, ada@example.com', 'Grace Hopper: 555-0142, grace@example.com']",
          },
          {
            call: "find_contacts({'Grace Hopper': {'phone': '555-0142', 'email': 'grace@example.com'}, 'Ada Lovelace': {'phone': '555-0101', 'email': 'ada@example.com'}}, 'hop')",
            expected: "['Grace Hopper: 555-0142, grace@example.com']",
          },
          {
            call: "find_contacts({'Ada Lovelace': {'phone': '555-0101', 'email': 'ada@example.com'}}, 'zed')",
            expected: "[]",
          },
        ],
      },
      solution: `def add_contact(book, name, phone, email):
    message = "Updated" if name in book else "Added"
    book[name] = {"phone": phone, "email": email}
    return f"{message} {name}"


def delete_contact(book, name):
    if name in book:
        del book[name]
        return f"Deleted {name}"
    return f"No contact named {name}"


def format_contact(name, info):
    return f"{name}: {info['phone']}, {info['email']}"


def find_contacts(book, text):
    text = text.lower()
    return [format_contact(name, book[name]) for name in sorted(book) if text in name.lower()]
`,
      hint: "format_contact() is one f-string: f\"{name}: {info['phone']}, {info['email']}\". In find_contacts(), lower text once, then build the list with a comprehension over sorted(book) that keeps a name only if text in name.lower().",
    },
    {
      type: "heading",
      text: "Stage 3: Save and load",
    },
    {
      type: "prose",
      body: "JSON is a text format for data that maps neatly onto dictionaries, lists, strings, and numbers. `json.dumps(book, indent=2)` turns the book into JSON text spread over several lines, each level indented by two spaces, ready to write to a file. `json.loads()` does the reverse, turning the text read back from the file into a dictionary again.",
    },
    {
      type: "prose",
      body: "On the very first run there is no file yet, so `open()` raises a `FileNotFoundError`. Catching it and returning an empty dictionary means a new user simply starts with an empty book.",
    },
    {
      type: "exercise",
      id: "project-contact-book-3",
      prompt:
        "Add import json at the top of the program and two functions. save_book(book, filename) writes the file named filename, containing exactly the text that json.dumps(book, indent=2) returns and nothing else. It returns nothing. load_book(filename) reads that file and returns the dictionary that json.loads() makes from its text; if the file does not exist, it returns an empty dictionary instead. For example, load_book('no_such_file.json') returns {}.",
      starterCode: `def add_contact(book, name, phone, email):
    message = "Updated" if name in book else "Added"
    book[name] = {"phone": phone, "email": email}
    return f"{message} {name}"


def delete_contact(book, name):
    if name in book:
        del book[name]
        return f"Deleted {name}"
    return f"No contact named {name}"


def format_contact(name, info):
    return f"{name}: {info['phone']}, {info['email']}"


def find_contacts(book, text):
    text = text.lower()
    return [format_contact(name, book[name]) for name in sorted(book) if text in name.lower()]
`,
      check: {
        type: "returns",
        cases: [
          { call: "load_book('no_such_file.json')", expected: "{}" },
          {
            call: "save_book({'Ada Lovelace': {'phone': '555-0101', 'email': 'ada@example.com'}}, 'contacts.json')",
            expected: "None",
          },
          {
            call: "open('contacts.json').read()",
            expected:
              "'{\\n  \"Ada Lovelace\": {\\n    \"phone\": \"555-0101\",\\n    \"email\": \"ada@example.com\"\\n  }\\n}'",
          },
          {
            call: "load_book('contacts.json')",
            expected: "{'Ada Lovelace': {'phone': '555-0101', 'email': 'ada@example.com'}}",
          },
        ],
      },
      solution: `import json


def add_contact(book, name, phone, email):
    message = "Updated" if name in book else "Added"
    book[name] = {"phone": phone, "email": email}
    return f"{message} {name}"


def delete_contact(book, name):
    if name in book:
        del book[name]
        return f"Deleted {name}"
    return f"No contact named {name}"


def format_contact(name, info):
    return f"{name}: {info['phone']}, {info['email']}"


def find_contacts(book, text):
    text = text.lower()
    return [format_contact(name, book[name]) for name in sorted(book) if text in name.lower()]


def save_book(book, filename):
    with open(filename, "w") as file:
        file.write(json.dumps(book, indent=2))


def load_book(filename):
    try:
        with open(filename) as file:
            return json.loads(file.read())
    except FileNotFoundError:
        return {}
`,
      hint: "In save_book(), open the file with the mode \"w\" and write json.dumps(book, indent=2). In load_book(), put the with block inside try, return json.loads(file.read()) from inside it, and add except FileNotFoundError: that returns {}.",
    },
    {
      type: "heading",
      text: "Stage 4: Run sessions",
    },
    {
      type: "prose",
      body: "A session is one run of the program from start to finish: load the book, carry out the user's commands, and save the book again. Here the commands arrive as a list of tuples whose first item names the action, such as `(\"find\", \"ada\")` or `(\"add\", \"Ada Lovelace\", \"555-0101\", \"ada@example.com\")`. Unpacking `command[1:]` gives the remaining items names.",
    },
    {
      type: "prose",
      body: "The test lines call `run_session()` twice with the same file name. Nothing carries over in memory: the second session's `book` is a new local variable, filled only from the file. It still finds everything the first session saved, which is the whole point of the file. The first test line saves an empty book, so every run starts fresh even if an earlier run left a file behind.",
    },
    {
      type: "exercise",
      id: "project-contact-book-4",
      prompt:
        "Write run_session(filename, commands) where the comment shows. It loads the book from filename and prints Loaded followed by the number of contacts and the word contacts, as in Loaded 3 contacts. Then for each command: for (\"add\", name, phone, email), print what add_contact() returns; for (\"delete\", name), print what delete_contact() returns; for (\"find\", text), print each line that find_contacts() returns, or No matches for followed by a space and the text when it returns an empty list. Finally it saves the book to filename and prints Saved followed by the number of contacts and the word contacts. The output should be exactly twelve lines: Loaded 0 contacts, then Added Ada Lovelace, then Added Alan Turing, then Added Grace Hopper, then Saved 3 contacts, then Loaded 3 contacts, then Deleted Alan Turing, then Updated Ada Lovelace, then Ada Lovelace: 555-0111, ada@example.com, then Grace Hopper: 555-0142, grace@example.com, then No matches for turing, then Saved 2 contacts",
      starterCode: `import json


def add_contact(book, name, phone, email):
    message = "Updated" if name in book else "Added"
    book[name] = {"phone": phone, "email": email}
    return f"{message} {name}"


def delete_contact(book, name):
    if name in book:
        del book[name]
        return f"Deleted {name}"
    return f"No contact named {name}"


def format_contact(name, info):
    return f"{name}: {info['phone']}, {info['email']}"


def find_contacts(book, text):
    text = text.lower()
    return [format_contact(name, book[name]) for name in sorted(book) if text in name.lower()]


def save_book(book, filename):
    with open(filename, "w") as file:
        file.write(json.dumps(book, indent=2))


def load_book(filename):
    try:
        with open(filename) as file:
            return json.loads(file.read())
    except FileNotFoundError:
        return {}


# write run_session(filename, commands) here


save_book({}, "contacts.json")
run_session("contacts.json", [
    ("add", "Ada Lovelace", "555-0101", "ada@example.com"),
    ("add", "Alan Turing", "555-0199", "alan@example.com"),
    ("add", "Grace Hopper", "555-0142", "grace@example.com"),
])
run_session("contacts.json", [
    ("delete", "Alan Turing"),
    ("add", "Ada Lovelace", "555-0111", "ada@example.com"),
    ("find", "a"),
    ("find", "turing"),
])
`,
      check: {
        type: "stdout-exact",
        expected:
          "Loaded 0 contacts\nAdded Ada Lovelace\nAdded Alan Turing\nAdded Grace Hopper\nSaved 3 contacts\nLoaded 3 contacts\nDeleted Alan Turing\nUpdated Ada Lovelace\nAda Lovelace: 555-0111, ada@example.com\nGrace Hopper: 555-0142, grace@example.com\nNo matches for turing\nSaved 2 contacts",
      },
      solution: `import json


def add_contact(book, name, phone, email):
    message = "Updated" if name in book else "Added"
    book[name] = {"phone": phone, "email": email}
    return f"{message} {name}"


def delete_contact(book, name):
    if name in book:
        del book[name]
        return f"Deleted {name}"
    return f"No contact named {name}"


def format_contact(name, info):
    return f"{name}: {info['phone']}, {info['email']}"


def find_contacts(book, text):
    text = text.lower()
    return [format_contact(name, book[name]) for name in sorted(book) if text in name.lower()]


def save_book(book, filename):
    with open(filename, "w") as file:
        file.write(json.dumps(book, indent=2))


def load_book(filename):
    try:
        with open(filename) as file:
            return json.loads(file.read())
    except FileNotFoundError:
        return {}


def run_session(filename, commands):
    book = load_book(filename)
    print(f"Loaded {len(book)} contacts")
    for command in commands:
        action = command[0]
        if action == "add":
            name, phone, email = command[1:]
            print(add_contact(book, name, phone, email))
        elif action == "delete":
            print(delete_contact(book, command[1]))
        elif action == "find":
            matches = find_contacts(book, command[1])
            if not matches:
                print("No matches for", command[1])
            for line in matches:
                print(line)
    save_book(book, filename)
    print(f"Saved {len(book)} contacts")


save_book({}, "contacts.json")
run_session("contacts.json", [
    ("add", "Ada Lovelace", "555-0101", "ada@example.com"),
    ("add", "Alan Turing", "555-0199", "alan@example.com"),
    ("add", "Grace Hopper", "555-0142", "grace@example.com"),
])
run_session("contacts.json", [
    ("delete", "Alan Turing"),
    ("add", "Ada Lovelace", "555-0111", "ada@example.com"),
    ("find", "a"),
    ("find", "turing"),
])
`,
      hint: "Start with book = load_book(filename) and the Loaded line. In the loop, action = command[0] picks the branch; for add, unpack name, phone, email = command[1:]. For find, store the list in matches, print the No matches line if not matches, then loop over matches. After the loop, call save_book() and print the Saved line.",
    },
    {
      type: "heading",
      text: "Extending the program",
    },
    {
      type: "prose",
      body: "The commands here come from a list, but the same `run_session()` loop could read them with `input()` instead, turning the program into one you type into. Other ideas to try: store a birthday or an address for each contact, search email addresses as well as names, or refuse an email address that has no `@` in it by raising a `ValueError`.",
    },
  ],
};

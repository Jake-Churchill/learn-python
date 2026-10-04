export default {
  slug: "project-text-adventure",
  title: "Text Adventure",
  unit: "Projects",
  blocks: [
    {
      type: "prose",
      body: "This project builds a text adventure: a game played entirely in words. The program describes where you are, you type commands such as `go east` or `take key`, and the program tells you what happens. The goal is to find the treasure, which lies behind a locked door.",
    },
    {
      type: "prose",
      body: "You build the game in five stages, and the starter code for each stage is the solution to the stage before, so work through them in order. As in the other command-driven programs, each stage comes with a fixed list of commands as its input, and the output shows each command after the `> ` prompt.",
    },
    {
      type: "heading",
      text: "Planning the game",
    },
    {
      type: "prose",
      body: "The map is data, not code. `rooms` is a dictionary of rooms, and each room is a dictionary holding a description, its exits, and a list of the items lying in it. The exits are a dictionary too, mapping a direction such as `north` to the name of the room it leads to. Adding a room to the game means adding an entry to `rooms`, without touching any function.",
    },
    {
      type: "prose",
      body: "Everything that changes while the game runs is called its state: which room the player is in, what they carry, and later how many moves they have made. The game keeps the state in one more dictionary, `state`, and passes it to the functions that need to read or change it.",
    },
    {
      type: "heading",
      text: "Stage 1: Describe a room",
    },
    {
      type: "prose",
      body: "`describe()` prints a room's description, its exits, and any items lying there. Looping over a dictionary gives its keys, so `\", \".join(room[\"exits\"])` joins the directions into one line. A room with no items should not print an empty `You see:` line, and an empty list counts as false.",
    },
    {
      type: "exercise",
      id: "project-text-adventure-1",
      prompt:
        "The map is written for you. Finish describe(name), which describes the room called name: print its description; then Exits: followed by a space and the names of its exits joined by a comma and a space; then, only if the room has any items, You see: followed by a space and the items joined the same way. The two calls at the bottom should print exactly five lines: \"You are in a dusty entrance hall.\", then \"Exits: north, east\", then \"You are in a cold kitchen.\", then \"Exits: west\", then \"You see: bread, key\"",
      starterCode: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}


def describe(name):
    room = rooms[name]
    # print the description, the exits, and any items


describe("hall")
describe("kitchen")
`,
      check: {
        type: "stdout-exact",
        expected:
          "You are in a dusty entrance hall.\nExits: north, east\nYou are in a cold kitchen.\nExits: west\nYou see: bread, key",
      },
      solution: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}


def describe(name):
    room = rooms[name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    if room["items"]:
        print("You see:", ", ".join(room["items"]))


describe("hall")
describe("kitchen")
`,
      hint: "Print room[\"description\"] first. For the exits, print(\"Exits:\", \", \".join(room[\"exits\"])). Put the You see: line inside if room[\"items\"]:, joining room[\"items\"] the same way.",
    },
    {
      type: "heading",
      text: "Stage 2: Move between rooms",
    },
    {
      type: "prose",
      body: "The game loop reads a command and splits it into a verb, the action word, and a noun, the thing the action applies to. In `go east`, the verb is `go` and the noun is `east`. `look` has no noun, so the conditional expression `words[1] if len(words) > 1 else \"\"` falls back to an empty string.",
    },
    {
      type: "prose",
      body: "`go()` looks the direction up in the current room's exits. If it is there, the exit's value is the name of the next room: store it in `state[\"room\"]` and describe the new room. Because the function changes the dictionary it was given, the change is still there when the loop asks for the next command.",
    },
    {
      type: "exercise",
      id: "project-text-adventure-2",
      prompt:
        "Replace the two describe() calls at the bottom with the main program, and add a function go(state, direction) above it. state is a dictionary whose \"room\" key holds the name of the current room. If direction is one of the current room's exits, go() sets state[\"room\"] to the room that exit leads to and describes the new room; otherwise it prints \"You can't go that way.\" The main program creates state = {\"room\": \"hall\"}, describes the starting room, and loops forever, reading a command with the exact prompt > (a greater-than sign and a space). Split the command into words: the first is the verb, and the second is the noun, or an empty string if there is no second word. For go, call go(state, noun); for look, describe the current room; for quit, print \"Goodbye.\" and leave the loop; for anything else, print \"I don't understand that.\" The program receives five commands: go west, go east, look, dance, quit. The output should be exactly sixteen lines: \"You are in a dusty entrance hall.\", then \"Exits: north, east\", then \"> go west\", then \"You can't go that way.\", then \"> go east\", then \"You are in a cold kitchen.\", then \"Exits: west\", then \"You see: bread, key\", then \"> look\", then the same three kitchen lines again, then \"> dance\", then \"I don't understand that.\", then \"> quit\", then \"Goodbye.\"",
      starterCode: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}


def describe(name):
    room = rooms[name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    if room["items"]:
        print("You see:", ", ".join(room["items"]))


describe("hall")
describe("kitchen")
`,
      stdin: "go west\ngo east\nlook\ndance\nquit",
      check: {
        type: "stdout-exact",
        expected:
          "You are in a dusty entrance hall.\nExits: north, east\n> go west\nYou can't go that way.\n> go east\nYou are in a cold kitchen.\nExits: west\nYou see: bread, key\n> look\nYou are in a cold kitchen.\nExits: west\nYou see: bread, key\n> dance\nI don't understand that.\n> quit\nGoodbye.",
      },
      solution: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}


def describe(name):
    room = rooms[name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    if room["items"]:
        print("You see:", ", ".join(room["items"]))


def go(state, direction):
    exits = rooms[state["room"]]["exits"]
    if direction in exits:
        state["room"] = exits[direction]
        describe(state["room"])
    else:
        print("You can't go that way.")


state = {"room": "hall"}
describe(state["room"])
while True:
    words = input("> ").split()
    verb = words[0]
    noun = words[1] if len(words) > 1 else ""
    if verb == "go":
        go(state, noun)
    elif verb == "look":
        describe(state["room"])
    elif verb == "quit":
        print("Goodbye.")
        break
    else:
        print("I don't understand that.")
`,
      hint: "In go(), store exits = rooms[state[\"room\"]][\"exits\"] and test if direction in exits:. In the loop, words = input(\"> \").split(), verb = words[0], and noun = words[1] if len(words) > 1 else \"\". Then an if/elif/else chain on verb handles the four cases.",
    },
    {
      type: "heading",
      text: "Stage 3: Pick things up",
    },
    {
      type: "prose",
      body: "Picking something up moves it from one list to another: `remove()` takes it out of the room's item list, and `append()` adds it to the player's inventory, the list of things they carry. The room really changes, so a `look` afterwards no longer lists the item.",
    },
    {
      type: "prose",
      body: "`take()` changes a list inside the global `rooms` dictionary, yet it needs no `global` line. The scope rules are about assigning to a name, and calling `remove()` on a list is not an assignment, so `rooms` still means the global dictionary.",
    },
    {
      type: "exercise",
      id: "project-text-adventure-3",
      prompt:
        "Add the player's inventory: create state with an empty list under \"inventory\" as well, as {\"room\": \"hall\", \"inventory\": []}. Add a function take(state, item): if item is in the current room's items, remove it from the room, append it to state[\"inventory\"], and print You take the, a space, the item, and a full stop, as in \"You take the key.\"; otherwise print There is no, a space, the item, a space, and here with a full stop, as in \"There is no key here.\" Add a function show_inventory(state) that prints You are carrying: followed by a space and the items joined by a comma and a space, as in \"You are carrying: key, bread\", or prints \"You are carrying nothing.\" when the list is empty. Then add two verbs to the loop: take calls take(state, noun), and inventory calls show_inventory(state). The program receives eight commands: inventory, take key, go east, take key, look, take bread, inventory, quit. The output should be exactly twenty-two lines: \"You are in a dusty entrance hall.\", then \"Exits: north, east\", then \"> inventory\", then \"You are carrying nothing.\", then \"> take key\", then \"There is no key here.\", then \"> go east\", then \"You are in a cold kitchen.\", then \"Exits: west\", then \"You see: bread, key\", then \"> take key\", then \"You take the key.\", then \"> look\", then \"You are in a cold kitchen.\", then \"Exits: west\", then \"You see: bread\", then \"> take bread\", then \"You take the bread.\", then \"> inventory\", then \"You are carrying: key, bread\", then \"> quit\", then \"Goodbye.\"",
      starterCode: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}


def describe(name):
    room = rooms[name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    if room["items"]:
        print("You see:", ", ".join(room["items"]))


def go(state, direction):
    exits = rooms[state["room"]]["exits"]
    if direction in exits:
        state["room"] = exits[direction]
        describe(state["room"])
    else:
        print("You can't go that way.")


state = {"room": "hall"}
describe(state["room"])
while True:
    words = input("> ").split()
    verb = words[0]
    noun = words[1] if len(words) > 1 else ""
    if verb == "go":
        go(state, noun)
    elif verb == "look":
        describe(state["room"])
    elif verb == "quit":
        print("Goodbye.")
        break
    else:
        print("I don't understand that.")
`,
      stdin: "inventory\ntake key\ngo east\ntake key\nlook\ntake bread\ninventory\nquit",
      check: {
        type: "stdout-exact",
        expected:
          "You are in a dusty entrance hall.\nExits: north, east\n> inventory\nYou are carrying nothing.\n> take key\nThere is no key here.\n> go east\nYou are in a cold kitchen.\nExits: west\nYou see: bread, key\n> take key\nYou take the key.\n> look\nYou are in a cold kitchen.\nExits: west\nYou see: bread\n> take bread\nYou take the bread.\n> inventory\nYou are carrying: key, bread\n> quit\nGoodbye.",
      },
      solution: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}


def describe(name):
    room = rooms[name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    if room["items"]:
        print("You see:", ", ".join(room["items"]))


def go(state, direction):
    exits = rooms[state["room"]]["exits"]
    if direction in exits:
        state["room"] = exits[direction]
        describe(state["room"])
    else:
        print("You can't go that way.")


def take(state, item):
    items = rooms[state["room"]]["items"]
    if item in items:
        items.remove(item)
        state["inventory"].append(item)
        print(f"You take the {item}.")
    else:
        print(f"There is no {item} here.")


def show_inventory(state):
    if state["inventory"]:
        print("You are carrying:", ", ".join(state["inventory"]))
    else:
        print("You are carrying nothing.")


state = {"room": "hall", "inventory": []}
describe(state["room"])
while True:
    words = input("> ").split()
    verb = words[0]
    noun = words[1] if len(words) > 1 else ""
    if verb == "go":
        go(state, noun)
    elif verb == "take":
        take(state, noun)
    elif verb == "inventory":
        show_inventory(state)
    elif verb == "look":
        describe(state["room"])
    elif verb == "quit":
        print("Goodbye.")
        break
    else:
        print("I don't understand that.")
`,
      hint: "In take(), store items = rooms[state[\"room\"]][\"items\"], then use if item in items: with items.remove(item) and state[\"inventory\"].append(item). show_inventory() tests if state[\"inventory\"]: and joins the list with \", \".join(). Add two elif branches for the new verbs before the else.",
    },
    {
      type: "heading",
      text: "Stage 4: A locked door",
    },
    {
      type: "prose",
      body: "A locked door is one more rule inside `go()`. A small dictionary, `locked`, maps a room to the item needed to enter it. Before moving, check whether the destination is in `locked` and, if it is, whether the player carries the item it needs. If not, print a message and leave `state[\"room\"]` alone.",
    },
    {
      type: "prose",
      body: "Keeping the rule in data pays off later: locking another room means adding one entry to `locked`, with no change to `go()`. The key you picked up in stage 3 now has a purpose.",
    },
    {
      type: "exercise",
      id: "project-text-adventure-4",
      prompt:
        "Lock the library: directly below rooms, add locked = {\"library\": \"key\"}, which maps a room to the item needed to enter it. Change go() so that when the room an exit leads to is in locked and the needed item is not in the player's inventory, it prints The, a space, the room name, a space, is locked. You need the, a space, the item, and a full stop, as in \"The library is locked. You need the key.\", and the player stays where they are. The program receives six commands: go north, go east, take key, go west, go north, quit. The output should be exactly nineteen lines: \"You are in a dusty entrance hall.\", then \"Exits: north, east\", then \"> go north\", then \"The library is locked. You need the key.\", then \"> go east\", then \"You are in a cold kitchen.\", then \"Exits: west\", then \"You see: bread, key\", then \"> take key\", then \"You take the key.\", then \"> go west\", then \"You are in a dusty entrance hall.\", then \"Exits: north, east\", then \"> go north\", then \"You are in a library full of old books.\", then \"Exits: south\", then \"You see: treasure\", then \"> quit\", then \"Goodbye.\"",
      starterCode: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}


def describe(name):
    room = rooms[name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    if room["items"]:
        print("You see:", ", ".join(room["items"]))


def go(state, direction):
    exits = rooms[state["room"]]["exits"]
    if direction in exits:
        state["room"] = exits[direction]
        describe(state["room"])
    else:
        print("You can't go that way.")


def take(state, item):
    items = rooms[state["room"]]["items"]
    if item in items:
        items.remove(item)
        state["inventory"].append(item)
        print(f"You take the {item}.")
    else:
        print(f"There is no {item} here.")


def show_inventory(state):
    if state["inventory"]:
        print("You are carrying:", ", ".join(state["inventory"]))
    else:
        print("You are carrying nothing.")


state = {"room": "hall", "inventory": []}
describe(state["room"])
while True:
    words = input("> ").split()
    verb = words[0]
    noun = words[1] if len(words) > 1 else ""
    if verb == "go":
        go(state, noun)
    elif verb == "take":
        take(state, noun)
    elif verb == "inventory":
        show_inventory(state)
    elif verb == "look":
        describe(state["room"])
    elif verb == "quit":
        print("Goodbye.")
        break
    else:
        print("I don't understand that.")
`,
      stdin: "go north\ngo east\ntake key\ngo west\ngo north\nquit",
      check: {
        type: "stdout-exact",
        expected:
          "You are in a dusty entrance hall.\nExits: north, east\n> go north\nThe library is locked. You need the key.\n> go east\nYou are in a cold kitchen.\nExits: west\nYou see: bread, key\n> take key\nYou take the key.\n> go west\nYou are in a dusty entrance hall.\nExits: north, east\n> go north\nYou are in a library full of old books.\nExits: south\nYou see: treasure\n> quit\nGoodbye.",
      },
      solution: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}
locked = {"library": "key"}


def describe(name):
    room = rooms[name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    if room["items"]:
        print("You see:", ", ".join(room["items"]))


def go(state, direction):
    exits = rooms[state["room"]]["exits"]
    if direction in exits:
        destination = exits[direction]
        if destination in locked and locked[destination] not in state["inventory"]:
            print(f"The {destination} is locked. You need the {locked[destination]}.")
        else:
            state["room"] = destination
            describe(destination)
    else:
        print("You can't go that way.")


def take(state, item):
    items = rooms[state["room"]]["items"]
    if item in items:
        items.remove(item)
        state["inventory"].append(item)
        print(f"You take the {item}.")
    else:
        print(f"There is no {item} here.")


def show_inventory(state):
    if state["inventory"]:
        print("You are carrying:", ", ".join(state["inventory"]))
    else:
        print("You are carrying nothing.")


state = {"room": "hall", "inventory": []}
describe(state["room"])
while True:
    words = input("> ").split()
    verb = words[0]
    noun = words[1] if len(words) > 1 else ""
    if verb == "go":
        go(state, noun)
    elif verb == "take":
        take(state, noun)
    elif verb == "inventory":
        show_inventory(state)
    elif verb == "look":
        describe(state["room"])
    elif verb == "quit":
        print("Goodbye.")
        break
    else:
        print("I don't understand that.")
`,
      hint: "Inside if direction in exits:, store destination = exits[direction]. Then test destination in locked and locked[destination] not in state[\"inventory\"]: print the locked message in that branch, and move and describe in an else branch.",
    },
    {
      type: "heading",
      text: "Stage 5: Win the game",
    },
    {
      type: "prose",
      body: "A game needs a way to win. After every command, the loop checks the state: once the treasure is in the inventory, it prints the winning message and ends with `break`. Checking at the end of the loop, rather than inside `take()`, keeps the winning rule in one obvious place.",
    },
    {
      type: "prose",
      body: "A move counter is one more entry in `state`, increased inside `go()`. Count only the moves that succeed, so walking into a wall or a locked door is not counted. The winning message then reports how many moves the player needed.",
    },
    {
      type: "exercise",
      id: "project-text-adventure-5",
      prompt:
        "Add \"moves\": 0 to state, and make go() add 1 to state[\"moves\"] each time the player actually moves to another room; refused moves do not count. At the end of each pass through the loop, after the command has been handled, check whether \"treasure\" is in the player's inventory. If it is, print \"You found the treasure in N moves!\" with N replaced by the number of moves, and end the loop. The program receives six commands: go north, go east, take key, go west, go north, take treasure. The output should be exactly twenty lines: \"You are in a dusty entrance hall.\", then \"Exits: north, east\", then \"> go north\", then \"The library is locked. You need the key.\", then \"> go east\", then \"You are in a cold kitchen.\", then \"Exits: west\", then \"You see: bread, key\", then \"> take key\", then \"You take the key.\", then \"> go west\", then \"You are in a dusty entrance hall.\", then \"Exits: north, east\", then \"> go north\", then \"You are in a library full of old books.\", then \"Exits: south\", then \"You see: treasure\", then \"> take treasure\", then \"You take the treasure.\", then \"You found the treasure in 3 moves!\"",
      starterCode: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}
locked = {"library": "key"}


def describe(name):
    room = rooms[name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    if room["items"]:
        print("You see:", ", ".join(room["items"]))


def go(state, direction):
    exits = rooms[state["room"]]["exits"]
    if direction in exits:
        destination = exits[direction]
        if destination in locked and locked[destination] not in state["inventory"]:
            print(f"The {destination} is locked. You need the {locked[destination]}.")
        else:
            state["room"] = destination
            describe(destination)
    else:
        print("You can't go that way.")


def take(state, item):
    items = rooms[state["room"]]["items"]
    if item in items:
        items.remove(item)
        state["inventory"].append(item)
        print(f"You take the {item}.")
    else:
        print(f"There is no {item} here.")


def show_inventory(state):
    if state["inventory"]:
        print("You are carrying:", ", ".join(state["inventory"]))
    else:
        print("You are carrying nothing.")


state = {"room": "hall", "inventory": []}
describe(state["room"])
while True:
    words = input("> ").split()
    verb = words[0]
    noun = words[1] if len(words) > 1 else ""
    if verb == "go":
        go(state, noun)
    elif verb == "take":
        take(state, noun)
    elif verb == "inventory":
        show_inventory(state)
    elif verb == "look":
        describe(state["room"])
    elif verb == "quit":
        print("Goodbye.")
        break
    else:
        print("I don't understand that.")
`,
      stdin: "go north\ngo east\ntake key\ngo west\ngo north\ntake treasure",
      check: {
        type: "stdout-exact",
        expected:
          "You are in a dusty entrance hall.\nExits: north, east\n> go north\nThe library is locked. You need the key.\n> go east\nYou are in a cold kitchen.\nExits: west\nYou see: bread, key\n> take key\nYou take the key.\n> go west\nYou are in a dusty entrance hall.\nExits: north, east\n> go north\nYou are in a library full of old books.\nExits: south\nYou see: treasure\n> take treasure\nYou take the treasure.\nYou found the treasure in 3 moves!",
      },
      solution: `rooms = {
    "hall": {
        "description": "You are in a dusty entrance hall.",
        "exits": {"north": "library", "east": "kitchen"},
        "items": [],
    },
    "kitchen": {
        "description": "You are in a cold kitchen.",
        "exits": {"west": "hall"},
        "items": ["bread", "key"],
    },
    "library": {
        "description": "You are in a library full of old books.",
        "exits": {"south": "hall"},
        "items": ["treasure"],
    },
}
locked = {"library": "key"}


def describe(name):
    room = rooms[name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    if room["items"]:
        print("You see:", ", ".join(room["items"]))


def go(state, direction):
    exits = rooms[state["room"]]["exits"]
    if direction in exits:
        destination = exits[direction]
        if destination in locked and locked[destination] not in state["inventory"]:
            print(f"The {destination} is locked. You need the {locked[destination]}.")
        else:
            state["room"] = destination
            state["moves"] += 1
            describe(destination)
    else:
        print("You can't go that way.")


def take(state, item):
    items = rooms[state["room"]]["items"]
    if item in items:
        items.remove(item)
        state["inventory"].append(item)
        print(f"You take the {item}.")
    else:
        print(f"There is no {item} here.")


def show_inventory(state):
    if state["inventory"]:
        print("You are carrying:", ", ".join(state["inventory"]))
    else:
        print("You are carrying nothing.")


state = {"room": "hall", "inventory": [], "moves": 0}
describe(state["room"])
while True:
    words = input("> ").split()
    verb = words[0]
    noun = words[1] if len(words) > 1 else ""
    if verb == "go":
        go(state, noun)
    elif verb == "take":
        take(state, noun)
    elif verb == "inventory":
        show_inventory(state)
    elif verb == "look":
        describe(state["room"])
    elif verb == "quit":
        print("Goodbye.")
        break
    else:
        print("I don't understand that.")
    if "treasure" in state["inventory"]:
        print(f"You found the treasure in {state['moves']} moves!")
        break
`,
      hint: "Add state[\"moves\"] += 1 in the branch of go() that moves the player, next to state[\"room\"] = destination. At the very end of the loop body, with the same indentation as the if/elif chain, write if \"treasure\" in state[\"inventory\"]:, print the message with an f-string, and break.",
    },
    {
      type: "heading",
      text: "Extending the program",
    },
    {
      type: "prose",
      body: "The map grows by adding entries to `rooms`, so try a garden or a cellar with exits back to the house. Other ideas: a `drop` command that reverses `take`, a `help` command that lists the verbs, a dark room that you can enter only while carrying a lamp, or a limit on moves that ends the game in defeat. Saving `state` to a JSON file would even let a player stop and continue later.",
    },
  ],
};

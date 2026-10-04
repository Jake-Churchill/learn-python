export default {
  slug: "project-todo-manager",
  title: "To-Do List Manager",
  unit: "Projects",
  blocks: [
    {
      type: "prose",
      body: "This project builds a to-do list manager: a program that keeps a list of tasks and responds to typed commands. `add Buy milk` adds a task, `list` shows every task with a number, `done 1` ticks off task number 1, `remove 2` deletes task number 2, and `quit` stops the program. Until you quit, it keeps reading one command after another.",
    },
    {
      type: "prose",
      body: "You build it in four stages, and each stage is one exercise. The starter code for each stage is the solution to the stage before, so work through them in order. If a stage defeats you, its solution appears after a failed check, and the next stage starts from that solution anyway.",
    },
    {
      type: "prose",
      body: "On this site you cannot type while a program runs. As in the guessing game from the Loops review, each stage comes with a fixed list of commands as its input, one per line, and the output shows each command after the `> ` prompt.",
    },
    {
      type: "heading",
      text: "Planning the data",
    },
    {
      type: "prose",
      body: "Each task needs two pieces of information: its title and whether it is finished. A dictionary holds both, as in `{\"title\": \"Buy milk\", \"done\": False}`. The whole to-do list is a list of these dictionaries, because a list keeps the tasks in the order they were added and lets you reach each one by its position.",
    },
    {
      type: "prose",
      body: "People count from 1, but list indexes start at 0, so the task shown as number 1 lives at index 0. Converting between the two, by adding or subtracting 1, is the one tricky part of this program.",
    },
    {
      type: "heading",
      text: "Stage 1: Show the tasks",
    },
    {
      type: "prose",
      body: "Start with the part that displays the list, because every later stage uses it. `show_tasks()` takes the list and prints one line per task with a checkbox: `[x]` for a finished task and `[ ]` for an unfinished one. `enumerate()` with `start=1` hands you each task's number alongside the task.",
    },
    {
      type: "prose",
      body: "An empty list deserves a message of its own, because a `list` command that prints nothing looks like a bug. An empty list counts as false, so `if not tasks:` catches it.",
    },
    {
      type: "exercise",
      id: "project-todo-manager-1",
      prompt:
        "Finish show_tasks(tasks). If tasks is empty, print No tasks yet. Otherwise print one line per task: its number counting from 1, a period and a space, then [x] if the task is done or [ ] (a space between the brackets) if it is not, then a space and the title. The calls at the bottom should print exactly three lines: No tasks yet, then 1. [ ] Buy milk, then 2. [x] Call Ada",
      starterCode: `def show_tasks(tasks):
    pass  # print the tasks here


tasks = [
    {"title": "Buy milk", "done": False},
    {"title": "Call Ada", "done": True},
]
show_tasks([])
show_tasks(tasks)
`,
      check: {
        type: "stdout-exact",
        expected: "No tasks yet\n1. [ ] Buy milk\n2. [x] Call Ada",
      },
      solution: `def show_tasks(tasks):
    if not tasks:
        print("No tasks yet")
        return
    for number, task in enumerate(tasks, start=1):
        mark = "x" if task["done"] else " "
        print(f"{number}. [{mark}] {task['title']}")


tasks = [
    {"title": "Buy milk", "done": False},
    {"title": "Call Ada", "done": True},
]
show_tasks([])
show_tasks(tasks)
`,
      hint: "Handle the empty list first: if not tasks:, print the message, then return. After that, loop with for number, task in enumerate(tasks, start=1): and choose the mark with a conditional expression: \"x\" if task[\"done\"] else \" \".",
    },
    {
      type: "heading",
      text: "Stage 2: Read commands",
    },
    {
      type: "prose",
      body: "A program driven by commands is a loop that reads a command, works out what it means, acts on it, and goes back for the next one. `while True:` keeps the loop going, and the `quit` command is the only way out, through `break`.",
    },
    {
      type: "prose",
      body: "Each command is one line of text, such as `add Buy milk`. `split()` breaks it into words, and the first word says what to do. For `add`, the remaining words joined back together with spaces form the title: `\" \".join(words[1:])` keeps a title of several words in one piece.",
    },
    {
      type: "exercise",
      id: "project-todo-manager-2",
      prompt:
        "Replace the sample tasks list and the two show_tasks() calls at the bottom with the main program. Start with an empty list named tasks, then loop forever: read a command with the exact prompt > (a greater-than sign and a space) and split it into words. If the first word is add, join the remaining words with spaces to make the title, append {\"title\": title, \"done\": False} to tasks, and print Added: followed by a space and the title. If it is list, call show_tasks(tasks). If it is quit, print Goodbye and leave the loop. For any other word, print Unknown command: followed by a space and the word. The program receives six commands: list, add Buy milk, add Call Ada, dance, list, quit. The output should be exactly thirteen lines: > list, then No tasks yet, then > add Buy milk, then Added: Buy milk, then > add Call Ada, then Added: Call Ada, then > dance, then Unknown command: dance, then > list, then 1. [ ] Buy milk, then 2. [ ] Call Ada, then > quit, then Goodbye",
      starterCode: `def show_tasks(tasks):
    if not tasks:
        print("No tasks yet")
        return
    for number, task in enumerate(tasks, start=1):
        mark = "x" if task["done"] else " "
        print(f"{number}. [{mark}] {task['title']}")


tasks = [
    {"title": "Buy milk", "done": False},
    {"title": "Call Ada", "done": True},
]
show_tasks([])
show_tasks(tasks)
`,
      stdin: "list\nadd Buy milk\nadd Call Ada\ndance\nlist\nquit",
      check: {
        type: "stdout-exact",
        expected:
          "> list\nNo tasks yet\n> add Buy milk\nAdded: Buy milk\n> add Call Ada\nAdded: Call Ada\n> dance\nUnknown command: dance\n> list\n1. [ ] Buy milk\n2. [ ] Call Ada\n> quit\nGoodbye",
      },
      solution: `def show_tasks(tasks):
    if not tasks:
        print("No tasks yet")
        return
    for number, task in enumerate(tasks, start=1):
        mark = "x" if task["done"] else " "
        print(f"{number}. [{mark}] {task['title']}")


tasks = []
while True:
    words = input("> ").split()
    action = words[0]
    if action == "add":
        title = " ".join(words[1:])
        tasks.append({"title": title, "done": False})
        print("Added:", title)
    elif action == "list":
        show_tasks(tasks)
    elif action == "quit":
        print("Goodbye")
        break
    else:
        print("Unknown command:", action)
`,
      hint: "Inside while True:, store input(\"> \").split() in words and words[0] in action, then use an if/elif/else chain on action. The add branch builds the title with \" \".join(words[1:]), and the quit branch needs break after its print().",
    },
    {
      type: "heading",
      text: "Stage 3: Finish and remove tasks",
    },
    {
      type: "prose",
      body: "`done 1` and `remove 2` name a task by the number that `list` shows. Convert the second word with `int()` and subtract 1 to get the index. Marking a task done changes the dictionary inside the list, with `tasks[index][\"done\"] = True`, and the list keeps its length.",
    },
    {
      type: "prose",
      body: "Removing works differently. `pop(index)` takes the task out of the list and hands it back, so you can still print its title. Every task after it moves up one place, which changes the numbers that `list` shows, so this stage's input ends with `list` to show the renumbered tasks.",
    },
    {
      type: "exercise",
      id: "project-todo-manager-3",
      prompt:
        "Add two commands to the if/elif chain, before the else. done N marks task number N as done and prints Done: followed by a space and the task's title. remove N removes task number N from the list and prints Removed: followed by a space and the task's title. N counts from 1, as list shows it. The program receives seven commands: add Buy milk, add Call Ada, add Water plants, done 1, remove 2, list, quit. The output should be exactly fifteen lines: > add Buy milk, then Added: Buy milk, then > add Call Ada, then Added: Call Ada, then > add Water plants, then Added: Water plants, then > done 1, then Done: Buy milk, then > remove 2, then Removed: Call Ada, then > list, then 1. [x] Buy milk, then 2. [ ] Water plants, then > quit, then Goodbye",
      starterCode: `def show_tasks(tasks):
    if not tasks:
        print("No tasks yet")
        return
    for number, task in enumerate(tasks, start=1):
        mark = "x" if task["done"] else " "
        print(f"{number}. [{mark}] {task['title']}")


tasks = []
while True:
    words = input("> ").split()
    action = words[0]
    if action == "add":
        title = " ".join(words[1:])
        tasks.append({"title": title, "done": False})
        print("Added:", title)
    elif action == "list":
        show_tasks(tasks)
    elif action == "quit":
        print("Goodbye")
        break
    else:
        print("Unknown command:", action)
`,
      stdin: "add Buy milk\nadd Call Ada\nadd Water plants\ndone 1\nremove 2\nlist\nquit",
      check: {
        type: "stdout-exact",
        expected:
          "> add Buy milk\nAdded: Buy milk\n> add Call Ada\nAdded: Call Ada\n> add Water plants\nAdded: Water plants\n> done 1\nDone: Buy milk\n> remove 2\nRemoved: Call Ada\n> list\n1. [x] Buy milk\n2. [ ] Water plants\n> quit\nGoodbye",
      },
      solution: `def show_tasks(tasks):
    if not tasks:
        print("No tasks yet")
        return
    for number, task in enumerate(tasks, start=1):
        mark = "x" if task["done"] else " "
        print(f"{number}. [{mark}] {task['title']}")


tasks = []
while True:
    words = input("> ").split()
    action = words[0]
    if action == "add":
        title = " ".join(words[1:])
        tasks.append({"title": title, "done": False})
        print("Added:", title)
    elif action == "list":
        show_tasks(tasks)
    elif action == "done":
        index = int(words[1]) - 1
        tasks[index]["done"] = True
        print("Done:", tasks[index]["title"])
    elif action == "remove":
        task = tasks.pop(int(words[1]) - 1)
        print("Removed:", task["title"])
    elif action == "quit":
        print("Goodbye")
        break
    else:
        print("Unknown command:", action)
`,
      hint: "In both new branches the index is int(words[1]) - 1. For done, set tasks[index][\"done\"] = True and print that task's title. For remove, task = tasks.pop(index) hands back the removed dictionary, so you can print task[\"title\"].",
    },
    {
      type: "heading",
      text: "Stage 4: Handle mistakes",
    },
    {
      type: "prose",
      body: "People mistype. Right now `done 9` crashes with an `IndexError`, `done two` crashes with a `ValueError`, and `add` on its own adds a task with an empty title. A program that people use should answer a bad command with a message and keep going.",
    },
    {
      type: "prose",
      body: "`done` and `remove` need the same check, so write it once as a function. `task_index(tasks, words)` returns the index when the command has exactly two words, the second is made of digits, and the number matches a task. Otherwise it prints a message and returns `None`. Testing with `isdigit()` first means `int()` never sees text it cannot convert.",
    },
    {
      type: "prose",
      body: "Test the result with `is not None`, not with a plain `if index:`; `is not` is the opposite of `is`, just as `not in` is the opposite of `in`. The index of the first task is 0, which counts as false, so `if index:` would refuse to touch task number 1.",
    },
    {
      type: "exercise",
      id: "project-todo-manager-4",
      prompt:
        "Write a function task_index(tasks, words) above the loop. It returns the list index for the task number in words[1] when words has exactly two items, words[1] is made only of digits, and the number is from 1 to the number of tasks. Otherwise it prints No task with that number and returns None. Use it in the done and remove branches, acting only when its result is not None. Also make add print Nothing to add, and add nothing, when no title follows it. The program receives eight commands: add, add Buy milk, done 3, done two, remove, done 1, list, quit. The output should be exactly sixteen lines: > add, then Nothing to add, then > add Buy milk, then Added: Buy milk, then > done 3, then No task with that number, then > done two, then No task with that number, then > remove, then No task with that number, then > done 1, then Done: Buy milk, then > list, then 1. [x] Buy milk, then > quit, then Goodbye",
      starterCode: `def show_tasks(tasks):
    if not tasks:
        print("No tasks yet")
        return
    for number, task in enumerate(tasks, start=1):
        mark = "x" if task["done"] else " "
        print(f"{number}. [{mark}] {task['title']}")


tasks = []
while True:
    words = input("> ").split()
    action = words[0]
    if action == "add":
        title = " ".join(words[1:])
        tasks.append({"title": title, "done": False})
        print("Added:", title)
    elif action == "list":
        show_tasks(tasks)
    elif action == "done":
        index = int(words[1]) - 1
        tasks[index]["done"] = True
        print("Done:", tasks[index]["title"])
    elif action == "remove":
        task = tasks.pop(int(words[1]) - 1)
        print("Removed:", task["title"])
    elif action == "quit":
        print("Goodbye")
        break
    else:
        print("Unknown command:", action)
`,
      stdin: "add\nadd Buy milk\ndone 3\ndone two\nremove\ndone 1\nlist\nquit",
      check: {
        type: "stdout-exact",
        expected:
          "> add\nNothing to add\n> add Buy milk\nAdded: Buy milk\n> done 3\nNo task with that number\n> done two\nNo task with that number\n> remove\nNo task with that number\n> done 1\nDone: Buy milk\n> list\n1. [x] Buy milk\n> quit\nGoodbye",
      },
      solution: `def show_tasks(tasks):
    if not tasks:
        print("No tasks yet")
        return
    for number, task in enumerate(tasks, start=1):
        mark = "x" if task["done"] else " "
        print(f"{number}. [{mark}] {task['title']}")


def task_index(tasks, words):
    if len(words) == 2 and words[1].isdigit():
        index = int(words[1]) - 1
        if 0 <= index < len(tasks):
            return index
    print("No task with that number")
    return None


tasks = []
while True:
    words = input("> ").split()
    action = words[0]
    if action == "add":
        title = " ".join(words[1:])
        if title:
            tasks.append({"title": title, "done": False})
            print("Added:", title)
        else:
            print("Nothing to add")
    elif action == "list":
        show_tasks(tasks)
    elif action == "done":
        index = task_index(tasks, words)
        if index is not None:
            tasks[index]["done"] = True
            print("Done:", tasks[index]["title"])
    elif action == "remove":
        index = task_index(tasks, words)
        if index is not None:
            task = tasks.pop(index)
            print("Removed:", task["title"])
    elif action == "quit":
        print("Goodbye")
        break
    else:
        print("Unknown command:", action)
`,
      hint: "In task_index(), check len(words) == 2 and words[1].isdigit() first; inside that if, compute index = int(words[1]) - 1 and return it when 0 <= index < len(tasks). In the loop, write index = task_index(tasks, words) and indent the existing code under if index is not None:. For add, an empty title counts as false, so if title: and else: choose between the two messages.",
    },
    {
      type: "heading",
      text: "Extending the program",
    },
    {
      type: "prose",
      body: "The manager forgets everything when it stops. Writing the tasks to a file when the user quits, and reading them back at the start, would make it remember; JSON suits a list of dictionaries well. Other ideas to try: a count of finished tasks at the end of `list`, a `clear` command that keeps only the unfinished tasks using a list comprehension, and an `undo` command that puts back the last removed task.",
    },
  ],
};

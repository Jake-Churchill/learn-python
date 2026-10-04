export default {
  slug: "composition-and-polymorphism",
  title: "Composition & Polymorphism",
  unit: "Object-Oriented Python",
  blocks: [
    {
      type: "prose",
      body: "Real programs are made of many objects working together. This lesson covers the two ways classes connect, inheritance and composition, and how one piece of code can work with many different classes. The last part helps you choose between inheritance and composition.",
    },
    {
      type: "heading",
      text: "Is-a and has-a",
    },
    {
      type: "prose",
      body: "Inheritance describes an is-a relationship: a manager is an employee, so `Manager` inherits from `Employee`. Many relationships are has-a instead: an order has a customer, and a car has an engine. A car is not a kind of engine, so making `Car` a subclass of `Engine` would be wrong.",
    },
    {
      type: "prose",
      body: "Composition models has-a. The outer object stores the inner object in an attribute and calls the inner object's methods when it needs them. Handing a job to another object this way is called delegation.",
    },
    {
      type: "example",
      code: `class Item:
    def __init__(self, name, price):
        self.name = name
        self.price = price

class Customer:
    def __init__(self, name, email):
        self.name = name
        self.email = email

class Order:
    def __init__(self, customer):
        self.customer = customer
        self.items = []

    def add(self, item):
        self.items.append(item)

    def total(self):
        return sum(item.price for item in self.items)

    def receipt(self):
        lines = [f"Order for {self.customer.name}"]
        for item in self.items:
            lines.append(f"  {item.name}: \${item.price:.2f}")
        lines.append(f"Total: \${self.total():.2f}")
        return "\\n".join(lines)

order = Order(Customer("Ada", "ada@example.com"))
order.add(Item("lamp", 24.5))
order.add(Item("mug", 8.0))
print(order.receipt())`,
    },
    {
      type: "prose",
      body: "The order reaches the customer's name through two dots, `self.customer.name`: first the attribute holding the customer, then that customer's own attribute. `Order` does not copy any customer or item data. It holds the objects and asks them for what it needs.",
    },
    {
      type: "exercise",
      id: "composition-and-polymorphism-1",
      prompt:
        "A Customer has an address, stored as an Address object. Replace pass in Customer.label() so that it returns the customer's name, a colon and a space, and then the result of the address's one_line() method, as in Ada: 12 Elm St, London.",
      starterCode: `class Address:
    def __init__(self, street, city):
        self.street = street
        self.city = city

    def one_line(self):
        return f"{self.street}, {self.city}"

class Customer:
    def __init__(self, name, address):
        self.name = name
        self.address = address

    def label(self):
        pass
`,
      check: {
        type: "returns",
        cases: [
          {
            call: "Customer('Ada', Address('12 Elm St', 'London')).label()",
            expected: "'Ada: 12 Elm St, London'",
          },
          {
            call: "Customer('Alan', Address('3 Oak Rd', 'Leeds')).label()",
            expected: "'Alan: 3 Oak Rd, Leeds'",
          },
        ],
      },
      solution: `class Address:
    def __init__(self, street, city):
        self.street = street
        self.city = city

    def one_line(self):
        return f"{self.street}, {self.city}"

class Customer:
    def __init__(self, name, address):
        self.name = name
        self.address = address

    def label(self):
        return f"{self.name}: {self.address.one_line()}"
`,
      hint: "The address object is self.address, so its method is called with self.address.one_line(). Put that call inside an f-string after self.name.",
    },
    {
      type: "heading",
      text: "Polymorphism and duck typing",
    },
    {
      type: "prose",
      body: "Polymorphism means one piece of code working with values of different types, each responding in its own way. You have relied on it all along: `len()` works on strings, lists, and dictionaries. With classes, it means several classes offering a method with the same name, so code can call that method without knowing which class it has.",
    },
    {
      type: "prose",
      body: "Python does not check an object's class before calling a method. It only looks for a method with that name at the moment of the call, and raises an `AttributeError` if there is none. This style is called duck typing, after the saying that if it walks like a duck and quacks like a duck, it is a duck.",
    },
    {
      type: "prose",
      body: "The three payment classes below share no parent class. They only agree on one thing: each has a `pay()` method that takes an amount and returns a message.",
    },
    {
      type: "example",
      code: `class CardPayment:
    def __init__(self, last_digits):
        self.last_digits = last_digits

    def pay(self, amount):
        return f"Charged \${amount:.2f} to card ending {self.last_digits}"

class CashPayment:
    def pay(self, amount):
        return f"Received \${amount:.2f} in cash"

class GiftCard:
    def __init__(self, balance):
        self.balance = balance

    def pay(self, amount):
        self.balance -= amount
        return f"Gift card paid \${amount:.2f}, \${self.balance:.2f} left"

def checkout(total, payment):
    print(payment.pay(total))

for payment in [CardPayment("4242"), CashPayment(), GiftCard(50)]:
    checkout(12.5, payment)`,
    },
    {
      type: "prose",
      body: "`checkout()` works with any object that has a `pay()` method, including classes written long after `checkout()` itself. `CashPayment` has no `__init__`, which is allowed: `CashPayment()` creates an instance with no attributes of its own.",
    },
    {
      type: "exercise",
      id: "composition-and-polymorphism-2",
      prompt:
        "Song is written for you, and its duration() method returns a length in seconds. Write a class Podcast whose __init__ takes a title and a number of minutes, with a duration() method that returns the length in seconds (minutes times 60). Then write a function total_duration(items) that returns the sum of duration() for every item in the list, whether it is a Song or a Podcast.",
      starterCode: `class Song:
    def __init__(self, title, seconds):
        self.title = title
        self.seconds = seconds

    def duration(self):
        return self.seconds

# write the Podcast class and the total_duration function below
`,
      check: {
        type: "returns",
        cases: [
          { call: "Podcast('News', 15).duration()", expected: "900" },
          { call: "total_duration([Song('Drive', 200), Podcast('News', 15)])", expected: "1100" },
          { call: "total_duration([Song('Drive', 200), Song('Holiday', 180)])", expected: "380" },
          { call: "total_duration([])", expected: "0" },
        ],
      },
      solution: `class Song:
    def __init__(self, title, seconds):
        self.title = title
        self.seconds = seconds

    def duration(self):
        return self.seconds

class Podcast:
    def __init__(self, title, minutes):
        self.title = title
        self.minutes = minutes

    def duration(self):
        return self.minutes * 60

def total_duration(items):
    return sum(item.duration() for item in items)
`,
      hint: "Podcast stores title and minutes, and its duration() returns self.minutes * 60. total_duration() does not need to know which class each item is: sum(item.duration() for item in items) works for both.",
    },
    {
      type: "heading",
      text: "Choosing between inheritance and composition",
    },
    {
      type: "prose",
      body: "Ask whether the sentence \"a child is a parent\" is true in every situation. If it is, and the child should be able to do everything the parent can, inheritance fits. A savings account is an account, and anything you can do with an account you can do with a savings account.",
    },
    {
      type: "prose",
      body: "If the honest sentence is \"one has another\" or \"one uses another\", choose composition. It keeps classes small and separate, and you can swap the inner object without changing the outer class, such as giving an order a different customer or a gift card instead of cash.",
    },
    {
      type: "prose",
      body: "When you are unsure, start with composition. Inheritance ties a child to every detail of its parent, and long chains of parents and grandparents become hard to follow. Duck typing often removes the need for a shared parent altogether, as the payment classes showed.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Inheriting just to reuse a few methods is the most common mistake. `class Car(Engine):` gives every car the engine's methods, but a car is not an engine, and the class now claims something that is not true. Store an engine in an attribute instead.",
    },
    {
      type: "prose",
      body: "With duck typing, a missing or misspelled method shows up only when the code runs. If one class names its method `pay()` and another names it `make_payment()`, the loop fails with an `AttributeError` when it reaches the second. Keep the shared method name and its parameters exactly the same in every class.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "Inheritance models is-a, and composition models has-a by storing one object in another's attribute and delegating work to it. Polymorphism lets one piece of code work with many classes, and duck typing means Python only needs the method to exist when it is called. Prefer composition unless the child truly is a kind of the parent.",
    },
    {
      type: "exercise",
      id: "composition-and-polymorphism-3",
      prompt:
        "Player is written for you. Write a class Team whose __init__ takes a name, stores it in self.name, and creates an empty list in self.players. Add a method add(player) that appends a Player to the list, a method total_goals() that returns the sum of every player's goals, and a method top_scorer() that returns the name of the player with the most goals. The code at the bottom uses your class, so the output should be exactly two lines: Rovers 9 and then Top scorer: Grace",
      starterCode: `class Player:
    def __init__(self, name, goals):
        self.name = name
        self.goals = goals

# write the Team class here


team = Team("Rovers")
team.add(Player("Ada", 3))
team.add(Player("Grace", 5))
team.add(Player("Alan", 1))
print(team.name, team.total_goals())
print("Top scorer:", team.top_scorer())
`,
      check: { type: "stdout-exact", expected: "Rovers 9\nTop scorer: Grace" },
      solution: `class Player:
    def __init__(self, name, goals):
        self.name = name
        self.goals = goals

class Team:
    def __init__(self, name):
        self.name = name
        self.players = []

    def add(self, player):
        self.players.append(player)

    def total_goals(self):
        return sum(player.goals for player in self.players)

    def top_scorer(self):
        best = max(self.players, key=lambda player: player.goals)
        return best.name


team = Team("Rovers")
team.add(Player("Ada", 3))
team.add(Player("Grace", 5))
team.add(Player("Alan", 1))
print(team.name, team.total_goals())
print("Top scorer:", team.top_scorer())
`,
      hint: "total_goals() can return sum(player.goals for player in self.players). For top_scorer(), max() with key=lambda player: player.goals finds the best Player object; return its name.",
    },
  ],
};

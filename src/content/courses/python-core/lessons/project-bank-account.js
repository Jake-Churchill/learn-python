export default {
  slug: "project-bank-account",
  title: "Bank Account",
  unit: "Projects",
  blocks: [
    {
      type: "prose",
      body: "This project builds a bank account class and a small program that runs a batch of transactions through it. The account protects its balance: no outside code can set the balance directly, every deposit and withdrawal must be a positive amount, and a withdrawal larger than the balance is refused with a clear error. The account also keeps a history of every transaction that succeeded.",
    },
    {
      type: "prose",
      body: "Those rules are the jobs that properties and exceptions were made for. You build the program in four stages, and the starter code for each stage is the solution to the stage before, so work through them in order. The first two stages check what the class's methods return or raise, and the last two check what the program prints.",
    },
    {
      type: "heading",
      text: "Stage 1: The account and its balance",
    },
    {
      type: "prose",
      body: "The balance lives in `self._balance`, marked private by its underscore. A read-only property named `balance` lets outside code read it as `account.balance` but not assign to it. The only way to change the balance is then through `deposit()` and `withdraw()`, which gives the class one place to enforce its rules.",
    },
    {
      type: "prose",
      body: "Each method returns the new balance, so the caller sees the result straight away: `Account(\"Ada\", 100).deposit(50)` gives 150. The `balance=0` default in `__init__` lets you open an empty account with just a name.",
    },
    {
      type: "exercise",
      id: "project-bank-account-1",
      prompt:
        "Add three things to the Account class: a read-only property balance that returns self._balance, a method deposit(amount) that adds amount to the balance and returns the new balance, and a method withdraw(amount) that subtracts amount from the balance and returns the new balance. For example, Account('Ada').balance is 0 and Account('Ada', 100).withdraw(30) returns 70.",
      starterCode: `class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    # add the balance property, deposit(), and withdraw() here
`,
      check: {
        type: "returns",
        cases: [
          { call: "Account('Ada').balance", expected: "0" },
          { call: "Account('Ada', 100).balance", expected: "100" },
          { call: "Account('Ada', 100).deposit(50)", expected: "150" },
          { call: "Account('Ada', 100).withdraw(30)", expected: "70" },
        ],
      },
      solution: `class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        self._balance += amount
        return self._balance

    def withdraw(self, amount):
        self._balance -= amount
        return self._balance
`,
      hint: "Write @property on the line above def balance(self): and return self._balance. In deposit(), use self._balance += amount and then return self._balance. withdraw() is the same with -=.",
    },
    {
      type: "heading",
      text: "Stage 2: Refuse bad amounts",
    },
    {
      type: "prose",
      body: "Two kinds of mistake call for two kinds of exception. An amount of zero or less is a value that cannot be used, which is exactly what `ValueError` means. Withdrawing more than the balance is a problem particular to banking, so it gets a custom exception class with a name of its own, `InsufficientFundsError`, written as a subclass of `Exception`.",
    },
    {
      type: "prose",
      body: "Put the checks at the top of each method, before the balance changes. When `raise` runs, the method stops at once, so a refused withdrawal leaves the balance exactly as it was. Check the amount first and the funds second, so that a negative amount is reported as a bad amount.",
    },
    {
      type: "exercise",
      id: "project-bank-account-2",
      prompt:
        "Add a class InsufficientFundsError, a subclass of Exception, above Account. Make deposit() and withdraw() raise ValueError(\"amount must be positive\") when amount is 0 or less. Make withdraw() also raise InsufficientFundsError when amount is more than the balance, with a message in the form cannot withdraw 150 from a balance of 100. Check the amount before the balance. Withdrawing the whole balance is allowed. For example, Account('Ada', 100).withdraw(150) raises InsufficientFundsError with the message cannot withdraw 150 from a balance of 100. If a call goes wrong, the check shows what it returned or raised next to what was expected.",
      starterCode: `class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        self._balance += amount
        return self._balance

    def withdraw(self, amount):
        self._balance -= amount
        return self._balance
`,
      check: {
        type: "returns",
        cases: [
          { call: "Account('Ada', 100).deposit(0)", expected: "raised ValueError: amount must be positive" },
          { call: "Account('Ada', 100).withdraw(-5)", expected: "raised ValueError: amount must be positive" },
          {
            call: "Account('Ada', 100).withdraw(150)",
            expected: "raised InsufficientFundsError: cannot withdraw 150 from a balance of 100",
          },
          { call: "Account('Ada', 100).withdraw(100)", expected: "0" },
          { call: "Account('Ada', 100).deposit(25)", expected: "125" },
        ],
      },
      solution: `class InsufficientFundsError(Exception):
    pass


class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount
        return self._balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFundsError(f"cannot withdraw {amount} from a balance of {self._balance}")
        self._balance -= amount
        return self._balance
`,
      hint: "The exception class needs only pass in its body. At the top of both methods, write if amount <= 0: and raise the ValueError. In withdraw(), add a second check, if amount > self._balance:, that raises InsufficientFundsError with an f-string message.",
    },
    {
      type: "heading",
      text: "Stage 3: Keep a history",
    },
    {
      type: "prose",
      body: "A bank records every transaction. Each record is a pair of facts, the action and the amount, which a tuple such as `(\"deposit\", 50)` holds neatly, and the records go into a list in the order they happened. The list must be created in `__init__`, so that every account gets its own.",
    },
    {
      type: "prose",
      body: "Append the record at the end of each method, after the balance has changed. A refused withdrawal raises before it gets that far, so it never appears in the history. The starter now ends with test lines, and a `__str__` method makes `print(account)` show a readable summary instead of a description of the object.",
    },
    {
      type: "exercise",
      id: "project-bank-account-3",
      prompt:
        "Give the class a transaction history: __init__ creates an empty list in self.history, and every successful deposit or withdrawal appends a tuple of the action and the amount, such as (\"deposit\", 50). A refused withdrawal must not be recorded. Also add a __str__ method that returns the owner, a colon, a space, the word balance, a space, and the balance, as in Ada: balance 120. The test lines at the bottom should then print exactly three lines: Refused: cannot withdraw 500 from a balance of 120, then [('deposit', 50), ('withdraw', 30)], then Ada: balance 120",
      starterCode: `class InsufficientFundsError(Exception):
    pass


class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount
        return self._balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFundsError(f"cannot withdraw {amount} from a balance of {self._balance}")
        self._balance -= amount
        return self._balance


account = Account("Ada", 100)
account.deposit(50)
account.withdraw(30)
try:
    account.withdraw(500)
except InsufficientFundsError as error:
    print("Refused:", error)
print(account.history)
print(account)
`,
      check: {
        type: "stdout-exact",
        expected:
          "Refused: cannot withdraw 500 from a balance of 120\n[('deposit', 50), ('withdraw', 30)]\nAda: balance 120",
      },
      solution: `class InsufficientFundsError(Exception):
    pass


class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance
        self.history = []

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount
        self.history.append(("deposit", amount))
        return self._balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFundsError(f"cannot withdraw {amount} from a balance of {self._balance}")
        self._balance -= amount
        self.history.append(("withdraw", amount))
        return self._balance

    def __str__(self):
        return f"{self.owner}: balance {self._balance}"


account = Account("Ada", 100)
account.deposit(50)
account.withdraw(30)
try:
    account.withdraw(500)
except InsufficientFundsError as error:
    print("Refused:", error)
print(account.history)
print(account)
`,
      hint: "Add self.history = [] to __init__. In each method, just before the return, append a tuple: self.history.append((\"deposit\", amount)), with double parentheses because the tuple is one argument. __str__ returns f\"{self.owner}: balance {self._balance}\".",
    },
    {
      type: "heading",
      text: "Stage 4: Process a batch of transactions",
    },
    {
      type: "prose",
      body: "Transactions often arrive as lines of text, such as `deposit 25` or `withdraw 900`, and a program that processes a batch of them should not stop at the first bad line. Give each line its own `try`, so a refused withdrawal is reported and the loop moves on to the next line.",
    },
    {
      type: "prose",
      body: "Text that is not a number never reaches the account, because `isdigit()` catches it first. Everything else goes to `deposit()` or `withdraw()`, and one `except` clause catches both of the account's exceptions by listing them in parentheses. The `else` block runs only when nothing was raised, so it is the place for the success message.",
    },
    {
      type: "exercise",
      id: "project-bank-account-4",
      prompt:
        "Write a function process(account, lines) where the comment shows. Each item of lines is an action and an amount separated by a space, such as deposit 25. For each line: if the amount is not made only of digits, print Skipped, a space, the line, a colon, a space, and not a number, then move on to the next line. Otherwise call deposit() or withdraw(), depending on the action, with the amount as a whole number. If that raises ValueError or InsufficientFundsError, print Refused, a space, the line, a colon, a space, and the error's message; if nothing was raised, print OK, a space, and the line. The starter calls process() at the bottom, so the output should be exactly nine lines: Refused: cannot withdraw 500 from a balance of 120, then [('deposit', 50), ('withdraw', 30)], then Ada: balance 120, then OK deposit 25, then Skipped withdraw ten: not a number, then Refused deposit 0: amount must be positive, then Refused withdraw 900: cannot withdraw 900 from a balance of 145, then OK withdraw 45, then Ada: balance 100",
      starterCode: `class InsufficientFundsError(Exception):
    pass


class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance
        self.history = []

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount
        self.history.append(("deposit", amount))
        return self._balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFundsError(f"cannot withdraw {amount} from a balance of {self._balance}")
        self._balance -= amount
        self.history.append(("withdraw", amount))
        return self._balance

    def __str__(self):
        return f"{self.owner}: balance {self._balance}"


account = Account("Ada", 100)
account.deposit(50)
account.withdraw(30)
try:
    account.withdraw(500)
except InsufficientFundsError as error:
    print("Refused:", error)
print(account.history)
print(account)


# write process(account, lines) here


process(account, ["deposit 25", "withdraw ten", "deposit 0", "withdraw 900", "withdraw 45"])
print(account)
`,
      check: {
        type: "stdout-exact",
        expected:
          "Refused: cannot withdraw 500 from a balance of 120\n[('deposit', 50), ('withdraw', 30)]\nAda: balance 120\nOK deposit 25\nSkipped withdraw ten: not a number\nRefused deposit 0: amount must be positive\nRefused withdraw 900: cannot withdraw 900 from a balance of 145\nOK withdraw 45\nAda: balance 100",
      },
      solution: `class InsufficientFundsError(Exception):
    pass


class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance
        self.history = []

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount
        self.history.append(("deposit", amount))
        return self._balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFundsError(f"cannot withdraw {amount} from a balance of {self._balance}")
        self._balance -= amount
        self.history.append(("withdraw", amount))
        return self._balance

    def __str__(self):
        return f"{self.owner}: balance {self._balance}"


account = Account("Ada", 100)
account.deposit(50)
account.withdraw(30)
try:
    account.withdraw(500)
except InsufficientFundsError as error:
    print("Refused:", error)
print(account.history)
print(account)


def process(account, lines):
    for line in lines:
        action, amount = line.split()
        if not amount.isdigit():
            print(f"Skipped {line}: not a number")
            continue
        try:
            if action == "deposit":
                account.deposit(int(amount))
            else:
                account.withdraw(int(amount))
        except (ValueError, InsufficientFundsError) as error:
            print(f"Refused {line}: {error}")
        else:
            print("OK", line)


process(account, ["deposit 25", "withdraw ten", "deposit 0", "withdraw 900", "withdraw 45"])
print(account)
`,
      hint: "Unpack action, amount = line.split(). Check not amount.isdigit() first, print the Skipped message, and continue. Then put the deposit() or withdraw() call inside try, catch except (ValueError, InsufficientFundsError) as error:, and print the OK message in an else block.",
    },
    {
      type: "heading",
      text: "Extending the program",
    },
    {
      type: "prose",
      body: "The class is a solid base for more rules. Try a `transfer(other, amount)` method that withdraws from one account and deposits into another, so a refused withdrawal moves no money at all. Other ideas: a `SavingsAccount` subclass that adds interest, a daily withdrawal limit raising its own custom exception, or a `statement()` method that prints the history with the balance after each transaction.",
    },
  ],
};

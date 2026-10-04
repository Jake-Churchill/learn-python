export default {
  slug: "review-loops",
  title: "Review: Guessing Game",
  unit: "Loops",
  blocks: [
    {
      type: "prose",
      body: "This review combines the first four units into one program: a number-guessing game. The program holds a secret number, and the player keeps guessing. After each guess, the program says whether it was too low or too high, until the player finds the number.",
    },
    {
      type: "prose",
      body: "A real game would pick a new secret every time it runs. Here the secret is always 37, and each exercise comes with a fixed set of guesses as its input. That way the output is the same on every run, and the page can check it.",
    },
    {
      type: "heading",
      text: "The tools you need",
    },
    {
      type: "prose",
      body: "`input()` reads a guess as text, and `int()` turns it into a number. Comparisons such as `<` and `>` tell whether a guess is too low or too high, and `if`, `elif`, and `else` choose what to print. A `while` loop keeps the game going, and `break` ends it when the guess is right.",
    },
    {
      type: "prose",
      body: "The game is built in three stages, and each stage adds to the one before. The starter code for stages 2 and 3 is the solution to the previous stage, so work through them in order.",
    },
    {
      type: "heading",
      text: "Stage 1: Keep guessing",
    },
    {
      type: "prose",
      body: "The first version only compares. It reads a guess, prints `Too low` or `Too high` when the guess is wrong, and prints `Correct!` and leaves the loop when it is right. The loop is `while True:`, so the `break` in the branch for a correct guess is its only way out.",
    },
    {
      type: "exercise",
      id: "review-loops-1",
      prompt:
        "The secret is 37, and the program receives the guesses 50, 25, and 37, one per line. The loop and the input() line are written for you. Add an if, elif, and else that print Too low when the guess is below the secret, Too high when it is above, and Correct! when it matches, followed by break. The output should be exactly six lines: Guess: 50, Too high, Guess: 25, Too low, Guess: 37, Correct!",
      starterCode: `secret = 37
while True:
    guess = int(input("Guess: "))
    # compare guess with secret here
`,
      stdin: "50\n25\n37",
      check: {
        type: "stdout-exact",
        expected: "Guess: 50\nToo high\nGuess: 25\nToo low\nGuess: 37\nCorrect!",
      },
      solution: `secret = 37
while True:
    guess = int(input("Guess: "))
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print("Correct!")
        break
`,
      hint: "The else branch runs only when the guess is neither lower nor higher than the secret. Print Correct! there, and put break on the next line with the same indentation.",
    },
    {
      type: "heading",
      text: "Stage 2: Count guesses and reject bad ones",
    },
    {
      type: "prose",
      body: "Players like to know how many guesses they needed. Add a counter that starts at 0 before the loop and goes up by one for each guess, and include it in the winning message.",
    },
    {
      type: "prose",
      body: "A guess outside 1 to 100 is a typing mistake, not a real try, so it should not count. Check that the guess is from 1 to 100 right after reading it. If it is outside, print a reminder and use `continue` to ask again. Skipping the counter is the point here, and the loop still moves forward because every pass reads a new guess.",
    },
    {
      type: "exercise",
      id: "review-loops-2",
      prompt:
        "The program receives the guesses 50, 150, 25, and 37. Starting from the stage 1 code, make two changes. First, if a guess is below 1 or above 100, print exactly Pick a number from 1 to 100 and skip it with continue, without counting it. Second, count each guess that is from 1 to 100 in a variable named guesses, and replace Correct! with Correct! You got it in N guesses. where N is the count. The output should be exactly eight lines: Guess: 50, Too high, Guess: 150, Pick a number from 1 to 100, Guess: 25, Too low, Guess: 37, Correct! You got it in 3 guesses.",
      starterCode: `secret = 37
while True:
    guess = int(input("Guess: "))
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print("Correct!")
        break
`,
      stdin: "50\n150\n25\n37",
      check: {
        type: "stdout-exact",
        expected:
          "Guess: 50\nToo high\nGuess: 150\nPick a number from 1 to 100\nGuess: 25\nToo low\nGuess: 37\nCorrect! You got it in 3 guesses.",
      },
      solution: `secret = 37
guesses = 0
while True:
    guess = int(input("Guess: "))
    if guess < 1 or guess > 100:
        print("Pick a number from 1 to 100")
        continue
    guesses += 1
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print(f"Correct! You got it in {guesses} guesses.")
        break
`,
      hint: "Create guesses = 0 before the loop. Right after the input() line, check guess < 1 or guess > 100, print the reminder, and continue. Then add 1 to guesses before comparing, and use an f-string for the winning message.",
    },
    {
      type: "heading",
      text: "Stage 3: Limit the guesses",
    },
    {
      type: "prose",
      body: "A game is more interesting when the player can lose. Allow 5 counted guesses. The loop now runs `while guesses < 5:` instead of forever, so it can end in two ways: the player wins and `break` runs, or the guesses run out and the condition becomes `False`.",
    },
    {
      type: "prose",
      body: "After the loop, the program has to know which of those happened. A flag answers that question. `won` starts as `False` before the loop and becomes `True` just before the `break`, and an `if` after the loop prints the winning or the losing message.",
    },
    {
      type: "exercise",
      id: "review-loops-3",
      prompt:
        "The program receives the guesses 50, 25, 0, 40, 30, and 35. Starting from the stage 2 code, allow only 5 counted guesses by looping while guesses < 5, and use a flag named won to remember whether the player found the number. Move the winning message after the loop: print Correct! You got it in N guesses. if won is True, and otherwise print exactly Out of guesses. The number was 37. The guess 0 still prints Pick a number from 1 to 100 and does not count. The output should be exactly thirteen lines: Guess: 50, Too high, Guess: 25, Too low, Guess: 0, Pick a number from 1 to 100, Guess: 40, Too high, Guess: 30, Too low, Guess: 35, Too low, Out of guesses. The number was 37.",
      starterCode: `secret = 37
guesses = 0
while True:
    guess = int(input("Guess: "))
    if guess < 1 or guess > 100:
        print("Pick a number from 1 to 100")
        continue
    guesses += 1
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print(f"Correct! You got it in {guesses} guesses.")
        break
`,
      stdin: "50\n25\n0\n40\n30\n35",
      check: {
        type: "stdout-exact",
        expected:
          "Guess: 50\nToo high\nGuess: 25\nToo low\nGuess: 0\nPick a number from 1 to 100\nGuess: 40\nToo high\nGuess: 30\nToo low\nGuess: 35\nToo low\nOut of guesses. The number was 37.",
      },
      solution: `secret = 37
guesses = 0
won = False
while guesses < 5:
    guess = int(input("Guess: "))
    if guess < 1 or guess > 100:
        print("Pick a number from 1 to 100")
        continue
    guesses += 1
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        won = True
        break
if won:
    print(f"Correct! You got it in {guesses} guesses.")
else:
    print(f"Out of guesses. The number was {secret}.")
`,
      hint: "Create won = False next to guesses = 0, and change while True: to while guesses < 5:. In the else branch, set won = True before break. After the loop, with no indentation, use if won: and else: to print one of the two messages.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "The finished game reads input and converts it, compares numbers, and chooses between messages, which covers Units 1 to 3. From this unit it uses a `while` loop, `break` to stop on a win, `continue` to skip bad input, a counter, and a flag that records how the loop ended. Most interactive programs you write will follow this same read, check, and respond shape.",
    },
  ],
};

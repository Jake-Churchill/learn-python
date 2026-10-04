export default {
  slug: "datetime-module",
  title: "Dates & Times",
  unit: "Modules & Standard Library",
  blocks: [
    {
      type: "prose",
      body: "Programs often work with dates: when a library book is due, how many days are left until a holiday, or what time a train leaves. Dates are awkward to handle as plain numbers, because months have different lengths and leap years add an extra day. The `datetime` module does that bookkeeping for you.",
    },
    {
      type: "heading",
      text: "Dates",
    },
    {
      type: "prose",
      body: "The `datetime` module provides a `date` class for calendar days. `date(2026, 3, 14)` creates the date 14 March 2026: year first, then month, then day. Printing a date shows it as year-month-day, and its parts are available as the attributes `year`, `month`, and `day`.",
    },
    {
      type: "prose",
      body: "The method `weekday()` gives the day of the week as a number, where Monday is 0 and Sunday is 6. Dates compare the way numbers do, so an earlier date is less than a later one. Inside a list, or in the result of a check, a date appears in its `repr` form, `datetime.date(2026, 3, 14)`.",
    },
    {
      type: "example",
      code: `from datetime import date

launch = date(2026, 3, 14)
print(launch)
print(launch.year, launch.month, launch.day)
print(launch.weekday())
print(launch < date(2026, 12, 25))
print([launch])`,
    },
    {
      type: "prose",
      body: "`date.today()` gives the date on which the program runs. This lesson builds every date explicitly instead, so your output matches the lesson's on any day.",
    },
    {
      type: "heading",
      text: "Dates with times",
    },
    {
      type: "prose",
      body: "The module also has a class named `datetime`, the same name as the module, for a date together with a time of day. `datetime(2026, 3, 14, 9, 30)` is 9:30 in the morning on 14 March 2026. Hours use the 24-hour clock, so 2:15 in the afternoon is written `14, 15`. The hour, minute, and second are optional and default to 0.",
    },
    {
      type: "example",
      code: `from datetime import datetime

meeting = datetime(2026, 3, 14, 9, 30)
print(meeting)
print(meeting.hour, meeting.minute)
print(meeting.date())`,
    },
    {
      type: "prose",
      body: "The `date()` method gives back just the date part of a `datetime`.",
    },
    {
      type: "heading",
      text: "Date arithmetic with timedelta",
    },
    {
      type: "prose",
      body: "A `timedelta` is a length of time, such as 30 days or 2 hours, rather than a point on the calendar. You create one with keyword arguments, as in `timedelta(days=30)`, `timedelta(weeks=2)`, or `timedelta(hours=2, minutes=45)`. Adding one to a date or a datetime moves it forward, and subtracting moves it back. Month ends and leap years are handled for you.",
    },
    {
      type: "prose",
      body: "Subtracting one date from another gives a `timedelta`. Its `days` attribute holds the number of days between them, which answers questions such as how long it is until a holiday. Printing a `timedelta` shows the days, then the hours, minutes, and seconds.",
    },
    {
      type: "example",
      code: `from datetime import date, datetime, timedelta

launch = date(2026, 3, 14)
print(launch + timedelta(days=30))
print(date(2026, 1, 31) + timedelta(days=1))

meeting = datetime(2026, 3, 14, 9, 30)
print(meeting + timedelta(hours=2, minutes=45))

gap = date(2026, 12, 25) - launch
print(gap)
print(gap.days)`,
    },
    {
      type: "exercise",
      id: "datetime-module-1",
      prompt:
        "A library lends books for 14 days. Complete the function due_date(borrowed) so it returns the date 14 days after the date borrowed. For example, due_date(date(2026, 3, 14)) returns datetime.date(2026, 3, 28).",
      starterCode: `from datetime import date, timedelta

def due_date(borrowed):
    # add a timedelta of 14 days to borrowed and return the result
    pass
`,
      check: {
        type: "returns",
        cases: [
          { call: "due_date(date(2026, 3, 14))", expected: "datetime.date(2026, 3, 28)" },
          { call: "due_date(date(2026, 12, 25))", expected: "datetime.date(2027, 1, 8)" },
          { call: "due_date(date(2028, 2, 20))", expected: "datetime.date(2028, 3, 5)" },
        ],
      },
      solution: `from datetime import date, timedelta

def due_date(borrowed):
    return borrowed + timedelta(days=14)
`,
      hint: "timedelta(days=14) is a length of 14 days. Return borrowed plus that length.",
    },
    {
      type: "heading",
      text: "Formatting dates with strftime",
    },
    {
      type: "prose",
      body: "The `strftime()` method turns a date or datetime into text in whatever layout you choose. You give it a format string in which codes starting with `%` are replaced by parts of the date, and everything else is copied as written. `%d` is the day, `%m` the month, and `%Y` the four-digit year, with a leading zero where needed.",
    },
    {
      type: "prose",
      body: "`%A` is the name of the weekday and `%B` the name of the month, and `%a` and `%b` are their three-letter short forms. For times, `%H` is the hour on the 24-hour clock and `%M` the minutes.",
    },
    {
      type: "example",
      code: `from datetime import date, datetime

launch = date(2026, 3, 14)
print(launch.strftime("%d/%m/%Y"))
print(launch.strftime("%A %d %B %Y"))
print(launch.strftime("%a %b %d"))

meeting = datetime(2026, 3, 14, 9, 30)
print(meeting.strftime("%H:%M on %d %b"))`,
    },
    {
      type: "heading",
      text: "Reading dates with strptime",
    },
    {
      type: "prose",
      body: "`datetime.strptime(text, format)` does the reverse. It reads a date from text laid out as the format string describes, using the same codes, and gives back a `datetime`. When the text has no time, the time is midnight, and `.date()` keeps just the date. If the text does not match the format, it stops with a `ValueError`.",
    },
    {
      type: "prose",
      body: "To tell the two apart, remember that the f in `strftime` stands for format, which makes text, and the p in `strptime` stands for parse, which means reading text to work out its parts.",
    },
    {
      type: "example",
      code: `from datetime import datetime

parsed = datetime.strptime("14/03/2026", "%d/%m/%Y")
print(parsed)
print(parsed.date())

departure = datetime.strptime("2026-03-14 18:05", "%Y-%m-%d %H:%M")
print(departure.strftime("%A at %H:%M"))`,
    },
    {
      type: "exercise",
      id: "datetime-module-2",
      prompt:
        "The variable concert holds 7:45 in the evening on 21 August 2026. Use strftime() to print it exactly as: Friday 21 August 2026, 19:45",
      starterCode: `from datetime import datetime

concert = datetime(2026, 8, 21, 19, 45)
# print concert formatted with strftime()
`,
      check: { type: "stdout-exact", expected: "Friday 21 August 2026, 19:45" },
      solution: `from datetime import datetime

concert = datetime(2026, 8, 21, 19, 45)
print(concert.strftime("%A %d %B %Y, %H:%M"))
`,
      hint: "You need the weekday name, the day, the month name, the four-digit year, a comma, then the hour and minutes: %A, %d, %B, %Y, %H, and %M.",
    },
    {
      type: "heading",
      text: "Common mistakes",
    },
    {
      type: "prose",
      body: "Putting the numbers in the wrong order is the most common mistake. `date()` always takes year, month, day, so `date(14, 3, 2026)` stops with `ValueError: day 2026 must be in range 1..31 for month 3 in year 14`. The message tells you how Python read each number.",
    },
    {
      type: "prose",
      body: "Format codes are case-sensitive. `%m` is the month but `%M` is the minutes, so `meeting.strftime(\"%d/%M/%Y\")` gives `14/30/2026` for 9:30 on 14 March. Finally, a `date` and a `datetime` cannot be subtracted or compared with `<` or `>`; call `.date()` on the `datetime` first so both sides are dates.",
    },
    {
      type: "heading",
      text: "Recap",
    },
    {
      type: "prose",
      body: "`date(year, month, day)` is a calendar day and `datetime(year, month, day, hour, minute)` adds a time. A `timedelta` is a length of time that you add to or subtract from dates, and subtracting two dates gives one, whose `days` attribute counts the days between. `strftime()` turns a date into text using `%` codes, and `datetime.strptime()` reads a date from text with the same codes.",
    },
    {
      type: "exercise",
      id: "datetime-module-3",
      prompt:
        "Write a function days_until(start, end) that takes two dates written as text in the form day/month/year, such as \"14/03/2026\", and returns the number of days from start to end as an int. For example, days_until(\"14/03/2026\", \"25/12/2026\") returns 286.",
      starterCode: `from datetime import datetime

# write days_until(start, end) here
`,
      check: {
        type: "returns",
        cases: [
          { call: "days_until('14/03/2026', '25/12/2026')", expected: "286" },
          { call: "days_until('31/12/2026', '01/01/2027')", expected: "1" },
          { call: "days_until('01/02/2028', '01/03/2028')", expected: "29" },
        ],
      },
      solution: `from datetime import datetime

def days_until(start, end):
    first = datetime.strptime(start, "%d/%m/%Y")
    second = datetime.strptime(end, "%d/%m/%Y")
    return (second - first).days
`,
      hint: "Read each text with datetime.strptime() and the format \"%d/%m/%Y\". Subtracting the first from the second gives a timedelta; return its days attribute.",
    },
  ],
};

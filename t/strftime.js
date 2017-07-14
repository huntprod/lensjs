;(function () {
  QUnit.module("strftime");
  QUnit.test("singular format specifiers", function (Ω) {
    var t1 = new Date(2001, 1 /* Feb */, 03, 04, 05, 06); /* Saturday */
    var t2 = new Date(2001, 9 /* Oct */, 28, 23, 58, 59); /* Sunday   */
    tests = [
      { t: t1, f: '%%', e: '%', m: '%% = literal percent sign.' },

      { t: t1, f: '%a', e: 'Sat', m: '%a = abbreviated weekday name (per locale).' },
      { t: t2, f: '%a', e: 'Sun', m: '%a = abbreviated weekday name (per locale).' },

      { t: t1, f: '%A', e: 'Saturday', m: '%A = full weekday name (per locale).' },
      { t: t2, f: '%A', e: 'Sunday',   m: '%A = full weekday name (per locale).' },

      { t: t1, f: '%b', e: 'Feb', m: '%b = abbreviated month name (per locale).' },
      { t: t2, f: '%b', e: 'Oct', m: '%b = abbreviated month name (per locale).' },

      { t: t1, f: '%B', e: 'February', m: '%B= full month name (per locale).' },
      { t: t2, f: '%B', e: 'October',  m: '%B= full month name (per locale).' },

      { t: t1, f: '%c', e: 'Sat Feb 3 04:05:06 2001', m: '%c = preferred date/time representation (per locale).' },
      { t: t2, f: '%c', e: 'Sun Oct 28 23:58:59 2001', m: '%c = preferred date/time representation (per locale).' },

      { t: t1, f: '%C', e: '20', m: '%C = century number (year/100) as a 2-digit number.' },

      { t: t1, f: '%d', e: '03', m: '%d = day of month as a 2-digit number.' },
      { t: t2, f: '%d', e: '28', m: '%d = day of month as a 2-digit number.' },

      { t: t1, f: '%D', e: '02/03/01', m: '%D = %m/%d/%y (alias).' },
      { t: t2, f: '%D', e: '10/28/01', m: '%D = %m/%d/%y (alias).' },

      { t: t1, f: '%e', e: '3',  m :'%e = day of month without leading zero.' },
      { t: t2, f: '%e', e: '28', m :'%e = day of month without leading zero.' },

      { t: t1, f: '%E', e: '', m: '%E should return 0 as it is unimplemented / unsupported.' },

      { t: t1, f: '%F', e: '2001-02-03', m: '%F = %Y-%m-%d (alias).' },
      { t: t2, f: '%F', e: '2001-10-28', m: '%F = %Y-%m-%d (alias).' },

      { t: t1, f: '%h', e: 'Feb', m: '%h = %b (alias).' },

      { t: t1, f: '%H', e: '04', m: '%H = hour on a 24h clock.' },
      { t: t2, f: '%H', e: '23', m: '%H = hour on a 24h clock.' },

      { t: t1, f: '%I', e: '04', m: '%I = hour on a 12h clock.' },
      { t: t2, f: '%I', e: '11', m: '%I = hour on a 12h clock.' },

      { t: t1, f: '%k', e: ' 4', m: '%k = hour on a 24h clock, space-padded.' },
      { t: t2, f: '%k', e: '23', m: '%k = hour on a 24h clock, space-padded.' },

      { t: t1, f: '%l', e: ' 4', m: '%l = hour on a 12h clock, space-padded.' },
      { t: t2, f: '%l', e: '11', m: '%l = hour on a 12h clock, space-padded.' },

      { t: t1, f: '%m', e: '02', m: '%m = month as a number, zero-padded.' },
      { t: t2, f: '%m', e: '10', m: '%m = month as a number, zero-padded.' },

      { t: t1, f: '%M', e: '05', m: '%M = minute, zero-padded.' },
      { t: t2, f: '%M', e: '58', m: '%M = minute, zero-padded.' },

      { t: t1, f: '%n', e: '\n', m: '%n = newline character.' },

      { t: t1, f: '%p', e: 'AM', m: '%p = AM/PM based on time (per locale).' },
      { t: t2, f: '%p', e: 'PM', m: '%p = AM/PM based on time (per locale).' },

      { t: t1, f: '%P', e: 'am', m: '%P = am/pm based on time (per locale).' },
      { t: t2, f: '%P', e: 'pm', m: '%P = am/pm based on time (per locale).' },

      { t: t1, f: '%r', e: '04:05:06 AM', m: '%r = time in am/pm notation.' },
      { t: t2, f: '%r', e: '11:58:59 PM', m: '%r = time in am/pm notation.' },

      { t: t1, f: '%R', e: '04:05', m: '%R = time in 24h H:M notation.' },
      { t: t2, f: '%R', e: '23:58', m: '%R = time in 24h H:M notation.' },

      { t: t1, f: '%s', e: '981191106000',  m: '%s = number of seconds since UNIX epoch.' },
      { t: t2, f: '%s', e: '1004331539000', m: '%s = number of seconds since UNIX epoch.' },

      { t: t1, f: '%S', e: '06', m: '%S = seconds, zero-padded.' },
      { t: t2, f: '%S', e: '59', m: '%S = seconds, zero-padded.' },

      { t: t1, f: '%t', e:'\t', m: '%t = tab character.' },

      { t: t1, f: '%T', e: '04:05:06', m: '%T = time in 24h H:M:S notation.' },
      { t: t2, f: '%T', e: '23:58:59', m: '%T = time in 24h H:M:S notation.' },

      { t: t1, f: '%u', e: '6', m: '%u = day of week, Mon(1) - Sun(7).' },
      { t: t2, f: '%u', e: '7', m: '%u = day of week, Mon(1) - Sun(7).' },

      { t: t1, f: '%w', e: '6', m: '%w = day of week, Sun(0) - Sat(6).' },
      { t: t2, f: '%w', e: '0', m: '%w = day of week, Sun(0) - Sat(6).' },

      { t: t1, f: '%x', e: '02/03/2001', m: '%x = preferred date representation (per locale).' },
      { t: t2, f: '%x', e: '10/28/2001', m: '%x = preferred date representation (per locale).' },

      { t: t1, f: '%X', e: '04:05:06', m: '%X = preferred time representation (per locale).' },
      { t: t2, f: '%X', e: '23:58:59', m: '%X = preferred time representation (per locale).' },

      { t: t1, f: '%y', e: '01', m: '%y = year as a 2-digit number.' },
      { t: t2, f: '%y', e: '01', m: '%y = year as a 2-digit number.' },

      { t: t1, f: '%Y', e: '2001', m: '%Y = year as a 4-digit number.' },
      { t: t2, f: '%Y', e: '2001', m: '%Y = year as a 4-digit number.' },
    ];
    for (var i = 0; i < tests.length; i++) {
      var test = tests[i];
      Ω.equal(strftime(test.f, test.t), test.e, test.m);
    }
  });

  QUnit.test('alternate formats', function (Ω) {
    var t1 = new Date(2001, 1 /* Feb */, 03, 04, 05, 06); /* Saturday */
    var t2 = new Date(2001, 9 /* Oct */, 28, 23, 58, 59); /* Sunday   */
    tests = [
      { t: t1, f: '%Oe', e: '3rd',  m: '%Oe = ordinal day of month.' },
      { t: t2, f: '%Oe', e: '28th', m: '%Oe = ordinal day of month.' },

      { t: t1, f: '%Ou', e: '6th', m: '%Ou = ordinal day of week, starting with Mon = 1st.' },
      { t: t2, f: '%Ou', e: '7th', m: '%Ou = ordinal day of week, starting with Mon = 1st.' },
    ];
    for (var i = 0; i < tests.length; i++) {
      var test = tests[i];
      Ω.equal(strftime(test.f, test.t), test.e, test.m);
    }
  });

  QUnit.test('unsupported modifiers', function (Ω) {
    var tests = "%E".split(/ /);
    for (var i = 0; i < tests.length; i++) {
      Ω.equal(strftime(tests[i]), '', "modifier '"+tests[i]+"' should be silently ignored.");
    }

    var tests = "%G %g %j %U %V %W %z %Z".split(/ /);
    for (var i = 0; i < tests.length; i++) {
      Ω.throws(function () { strftime(tests[i]) }, /does not support/,
        "modifier '"+tests[i]+"' should be unsupported (otherwise, it needs tests)");
    }

    Ω.throws(function () { strftime("%!") }, /unrecognized/,
      "strftime handles unrecognized sequences by throwing a fit.");
  });

  QUnit.test('combined modifiers', function (Ω) {
    var ts = new Date(2013, 06, 07, 11, 22, 46);
    Ω.equal(strftime("%A, %B %Oe, %Y at %I:%M:%S %P or so", ts),
      "Sunday, July 7th, 2013 at 11:22:46 am or so",
      "strftime handles the specs, all the specs, and nothing but the specs.");
  });

})();

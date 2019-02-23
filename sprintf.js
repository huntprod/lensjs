;(function () {
  var twos = function (n, w) {
    return n < 0 ? 2 ** w + n : n;
  };

  var lpad = function (s, p, n) {
    while (s.length < n) {
      s = p + s;
    }
    return s;
  };

  var num = function (n, prefix, sign, left, pad, width, ffmt) {
    var p = '',
        s = (ffmt ? ffmt : function (x) { return x.toString(); }).call(null, n);

    if (sign && n > 0) { prefix = sign; }
    if (n < 0) { prefix = '-'; s = s.substr(1); }

    if (left) { pad = ' '; } /* all left-alignment is space-padded */

    width -= s.length;
    width -= prefix.length;
    while (width > 0) {
      p += pad;
      width--; /* assumes pad is always 1 character */
    }
    if (pad == '0') {
      s = prefix + p + s;
    } else if (left) {
      s = prefix + s + p;
    } else {
      s = p + prefix + s;
    }
    return s;
  };

  var sprintf = function () {
    var s = '';
    var fmt = arguments[0];
    if (!fmt) { return ''; }

    var n = 1;
    for (var i = 0; i < fmt.length; i++) {
      var c = fmt.charCodeAt(i);
      if (c == 37) { // % - start of a format specificer
        if (i + 1 >= fmt.length) {
          throw '%: invalid format specifier (trailing %-sign)'
        }
        if (fmt.charCodeAt(i+1) == 37) {
          i++;
          s += '%';
          continue;
        }

        var alt   = false, /* alternate form (#) */
            pad   = ' ';   /* pad char (changeable with 0) */
            left  = false, /* left-adjust (-) */
            sign  = '';    /* pre-positive character (' ' or +) */
            comma = false; /* use thousands separator (') */

        var width = -1, /* field minimum width */
            prec  = -1, /* field precision */
            bits  = 32; /* field length modifier */

        /* parse format specifier flags */
        for (;;) {
          i++;
          if (i >= fmt.length) {
            throw '%: invalid format specifier (while parsing flags)'
          }

          c = fmt.charCodeAt(i);
          switch (c) {
            case 35: /* # */ alt   = true; continue;
            case 48: /* 0 */ pad   = '0';  continue;
            case 45: /* - */ left  = true; continue;
            case 32: /*   */ sign  = ' ';  continue;
            case 43: /* + */ sign  = '+';  continue;
            case 39: /* ' */ comma = true; continue;
          }
          break;
        }

        c = fmt.charCodeAt(i);
        if (c >= 49 && c <= 57) {
          /* parse field minimum width */
          width = c - 48;
          for (;;) {
            i++;
            if (i >= fmt.length) {
              throw '%: invalid format specifier (while parsing field minimum width)'
            }

            c = fmt.charCodeAt(i);
            if (c >= 48 && c <= 57) {
              width = (width * 10) + (c - 48);
              continue;
            }
            break;
          }
        }

        c = fmt.charCodeAt(i);
        if (c == 46) { /* . */
          /* parse field precision */
          prec = 0;
          for (;;) {
            i++;
            if (i >= fmt.length) {
              throw '%: invalid format specifier (while parsing field precision)'
            }

            c = fmt.charCodeAt(i);
            if (c >= 48 && c <= 57) {
              prec = (prec * 10) + (c - 48);
              continue;
            }
            break;
          }
        }

        /* parse length modifier (h, hh, l, ll) */
        c = fmt.charCodeAt(i);
        if (c == 104) { /* h */
          i++;
          if (i >= fmt.length) {
            throw '%: invalid format specifier (while parsing length modifier)'
          }

          c = fmt.charCodeAt(i);
          if (c == 104) { /* hh */
            i++;
            if (i >= fmt.length) {
              throw '%: invalid format specifier (while parsing length modifier)'
            }
            bits = 8;

          } else {
            bits = 16;
          }
        } else if (c == 108) { /* l */
          i++;
          if (i >= fmt.length) {
            throw '%: invalid format specifier (while parsing length modifier)'
          }

          c = fmt.charCodeAt(i);
          if (c == 108) { /* ll */
            i++;
            if (i >= fmt.length) {
              throw '%: invalid format specifier (while parsing length modifier)'
            }
            bits = 128;

          } else {
            bits = 64;
          }
        }

        /* parse conversion specifier */
        c = fmt.charCodeAt(i);
        switch (c) {
        case 100: /* d */
        case 105: /* i */
          if (n < arguments.length) {
            s += num(parseInt(arguments[n]), '', sign, left, pad, width);
            n++;
          } else {
            s += '(!missing)';
          }
          break;

        case 111: /* o */
          if (n < arguments.length) {
            s += num(parseInt(arguments[n]),
                     '' /* ffmt (below) handles alt */,
                     '' /* ignore sign */, left, pad, width,
                     function (x) {
                       var v = lpad(x.toString(8), '0', prec);
                       return (alt && v.charCodeAt(0) != 48)
                            ? '0' + v
                            :       v;
                     });
            n++;
          } else {
            s += '(!missing)';
          }
          break;

        case 117: /* u */
          if (n < arguments.length) {
            s += num(twos(parseInt(arguments[n]), bits), '', sign, left, pad, width);
            n++;
          } else {
            s += '(!missing)';
          }
          break;

        case 120: /* x */
          if (n < arguments.length) {
            s += num(twos(parseInt(arguments[n]), bits),
                     (alt ? '0x' : ''),
                     '' /* ignore sign */, left, pad, width,
                     function (x) { return lpad(x.toString(16), '0', prec); });
            n++;
          } else {
            s += '(!missing)';
          }
          break;

        case 88:  /* X */
          if (n < arguments.length) {
            s += num(twos(parseInt(arguments[n]), bits),
                     (alt ? '0X' : ''),
                     '' /* ignore sign */, left, pad, width,
                     function (x) { return lpad(x.toString(16).toUpperCase(), '0', prec); });
            n++;
          } else {
            s += '(!missing)';
          }
          break;

        case 101: /* e */
          if (n < arguments.length) {
            s += num(parseFloat(arguments[n]), '', sign, left, pad, width,
                     function (x) { return x.toExponential(); });
            n++;
          } else {
            s += '(!missing)';
          }
          break;

        case 69:  /* E */
          if (n < arguments.length) {
            s += num(parseFloat(arguments[n]), '', sign, left, pad, width,
                     function (x) { return x.toExponential().toUpperCase(); });
            n++;
          } else {
            s += '(!missing)';
          }
          break;

        case 102: /* f */
        case 103: /* g */
        case 70:  /* F */
        case 71:  /* G */
          if (n < arguments.length) {
            s += num(parseFloat(arguments[n]), '', sign, left, pad, width,
                     function (x) {
                       return prec >= 0 ? x.toFixed(prec)
                                        : x.toString();
                     });
            n++;
          } else {
            s += '(!missing)';
          }
          break;

        case 99:  /* c */
          if (n < arguments.length) {
            s += String.fromCharCode(parseInt(arguments[n])).toString();
            n++;
          } else {
            s += '(!missing)';
          }
          break;

        case 115: /* s */
          if (n < arguments.length) {
            var v;
            if (typeof(arguments[n]) === 'undefined') {
              v = '(undefined)';
            } else if (arguments[n] == null) {
              v = '(null)';
            } else {
              v = arguments[n].toString();
              if (prec >= 0) {
                v = v.substr(0, prec);
              }
            }

            while (v.length < width) {
              if (left) {
                v += ' ';
              } else {
                v = pad + v;
              }
            }

            s += v;
            n++;
          } else {
            s += '(!missing)';
          }
          break;
        }
      } else {
        s += fmt[i];
      }
    }
    return s;
  };

  Lens.sprintf = sprintf;
  window.sprintf = sprintf;
})();

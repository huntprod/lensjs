;(function () {

  var __templates = {};
  var template = function (name, data) {
    if (!(name in __templates)) {
      __templates[name] = compile(name);
    }

    return __templates[name](data || {});
  };

  var compile = function (name) {
    name = name.toString();
    var script = document.getElementById('template:'+name);
    if (!script) {
      return function () {
        throw "Template {"+name+"} not found";
      };
    }

    var src = script.innerHTML;
    var tokenizer = new RegExp('([\\s\\S]*?)\\[\\[([\\s\\S]*?)\\]\\]([\\s\\S]*)');
    var str = function (s) {
      if (!s) { return "''"; }
      return "'"+s.replace(/(['\\])/g, '\\$1').replace(/\n/g, "\\n")+"'";
    };

    var code = [];
    for (;;) {
      var tokens = tokenizer.exec(src)
      if (!tokens) {
        code.push('__ += '+str(src)+';');
        break;
      }

      code.push('__ += '+str(tokens[1])+';');
      if (tokens[2][0] == '=') {
        code.push('__ += ('+tokens[2].replace(/^=\s*/, '')+');');

      } else if (tokens[2][0] != '#') { /* skip comments */
        code.push(tokens[2]);
      }

      src = tokens[3];
    }

    code = code.join('');
    return function (_) {
      /* the output variable */
      var __ = '';

      /* namespaced helper functions */
      var lens = {



        /* maybe(x,fallback)

           fallback to a default value if a given variable
           is undefined, or was not provided.

           example:

             [[= lens.maybe(x, "no x given") ]]

         */
        maybe: function (a, b) {
          return typeof(a) !== 'undefined' ? a : b;
        },



        /* escapeHTML(x)

           return a sanitized version of x, with the dangerous HTML
           entities like <, > and & replaced.  Also replaces double
           quote (") with the &quot; representation, so that you can
           embed values in form element attributes.

           example:

             <input type="text" name="display"
                    value="[[= lens.htmlEscape(_.display) ]]">

           lens.h() is an alias, so you can also do this:

             <input type="text" name="display"
                    value="[[= lens.h(_.display) ]]">
         */
        escapeHTML: function (s) {
          var t = document.createElement('textarea');
          t.innerHTML = s;
          return t.innerText.replace(/"/g, '&quot;');
        },

        /* include(template)
           include(template, _.other.data)

           splices the output of another template into the current
           output, at the calling site.  This can be useful for
           breaking up common elements of a UI into more manageable
           chunks.

           example:

             <div id="login">[[ lens.include('signin'); ]]</div>

           you can also provide a data object that will become the
           `_` variable inside the called template:

             [[ lens.include('alert', { alert: "something broke" }); ]]

           as a "language construct", this function is also aliased
           as (toplevel) `include()`, and it can be used in [[= ]]
           constructs:

             [[= include('other-template') ]]

         */
        include: function (name, data) {
          __ += template(name, data || _);
          return '';
        }
      };

      /* aliases ... */
      lens.u = encodeURIComponent;
      lens.h = lens.escapeHTML;
      var include = lens.include;

      eval(code);
      return __;
    };
  };

  if (jQuery) {
    jQuery.template = template;

    jQuery.fn.template = function (name, data) {
      this.html(template(name, data));
    };

  } else if (window) {
    window.template = template;
  }
})();

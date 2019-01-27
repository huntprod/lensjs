;(function () {

  var __templates = {};
  var template = function (name, data) {
    if (!(name in __templates)) {
      Lens.log.debug('template {%s} not found in the cache; compiling from source.', name);
      __templates[name] = compile(name);
    }

    return __templates[name](data || {});
  };

  var parse = function (src) {
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

      if (tokens[2][0] == ':') { /* trim preceeding literal */
        tokens[1] = tokens[1].replace(/\s+$/, '');
        tokens[2] = tokens[2].substr(1);
      }
      if (tokens[2][tokens[2].length - 1] == ':') { /* trim following literal */
        tokens[3] = tokens[3].replace(/^\s+/, '');
        tokens[2] = tokens[2].substr(0, tokens[2].length-2);
      }

      code.push('__ += '+str(tokens[1])+';');
      if (tokens[2][0] == '=') {
        code.push('__ += ('+tokens[2].replace(/^=\s*/, '')+');');

      } else if (tokens[2][0] != '#') { /* skip comments */
        code.push(tokens[2]);
      }

      src = tokens[3];
    }

    return code.join('');
  };

  var compile = function (name) {
    name = name.toString();
    var script = document.getElementById('template:'+name);
    if (!script) {
      Lens.log.error('unable to find a <script> element with id="template:%s"', name);
      return function () {
        throw "Template {"+name+"} not found";
      };
    }

    var code = parse(script.innerHTML);

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
          t.innerText = s;
          return t.innerHTML.replace(/"/g, '&quot;');
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

      Lens.log.debug('evaluating the {%s} template', name);
      eval(code);
      return __;
    };
  };

  window.parseTemplate = parse;

  if (typeof(jQuery) !== 'undefined') {
    jQuery.template = template;

    jQuery.fn.template = function (name, data) {
      this.html(template(name, data));
    };

  } else if (typeof(window) !== 'undefined') {
    window.template = template;

  } else {
    throw 'neither jQuery or top-level window object were found; unsure where to attach template()...';
  }
})();

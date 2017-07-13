lens.js
=======

Let's make web application development fun again, without drowning in a
billion npm dependencies and three build systems.

This is an ambitious project, and one that may not actually pan out.
No harm in tryin', though, right?

Templating
----------

Lens comes with a simple yet powerful templating engine that leverages the
power of raw Javascript in a syntax familiar to users of Perl's Template
toolkit (TT) or Ruby's ERB:

```
<script type="text/html" id="template:hello">
[[ if (_.name) { ]]
  <h2>Hello, [[= _.name ]]</h2>
[[ } else { ]]
  <h2>Hello, World!</h2>
[[ } ]]
</script>
```

defines a template named `hello`.

Elsewhere, you can render that template like this:

```
<div id="main"></div>

<script type="text/javascript">
  $('#main').template('hello');
</script>
```

That will append `<h2>Hello, World!</h2>` to the `div` named "main".

If you want, you can pass an object to `template()` and it will be
made available inside the template as `_`:

```
<div id="main"></div>

<script type="text/javascript">
  $('#main').template('hello', { name: 'James' });
</script>
```

That will replace the contents of `#main` with `<h2>Hello,
James</h2>`.

Anything between `[[` ... `]]` will be treated as raw Javascript.
This lets you do loops, conditionals (as pictured above), or even
embed function definitions and more advanced view logic.

Anything between `[[=` ... `]]` will be evaluated as a standalone
expression (in the context of the template, the `_` variable,
other defined variables, and any defined functions), and appended
to the output.  You do not need the trailing `;`, so `[[= x ]]` is
perfectly valid.

Anything outside of these constructs is pasted into the output
as-is, as the template executes.

To print a list of the numbers from 1 to 10:

```
<script type="text/html" id="template:numbers">
<ul>
  [[ for (var i = 1; i = 10; i++) { ]]
  <li>[[= i ]]</li>
  [[ } ]]
</ul>
</script>
```

Contributing
------------
This code is licensed MIT.  Enjoy.

If you find a bug, please raise a [Github Issue][issues] first,
before submitting a PR.

Happy Hacking!

[issues]: https://github.com/huntprod/lensjs/issues

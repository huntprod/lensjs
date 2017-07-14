;(function () {
  QUnit.module("template");
  QUnit.test("simple template structures", function (Ω) {
    Ω.equal(template('text'), '\nHello, World.\n', 'simple static template works');
    Ω.equal(template('vars', { name: 'Joe' }),
      '\nHello, Joe!\n', 'simple variable template works');
  });

  QUnit.test("complicated template structures", function (Ω) {
    Ω.equal(template('fibonacci'), '\n1 1 2 3 5 8 13 \n', 'looping construct works');
    Ω.equal(template('fibonacci', { max: 100 }),
      '\n1 1 2 3 5 8 13 21 34 55 89 \n', 'looping construct works');
  });

  QUnit.test("template inclusion", function (Ω) {
    Ω.equal(template('includer'), '\n\nHello, World.\n\n-----\n\nHello, World!\n\n',
      'simple template inclusion works');

    Ω.equal(template('loop-include', { max: 3 }),
      '\n\nHello, World.\n\nHello, World.\n\nHello, World.\n\n',
      'inclusion works from inside of control constructs');
  });

  QUnit.test("lens.h / lens.escapeHTML", function (Ω) {
    Ω.equal(template('escape-html', { html: '<a id="test">&amp;</a>' }),
      '\nh:          &lt;a id=&quot;test&quot;&gt;&amp;amp;&lt;/a&gt;'+
      '\nescapeHTML: &lt;a id=&quot;test&quot;&gt;&amp;amp;&lt;/a&gt;\n',
      'lens HTML escaping works');
  });

  QUnit.test("lens.maybe", function (Ω) {
    Ω.equal(template('maybe', { x: 42 }), '\nx = 42\n', 'maybe returns the defined value.');
    Ω.equal(template('maybe', { y: 42 }), '\nx = (not given)\n', 'maybe falls back to default.');
  });

  QUnit.test("lens.u", function (Ω) {
    Ω.equal(template('url', { v: 'key-value' }),
      '\nkey-value\n',
      'lens.u encodes URI components');

    Ω.equal(template('url', { v: 'key=value++&&1' }),
      '\nkey%3Dvalue%2B%2B%26%261\n',
      'lens.u encodes URI components');
  });
})();


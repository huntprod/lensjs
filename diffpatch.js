;(function () {
  const SET_ATTRIBUTE    = 1,
        REMOVE_ATTRIBUTE = 2,
        SET_PROPERTY     = 3,
        REMOVE_PROPERTY  = 4,
        REPLACE_NODE     = 5,
        APPEND_CHILD     = 6,
        REMOVE_CHILD     = 7,
        REPLACE_TEXT     = 8;

  /* diff the ATTRIBUTES of two nodes, and return a
     (potentially empty) patch op list. */
  var diffa = function (a, b) {
    const ops = [];
    const _a  = {};
    const _b  = {};

    for (let i = 0; i < a.attributes.length; i++) {
      _a[a.attributes[i].nodeName] = a.attributes[i].nodeValue;
    }
    for (let i = 0; i < b.attributes.length; i++) {
      _b[b.attributes[i].nodeName] = b.attributes[i].nodeValue;
    }

    /* if the attribute is only defined in (a), then
       it has been removed in (b) and should be patched
       as a REMOVE_ATTRIBUTE.  */
    for (let attr in _a) {
      if (!(attr in _b)) {
        ops.push({
          op:    REMOVE_ATTRIBUTE,
          node:  a,
          key:   attr,
        });
      }
    }

    /* if the attribute is only defined in (b), or is
       defined in both with different values, patch as
       a SET_ATTRIBUTE to get the correct value. */
    for (let attr in _b) {
      if (!(attr in _a) || _a[attr] !== _b[attr]) {
        ops.push({
          op:    SET_ATTRIBUTE,
          node:  a,
          key:   attr,
          value: _b[attr]
        });
      }
    }

    return ops;
  };

  var diffe = function (a, b) {
    if (a.localName === b.localName) {
      return diffa(a, b);
    }
    return null;
  };

  var difft = function (a, b) {
    if (a.textContent === b.textContent) {
      return [];
    }
    return [{
      op:   REPLACE_TEXT,
      node: a,
      with: b.textContent
    }];
  };

  /* diff two NODEs, without recursing through child nodes */
  var diffn1 = function (a, b) {
    if (a.nodeType != b.nodeType) {
      /* nothing in common */
      return null;
    }

    if (a.nodeType == Node.ELEMENT_NODE) {
      return diffe(a, b);
    }
    if (a.nodeType == Node.TEXT_NODE) {
      return difft(a, b);
    }
    if (a.nodeType == Node.COMMENT_NODE) {
      return null;
    }

    console.log('unrecognized a type %s', a.nodeType);
    return null;
  };

  /* diff two NODEs, co-recursively with diff() */
  var diffn = function (a, b) {
    let ops = diffn1(a, b);

    if (ops) {
      return ops.concat(diff(a, b));
    }

    return [{
      op:   REPLACE_NODE,
      node: a,
      with: b
    }];
  };

  window.diff = function (a, b) {
    let ops = [];
    const { childNodes: _a } = a;
    const { childNodes: _b } = b;

    const _al = _a ? _a.length : 0;
    const _bl = _b ? _b.length : 0;

    for (let i = 0; i < _bl; i++) {
      if (!_a[i]) {
        ops.push({
          op:    APPEND_CHILD,
          node:  a,
          child: _b[i]
        });
        continue;
      }

      ops = ops.concat(diffn(_a[i], _b[i]));
    }

    for (var i = _bl; i < _al; i++) {
      ops.push({
        op:    REMOVE_CHILD,
        node:  a,
        child: _a[i]
      });
    }

    return ops;
  };




  window.patch = function (e, ops) {
    for (let i = 0; i < ops.length; i++) {
      switch (ops[i].op) {
        case SET_ATTRIBUTE:    ops[i].node.setAttribute(ops[i].key, ops[i].value);            break;
        case REMOVE_ATTRIBUTE: ops[i].node.removeAttribute(ops[i].key);                       break;
        case SET_PROPERTY:     /* FIXME needs implemented! */                                 break;
        case REMOVE_PROPERTY:  /* FIXME needs implemented! */                                 break;
        case REPLACE_NODE:     ops[i].node.parentNode.replaceChild(ops[i].with, ops[i].node); break;
        case APPEND_CHILD:     ops[i].node.appendChild(ops[i].child);                         break;
        case REMOVE_CHILD:     ops[i].node.removeChild(ops[i].child);                         break;
        case REPLACE_TEXT:     ops[i].node.textContent = ops[i].with;                         break;
        default:
          console.log('unrecognized patch op %d for ', ops[i].op, ops[i]);
          break;
      }
    }
  };




  window.explainPatch = function (ops) {
    var l = [];
    for (let i = 0; i < ops.length; i++) {
      switch (ops[i].op) {
        case SET_ATTRIBUTE:    l.push(['SET_ATTRIBUTE',    ops[i].node, ops[i].key+'='+ops[i].value]); break;
        case REMOVE_ATTRIBUTE: l.push(['REMOVE_ATTRIBUTE', ops[i].node, ops[i].key]);                  break;
        case SET_PROPERTY:     l.push(['SET_PROPERTY',     'FIXME']);                                  break;
        case REMOVE_PROPERTY:  l.push(['REMOVE_PROPERTY',  'FIXME']);                                  break;
        case REPLACE_NODE:     l.push(['REPLACE_NODE',     ops[i].node, { with: ops[i].with }]);       break;
        case APPEND_CHILD:     l.push(['APPEND_CHILD',     ops[i].node, { child: ops[i].child }]);     break;
        case REMOVE_CHILD:     l.push(['REMOVE_CHILD',     ops[i].node, { child: ops[i].child }]);     break;
        case REPLACE_TEXT:     l.push(['REPLACE_TEXT',     ops[i].node, { with: ops[i].with }]);       break;
        default:               l.push(['**UNKNOWN**',      ops[i]]);                                   break;
      }
    }
    return l;
  };
})(window, document);

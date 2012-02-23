/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

!(typeof(define) !== "function" ? function($){ $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports); } : define)(function(require, exports) {

'use strict';

var protocol = require('../core').protocol
var meta

exports['test basics'] = function(assert) {
  var sequence = protocol({
    first: [ protocol ],
    rest: [ protocol ],
    stick: [ Object, protocol ]
  })
  (String, {
    first: function(string) { return string[0] || null },
    rest: function(string) { return String.prototype.substr.call(string, 1) },
    stick: function(item, string) { return item + string }
  })
  (Array, {
    first: function(array) { return array[0] || null },
    rest: function(array) { return Array.prototype.slice.call(array, 1) },
    stick: function(item, array) {
      return Array.prototype.concat.call([ item ], array)
    }
  })

  assert.equal(sequence.first([ 1, 2, 3 ]), 1, 'first works on array')
  assert.deepEqual(sequence.rest([ 1, 2, 3]), [ 2, 3 ], 'rest works on array')
  assert.deepEqual(sequence.stick(1, [ 2, 3 ]), [ 1, 2, 3 ], 'stick works on array')

  assert.equal(sequence.first('hello'), 'h', 'first works on strings')
  assert.equal(sequence.rest('hello'), 'ello', 'rest works on strings')
  assert.equal(sequence.stick('h', 'ello'), 'hello', 'stick works on strings')
}

exports['test grouped extensions'] = function(assert) {
  var Sequence = protocol({
    head: [ protocol ],
    tail: [ protocol ]
  })
  (protocol.String, protocol.Array, protocol.Arguments, {
    head: function head(value) { return value[0] }
  })
  (protocol.Array, protocol.Arguments, {
    tail: function(value) { return Array.prototype.slice.call(value, 1) }
  })
  (protocol.String, {
    tail: function(value) { return value.substr(1) }
  })

  assert.equal(Sequence.head([ 1, 2, 3 ]), 1, 'first works on array')
  assert.deepEqual(Sequence.tail([ 1, 2, 3]), [ 2, 3 ], 'rest works on array')
  assert.equal(Sequence.head('hello'), 'h', 'first works on strings')
  assert.equal(Sequence.tail('hello'), 'ello', 'rest works on strings')
}

if (module == require.main)
  require("test").run(exports);

})

/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

!(typeof(define) !== "function" ? function($){ $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports); } : define)(function(require, exports) {

'use strict';

var protocol = require('../core').protocol
var meta

exports['test basics'] = function(assert) {
  var sequence = protocol(('Logical list abstraction', {
    first: ('Returns first item of this sequence', [ protocol ]),
    rest: ('Returns sequence of items after the first', [ protocol ]),
    stick: ('Returns sequence of items where head is first, and this is rest', [ Object, protocol ])
  }))
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

if (module == require.main)
  require("test").run(exports);

})

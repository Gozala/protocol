/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

!(typeof(define) !== "function" ? function($){ $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports); } : define)(function(require, exports) {

'use strict';

var protocol = require('../core').protocol
function Arguments() { return arguments }
Arguments.prototype = Object.getPrototypeOf(Arguments())

exports['test basics'] = function(assert) {
  var sequence = protocol({
    first: [ protocol ],
    rest: [ protocol ],
    join: [ Object, protocol ]
  })

  sequence(String, {
    first: function(string) { return string[0] || null },
    rest: function(string) { return String.prototype.substr.call(string, 1) },
    join: function(item, string) { return item + string }
  })
  sequence(Array, {
    first: function(array) { return array[0] || null },
    rest: function(array) { return Array.prototype.slice.call(array, 1) },
    join: function(item, array) {
      return Array.prototype.concat.call([ item ], array)
    }
  })

  assert.equal(sequence.first([ 1, 2, 3 ]), 1, 'first works on array')
  assert.deepEqual(sequence.rest([ 1, 2, 3]), [ 2, 3 ], 'rest works on array')
  assert.deepEqual(sequence.join(1, [ 2, 3 ]), [ 1, 2, 3 ], 'join works on array')

  assert.equal(sequence.first('hello'), 'h', 'first works on strings')
  assert.equal(sequence.rest('hello'), 'ello', 'rest works on strings')
  assert.equal(sequence.join('h', 'ello'), 'hello', 'join works on strings')
}

exports['test grouped extensions'] = function(assert) {
  var Sequence = protocol({
    head: [ protocol ],
    tail: [ protocol ]
  })

  Sequence(String, Array, Arguments, {
    head: function head(value) { return value[0] }
  })
  Sequence(Array, Arguments, {
    tail: function(value) { return Array.prototype.slice.call(value, 1) }
  })
  Sequence(String, {
    tail: function(value) { return value.substr(1) }
  })

  assert.equal(Sequence.head([ 1, 2, 3 ]), 1, 'first works on array')
  assert.deepEqual(Sequence.tail([ 1, 2, 3]), [ 2, 3 ], 'rest works on array')
  assert.equal(Sequence.head('hello'), 'h', 'first works on strings')
  assert.equal(Sequence.tail('hello'), 'ello', 'rest works on strings')
}

exports['test default & type specific implementations'] = function(assert) {
  var Sequence = protocol({
    head: [ protocol ],
    tail: [ protocol ]
  })

  Sequence(Object, {
    head: function(object) { return object },
    tail: function(object) { return null }
  })

  ;[ {}, [], null, undefined, true, 3, /a/, 'b' ].forEach(function($) {
    assert.equal(Sequence.head($), $,
                 'Object protocol is implemented by:' + typeof($))
    assert.equal(Sequence.tail($), null,
                 'Object protocol is implemented by:' + typeof($))
  })

  function Stream(head, tail) {
    var stream = Object.create(Stream.prototype)
    stream.head = head
    stream.tail = tail
    return stream
  }
  Sequence(Stream, {
    tail: function(stream) { return stream.tail },
  })

  var a = Stream(1, null), b = Stream(2, a)

  assert.equal(Sequence.head(a), a, 'Stream inherits implementation of head')
  assert.equal(Sequence.tail(b), a, 'Stream has own implementation of tail')

}

exports['test inline types'] = function(assert) {
  var Foo = protocol({
    isFoo: [ protocol ]
  })
  Foo(Object, { isFoo: function(object) { return false } })

  var bar = Foo({ isFoo: function(object) { return true } })

  assert.equal(Foo.isFoo({}), false, 'Default is not foo')
  assert.equal(Foo.isFoo(bar), true, 'bar is foo')
}

if (module == require.main)
  require('test').run(exports);

})

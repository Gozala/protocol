/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

(typeof define === "undefined" ? function ($) { $(require, exports, module) } : define)(function (require, exports, module, undefined) {

"use strict";

var dispatcher = require('../core').dispatcher

exports['test arity based match'] = function(assert) {
  function identity(value) { return function() { return value } }

  function number(value) {
    if (typeof(value) !== 'number') throw Error('Not a number')
    return value
  }

  var called = {
    nothing: 0,
    number: 0,
    number_number: 0,
    number_rest: 0
  }

  // Match different arity.
  var sum = dispatcher({ doc: "sums given numbers", added: "0.1.0" },
    [], function() { called.nothing ++; return 0 },
    [ number ], function(x) { called.number ++; return x },
    [ number, number ], function(x, y) { called.number_number ++; return x + y },
    [ number, [] ], function (x, rest) {
      called.number_rest ++;
      return rest.reduce(function(x, y) {
        return x + y
      }, x)
    })

  assert.equal(sum(), 0, 'sum() -> 0')
  assert.equal(called.nothing, 1, 'called sum with no args once')
  assert.equal(sum(2), 2, 'sum(2) -> 2')
  assert.equal(sum(17), 17, 'sum(17) -> 17')
  assert.equal(called.number, 2, 'called sum with one arg twice')
  assert.equal(sum(2, 3), 5, 'sum(2, 3) -> 5')
  assert.equal(called.number_number, 1, 'called sum with two args once')
  assert.equal(sum(2, 5, 17, 1), 25, 'sum(2, 5, 17, 1) -> 25')
  assert.equal(called.number_rest, 1, 'called sum with rest once')

  assert.throws(function() {
    sum({})
  }, /Unsupported protocol/, 'throws on unexpected input type')
}

exports['test argument type based match'] = function(assert) {
  function string(value) {
    if (typeof(value) !== 'string') throw Error('Not a string')
    return value
  }
  function lambda(value) {
    if (typeof(value) !== 'function') throw Error('Not a function')
    return value
  }
  function array(value) {
    if (!Array.isArray(value)) throw Error('Not an array')
    return value
  }
  function object(value) {
    if (!value || typeof(value) !== 'object') throw new Error('Not an object')
    return value
  }

  // Match by different input types.
  var map = dispatcher({ added: "0.1.0" },
    [ lambda, string ], function(lambda, string) {
      var index = -1, length = string.length, chars = []
      while (++index < length) chars[index] = lambda(string[index])
      return chars.join('')
    },
    [ lambda, array ], function(lambda, array) {
      var index = -1, length = array.length, elements = []
      while (++index < length) elements[index] = lambda(array[index])
      return elements
    },
    [ lambda, object ], function(lambda, object) {
      var pair, value = Object.create(Object.getPrototypeOf(object))
      for (var key in object) {
        pair = lambda(key, object[key])
        value[pair[0]] = pair[1]
      }
      return value
    },
    [ lambda,, ], function(lambda, value) {
      return lambda(value)
    })

    assert.equal(map(function($) { return $.toUpperCase() }, 'hello world'),
                 'HELLO WORLD', 'works with strings')
    assert.deepEqual(map(function($) { return $ * 2 }, [ 1, 2, 3 ]),
                     [ 2, 4, 6 ], 'works with array')
    assert.deepEqual(map(function(k, v) { return [ '@' + k, v + '!' ] },
                         { a: 'foo', 'b': 2 }),
                     { '@a': 'foo!', '@b': '2!' }, 'works with hashes')
    assert.equal(map(function($) { return $ + 1 }, 6), 7, 'works with numbers')

    assert.throws(function() {
      map(function() {}, 'hello', 'world')
    }, /Unsupported protocol/, 'throws on more arguments then expected')
}

if (module == require.main)
  require("test").run(exports);

})

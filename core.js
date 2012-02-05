/*jshint asi:true latedef: true */

!(typeof(define) !== "function" ? function($){ $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports); } : define)(function(require, exports) {

'use strict';

function Name(name) {
  return ':' + Math.round(Math.random() * 1000000000000000) + ':' + (name || '')
}

function define(methods) {
  /**
  Defines new protocol that may be implemented for different types.

  ## Example

  var sequence = protocol.define(('Logical list abstraction', {
    first: ('Returns the first item in the sequence', [ 'this' ]),
    rest: ('Returns a sequence of the items after the first', [ 'this' ]),
    stick: ('Returns a new sequence where item is first, and this is rest', [ 'item', 'this' ])
  }))

  **/
  function protocol(type, methods) {
    /**
    Extends this protocol by implementing it for the given `type`.

    ## Example

    sequence(String, {
      first: function(string) { return string[0] || null },
      rest: function(string) { return String.prototype.substr.call(string, 1) },
      stick: function(item, string) { return item + string }
    })
    sequence(Array, {
      first: function(array) { return array[0] || null },
      rest: function(array) { return Array.prototype.slice.call(array, 1) },
      stick: function(item, array) {
        return Array.prototype.concat.call([ item ], array)
      }
    })
    **/
    return extend(protocol, type, methods)
  }
  Object.keys(methods).forEach(function(key) {
    function method() {
      var index = ':this-index' in method ? method[':this-index']
                                          : arguments.length - 1
      var name = method[':name']
      var self = arguments[index]
      if (!self[name]) throw TypeError('Protocol not implemented: ' + key)
      return self[name].apply(self, arguments)
    }
    method[':this-index'] = methods[key].indexOf('this')
    method[':name'] = Name(key)
    protocol[key] = method
  })
  return protocol
}
define.define = define
exports.define = define
exports.Protocol = define
exports.protocol = define

function extend(protocol, type, implementation) {
  var descriptor = {}
  type = typeof(type) === 'function' ? type.prototype : type
  Object.keys(implementation).forEach(function(key, name) {
    if (key in protocol) {
      name = protocol[key][':name']
      if (name in type) throw Error('Type already implements protocol: ' + key)
      descriptor[name] = {
        value: implementation[key],
        enumerable: false,
        configurable: false,
        writable: false
      }
    }
  })
  Object.defineProperties(type, descriptor)
  return protocol
}
exports.extend = extend
define.extend = extend

})

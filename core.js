/*jshint asi:true latedef: true */

!(typeof(define) !== "function" ? function($){ $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports); } : define)(function(require, exports) {

'use strict';

var unbind = Function.call.bind(Function.bind, Function.call)
var slice = unbind(Array.prototype.slice)
var owns = unbind(Object.prototype.hasOwnProperty)
var stringify = unbind(Object.prototype.toString)

var ERROR_IMPLEMENTS = 'Type already implements this protocol: '
var ERROR_DOES_NOT_IMPLEMENTS = 'Protocol is not implemented: '

function Name(name) {
  /**
  Generating unique property names.
  **/
  return ':' + (name || '') + ':' + Math.random().toString(36).slice(2)
}

function typeOf(value) {
  /**
  Normalized version of `typeof`.
  **/
  return stringify(value).split(' ')[1].split(']')[0]
}

var types = {
  'Arguments': {},
  'Array': {},
  'String': {},
  'Number': {},
  'Boolean': {},
  'RegExp': {},
  'Date': {},
  'Function': {},
  'Object': {},
  'Undefined': {},
  'Null': {}
}
exports.types = types

function protocol(signature) {
  /**
  Defines new protocol that may be implemented for different types.

  ## Example

  var sequence = protocol.define(('Logical list abstraction', {
    first: ('Returns the first item in the sequence', [ protocol ]),
    rest: ('Returns a sequence of the items after the first', [ protocol ]),
    stick: ('Returns a new sequence where item is first, and this is rest', [ Object, protocol ])
  }))

  **/
  function Protocol(type, methods) {
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
    var types = slice(arguments)
    methods = types.pop()
    if (!types.length) return extend(Protocol, {}, methods)
    while (types.length) extend(Protocol, types.shift(), methods)
  }

  Protocol.signature = signature
  var descriptor = {}
  Object.keys(signature).forEach(function(key) {
    function method() {
      var index = method[':this-index']
      var name = method[':name']
      var target = arguments[index]
      var f = (
        (target && target[name]) ||           // By instance
        (types[typeOf(target)][name]) ||      // By type
        (types.Object[name]))                 // Default

      if (!f) throw TypeError(ERROR_DOES_NOT_IMPLEMENTS + key)
      return f.apply(f, arguments)
    }
    method[':this-index'] = signature[key].indexOf(protocol)
    method[':name'] = Name(key)
    descriptor[key] = { value: method, enumerable: true }
  })

  return Object.defineProperties(Protocol, descriptor)
}
exports.protocol = protocol

function extend(protocol, type, implementation) {
  var descriptor = {}
  if (typeof(type) === 'function' && typeof(type.prototype) !== 'function')
    type = type.prototype
  else
    type = types[typeOf(type)] || type

  Object.keys(implementation).forEach(function(key, name) {
    if (key in protocol) {
      name = protocol[key][':name']
      if (owns(type, name)) throw Error(ERROR_IMPLEMENTS + key)
      descriptor[name] = {
        value: implementation[key],
        enumerable: false,
        configurable: false,
        writable: false
      }
    }
  })

  Object.defineProperties(type, descriptor)
  return type
}
exports.extend = extend

});

/*jshint asi:true latedef: true */

!(typeof(define) !== "function" ? function($){ $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports); } : define)(function(require, exports) {

'use strict';

var unbind = Function.call.bind(Function.bind, Function.call)
var args = (function() { return arguments })()
var Arguments = Object.getPrototypeOf(args)
var stringify = unbind(Object.prototype.toString)

function Name(name) {
  return ':' + (name || '') + ':' + Math.round(Math.random() * 1000000000000000)
}

var numbery = stringify(Number.prototype)
var booleany = stringify(Boolean.prototype)
var regexpy = String(RegExp.prototype)
var daty = stringify(Date.prototype)
var stringy = stringify(String.prototype)
var argumenty = stringify(args)


var builtins = {}
Object.defineProperties(builtins, builtins.descriptor = {
  Arguments: { value: {} },
  Array: { value: {} },
  String: { value: {} },
  Number: { value: {} },
  Boolean: { value: {} },
  RegExp: { value: {} },
  Date: { value: {} },
  Function: { value: {} },
  Object: { value: {} }
})

var isArray = Array.isArray
function isString(type) { return stringify(type) === stringy }
function isNumber(type) { return stringify(type) === numbery }
function isBoolean(type) { return stringify(type) === booleany }
function isDate(type) { return stringify(type) === daty }
function isRegExp(type) { return String(type) === regexpy }
function isArguments(type) { return stringify(type) === argumenty }
function isFunction(type) { return typeof(type) === 'undefined' }
function isObject(type) { return Object.getPrototypeOf(type) === null }

function define(signature) {
  /**
  Defines new protocol that may be implemented for different types.

  ## Example

  var sequence = protocol.define(('Logical list abstraction', {
    first: ('Returns the first item in the sequence', [ protocol ]),
    rest: ('Returns a sequence of the items after the first', [ protocol ]),
    stick: ('Returns a new sequence where item is first, and this is rest', [ Object, protocol ])
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
  Object.keys(signature).forEach(function(key) {
    function method() {
      var index = method[':this-index']
      var name = method[':name']
      var target = arguments[index]
      var f = (target[name] ||
        // Following fallbacks are probably slow but not a big issues anyway
        // as they only execute if `target` either does not implements protocol
        // or it's from scope with different globals. In later case that's a
        // price to pay for multiple set of built-ins. Also there is always an
        // option to execute protocol implementation there to go with a fast
        // path.
        (isArray(target) && builtins.Array[name]) ||
        (isString(target) && builtins.String[name]) ||
        (isNumber(target) && builtins.Number[name]) ||
        (isBoolean(target) && builtins.Boolean[name]) ||
        (isDate(target) && builtins.Date[name]) ||
        (isRegExp(target) && builtins.RegExp[name]) ||
        (isArguments(target) && builtins.Arguments[name]) ||
        (isFunction(target) && builtins.Function[name]) ||
        (isObject(target) && builtins.Object[name]))

      if (!f) throw TypeError('Protocol is not implemented: ' + key)
      return f.apply(f, arguments)
    }
    method[':this-index'] = signature[key].indexOf('this')
    method[':name'] = Name(key)
    protocol[key] = method
  })
  return protocol
}
// Export local built-ins so that extensions can be defined across the rest of
// the application.
Object.defineProperties(define, builtins.descriptor)
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

});

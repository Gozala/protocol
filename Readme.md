# dispatcher #

[Pattern matching] for JavaScript.

Library can be used to implement functions supporting range of different
dispatchers, in a declarative manner avoiding mess of conditional blocks &
manual argument validations. While primarily this aims to improve code
readability and maintainability, in some cases this can be useful to optimize
specific, hot code paths.


## Examples ##

```js

var dispatcher = require('dispatcher/core').dispatcher

function number(value) {
  if (typeof(value) !== 'number') throw Error('Not a number')
  return value
}

var sum = dispatcher({ doc: "sums given numbers", added: "0.1.0" },
  // If no arguments are passed then 0.
  [], function() { return 0 },
  // If only one argument is passed return back.
  [ number ], function(x) { return x },
  // Optimize two argument case.
  [ number, number ], function(x, y) { return x + y },
  // If more then two then take all the args starting from second as
  // rest array.
  [ number, [] ], function (x, rest) {
    called.number_rest ++;
    return rest.reduce(function(x, y) {
      return x + y
    }, x)
  })


sum()               // => 0
sum(1)              // => 1
sum(2, 3)           // => 5
sum(2, 5, 17, 1)    // => 25
sum([ 4 ])          // TypeError -> Unsupported dispatcher


// Define guards
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

var map = dispatcher(
  // Function that operates on strings
  [ lambda, string ], function(lambda, string) {
    var index = -1, length = string.length, chars = []
    while (++index < length) chars[index] = lambda(string[index])
    return chars.join('')
  },
  // Function that operates on arrays
  [ lambda, array ], function(lambda, array) {
    var index = -1, length = array.length, elements = []
    while (++index < length) elements[index] = lambda(array[index])
    return elements
  },
  // Function that operates on objects
  [ lambda, object ], function(lambda, object) {
    var pair, value = Object.create(Object.getPrototypeOf(object))
    for (var key in object) {
      pair = lambda(key, object[key])
      value[pair[0]] = pair[1]
    }
    return value
  },
  // Function that operates on everything else
  [ lambda, , ], function(lambda, value) {
    return lambda(value)
  })


map(function($) { return $.toUpperCase() }, 'hello world')
// => 'HELLO WORLD'

map(function($) { return $ * 2 }, [ 1, 2, 3 ])
// => [ 2, 4, 6 ]

map(function(k, v) { return [ '@' + k, v + '!' ] }, { foo: 1, bar: 'baz' })
// => { '@foo': '1!', '@bar': 'baz!' }

map(function($) { return $ + 1 }, 6)
// => 7

map(function($) { return $ + '!' }, 'hello', 'world')
// TypeError -> Unsupported dispatcher
```

## Install ##

    npm install dispatcher

[Pattern matching]:http://en.wikipedia.org/wiki/Pattern_matching

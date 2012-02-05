# Protocol

Protocol JS library is inspired by idea of [clojure protocols]. Protocols
provide a powerful way for decoupling abstraction interface definition from
an actual implementation per type, without risks of interference with other
libraries.

There are several motivations for protocols:

- Provide a high-performance, dynamic polymorphism construct as an alternative
  to existing object inheritance that does not provides any mechanics for
  guarding against name conflicts.
- Provide the best parts of interfaces:
    - specification only, no implementation
    - a single type can implement multiple protocols
- Protocols allow independent extension of the set of types, protocols, and
  implementations of protocols on types, by different parties.

### Basics

A protocol is a named set of functions and their signatures:

```js
var protocol = require('protocol/core').protocol

var sequence = protocol(('Logical list abstraction', {
  first: ('Returns first item of this sequence', [ 'this' ]),
  rest: ('Returns sequence of items after the first', [ 'this' ]),
  stick: ('Returns sequence of items where head is first, and this is rest', [ 'head', 'this' ])
}))
```

- No implementations are provided
- Docs can be optionally specified for the protocol and the functions, via
  elegant JS hack.
- The above yields a set of polymorphic functions and a protocol object
- The resulting functions dispatch on the type of their `'this'` argument, and
  thus must have it in the list of arguments.

`protocol` will generate an interface containing a corresponding functions.
returned interface may be used to extend data types with it's implementations:

```js
sequence(Array, {
  first: function(array) { return array[0] || null },
  rest: function(array) { return Array.prototype.slice.call(array, 1) },
  stick: function(item, array) {
    return Array.prototype.concat.call([ item ], array)
  }
})
```

Once protocol is implemented for a given type it can be used with a given data
types:

```js
sequence.first([ 1, 2, 3 ]) // => 1
sequence.rest([ 1, 2, 3 ])  // => [ 2, 3 ]

sequence.first('hello')     // TypeError: Protocol not implemented: first
```

Protocol may be implemented for any other data types by any other party:

```js
sequence(String, {
  first: function(string) { return string[0] || null },
  rest: function(string) { return String.prototype.substr.call(string, 1) },
  stick: function(item, string) { return item + string }
})

sequence.first('hello')     // => 'h'
```

Since protocol implementations are decoupled from the actual protocol
definition there maybe multiple implementations, but user will be in charge of
deciding which one to pull in.


## Argument pattern based dispatch

This library previously was doing argument pattern based method dispatch.
If you are looking into something more in that line, check out [dispatcher]
library that was forked from protocol to explore that direction.

[dispatcher]:https://github.com/Gozala/dispatcher/ "Argument patter based dispatch"
[clojure protocols]:http://clojure.org/protocols "Clojure protocols"

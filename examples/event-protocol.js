/*jshint asi:true */
// module: ./event-protocol

var protocol = require('protocol/core').protocol

// Defining a protocol for working with an event listeners / emitters.
module.exports = protocol({
  // Function on takes event `target` object implementing
  // `Event` protocol as first argument, event `type` string
  // as second argument and `listener` function as a third
  // argument. Optionally forth boolean argument can be
  // specified to use a capture. Function allows registration
  // of event `listeners` on the event `target` for the given
  // event `type`.
  on: [ protocol, String, Function, [ Boolean ] ],

  // Function allows registration of single shot event `listener`
  // on the event `target` of the given event `type`.
  once: [ protocol, 'type', 'listener', [ 'capture=false' ] ],

  // Unregisters event `listener` of the given `type` from the given
  // event `target` (implementing this protocol) with a given `capture`
  // face. Optional `capture` argument falls back to `false`.
  off: [ protocol, 'type', 'listener', [ 'capture=false'] ],

  // Emits given `event` for the listeners of the given event `type`
  // of the given event `target` (implementing this protocol) with a given
  // `capture` face. Optional `capture` argument falls back to `false`.
  emit: [ protocol, 'type', 'event', [ 'capture=false' ] ]
})

/*jshint asi:true */
// module: ./event-object

var Event = require('./event-protocol'), on = Event.on

// Weak registry of listener maps associated
// to event targets.
var map = WeakMap()

// Returns listeners of the given event `target`
// for the given `type` with a given `capture` face.
function getListeners(target, type, capture) {
  // If there is no listeners map associated with
  // this target then create one.
  if (!map.has(target)) map.set(target, Object.create(null))

  var listeners = map.get(target)
  // prefix event type with a capture face flag.
  var address = (capture ? '!' : '-') + type
  // If there is no listeners array for the given type & capture
  // face than create one and return.
  return listeners[address] || (listeners[address] = [])
}

Event(Object, {
  on: function(target, type, listener, capture) {
    var listeners = getListeners(target, type, capture)
    // Add listener if not registered yet.
    if (!~listeners.indexOf(listener)) listeners.push(listener)
  },
  once: function(target, type, listener, capture) {
    on(target, type, listener, capture)
    on(target, type, function cleanup() {
      off(target, type, listener, capture)
    }, capture)
  },
  off: function(target, type, listener, capture) {
    var listeners = getListeners(target, type, capture)
    var index = listeners.indexOf(listener)
    // Remove listener if registered.
    if (~index) listeners.splice(index, 1)
  },
  emit: function(target, type, event, capture) {
    var listeners = getListeners(target, type, capture).slice()
    // TODO: Exception handling
    while (listeners.length) listeners.shift().call(target, event)
  }
})

/*jshint asi:true */
// module: ./event-emitter

var EventProtocol = require('./event-protocol')
var EventEmitter = require('events').EventEmitter

EventProtocol(EventEmitter, {
  on: function(target, type, listener, capture) {
    target.on(type, listener)
  },
  once: function(target, type, listener, capture) {
    target.once(type, listener)
  },
  off: function(target, type, listener, capture) {
    target.removeListener(target, type)
  },
  emit: function(target, type, event, capture) {
    target.emit(type, event)
  }
})

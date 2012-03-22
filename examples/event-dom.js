/*jshint asi:true latedef: true */
// module: ./event-dom

var Event = require('./event-protocol')

Event(Element, {
  on: function(target, type, listener, capture) {
    target.addEventListener(type, listener, capture)
  },
  off: function(target, type, listener, capture) {
    target.removeListener(type, listener, capture)
  },
  emit: function(target, type, option, capture) {
    // Note: This is simplified implementation for demo purposes.
    var document = target.ownerDocument
    var event = document.createEvent('UIEvents')
    event.initUIEvent(type, option.bubbles, option.cancellable,
                      document.defaultView, 1)
    event.data = option.data
    target.dispatchEvent(event)
  }
})

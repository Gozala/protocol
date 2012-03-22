/*jshint asi:true latedef: true */
// module: ./installable

// Protocol for working with installable application components.
var Installable = protocol({
  // Installs given `component` implementing this protocol. Takes optional
  // configuration options.
  install: [ protocol, [ 'options:Object' ] ],
  // Uninstall given `component` implementing this protocol.
  uninstall: [ protocol ],
  // Activate given `component` implementing this protocol.
  on: [ protocol ],
  // Disable given `component` implementing this protocol.
  off: [ protocol ]
})

Installable(Object, {
  install: function(component, options) {
    // Implementation details...
  },
  uninstall: function(component, options) {
    // Implementation details...
  },
  on: function(component) {
    component.enabled = true
  },
  off: function(component) {
    component.enabled = false
  }
})

module.exports = Installable

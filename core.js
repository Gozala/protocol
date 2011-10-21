/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true devel: true
         forin: true latedef: false supernew: true */
/*global define: true */

!(typeof(define) !== "function" ? function($) { $(typeof(require) !== 'function' ? (function() { throw Error('require unsupported'); }) : require, typeof(exports) === 'undefined' ? this : exports, typeof(module) === 'undefined' ? {} : module); } : define)(function(require, exports, module) {

"use strict";

var dispatcher = (function(slicer, isArray) {
  // Creating a shortcuts:
  slicer = Array.prototype.slice
  isArray = Array.isArray

  function match(pattern, args) {
    /**
    Utility function takes arguments `pattern` and actual arguments as `args`
    array and performs match over them. If given `args` match the `pattern`
    returned value is arrays of matches, otherwise it's `null`.
    **/
    try {
      var length = pattern.length, index = -1, matches = []

      // If more arguments are passed then pattern expects and pattern does
      // not captures rest arguments by special `[]` match return `null` since
      // pattern won't match.
      if (length < args.length && !isArray(pattern[length - 1])) return null

      while (++index < length) {
        // If pattern for argument is undefined (usually specified as hole in
        // array via trailing `,`) pattern matches anything, so map it.
        if (typeof(pattern[index]) === 'undefined')
          matches[index] = args[index]

        // If pattern for the argument is a function then it's a guard that
        // either extracts data or throws if it does not matches. Map extracted
        // data or return `null` in exception handler.
        else if (typeof(pattern[index]) === 'function')
          matches[index] = pattern[index](args[index])

        // Empty array as argument pattern, has a special meaning of capturing
        // this and all the following arguments into an array. There for slice
        // all the `args` starting from this one push into matches and return
        // immediately.
        else if (isArray(pattern[index]))
          return matches[index] = slicer.call(args, index), matches

        // In all other cases patterns are treated as constants. If it matches
        // argument, put it into matches.
        else if (args[index] === pattern[index])
          matches[index] = args[index]

        // Otherwise match fails and return with `null` immediately.
        else
          return null
      }
      return matches
    } catch (error) {
      // If function pattern does not matches argument it throws, in which
      // case match is failed and `null returned.
      return null
    }
  }

  return function dispatcher(meta, params) {
    /**
    This function can be used to implement functions supporting range of
    protocols, in a declarative manner avoiding mess of conditional blocks &
    manual argument validations. While primarily this aims to improve code
    readability and maintainability, in some cases this can be useful to
    optimize specific, hot code paths.

    Function accepts following input:

      - Optionally metadata (name, version, doc) JSON object can be passed
        as a first argument.
      - Optionally `doc` string may be passed as first argument, in which case
        metadata object will be created with this doc string.
      - All the other arguments represent input patterns and associated
        functions (as following argument) to be invoked in case of match.

    Returned function, when invoked will find matching pattern for the passed
    arguments and will delegate to an associated function. If no match is found
    `TypeError` with `"Unsupported protocol"` message is thrown.

    Pattern represents an array. Each element is an argument pattern. Usually
    that's a function that either extracts data (or just returns given data) on
    match or throws if does not match. Empty array as last pattern has a special
    meaning of extracting rest arguments. `undefined` or typically hole in array
    matches anything. Anything else is matches argument only if it's equal.
    **/

    // Array containing pattern and associated function paths.
    var routes = []

    // Take all the params except 1st one, as we expect it to be a metadata
    // object associated with a resulting function.
    params = slicer.call(arguments, 1)

    // If metadata is a string, then we interpret it as documentation string
    // and there for normalize to a metadata object with a doc property
    // containing this string.
    if (typeof(meta) === 'string') meta = { doc: meta  }

    // If first argument is not an array or is non-object, then it's part of
    // pattern match rules so we unshift it back to params.
    if (isArray(meta)) (params.unshift(meta), meta = {})

    meta.error = meta.error || 'Unsupported protocol'

    // `params` are expected to have a following form:
    // `[ pattern1, fn1, pattern2, fn2, ... ]` where `pattern` is an array
    // representing an arguments signature for the following `fn` function.
    // We walk through parameters in order to collect all routes consisting of
    // (optional) pattern and associated function.

    var length = params.length, index = 0, route
    while (index < length)
      routes.push({ pattern: params[index++], fn: params[index++] })

    function router() {
      /**
      Composite function that implements multiple different protocols for
      interacting with different input.
      **/

      var length = routes.length, index = 0, route, args

      // Try to find a route, that has a pattern matching given arguments. If
      // such rout is found, extract match from arguments and delegate to the
      // associated function of the route.
      while (index < length) {
        route = routes[index++]
        args = match(route.pattern, arguments)
        if (args) return route.fn.apply(this, args)
      }

      // If matching route not found throw an exception.
      throw TypeError(meta.error)
    }

    // Metadata is copied to the composed function (`name` property is treated
    // specially, it's copied as `displayName` property so that debuggers can
    // provide more meaningful information for such function).
    router.meta = meta
    if (router.name) router.displayName = meta.name

    return router
  } 
})()
exports.dispatcher = dispatcher

});

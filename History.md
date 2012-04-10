# Changes #

## 0.3.0 / 2012-04-10

  - Stop mutating builtins.
  - Remove alias names for `protocol` function.
  - Add API for in-line protocol implementations.
  - Add more tests.

## 0.2.4 / 2012-03-21

  - Make possible to implement protocol for a type even if ancestors already
    implemented it.
  - Use shorter names for protocol properties.
  - Provide some code examples.

## 0.2.3 / 2012-02-23

  - Add convenience syntax for extending multiple types in a same call.

## 0.2.2 / 2012-02-22

  - Fix incorrect behavior when extending `protocol.Object`.

## 0.2.1 / 2012-02-21

  - Support for multi-globals by exposing `protocol.Object`, `protocol.String`,
    etc that apply to all built-ins regardless of scope they're coming from.
  - Swap `'this'` with `protocol` in the signature definitions.

## 0.2.0 / 2012-02-05

  - Moving protocols to a type based polymorphism from an argument based method
    dispatch.

## 0.0.1 / 2011-10-10

  - Initial release

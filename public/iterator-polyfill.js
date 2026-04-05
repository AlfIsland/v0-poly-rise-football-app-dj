(function() {
  'use strict';
  try {
    function addToArray(proto) {
      if (proto && typeof proto.toArray !== 'function') {
        Object.defineProperty(proto, 'toArray', {
          value: function() { return Array.from(this); },
          writable: true,
          configurable: true,
          enumerable: false
        });
      }
    }
    // Map iterators
    addToArray(Object.getPrototypeOf(new Map().values()));
    addToArray(Object.getPrototypeOf(new Map().keys()));
    addToArray(Object.getPrototypeOf(new Map().entries()));
    // Set iterators
    addToArray(Object.getPrototypeOf(new Set().values()));
    addToArray(Object.getPrototypeOf(new Set().keys()));
    addToArray(Object.getPrototypeOf(new Set().entries()));
    // Array iterator
    addToArray(Object.getPrototypeOf([][Symbol.iterator]()));
    // String iterator
    addToArray(Object.getPrototypeOf(''[Symbol.iterator]()));
  } catch(e) {
    console.error('Iterator polyfill failed:', e);
  }
})();

(function() {
  'use strict';
  
  // Polyfill for Iterator.prototype.toArray
  if (typeof Iterator !== 'undefined' && Iterator.prototype && !Iterator.prototype.toArray) {
    Iterator.prototype.toArray = function() {
      return Array.from(this);
    };
  }
  
  // Polyfill Map iterator methods
  if (typeof Map !== 'undefined') {
    var mapValues = Map.prototype.values;
    var mapKeys = Map.prototype.keys;
    var mapEntries = Map.prototype.entries;
    var mapIterator = Map.prototype[Symbol.iterator];
    
    function toArrayFn() {
      var result = [];
      var item;
      while (!(item = this.next()).done) {
        result.push(item.value);
      }
      return result;
    }
    
    function patchIterator(iter) {
      if (iter && typeof iter.toArray !== 'function') {
        iter.toArray = toArrayFn;
      }
      return iter;
    }
    
    Map.prototype.values = function() { return patchIterator(mapValues.call(this)); };
    Map.prototype.keys = function() { return patchIterator(mapKeys.call(this)); };
    Map.prototype.entries = function() { return patchIterator(mapEntries.call(this)); };
    Map.prototype[Symbol.iterator] = function() { return patchIterator(mapIterator.call(this)); };
  }
  
  // Polyfill Set iterator methods
  if (typeof Set !== 'undefined') {
    var setValues = Set.prototype.values;
    var setKeys = Set.prototype.keys;
    var setEntries = Set.prototype.entries;
    var setIterator = Set.prototype[Symbol.iterator];
    
    function toArrayFnSet() {
      var result = [];
      var item;
      while (!(item = this.next()).done) {
        result.push(item.value);
      }
      return result;
    }
    
    function patchIteratorSet(iter) {
      if (iter && typeof iter.toArray !== 'function') {
        iter.toArray = toArrayFnSet;
      }
      return iter;
    }
    
    Set.prototype.values = function() { return patchIteratorSet(setValues.call(this)); };
    Set.prototype.keys = function() { return patchIteratorSet(setKeys.call(this)); };
    Set.prototype.entries = function() { return patchIteratorSet(setEntries.call(this)); };
    Set.prototype[Symbol.iterator] = function() { return patchIteratorSet(setIterator.call(this)); };
  }
})();

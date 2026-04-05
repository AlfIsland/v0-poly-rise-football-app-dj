// Iterator.prototype.toArray polyfill for React 19 compatibility
// Patches Map and Set to return iterators with toArray method

;(function applyIteratorPolyfill() {
  const toArrayImpl = function <T>(this: IterableIterator<T>): T[] {
    const result: T[] = []
    let item = this.next()
    while (!item.done) {
      result.push(item.value)
      item = this.next()
    }
    return result
  }

  // Wrap Map methods
  const origMapValues = Map.prototype.values
  Map.prototype.values = function () {
    const iter = origMapValues.call(this)
    if (!iter.toArray) iter.toArray = toArrayImpl.bind(iter)
    return iter
  }

  const origMapKeys = Map.prototype.keys
  Map.prototype.keys = function () {
    const iter = origMapKeys.call(this)
    if (!iter.toArray) iter.toArray = toArrayImpl.bind(iter)
    return iter
  }

  const origMapEntries = Map.prototype.entries
  Map.prototype.entries = function () {
    const iter = origMapEntries.call(this)
    if (!iter.toArray) iter.toArray = toArrayImpl.bind(iter)
    return iter
  }

  // Wrap Set methods
  const origSetValues = Set.prototype.values
  Set.prototype.values = function () {
    const iter = origSetValues.call(this)
    if (!iter.toArray) iter.toArray = toArrayImpl.bind(iter)
    return iter
  }

  const origSetKeys = Set.prototype.keys
  Set.prototype.keys = function () {
    const iter = origSetKeys.call(this)
    if (!iter.toArray) iter.toArray = toArrayImpl.bind(iter)
    return iter
  }

  const origSetEntries = Set.prototype.entries
  Set.prototype.entries = function () {
    const iter = origSetEntries.call(this)
    if (!iter.toArray) iter.toArray = toArrayImpl.bind(iter)
    return iter
  }

  // Also patch Symbol.iterator for both
  const origMapIterator = Map.prototype[Symbol.iterator]
  Map.prototype[Symbol.iterator] = function () {
    const iter = origMapIterator.call(this)
    if (!iter.toArray) iter.toArray = toArrayImpl.bind(iter)
    return iter
  }

  const origSetIterator = Set.prototype[Symbol.iterator]
  Set.prototype[Symbol.iterator] = function () {
    const iter = origSetIterator.call(this)
    if (!iter.toArray) iter.toArray = toArrayImpl.bind(iter)
    return iter
  }
})()

export {}

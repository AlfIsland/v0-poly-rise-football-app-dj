"use client"

// This component ensures the iterator polyfill runs on the client before React hydration
if (typeof window !== "undefined") {
  const toArrayFn = function <T>(this: IterableIterator<T>): T[] {
    const arr: T[] = []
    let result = this.next()
    while (!result.done) {
      arr.push(result.value)
      result = this.next()
    }
    return arr
  }

  const patchIterator = <T,>(iter: IterableIterator<T>): IterableIterator<T> => {
    if (iter && typeof (iter as any).toArray !== "function") {
      ;(iter as any).toArray = toArrayFn.bind(iter)
    }
    return iter
  }

  // Patch Map prototype
  const origMapValues = Map.prototype.values
  Map.prototype.values = function <V>(this: Map<unknown, V>) {
    return patchIterator(origMapValues.call(this))
  }

  const origMapKeys = Map.prototype.keys
  Map.prototype.keys = function <K>(this: Map<K, unknown>) {
    return patchIterator(origMapKeys.call(this))
  }

  const origMapEntries = Map.prototype.entries
  Map.prototype.entries = function <K, V>(this: Map<K, V>) {
    return patchIterator(origMapEntries.call(this))
  }

  const origMapIterator = Map.prototype[Symbol.iterator]
  Map.prototype[Symbol.iterator] = function <K, V>(this: Map<K, V>) {
    return patchIterator(origMapIterator.call(this))
  }

  // Patch Set prototype
  const origSetValues = Set.prototype.values
  Set.prototype.values = function <T>(this: Set<T>) {
    return patchIterator(origSetValues.call(this))
  }

  const origSetKeys = Set.prototype.keys
  Set.prototype.keys = function <T>(this: Set<T>) {
    return patchIterator(origSetKeys.call(this))
  }

  const origSetEntries = Set.prototype.entries
  Set.prototype.entries = function <T>(this: Set<T>) {
    return patchIterator(origSetEntries.call(this))
  }

  const origSetIterator = Set.prototype[Symbol.iterator]
  Set.prototype[Symbol.iterator] = function <T>(this: Set<T>) {
    return patchIterator(origSetIterator.call(this))
  }
}

export function IteratorPolyfillLoader() {
  return null
}

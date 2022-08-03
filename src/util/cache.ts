export const createCacheContainer = <Data>() => {
  let cache: Record<string, Data> = {}

  return {
    reset: () => (cache = {}),
    set: (key: string, setter: () => Data) => {
      const oldValue = cache[key]

      if (oldValue) {
        return oldValue
      } else {
        const newValue = setter()
        cache[key] = newValue
        return newValue
      }
    },
  }
}

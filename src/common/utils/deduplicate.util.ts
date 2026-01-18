export const deduplicateByKey = <T>(items: T[], getKey: (item: T) => string): T[] => {
  const map = new Map<string, T>()

  for (const item of items) {
    const key = getKey(item)
    if (!map.has(key)) map.set(key, item)
  }

  return [...map.values()]
}

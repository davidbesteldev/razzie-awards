/**
 * Removes duplicates from an array based on a generated key, preserving the first occurrence.
 *
 * @example
 * const data = [{ id: 1, role: 'admin' }, { id: 1, role: 'user' }, { id: 2, role: 'guest' }]
 * deduplicateByKey(data, (user) => user.id)
 * // Returns: [{ id: 1, role: 'admin' }, { id: 2, role: 'guest' }]
 */
export const deduplicateByKey = <T>(items: T[], getKey: (item: T) => string): T[] => {
  const map = new Map<string, T>()

  for (const item of items) {
    const key = getKey(item)
    if (!map.has(key)) map.set(key, item)
  }

  return [...map.values()]
}

/**
 * Splits a string into a clean list, supporting multiple delimiters (commas, semicolons, slashes, ampersands, and "and").
 * It automatically trims whitespace and removes empty values.
 *
 * @example
 * parseDelimitedList("Moritz Borman, Jon Kilik, Thomas Schuhly and Iain Smith")
 * // Returns: ['Moritz Borman', 'Jon Kilik', 'Thomas Schuhly', 'Iain Smith']
 */
export const parseDelimitedList = (value: string): string[] => {
  if (!value) return []

  return value
    .replace(/\band\b/gi, ',')
    .replace(/[;&/]/g, ',')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

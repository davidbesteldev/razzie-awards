/**
 * Generates a normalized string key based on the movie's title and year.
 *
 * @example
 * buildMovieKey({ title: ' The Matrix ', year: 1999 })
 * // Returns: "the matrix_1999"
 */
export const buildMovieKey = (movie: { title: string; year: number }): string => {
  return `${movie.title.trim().toLowerCase()}_${movie.year}`
}

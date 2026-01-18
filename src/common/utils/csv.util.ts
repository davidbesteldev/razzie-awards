import csv from 'csv-parser'
import * as fs from 'node:fs'

/**
 * Streams a CSV file and converts it to a JSON array using a transform function.
 * Default separator is ';'.
 * @example
 * await csvToJson('users.csv', (row) => ({ name: row.name, age: Number(row.age) }));
 * // Returns: [{ name: 'Alice', age: 30 }]
 */
export const csvToJson = <TRow, TResult>(
  filePath: string,
  mapRow: (row: TRow) => TResult,
  options?: { separator?: string; requiredColumns?: (keyof TRow)[] },
): Promise<TResult[]> => {
  return new Promise((resolve, reject) => {
    const result: TResult[] = []
    const requiredColumns = options?.requiredColumns

    const stream = fs.createReadStream(filePath)

    stream.once('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return reject(new Error(`CSV file not found: ${filePath}`))
      }
      reject(err)
    })

    stream
      .pipe(csv({ separator: options?.separator ?? ';' }))
      .on('error', (error) => reject(error))
      .on('data', (row: TRow) => {
        if (!row || Object.keys(row).length === 0) return

        if (requiredColumns) {
          const isValid = requiredColumns.every((col) => {
            const val = row[col]
            return val !== undefined && val !== null && String(val).trim() !== ''
          })

          if (!isValid) return
        }

        result.push(mapRow(row))
      })
      .on('end', () => resolve(result))
  })
}

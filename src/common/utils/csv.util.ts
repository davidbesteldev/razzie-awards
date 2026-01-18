import csv from 'csv-parser'
import * as fs from 'node:fs'

export type CsvRawRow = Record<string, string>

type CsvToJsonOptions = {
  requiredColumns?: (keyof CsvRawRow)[]
  separator?: string
}
type CsvToJsonResult<T> = {
  valid: T[]
  invalid: Array<{ row: CsvRawRow; reason: string }>
}

/**
 * Streams a CSV file and converts it to JSON using a transform function.
 * Only valid rows are returned; invalid ones are collected with the reason.
 * Default separator is ';'.
 *
 * @example
 * const { valid, invalid } = await csvToJson(
 *   'users.csv',
 *   (row) => ({ name: row.name, age: Number(row.age) }),
 *   { requiredColumns: ['name', 'age'] }
 * )
 * // valid:   [{ name: 'Alice', age: 30 }]
 * // invalid: [{ row: { name: '', age: '25' }, reason: 'Missing required columns: name' }]
 */
export const csvToJson = <TResult>(
  filePath: string,
  mapRow: (row: CsvRawRow) => TResult | undefined,
  options?: CsvToJsonOptions,
): Promise<CsvToJsonResult<TResult>> => {
  return new Promise((resolve, reject) => {
    const valid: TResult[] = []
    const invalid: Array<{ row: CsvRawRow; reason: string }> = []

    const stream = fs.createReadStream(filePath)

    stream.once('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return reject(new Error(`CSV file not found: ${filePath}`))
      }
      reject(err)
    })

    stream
      .pipe(csv({ separator: options?.separator ?? ';' }))
      .on('error', reject)
      .on('data', (row: CsvRawRow) => {
        if (Object.keys(row).length === 0) {
          invalid.push({ row, reason: 'Empty row' })
          return
        }

        if (options?.requiredColumns) {
          const missing = options.requiredColumns.filter((col) => {
            const val = row[col]
            return typeof val !== 'string' || val.trim() === ''
          })

          if (missing.length > 0) {
            invalid.push({
              row,
              reason: `Missing required columns: ${missing.join(', ')}`,
            })
            return
          }
        }

        try {
          const mapped = mapRow(row)
          if (!mapped) {
            invalid.push({ row, reason: 'Invalid row mapping' })
          } else {
            valid.push(mapped)
          }
        } catch (err) {
          invalid.push({
            row,
            reason: err instanceof Error ? err.message : 'Error mapping row',
          })
        }
      })
      .on('end', () => resolve({ valid, invalid }))
  })
}

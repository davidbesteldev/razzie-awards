import csv from 'csv-parser'
import * as fs from 'node:fs'

export const csvToJson = <TRow, TResult>(
  filePath: string,
  mapRow: (row: TRow) => TResult,
  options?: { separator?: string },
): Promise<TResult[]> => {
  return new Promise((resolve, reject) => {
    const result: TResult[] = []

    fs.createReadStream(filePath)
      .pipe(csv({ separator: options?.separator ?? ';' }))
      .on('error', (error) => reject(error))
      .on('data', (row: TRow) => result.push(mapRow(row)))
      .on('end', () => resolve(result))
  })
}

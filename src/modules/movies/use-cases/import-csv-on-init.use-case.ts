import { Injectable, Logger } from '@nestjs/common'
import * as path from 'node:path'

import { CsvRawRow, csvToJson, parseDelimitedList, validateDto } from '@app/common/utils'
import { CreateMovieDTO } from '@app/modules/movies/dto/create-movie.dto'
import { CreateMoviesBatchHelper } from '@app/modules/movies/helpers/create-movies-batch.helper'

const csvFilePath = path.join(process.cwd(), 'data', 'Movielist.csv')

@Injectable()
export class ImportCSVOnInitUseCase {
  private readonly logger = new Logger(ImportCSVOnInitUseCase.name)

  constructor(private readonly createMoviesBatchHelper: CreateMoviesBatchHelper) {}

  async execute() {
    try {
      this.logger.log(`Starting CSV import process from file: ${csvFilePath}`)

      const csvData = await csvToJson<CreateMovieDTO>(
        csvFilePath,
        (row) => this.mapRowToDto(row),
        { requiredColumns: ['title', 'year'] },
      )

      if (csvData.invalid.length > 0) {
        this.logger.warn(
          `Invalid CSV rows: ${JSON.stringify({
            count: csvData.invalid.length,
            samples: csvData.invalid.slice(0, 5),
          })}`,
        )
      }

      this.logger.log(`Parsed valid ${csvData.valid.length} records from CSV`)

      if (csvData.valid.length) {
        await this.createMoviesBatchHelper.execute(csvData.valid)
      }

      this.logger.log('CSV import process completed successfully')
    } catch (error) {
      this.logger.error(`CSV import process failed: ${error}`)
    }
  }

  private mapRowToDto(row: CsvRawRow): CreateMovieDTO | undefined {
    const parsed = {
      title: row.title,
      year: Number(row.year),
      winner: row.winner?.toLowerCase() === 'yes',
      studios: parseDelimitedList(row.studios),
      producers: parseDelimitedList(row.producers),
    }

    return validateDto(CreateMovieDTO, parsed)
  }
}

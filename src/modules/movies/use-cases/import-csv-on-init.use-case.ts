import { Injectable, Logger } from '@nestjs/common'
import * as path from 'node:path'

import { csvToJson, parseDelimitedList } from '@app/common/utils'
import { CreateMovieDTO } from '@app/modules/movies/dto/create-movie.dto'
import { CreateMoviesBatchHelper } from '@app/modules/movies/helpers/create-movies-batch.helper'

interface CsvRow {
  year: string
  title: string
  winner: string
  studios: string
  producers: string
}

const csvFilePath = path.join(process.cwd(), 'data', 'Movielist.csv')

@Injectable()
export class ImportCSVOnInitUseCase {
  private readonly logger = new Logger(ImportCSVOnInitUseCase.name)

  constructor(private readonly createMoviesBatchHelper: CreateMoviesBatchHelper) {}

  async execute() {
    try {
      this.logger.log(`Starting CSV import process from file: ${csvFilePath}`)

      const csvData = await csvToJson<CsvRow, CreateMovieDTO>(
        csvFilePath,
        (row) => this.mapRowToDto(row),
        { requiredColumns: ['title', 'year'] },
      )

      this.logger.log(`Parsed ${csvData.length} records from CSV`)

      await this.createMoviesBatchHelper.execute(csvData)

      this.logger.log('CSV import process completed successfully')
    } catch (error) {
      this.logger.error(`CSV import process failed: ${error}`)
    }
  }

  private mapRowToDto(row: CsvRow): CreateMovieDTO {
    return {
      title: row.title,
      year: Number(row.year),
      winner: row.winner?.toLowerCase() === 'yes',
      studios: parseDelimitedList(row.studios),
      producers: parseDelimitedList(row.producers),
    }
  }
}

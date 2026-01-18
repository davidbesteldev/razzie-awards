import { Module } from '@nestjs/common'

import { DatabaseModule } from '@app/core/database/database.module'
import { CreateMoviesBatchHelper } from '@app/modules/movies/helpers/create-movies-batch.helper'
import { MovieService } from '@app/modules/movies/movie.service'
import { ImportCSVOnInitUseCase } from '@app/modules/movies/use-cases/import-csv-on-init.use-case'

@Module({
  imports: [DatabaseModule],
  providers: [MovieService, CreateMoviesBatchHelper, ImportCSVOnInitUseCase],
  exports: [],
})
export class MovieModule {}

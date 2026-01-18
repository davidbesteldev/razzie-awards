import { Module } from '@nestjs/common'

import { EnvModule } from '@app/core/config'
import { DatabaseModule } from '@app/core/database/database.module'

import { MovieModule } from '@app/modules/movies/movie.module'

@Module({
  imports: [EnvModule, DatabaseModule, MovieModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

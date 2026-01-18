import { Module } from '@nestjs/common'

import { EnvModule } from '@app/core/config'
import { DatabaseModule } from '@app/core/database/database.module'
import { MovieModule } from '@app/modules/movies/movie.module'
import { ProducerModule } from '@app/modules/producers/producer.module'

@Module({
  imports: [EnvModule, DatabaseModule, MovieModule, ProducerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

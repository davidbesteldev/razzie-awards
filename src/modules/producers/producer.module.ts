import { Module } from '@nestjs/common'

import { DatabaseModule } from '@app/core/database/database.module'
import { ProducerController } from '@app/modules/producers/producer.controller'
import { ProducerService } from '@app/modules/producers/producer.service'
import { GetAwardsIntervalsUseCase } from '@app/modules/producers/use-cases/get-awards-intervals.use-case'

@Module({
  imports: [DatabaseModule],
  controllers: [ProducerController],
  providers: [ProducerService, GetAwardsIntervalsUseCase],
  exports: [],
})
export class ProducerModule {}

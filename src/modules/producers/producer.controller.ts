import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { ProducerService } from '@app/modules/producers/producer.service'

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get('/awards-intervals')
  @ApiOperation({ summary: 'Gets producers with minimum and maximum award intervals' })
  getAwardsIntervals() {
    return this.producerService.getAwardsIntervals()
  }
}

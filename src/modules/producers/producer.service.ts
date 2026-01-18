import { Injectable } from '@nestjs/common'

import { GetAwardsIntervalsResponseDto } from '@app/modules/producers/dto/get-awards-interval.dto'
import { GetAwardsIntervalsUseCase } from '@app/modules/producers/use-cases/get-awards-intervals.use-case'

@Injectable()
export class ProducerService {
  constructor(private readonly getAwardsIntervalsUseCase: GetAwardsIntervalsUseCase) {}

  getAwardsIntervals(): Promise<GetAwardsIntervalsResponseDto> {
    return this.getAwardsIntervalsUseCase.execute()
  }
}

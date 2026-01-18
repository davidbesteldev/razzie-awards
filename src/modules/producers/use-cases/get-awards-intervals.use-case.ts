import { Injectable } from '@nestjs/common'

import { DatabaseService } from '@app/core/database/database.service'

import {
  GetAwardIntervalItemDto,
  GetAwardsIntervalsResponseDto,
} from '@app/modules/producers/dto/get-awards-interval.dto'

@Injectable()
export class GetAwardsIntervalsUseCase {
  constructor(private readonly database: DatabaseService) {}

  async execute(): Promise<GetAwardsIntervalsResponseDto> {
    const winners = await this.database.movieProducer.findMany({
      where: { movie: { winner: true } },
      include: { producer: true, movie: true },
      orderBy: { movie: { year: 'asc' } },
    })

    const producerWinsMap = this.groupWinsByProducer(winners)
    const intervals = this.calculateIntervals(producerWinsMap)

    return this.buildResponse(intervals)
  }

  private groupWinsByProducer(
    winners: { producer: { name: string }; movie: { year: number } }[],
  ): Map<string, number[]> {
    const producerWinsMap = new Map<string, number[]>()

    for (const win of winners) {
      const producerName = win.producer.name
      const year = win.movie.year

      if (!producerWinsMap.has(producerName)) producerWinsMap.set(producerName, [])
      producerWinsMap.get(producerName)!.push(year)
    }

    return producerWinsMap
  }

  private calculateIntervals(
    producerWinsMap: Map<string, number[]>,
  ): GetAwardIntervalItemDto[] {
    const intervals: GetAwardIntervalItemDto[] = []

    for (const [producer, years] of producerWinsMap.entries()) {
      const hasSingleWin = years.length < 2
      if (hasSingleWin) continue

      years.sort((a, b) => a - b)

      for (let i = 1; i < years.length; i++) {
        const previousWin = years[i - 1]
        const followingWin = years[i]

        intervals.push({
          producer,
          interval: followingWin - previousWin,
          previousWin,
          followingWin,
        })
      }
    }

    return intervals
  }

  private buildResponse(
    intervals: GetAwardIntervalItemDto[],
  ): GetAwardsIntervalsResponseDto {
    if (!intervals.length) return { min: [], max: [] }

    const minInterval = Math.min(...intervals.map((i) => i.interval))
    const maxInterval = Math.max(...intervals.map((i) => i.interval))

    return {
      min: intervals.filter((i) => i.interval === minInterval),
      max: intervals.filter((i) => i.interval === maxInterval),
    }
  }
}

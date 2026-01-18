export class GetAwardIntervalItemDto {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

export class GetAwardsIntervalsResponseDto {
  min: GetAwardIntervalItemDto[]
  max: GetAwardIntervalItemDto[]
}

import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator'

export class CreateMovieDTO {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsInt()
  @Min(1800)
  year: number

  @IsBoolean()
  winner: boolean

  @IsString({ each: true })
  studios: string[]

  @IsString({ each: true })
  producers: string[]
}

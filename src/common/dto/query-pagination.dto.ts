import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNumberString, IsOptional } from 'class-validator'

import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '@app/common/database/utils/pagination.utils'

export enum QueryPaginationOrderEnum {
  DESC = 'desc',
  ASC = 'asc',
}

export class QueryPaginationDto {
  @ApiPropertyOptional({
    description: 'Número da página',
    default: DEFAULT_PAGE_NUMBER,
  })
  @IsOptional()
  @IsNumberString()
  page?: string

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    default: DEFAULT_PAGE_SIZE,
  })
  @IsOptional()
  @IsNumberString()
  size?: string

  @ApiPropertyOptional({
    description: 'Ordem da listagem',
    enum: QueryPaginationOrderEnum,
  })
  @IsOptional()
  @IsEnum(QueryPaginationOrderEnum)
  order?: QueryPaginationOrderEnum
}

export class PaginationMetaDto {
  @ApiProperty({ example: 3 })
  total: number

  @ApiProperty({ example: 1 })
  lastPage: number

  @ApiProperty({ example: 1 })
  currentPage: number

  @ApiProperty({ example: 10 })
  totalPerPage: number

  @ApiProperty({ example: null, nullable: true })
  prevPage: number | null

  @ApiProperty({ example: null, nullable: true })
  nextPage: number | null
}

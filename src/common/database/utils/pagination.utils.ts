import { QueryPaginationDto } from '../../dto/query-pagination.dto'

export const DEFAULT_PAGE_NUMBER = 1
export const DEFAULT_PAGE_SIZE = 10

export interface PaginateMetaOutput {
  total: number
  lastPage: number
  currentPage: number
  totalPerPage: number
  prevPage: number | null
  nextPage: number | null
}
export interface PaginateOutput<T> {
  data: T[]
  meta: PaginateMetaOutput
}

export const paginate = (query?: QueryPaginationDto): { skip: number; take: number } => {
  const size = Math.abs(parseInt(query?.size ?? '')) || DEFAULT_PAGE_SIZE
  const page = Math.abs(parseInt(query?.page ?? '')) || DEFAULT_PAGE_NUMBER

  return {
    skip: size * (page - 1),
    take: size,
  }
}

export const paginateOutput = <T>(
  data: T[],
  total: number,
  query?: QueryPaginationDto,
): PaginateOutput<T> => {
  const page = Math.abs(parseInt(query?.page ?? '')) || DEFAULT_PAGE_NUMBER
  const size = Math.abs(parseInt(query?.size ?? '')) || DEFAULT_PAGE_SIZE

  const lastPage = Math.ceil(total / size)

  if (!data.length) {
    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        totalPerPage: size,
        prevPage: null,
        nextPage: null,
      },
    }
  }

  return {
    data,
    meta: {
      total,
      lastPage,
      currentPage: page,
      totalPerPage: size,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < lastPage ? page + 1 : null,
    },
  }
}

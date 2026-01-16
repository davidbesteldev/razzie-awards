import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  paginate,
  paginateOutput,
} from '@app/common/database/utils/pagination.utils'

describe('pagination.utils', () => {
  describe('paginate', () => {
    it('should return default skip and take when no query is provided', () => {
      expect(paginate()).toEqual({ skip: 0, take: DEFAULT_PAGE_SIZE })
    })

    it('should calculate correct skip and take based on valid query', () => {
      const query = { page: '2', size: '5' }
      expect(paginate(query)).toEqual({ skip: 5, take: 5 })
    })
  })

  describe('paginateOutput', () => {
    const sampleData = [{ id: 1 }, { id: 2 }]

    it('should return correct pagination metadata with data', () => {
      const result = paginateOutput(sampleData, 20, { page: '2', size: '5' })

      expect(result.meta).toEqual({
        total: 20,
        lastPage: 4,
        currentPage: 2,
        totalPerPage: 5,
        prevPage: 1,
        nextPage: 3,
      })
      expect(result.data).toEqual(sampleData)
    })

    it('should handle first page with no previous page', () => {
      const result = paginateOutput(sampleData, 10, { page: '1', size: '5' })

      expect(result.meta.prevPage).toBeNull()
    })

    it('should handle last page with no next page', () => {
      const result = paginateOutput(sampleData, 10, { page: '2', size: '5' })

      expect(result.meta.nextPage).toBeNull()
    })

    it('should return null prev/next when no data is returned', () => {
      const result = paginateOutput([], 0, { page: '1', size: '10' })

      expect(result.meta).toEqual({
        total: 0,
        lastPage: 0,
        currentPage: 1,
        totalPerPage: 10,
        prevPage: null,
        nextPage: null,
      })

      expect(result.data).toEqual([])
    })

    it('should return default values if not sent', () => {
      const result = paginateOutput([], 0, {})

      expect(result.meta).toEqual({
        total: 0,
        lastPage: 0,
        currentPage: DEFAULT_PAGE_NUMBER,
        totalPerPage: DEFAULT_PAGE_SIZE,
        prevPage: null,
        nextPage: null,
      })

      expect(result.data).toEqual([])
    })
  })
})

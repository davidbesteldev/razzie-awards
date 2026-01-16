import { BaseRepository } from '@app/common/database/repositories/base.repository'

describe('BaseRepository', () => {
  const mockDelegate = { findMany: jest.fn(), count: jest.fn() }

  class TestRepository extends BaseRepository<typeof mockDelegate> {
    constructor() {
      super(mockDelegate)
    }
  }

  let repository: TestRepository

  beforeEach(() => {
    repository = new TestRepository()
  })

  it('should return the delegate instance via the model getter', () => {
    expect(repository.model).toBe(mockDelegate)
  })
})

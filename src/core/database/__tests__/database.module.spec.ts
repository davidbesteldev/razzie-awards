import { createTestingModuleWithGlobals } from '@app/common/tests/helpers/create-testing-module-with-globals'
import { EnvModule } from '@app/core/config'

import { DatabaseModule } from '../database.module'
import { DatabaseService } from '../database.service'

describe('DatabaseModule', () => {
  let sut: DatabaseService

  beforeEach(async () => {
    const moduleRef = await createTestingModuleWithGlobals({
      imports: [EnvModule, DatabaseModule],
      providers: [DatabaseService],
    })

    sut = moduleRef.get<DatabaseService>(DatabaseService)
  })

  it('should provide DatabaseService', () => {
    expect(sut).toBeDefined()
    expect(sut.constructor).toBe(DatabaseService)
  })
})

import { createTestingModuleWithGlobals } from '@app/common/tests/helpers/create-testing-module-with-globals'
import { EnvModule } from '@app/core/config'

import { DatabaseService } from '../database.service'

describe('DatabaseService', () => {
  let sut: DatabaseService

  beforeEach(async () => {
    const module = await createTestingModuleWithGlobals({
      imports: [EnvModule],
      providers: [DatabaseService],
    })

    sut = module.get<DatabaseService>(DatabaseService)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should connect on module init', async () => {
    const connectSpy = jest.spyOn(sut, '$connect').mockResolvedValue()

    await sut.onModuleInit()
    expect(connectSpy).toHaveBeenCalled()
  })

  it('should disconnect on module destroy', async () => {
    const disconnectSpy = jest.spyOn(sut, '$disconnect').mockResolvedValue()

    await sut.onModuleDestroy()
    expect(disconnectSpy).toHaveBeenCalled()
  })
})

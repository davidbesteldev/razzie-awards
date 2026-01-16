import { ConfigService } from '@nestjs/config'
import { TestingModule } from '@nestjs/testing'

import { createTestingModuleWithGlobals } from '@app/common/tests/helpers/create-testing-module-with-globals'

import { EnvModule, EnvService } from '@app/core/config'

describe('createTestingModuleWithGlobals', () => {
  let module: TestingModule

  let configService: ConfigService
  let envService: EnvService

  beforeEach(async () => {
    module = await createTestingModuleWithGlobals({
      imports: [],
    })

    configService = module.get<ConfigService>(ConfigService)
    envService = module.get<EnvService>(EnvService)
  })

  it('should initialize correctly with global modules', () => {
    expect(module).toBeDefined()

    expect(configService).toBeDefined()

    expect(EnvModule).toBeDefined()
    expect(envService).toBeDefined()
  })

  it('should handle undefined metadata.imports', async () => {
    module = await createTestingModuleWithGlobals({
      imports: undefined,
    })

    expect(module).toBeDefined()
  })
})

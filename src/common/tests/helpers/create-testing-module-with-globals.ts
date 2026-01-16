import { Test, TestingModule } from '@nestjs/testing'

import { EnvModule } from '@app/core/config'

export async function createTestingModuleWithGlobals(
  metadata: Parameters<typeof Test.createTestingModule>[0],
): Promise<TestingModule> {
  return Test.createTestingModule({
    ...metadata,
    imports: [EnvModule],
  }).compile()
}

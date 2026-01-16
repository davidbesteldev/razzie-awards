import { INestApplication, ValidationPipe } from '@nestjs/common'

import { createTestingModuleWithGlobals } from '@app/common/tests/helpers/create-testing-module-with-globals'

import { appMiddlewares } from './app.middleware'

describe('appMiddlewares', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleRef = await createTestingModuleWithGlobals({
      imports: [],
    })

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should register app middlewares', () => {
    const useSpy = jest.spyOn(app, 'use')
    const useGlobalPipesSpy = jest.spyOn(app, 'useGlobalPipes')
    const enableCorsSpy = jest.spyOn(app, 'enableCors')

    appMiddlewares(app)

    expect(useSpy).toHaveBeenCalledTimes(2)
    expect(useGlobalPipesSpy).toHaveBeenCalledWith(expect.any(ValidationPipe))
    expect(enableCorsSpy).toHaveBeenCalledWith({ origin: '*' })
  })
})

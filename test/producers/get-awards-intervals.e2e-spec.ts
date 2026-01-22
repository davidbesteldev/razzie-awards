import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@app/app.module'

/**
 * NOTE:
 * Data is loaded via MovieService onModuleInit, so manual creation is not required here.
 */
describe('GET /producers/awards-intervals', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return producers with min and max award intervals', async () => {
    const response = await request(app.getHttpServer())
      .get('/producers/awards-intervals')
      .expect(200)

    expect(response.body).toEqual({
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    })
  })
})

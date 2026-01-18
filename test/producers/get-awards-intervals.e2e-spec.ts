import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@app/app.module'
import { GetAwardsIntervalsResponseDto } from '@app/modules/producers/dto/get-awards-interval.dto'

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

    const body = response.body as GetAwardsIntervalsResponseDto

    expect(body).toHaveProperty('min')
    expect(body).toHaveProperty('max')

    expect(Array.isArray(body.min)).toBe(true)
    expect(Array.isArray(body.max)).toBe(true)

    const sample = body.min[0] || body.max[0]

    expect(sample).toHaveProperty('producer')
    expect(sample).toHaveProperty('interval')
    expect(sample).toHaveProperty('previousWin')
    expect(sample).toHaveProperty('followingWin')
  })
})

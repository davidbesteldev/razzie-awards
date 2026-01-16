import { ApiProperty } from '@nestjs/swagger'

import { EntityFaker } from '@app/common/tests/fakers/entity.faker'

class DummyAddressEntity {
  @ApiProperty()
  id: number

  @ApiProperty()
  street: string
}

class DummyEntity {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  active: boolean

  @ApiProperty()
  address: DummyAddressEntity

  @ApiProperty()
  professionalAddresses: DummyAddressEntity[]
}

describe('EntityFaker', () => {
  const faker = new EntityFaker(DummyEntity)
  const fakerAddress = new EntityFaker(DummyAddressEntity)

  it('should generate a valid instance with default fake values', () => {
    const instance = faker.fake()

    expect(instance).toBeInstanceOf(DummyEntity)
    expect(typeof instance.id).toBe('number')
    expect(typeof instance.name).toBe('string')
    expect(instance.createdAt).toBeInstanceOf(Date)
    expect(typeof instance.active).toBe('boolean')
  })

  it('should generate a list of instances', () => {
    const list = faker.fakeList(3)
    expect(list).toHaveLength(3)
    list.forEach((item) => expect(item).toBeInstanceOf(DummyEntity))
  })

  it('should apply overrides to properties', () => {
    const instance = faker.fake({
      overrides: {
        name: 'Fixed Name',
        active: false,
      },
    })

    expect(instance.name).toBe('Fixed Name')
    expect(instance.active).toBe(false)
  })

  it('should generate relation values as an array', () => {
    const instance = faker.fake({
      relations: {
        professionalAddresses: {
          generator: () => fakerAddress.fakeList(2),
        },
      },
    })

    expect(instance.professionalAddresses).toHaveLength(2)
  })

  it('should generate relation values as a single value', () => {
    const fakeAddress = fakerAddress.fake()
    const instance = faker.fake({
      relations: {
        address: {
          generator: () => fakeAddress,
        },
      },
    })

    expect(instance.address).toBe(fakeAddress)
  })
})

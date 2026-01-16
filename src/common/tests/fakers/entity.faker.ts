import 'reflect-metadata'
import { faker } from '@faker-js/faker'

type SupportedConstructors =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | DateConstructor

enum FakeValueTypesEnum {
  Number = 'number',
  String = 'string',
  Date = 'date',
  Boolean = 'boolean',
}

const typeMap = new Map<SupportedConstructors, FakeValueTypesEnum>([
  [String, FakeValueTypesEnum.String],
  [Number, FakeValueTypesEnum.Number],
  [Boolean, FakeValueTypesEnum.Boolean],
  [Date, FakeValueTypesEnum.Date],
])

type GeneratorFn<T> = () => T

interface FakerOptions<T> {
  overrides?: Partial<T>
  relations?: {
    [K in keyof T]?: {
      generator: GeneratorFn<T[K]>
    }
  }
}

export class EntityFaker<T extends object> {
  constructor(private EntityClass: new () => T) {}

  fake(options?: FakerOptions<T>): T {
    const instance = new this.EntityClass()

    for (const key of Object.keys(instance) as (keyof T)[]) {
      if (options?.overrides && key in options.overrides) {
        instance[key] = options.overrides[key]!
        continue
      }

      const designType = Reflect.getMetadata(
        'design:type',
        instance,
        key as string,
      ) as SupportedConstructors
      instance[key] = this.generateFakeValue(typeMap.get(designType)) as T[typeof key]
    }

    if (options?.relations) {
      for (const key in options.relations) {
        const relation = options.relations[key]!
        instance[key as keyof T] = relation.generator()
      }
    }

    return instance
  }

  fakeList(quantity: number, options?: FakerOptions<T>): T[] {
    return Array.from({ length: quantity }, () => this.fake(options))
  }

  private generateFakeValue(type?: FakeValueTypesEnum) {
    if (type === FakeValueTypesEnum.Number) return faker.number.int()
    else if (type === FakeValueTypesEnum.String) return faker.lorem.sentence()
    else if (type === FakeValueTypesEnum.Date) return faker.date.recent()
    else if (type === FakeValueTypesEnum.Boolean) return faker.datatype.boolean()

    return null
  }
}

import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

export const createMockDeep = <T>(): DeepMockProxy<T> => mockDeep<T>()

import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

const config: Config.InitialOptions = {
  rootDir: './',
  maxWorkers: '50%',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['src/**/*.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '.e2e-spec.ts$',
    '<rootDir>/test/',
  ],
  coveragePathIgnorePatterns: [
    '/index\\.ts$',
    '/src/main.ts',
    '/src/config/',
    '/src/.*/constants/',
    '/src/.*/dto/',
    '/src/.*/entities/',
    '/src/.*/types/',
    '/src/.*/interfaces/',
    '/src/.*/__fixtures__/',
    '/src/.*/__mocks__/',
    '\\.module\\.ts$',
    '\\.controller\\.ts$',
    '\\.service\\.ts$',
    '\\.repository\\.ts$',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['lcov', 'text'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}

export default config

import { OriginalEnv } from '@app/core/config'

export const buildOriginalEnv = (): OriginalEnv => ({
  NODE_ENV: 'test',
  PORT: 3000,
  DATABASE_URL: '',
})

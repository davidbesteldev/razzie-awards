import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

/**
 * Validates a plain object against a DTO using class-validator.
 * Returns the DTO instance if valid, otherwise undefined.
 */
export const validateDto = <T extends object>(
  dtoClass: new () => T,
  plain: unknown,
): T | undefined => {
  const instance = plainToInstance(dtoClass, plain)
  const errors = validateSync(instance, {
    whitelist: true,
    forbidNonWhitelisted: false,
  })

  return !errors.length ? instance : undefined
}

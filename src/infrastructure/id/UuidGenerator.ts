import type { IdGenerator } from '~/application/ports/IdGenerator'

/** Implementação de IdGenerator usando a Web Crypto API. */
export class UuidGenerator implements IdGenerator {
  next(): string {
    return crypto.randomUUID()
  }
}

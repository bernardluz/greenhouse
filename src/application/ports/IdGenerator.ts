/**
 * Porta para geração de identificadores únicos. Abstrai a fonte de aleatoriedade
 * (ex.: crypto.randomUUID) para manter a aplicação determinística nos testes.
 */
export interface IdGenerator {
  next(): string
}

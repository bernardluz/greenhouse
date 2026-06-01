import type { DistractionItem } from '../entities/DistractionItem'

/**
 * Contrato de persistência das distrações, descrito em termos de domínio.
 * Implementações concretas vivem na infraestrutura e são intercambiáveis (LSP).
 * Assíncrono para permitir trocar localStorage por IndexedDB ou API futura.
 */
export interface DistractionRepository {
  load(): Promise<DistractionItem[]>
  save(items: readonly DistractionItem[]): Promise<void>
  clear(): Promise<void>
}

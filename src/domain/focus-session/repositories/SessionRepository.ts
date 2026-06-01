import type { FocusSession } from '../entities/FocusSession'

/**
 * Contrato de persistência do agregado FocusSession, descrito em termos de
 * domínio (sem mencionar localStorage). Implementações concretas vivem na
 * infraestrutura e são intercambiáveis (LSP). Assíncrono de propósito: permite
 * trocar localStorage por IndexedDB ou uma API futura sem tocar no domínio.
 */
export interface SessionRepository {
  load(): Promise<FocusSession | null>
  save(session: FocusSession): Promise<void>
  clear(): Promise<void>
}

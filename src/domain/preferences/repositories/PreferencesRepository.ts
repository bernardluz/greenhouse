import type { FocusPreferences } from '../entities/FocusPreferences'

/**
 * Contrato de persistência das preferências, descrito em termos de domínio.
 * Implementações concretas vivem na infraestrutura e são intercambiáveis (LSP).
 */
export interface PreferencesRepository {
  load(): Promise<FocusPreferences | null>
  save(preferences: FocusPreferences): Promise<void>
}

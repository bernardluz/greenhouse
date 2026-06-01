import { FocusPreferences } from '~/domain/preferences/entities/FocusPreferences'
import type { PreferencesRepository } from '~/domain/preferences/repositories/PreferencesRepository'

export interface UpdatePreferencesInput {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  blocksUntilLongBreak: number
}

/**
 * Valida e persiste novas preferências de duração e tamanho do ciclo. A
 * validação ocorre no agregado FocusPreferences; o caso de uso apenas
 * orquestra a persistência.
 */
export class UpdatePreferences {
  constructor(private readonly preferences: PreferencesRepository) {}

  async execute(input: UpdatePreferencesInput): Promise<FocusPreferences> {
    const prefs = FocusPreferences.create(input)
    await this.preferences.save(prefs)
    return prefs
  }
}

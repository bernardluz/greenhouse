import { FocusPreferences } from '~/domain/preferences/entities/FocusPreferences'
import type { PreferencesRepository } from '~/domain/preferences/repositories/PreferencesRepository'

interface StoredPreferences {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  blocksUntilLongBreak: number
}

const KEY = 'greenhouse:preferences'

/**
 * Persistência das preferências via localStorage. A reconstrução passa pela
 * fábrica validada do agregado, garantindo que dados inválidos não produzam
 * preferências inconsistentes.
 */
export class LocalStoragePreferencesRepository implements PreferencesRepository {
  constructor(private readonly storage: Storage = localStorage) {}

  async load(): Promise<FocusPreferences | null> {
    const raw = this.storage.getItem(KEY)
    if (!raw) {
      return null
    }
    try {
      return FocusPreferences.create(JSON.parse(raw) as StoredPreferences)
    } catch {
      return null
    }
  }

  async save(preferences: FocusPreferences): Promise<void> {
    const data: StoredPreferences = {
      focusMinutes: preferences.focusDuration.minutes,
      shortBreakMinutes: preferences.shortBreakDuration.minutes,
      longBreakMinutes: preferences.longBreakDuration.minutes,
      blocksUntilLongBreak: preferences.blocksUntilLongBreak,
    }
    this.storage.setItem(KEY, JSON.stringify(data))
  }
}

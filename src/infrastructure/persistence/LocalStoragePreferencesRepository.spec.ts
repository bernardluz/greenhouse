// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import { FocusPreferences } from '~/domain/preferences/entities/FocusPreferences'
import { LocalStoragePreferencesRepository } from './LocalStoragePreferencesRepository'

describe('LocalStoragePreferencesRepository', () => {
  beforeEach(() => localStorage.clear())

  it('retorna null quando não há preferências salvas', async () => {
    expect(await new LocalStoragePreferencesRepository().load()).toBeNull()
  })

  it('salva e recarrega preferências', async () => {
    const repo = new LocalStoragePreferencesRepository()
    await repo.save(
      FocusPreferences.create({
        focusMinutes: 40,
        shortBreakMinutes: 8,
        longBreakMinutes: 25,
        blocksUntilLongBreak: 3,
      }),
    )
    const loaded = await repo.load()
    expect(loaded?.focusDuration.minutes).toBe(40)
    expect(loaded?.blocksUntilLongBreak).toBe(3)
  })

  it('retorna null para dados corrompidos', async () => {
    localStorage.setItem('greenhouse:preferences', '{bad')
    expect(await new LocalStoragePreferencesRepository().load()).toBeNull()
  })
})

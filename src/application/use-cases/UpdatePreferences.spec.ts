import { describe, expect, it } from 'vitest'
import { InMemoryPreferencesRepository } from '../testing/fakes'
import { UpdatePreferences } from './UpdatePreferences'

function setup() {
  const preferences = new InMemoryPreferencesRepository()
  return { preferences, useCase: new UpdatePreferences(preferences) }
}

describe('UpdatePreferences', () => {
  it('valida e persiste novas preferências', async () => {
    const { useCase, preferences } = setup()
    const prefs = await useCase.execute({
      focusMinutes: 30,
      shortBreakMinutes: 6,
      longBreakMinutes: 18,
      blocksUntilLongBreak: 3,
    })
    expect(prefs.focusDuration.minutes).toBe(30)
    expect((await preferences.load())?.blocksUntilLongBreak).toBe(3)
  })

  it('rejeita preferências inválidas sem persistir', async () => {
    const { useCase, preferences } = setup()
    await expect(
      useCase.execute({
        focusMinutes: 0,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        blocksUntilLongBreak: 4,
      }),
    ).rejects.toThrow()
    expect(await preferences.load()).toBeNull()
  })
})

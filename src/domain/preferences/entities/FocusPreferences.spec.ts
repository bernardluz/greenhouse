import { describe, expect, it } from 'vitest'
import { FocusPreferences } from './FocusPreferences'

describe('FocusPreferences', () => {
  it('fornece padrões clássicos (25/5/15, ciclo de 4)', () => {
    const prefs = FocusPreferences.default()
    expect(prefs.focusDuration.minutes).toBe(25)
    expect(prefs.shortBreakDuration.minutes).toBe(5)
    expect(prefs.longBreakDuration.minutes).toBe(15)
    expect(prefs.blocksUntilLongBreak).toBe(4)
  })

  it('cria preferências válidas a partir de minutos', () => {
    const prefs = FocusPreferences.create({
      focusMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 30,
      blocksUntilLongBreak: 3,
    })
    expect(prefs.focusDuration.minutes).toBe(50)
    expect(prefs.blocksUntilLongBreak).toBe(3)
  })

  it('rejeita durações não positivas', () => {
    expect(() =>
      FocusPreferences.create({
        focusMinutes: 0,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        blocksUntilLongBreak: 4,
      }),
    ).toThrow()
  })

  it('rejeita ciclo inválido (zero, negativo ou fracionário)', () => {
    const base = { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 }
    expect(() => FocusPreferences.create({ ...base, blocksUntilLongBreak: 0 })).toThrow()
    expect(() => FocusPreferences.create({ ...base, blocksUntilLongBreak: -1 })).toThrow()
    expect(() => FocusPreferences.create({ ...base, blocksUntilLongBreak: 2.5 })).toThrow()
  })
})

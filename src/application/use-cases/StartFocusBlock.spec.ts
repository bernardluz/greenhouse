import { describe, expect, it } from 'vitest'
import { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import { TimerStatus } from '~/domain/focus-session/value-objects/TimerState'
import { FocusPreferences } from '~/domain/preferences/entities/FocusPreferences'
import {
  FixedClock,
  InMemoryPreferencesRepository,
  InMemorySessionRepository,
  SequentialIdGenerator,
} from '../testing/fakes'
import { StartFocusBlock } from './StartFocusBlock'

function setup() {
  const sessions = new InMemorySessionRepository()
  const preferences = new InMemoryPreferencesRepository()
  const clock = new FixedClock(1000)
  const ids = new SequentialIdGenerator()
  return { sessions, preferences, useCase: new StartFocusBlock(sessions, preferences, clock, ids) }
}

describe('StartFocusBlock', () => {
  it('inicia um bloco de foco com a duração padrão quando não há preferências', async () => {
    const { useCase, sessions } = setup()
    const session = await useCase.execute()
    expect(session.currentBlock?.type).toBe(BlockType.Focus)
    expect(session.currentBlock?.plannedDuration.minutes).toBe(25)
    expect(session.currentBlock?.state.is(TimerStatus.Running)).toBe(true)
    expect(await sessions.load()).not.toBeNull() // persistiu
  })

  it('usa a duração configurada para o tipo solicitado', async () => {
    const { useCase, preferences } = setup()
    await preferences.save(
      FocusPreferences.create({
        focusMinutes: 50,
        shortBreakMinutes: 7,
        longBreakMinutes: 20,
        blocksUntilLongBreak: 4,
      }),
    )
    const focus = await useCase.execute({ type: BlockType.Focus })
    expect(focus.currentBlock?.plannedDuration.minutes).toBe(50)
  })

  it('inicia uma pausa curta com a duração configurada', async () => {
    const { useCase } = setup()
    const session = await useCase.execute({ type: BlockType.ShortBreak })
    expect(session.currentBlock?.type).toBe(BlockType.ShortBreak)
    expect(session.currentBlock?.plannedDuration.minutes).toBe(5)
  })
})

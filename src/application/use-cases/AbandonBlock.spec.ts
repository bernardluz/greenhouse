import { describe, expect, it } from 'vitest'
import { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import { TimerStatus } from '~/domain/focus-session/value-objects/TimerState'
import { Duration } from '~/domain/shared/value-objects/Duration'
import { FixedClock, InMemorySessionRepository } from '../testing/fakes'
import { AbandonBlock } from './AbandonBlock'

function setup() {
  const sessions = new InMemorySessionRepository()
  const clock = new FixedClock(9000)
  return { sessions, useCase: new AbandonBlock(sessions, clock) }
}

describe('AbandonBlock', () => {
  it('encerra o bloco corrente e conta o abandono', async () => {
    const { sessions, useCase } = setup()
    await sessions.save(
      FocusSession.start('s1').startBlock('b1', BlockType.Focus, Duration.ofMinutes(25), 1000),
    )
    const session = await useCase.execute()
    expect(session.currentBlock?.state.is(TimerStatus.Abandoned)).toBe(true)
    expect(session.abandonedToday).toBe(1)
  })

  it('falha quando não há bloco corrente', async () => {
    const { useCase } = setup()
    await expect(useCase.execute()).rejects.toThrow()
  })
})

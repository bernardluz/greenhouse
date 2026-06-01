import { describe, expect, it } from 'vitest'
import { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import { BlockSchedulingService } from '~/domain/focus-session/services/BlockSchedulingService'
import { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import { Duration } from '~/domain/shared/value-objects/Duration'
import {
  FixedClock,
  InMemoryPreferencesRepository,
  InMemorySessionRepository,
} from '../testing/fakes'
import { CompleteBlock } from './CompleteBlock'

function setup() {
  const sessions = new InMemorySessionRepository()
  const preferences = new InMemoryPreferencesRepository()
  const clock = new FixedClock(5000)
  const scheduling = new BlockSchedulingService()
  return { sessions, useCase: new CompleteBlock(sessions, preferences, scheduling, clock) }
}

describe('CompleteBlock', () => {
  it('conclui o foco, conta o bloco e sugere pausa curta', async () => {
    const { sessions, useCase } = setup()
    await sessions.save(
      FocusSession.start('s1').startBlock('b1', BlockType.Focus, Duration.ofMinutes(25), 1000),
    )
    const { session, nextType } = await useCase.execute()
    expect(session.completedToday).toBe(1)
    expect(nextType).toBe(BlockType.ShortBreak)
  })

  it('sugere pausa longa ao fechar o ciclo padrão de 4 focos', async () => {
    const { sessions, useCase } = setup()
    let session = FocusSession.restore({
      id: 's1',
      currentBlock: null,
      completedFocusInCycle: 3,
      completedToday: 3,
      abandonedToday: 0,
    })
    session = session.startBlock('b4', BlockType.Focus, Duration.ofMinutes(25), 1000)
    await sessions.save(session)
    const { nextType } = await useCase.execute()
    expect(nextType).toBe(BlockType.LongBreak)
  })

  it('falha quando não há bloco corrente', async () => {
    const { useCase } = setup()
    await expect(useCase.execute()).rejects.toThrow()
  })
})

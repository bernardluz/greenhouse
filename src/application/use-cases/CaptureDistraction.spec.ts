import { describe, expect, it } from 'vitest'
import { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import { Duration } from '~/domain/shared/value-objects/Duration'
import {
  FixedClock,
  InMemoryDistractionRepository,
  InMemorySessionRepository,
  SequentialIdGenerator,
} from '../testing/fakes'
import { CaptureDistraction } from './CaptureDistraction'

function setup() {
  const sessions = new InMemorySessionRepository()
  const distractions = new InMemoryDistractionRepository()
  const clock = new FixedClock(2000)
  const ids = new SequentialIdGenerator()
  return {
    sessions,
    distractions,
    useCase: new CaptureDistraction(sessions, distractions, clock, ids),
  }
}

async function startFocus(sessions: InMemorySessionRepository) {
  await sessions.save(
    FocusSession.start('s1').startBlock('b1', BlockType.Focus, Duration.ofMinutes(25), 1000),
  )
}

describe('CaptureDistraction', () => {
  it('captura uma distração durante um foco em andamento e persiste', async () => {
    const { useCase, sessions, distractions } = setup()
    await startFocus(sessions)
    const lot = await useCase.execute({ text: 'ligar para o banco' })
    expect(lot.items).toHaveLength(1)
    expect((await distractions.load())[0]?.text).toBe('ligar para o banco')
  })

  it('recusa a captura quando não há bloco de foco ativo', async () => {
    const { useCase } = setup()
    await expect(useCase.execute({ text: 'qualquer coisa' })).rejects.toThrow()
  })

  it('recusa a captura durante uma pausa (não é foco)', async () => {
    const { useCase, sessions } = setup()
    await sessions.save(
      FocusSession.start('s1').startBlock('p1', BlockType.ShortBreak, Duration.ofMinutes(5), 1000),
    )
    await expect(useCase.execute({ text: 'durante a pausa' })).rejects.toThrow()
  })
})

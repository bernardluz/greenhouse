// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import { TimerStatus } from '~/domain/focus-session/value-objects/TimerState'
import { Duration } from '~/domain/shared/value-objects/Duration'
import { LocalStorageSessionRepository } from './LocalStorageSessionRepository'

describe('LocalStorageSessionRepository', () => {
  beforeEach(() => localStorage.clear())

  it('retorna null quando não há sessão salva', async () => {
    expect(await new LocalStorageSessionRepository().load()).toBeNull()
  })

  it('salva e recarrega uma sessão preservando o bloco corrente', async () => {
    const repo = new LocalStorageSessionRepository()
    const session = FocusSession.start('s1')
      .startBlock('b1', BlockType.Focus, Duration.ofMinutes(25), 1000)
      .tick(60_000)
    await repo.save(session)

    const loaded = await repo.load()
    expect(loaded?.id).toBe('s1')
    expect(loaded?.currentBlock?.type).toBe(BlockType.Focus)
    expect(loaded?.currentBlock?.plannedDuration.minutes).toBe(25)
    expect(loaded?.currentBlock?.elapsedMs).toBe(60_000)
    expect(loaded?.currentBlock?.state.is(TimerStatus.Running)).toBe(true)
  })

  it('preserva contadores e sessão sem bloco', async () => {
    const repo = new LocalStorageSessionRepository()
    await repo.save(
      FocusSession.restore({
        id: 's2',
        currentBlock: null,
        completedFocusInCycle: 2,
        completedToday: 2,
        abandonedToday: 1,
      }),
    )
    const loaded = await repo.load()
    expect(loaded?.currentBlock).toBeNull()
    expect(loaded?.completedToday).toBe(2)
    expect(loaded?.abandonedToday).toBe(1)
  })

  it('limpa a sessão', async () => {
    const repo = new LocalStorageSessionRepository()
    await repo.save(FocusSession.start('s1'))
    await repo.clear()
    expect(await repo.load()).toBeNull()
  })

  it('retorna null para dados corrompidos', async () => {
    localStorage.setItem('greenhouse:session', '{invalid json')
    expect(await new LocalStorageSessionRepository().load()).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import { Duration } from '../../shared/value-objects/Duration'
import { BlockType } from '../value-objects/BlockType'
import { TimerStatus } from '../value-objects/TimerState'
import { FocusSession } from './FocusSession'

const focus = Duration.ofMinutes(25)
const shortBreak = Duration.ofMinutes(5)

describe('FocusSession', () => {
  it('começa vazia, sem bloco ativo e com contadores zerados', () => {
    const s = FocusSession.start('s1')
    expect(s.currentBlock).toBeNull()
    expect(s.hasActiveBlock).toBe(false)
    expect(s.completedToday).toBe(0)
    expect(s.abandonedToday).toBe(0)
  })

  it('inicia um bloco de foco e emite BlockStarted com o instante informado', () => {
    const s = FocusSession.start('s1').startBlock('b1', BlockType.Focus, focus, 1000)
    expect(s.hasActiveBlock).toBe(true)
    expect(s.currentBlock?.state.is(TimerStatus.Running)).toBe(true)
    expect(s.pendingEvents).toHaveLength(1)
    expect(s.pendingEvents[0]?.type).toBe('BlockStarted')
    expect(s.pendingEvents[0]?.occurredAt).toBe(1000)
  })

  it('emite BreakStarted ao iniciar uma pausa', () => {
    const s = FocusSession.start('s1').startBlock('b1', BlockType.ShortBreak, shortBreak, 1000)
    expect(s.pendingEvents[0]?.type).toBe('BreakStarted')
  })

  it('respeita a invariante de apenas um bloco ativo', () => {
    const s = FocusSession.start('s1').startBlock('b1', BlockType.Focus, focus, 1000)
    expect(() => s.startBlock('b2', BlockType.Focus, focus, 2000)).toThrow()
  })

  it('permite iniciar novo bloco após concluir o anterior e conta o foco', () => {
    const s = FocusSession.start('s1').startBlock('b1', BlockType.Focus, focus, 1000).complete(2000)
    expect(s.completedToday).toBe(1)
    expect(s.completedFocusInCycle).toBe(1)
    expect(s.pendingEvents[0]?.type).toBe('BlockCompleted')
    const s2 = s.startBlock('b2', BlockType.ShortBreak, shortBreak, 3000)
    expect(s2.hasActiveBlock).toBe(true)
  })

  it('conta blocos de foco abandonados', () => {
    const s = FocusSession.start('s1').startBlock('b1', BlockType.Focus, focus, 1000).abandon(1500)
    expect(s.abandonedToday).toBe(1)
    expect(s.pendingEvents[0]?.type).toBe('BlockAbandoned')
  })

  it('zera o ciclo ao concluir uma pausa longa', () => {
    let s = FocusSession.restore({
      id: 's1',
      currentBlock: null,
      completedFocusInCycle: 4,
      completedToday: 4,
      abandonedToday: 0,
    })
    s = s.startBlock('lb', BlockType.LongBreak, shortBreak, 1000).complete(2000)
    expect(s.completedFocusInCycle).toBe(0)
  })

  it('pausa e retoma o bloco corrente', () => {
    const s = FocusSession.start('s1')
      .startBlock('b1', BlockType.Focus, focus, 1000)
      .tick(5000)
      .pause()
    expect(s.currentBlock?.state.is(TimerStatus.Paused)).toBe(true)
    expect(s.resume().currentBlock?.state.is(TimerStatus.Running)).toBe(true)
  })

  it('limpa os eventos pendentes entre comandos', () => {
    const s = FocusSession.start('s1').startBlock('b1', BlockType.Focus, focus, 1000)
    expect(s.pendingEvents).toHaveLength(1)
    expect(s.tick(1000).pendingEvents).toHaveLength(0)
  })
})

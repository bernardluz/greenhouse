import { describe, expect, it } from 'vitest'
import { TimerState, TimerStatus } from './TimerState'

describe('TimerState', () => {
  it('começa em Idle', () => {
    expect(TimerState.idle().status).toBe(TimerStatus.Idle)
    expect(TimerState.idle().is(TimerStatus.Idle)).toBe(true)
  })

  it('permite o fluxo Idle → Running → Paused → Running', () => {
    const running = TimerState.idle().transitionTo(TimerStatus.Running)
    expect(running.is(TimerStatus.Running)).toBe(true)
    const paused = running.transitionTo(TimerStatus.Paused)
    expect(paused.is(TimerStatus.Paused)).toBe(true)
    expect(paused.transitionTo(TimerStatus.Running).is(TimerStatus.Running)).toBe(true)
  })

  it('permite concluir e abandonar a partir de Running', () => {
    const running = TimerState.of(TimerStatus.Running)
    expect(running.transitionTo(TimerStatus.Completed).isTerminal).toBe(true)
    expect(running.transitionTo(TimerStatus.Abandoned).isTerminal).toBe(true)
  })

  it('rejeita transições inválidas', () => {
    expect(() => TimerState.idle().transitionTo(TimerStatus.Paused)).toThrow()
    expect(() => TimerState.of(TimerStatus.Completed).transitionTo(TimerStatus.Running)).toThrow()
    expect(() => TimerState.of(TimerStatus.Idle).transitionTo(TimerStatus.Completed)).toThrow()
  })

  it('classifica estados ativos e terminais', () => {
    expect(TimerState.of(TimerStatus.Running).isActive).toBe(true)
    expect(TimerState.of(TimerStatus.Paused).isActive).toBe(true)
    expect(TimerState.of(TimerStatus.Completed).isActive).toBe(false)
    expect(TimerState.of(TimerStatus.Completed).isTerminal).toBe(true)
    expect(TimerState.of(TimerStatus.Abandoned).isTerminal).toBe(true)
    expect(TimerState.of(TimerStatus.Idle).isTerminal).toBe(false)
  })

  it('é imutável: transicionar não altera a instância original', () => {
    const idle = TimerState.idle()
    idle.transitionTo(TimerStatus.Running)
    expect(idle.is(TimerStatus.Idle)).toBe(true)
  })
})

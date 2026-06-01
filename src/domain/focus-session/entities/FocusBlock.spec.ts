import { describe, expect, it } from 'vitest'
import { Duration } from '../../shared/value-objects/Duration'
import { BlockType } from '../value-objects/BlockType'
import { TimerStatus } from '../value-objects/TimerState'
import { FocusBlock } from './FocusBlock'

const make = () => FocusBlock.create('b1', BlockType.Focus, Duration.ofMinutes(1))

describe('FocusBlock', () => {
  it('nasce ocioso, com tempo zerado e duração planejada', () => {
    const b = make()
    expect(b.state.is(TimerStatus.Idle)).toBe(true)
    expect(b.elapsedMs).toBe(0)
    expect(b.plannedMs).toBe(60_000)
    expect(b.remainingSeconds).toBe(60)
  })

  it('inicia, pausa e retoma preservando o tempo decorrido', () => {
    const running = make().start()
    expect(running.state.is(TimerStatus.Running)).toBe(true)
    const ticked = running.tick(10_000)
    expect(ticked.elapsedMs).toBe(10_000)
    const paused = ticked.pause()
    expect(paused.state.is(TimerStatus.Paused)).toBe(true)
    expect(paused.tick(5_000).elapsedMs).toBe(10_000) // pausado não avança
    const resumed = paused.resume()
    expect(resumed.tick(5_000).elapsedMs).toBe(15_000)
  })

  it('não ultrapassa a duração planejada ao avançar o tempo', () => {
    const b = make().start().tick(120_000)
    expect(b.elapsedMs).toBe(60_000)
    expect(b.isElapsed).toBe(true)
    expect(b.remainingMs).toBe(0)
    expect(b.progress).toBe(1)
  })

  it('conclui preenchendo o tempo e tornando-se terminal', () => {
    const b = make().start().complete()
    expect(b.state.is(TimerStatus.Completed)).toBe(true)
    expect(b.state.isTerminal).toBe(true)
    expect(b.elapsedMs).toBe(60_000)
  })

  it('abandona a partir de execução', () => {
    const b = make().start().abandon()
    expect(b.state.is(TimerStatus.Abandoned)).toBe(true)
  })

  it('é imutável: operações não alteram a instância anterior', () => {
    const running = make().start()
    running.tick(10_000)
    expect(running.elapsedMs).toBe(0)
  })
})

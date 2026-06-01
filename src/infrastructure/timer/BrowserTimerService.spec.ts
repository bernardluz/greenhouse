import { afterEach, describe, expect, it, vi } from 'vitest'
import { BrowserTimerService } from './BrowserTimerService'

describe('BrowserTimerService', () => {
  afterEach(() => vi.useRealTimers())

  it('chama onTick periodicamente com o tempo decorrido', () => {
    vi.useFakeTimers()
    const timer = new BrowserTimerService(1000)
    const deltas: number[] = []
    timer.start((d) => deltas.push(d))
    vi.advanceTimersByTime(3000)
    expect(deltas).toHaveLength(3)
    expect(deltas.every((d) => d === 1000)).toBe(true)
    timer.stop()
  })

  it('para de emitir ticks após stop', () => {
    vi.useFakeTimers()
    const timer = new BrowserTimerService(1000)
    let count = 0
    timer.start(() => {
      count += 1
    })
    vi.advanceTimersByTime(2000)
    timer.stop()
    vi.advanceTimersByTime(5000)
    expect(count).toBe(2)
  })
})

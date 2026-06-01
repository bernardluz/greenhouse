import { afterEach, describe, expect, it, vi } from 'vitest'
import { BrowserClock } from './BrowserClock'

describe('BrowserClock', () => {
  afterEach(() => vi.useRealTimers())

  it('retorna o instante atual em epoch ms', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T10:00:00.000Z'))
    expect(new BrowserClock().now()).toBe(Date.parse('2026-06-01T10:00:00.000Z'))
  })
})

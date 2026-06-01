import { describe, expect, it } from 'vitest'
import { UuidGenerator } from './UuidGenerator'

describe('UuidGenerator', () => {
  it('gera identificadores únicos no formato UUID', () => {
    const gen = new UuidGenerator()
    const a = gen.next()
    const b = gen.next()
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    expect(a).not.toBe(b)
  })
})

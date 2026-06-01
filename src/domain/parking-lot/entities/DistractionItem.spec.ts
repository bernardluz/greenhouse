import { describe, expect, it } from 'vitest'
import { DistractionStatus } from '../value-objects/DistractionStatus'
import { DistractionItem } from './DistractionItem'

describe('DistractionItem', () => {
  it('captura uma distração com status Open e texto aparado', () => {
    const item = DistractionItem.capture('d1', '  responder e-mail  ', 1000)
    expect(item.text).toBe('responder e-mail')
    expect(item.capturedAt).toBe(1000)
    expect(item.status).toBe(DistractionStatus.Open)
    expect(item.isOpen).toBe(true)
  })

  it('rejeita texto vazio ou só com espaços', () => {
    expect(() => DistractionItem.capture('d1', '   ', 1000)).toThrow()
    expect(() => DistractionItem.capture('d1', '', 1000)).toThrow()
  })

  it('trunca textos muito longos', () => {
    const item = DistractionItem.capture('d1', 'a'.repeat(500), 1000)
    expect(item.text).toHaveLength(280)
  })

  it('resolve e descarta gerando novas instâncias imutáveis', () => {
    const open = DistractionItem.capture('d1', 'ideia', 1000)
    const resolved = open.resolve()
    expect(resolved.status).toBe(DistractionStatus.Resolved)
    expect(open.status).toBe(DistractionStatus.Open) // original intacto
    expect(open.discard().status).toBe(DistractionStatus.Discarded)
  })
})

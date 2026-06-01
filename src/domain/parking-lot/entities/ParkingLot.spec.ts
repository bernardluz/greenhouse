import { describe, expect, it } from 'vitest'
import { DistractionStatus } from '../value-objects/DistractionStatus'
import { ParkingLot } from './ParkingLot'

describe('ParkingLot', () => {
  it('captura uma distração quando há foco em andamento e emite DistractionCaptured', () => {
    const lot = ParkingLot.empty().capture('d1', 'pensamento', 1000, true)
    expect(lot.items).toHaveLength(1)
    expect(lot.openItems).toHaveLength(1)
    expect(lot.pendingEvents[0]?.type).toBe('DistractionCaptured')
  })

  it('recusa captura quando não há foco em andamento', () => {
    expect(() => ParkingLot.empty().capture('d1', 'pensamento', 1000, false)).toThrow()
  })

  it('resolve uma distração específica sem afetar as demais', () => {
    const lot = ParkingLot.empty()
      .capture('d1', 'a', 1000, true)
      .capture('d2', 'b', 2000, true)
      .resolve('d1')
    expect(lot.items.find((i) => i.id === 'd1')?.status).toBe(DistractionStatus.Resolved)
    expect(lot.items.find((i) => i.id === 'd2')?.status).toBe(DistractionStatus.Open)
    expect(lot.openItems).toHaveLength(1)
  })

  it('descarta uma distração', () => {
    const lot = ParkingLot.empty().capture('d1', 'a', 1000, true).discard('d1')
    expect(lot.items[0]?.status).toBe(DistractionStatus.Discarded)
    expect(lot.openItems).toHaveLength(0)
  })

  it('limpa os eventos pendentes em comandos de triagem', () => {
    const lot = ParkingLot.empty().capture('d1', 'a', 1000, true)
    expect(lot.pendingEvents).toHaveLength(1)
    expect(lot.resolve('d1').pendingEvents).toHaveLength(0)
  })
})

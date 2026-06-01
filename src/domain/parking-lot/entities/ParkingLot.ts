import type { DomainEvent } from '../../shared/events/DomainEvent'
import { DistractionCaptured } from '../events/DistractionCaptured'
import { DistractionItem } from './DistractionItem'

/**
 * Raiz do agregado de distrações. Agrupa os DistractionItem e garante a
 * invariante de que uma distração só é capturada quando há um bloco de foco em
 * andamento — informação recebida via `focusInProgress`, mantendo o contexto
 * desacoplado do focus-session. Imutável: comandos retornam um novo ParkingLot
 * e expõem em `pendingEvents` os eventos do último comando.
 */
export class ParkingLot {
  private constructor(
    readonly items: readonly DistractionItem[],
    readonly pendingEvents: readonly DomainEvent[],
  ) {}

  static empty(): ParkingLot {
    return new ParkingLot([], [])
  }

  static restore(items: readonly DistractionItem[]): ParkingLot {
    return new ParkingLot(items, [])
  }

  get openItems(): readonly DistractionItem[] {
    return this.items.filter((item) => item.isOpen)
  }

  capture(id: string, text: string, capturedAt: number, focusInProgress: boolean): ParkingLot {
    if (!focusInProgress) {
      throw new Error('Só é possível capturar distrações durante um bloco de foco em andamento.')
    }
    const item = DistractionItem.capture(id, text, capturedAt)
    return new ParkingLot([...this.items, item], [new DistractionCaptured(item.id, item.capturedAt)])
  }

  resolve(id: string): ParkingLot {
    return new ParkingLot(
      this.items.map((item) => (item.id === id ? item.resolve() : item)),
      [],
    )
  }

  discard(id: string): ParkingLot {
    return new ParkingLot(
      this.items.map((item) => (item.id === id ? item.discard() : item)),
      [],
    )
  }
}

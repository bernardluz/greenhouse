import type { DomainEvent } from '../../shared/events/DomainEvent'

/** Emitido quando uma distração é capturada no parking lot. */
export class DistractionCaptured implements DomainEvent {
  readonly type = 'DistractionCaptured' as const

  constructor(
    readonly distractionId: string,
    readonly occurredAt: number,
  ) {}
}

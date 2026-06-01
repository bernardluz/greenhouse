import type { DomainEvent } from '../../shared/events/DomainEvent'
import type { BlockType } from '../value-objects/BlockType'

/** Emitido quando uma pausa (curta ou longa) é iniciada. */
export class BreakStarted implements DomainEvent {
  readonly type = 'BreakStarted' as const

  constructor(
    readonly blockId: string,
    readonly breakType: BlockType,
    readonly occurredAt: number,
  ) {}
}

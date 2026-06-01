import type { DomainEvent } from '../../shared/events/DomainEvent'
import type { BlockType } from '../value-objects/BlockType'

/** Emitido quando um bloco de foco é iniciado. */
export class BlockStarted implements DomainEvent {
  readonly type = 'BlockStarted' as const

  constructor(
    readonly blockId: string,
    readonly blockType: BlockType,
    readonly occurredAt: number,
  ) {}
}

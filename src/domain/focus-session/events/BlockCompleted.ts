import type { DomainEvent } from '../../shared/events/DomainEvent'
import type { BlockType } from '../value-objects/BlockType'

/** Emitido quando um bloco chega ao fim do tempo planejado. */
export class BlockCompleted implements DomainEvent {
  readonly type = 'BlockCompleted' as const

  constructor(
    readonly blockId: string,
    readonly blockType: BlockType,
    readonly occurredAt: number,
  ) {}
}

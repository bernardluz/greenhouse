import type { DomainEvent } from '../../shared/events/DomainEvent'
import type { BlockType } from '../value-objects/BlockType'

/** Emitido quando o usuário encerra um bloco antes do tempo planejado. */
export class BlockAbandoned implements DomainEvent {
  readonly type = 'BlockAbandoned' as const

  constructor(
    readonly blockId: string,
    readonly blockType: BlockType,
    readonly occurredAt: number,
  ) {}
}

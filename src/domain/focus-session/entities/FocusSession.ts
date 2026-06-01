import type { Duration } from '../../shared/value-objects/Duration'
import type { DomainEvent } from '../../shared/events/DomainEvent'
import { BlockType, isBreak } from '../value-objects/BlockType'
import { BlockAbandoned } from '../events/BlockAbandoned'
import { BlockCompleted } from '../events/BlockCompleted'
import { BlockStarted } from '../events/BlockStarted'
import { BreakStarted } from '../events/BreakStarted'
import { FocusBlock } from './FocusBlock'

interface SessionState {
  currentBlock: FocusBlock | null
  completedFocusInCycle: number
  completedToday: number
  abandonedToday: number
  pendingEvents: readonly DomainEvent[]
}

/**
 * Raiz do agregado de foco. Garante a invariante de que apenas um bloco está
 * ativo por vez e mantém os contadores do dia e do ciclo. Imutável: cada
 * comando retorna uma nova sessão e expõe em `pendingEvents` os eventos
 * daquele comando, para a camada de aplicação despachar e persistir.
 *
 * Contadores `completedToday`/`abandonedToday` referem-se a blocos de FOCO,
 * que são os relevantes para a métrica de produtividade do dia.
 */
export class FocusSession {
  private constructor(
    readonly id: string,
    readonly currentBlock: FocusBlock | null,
    readonly completedFocusInCycle: number,
    readonly completedToday: number,
    readonly abandonedToday: number,
    readonly pendingEvents: readonly DomainEvent[],
  ) {}

  static start(id: string): FocusSession {
    return new FocusSession(id, null, 0, 0, 0, [])
  }

  static restore(params: {
    id: string
    currentBlock: FocusBlock | null
    completedFocusInCycle: number
    completedToday: number
    abandonedToday: number
  }): FocusSession {
    return new FocusSession(
      params.id,
      params.currentBlock,
      params.completedFocusInCycle,
      params.completedToday,
      params.abandonedToday,
      [],
    )
  }

  get hasActiveBlock(): boolean {
    return this.currentBlock?.state.isActive ?? false
  }

  private next(overrides: Partial<SessionState>): FocusSession {
    return new FocusSession(
      this.id,
      overrides.currentBlock !== undefined ? overrides.currentBlock : this.currentBlock,
      overrides.completedFocusInCycle ?? this.completedFocusInCycle,
      overrides.completedToday ?? this.completedToday,
      overrides.abandonedToday ?? this.abandonedToday,
      overrides.pendingEvents ?? [],
    )
  }

  startBlock(blockId: string, type: BlockType, duration: Duration, now: number): FocusSession {
    if (this.hasActiveBlock) {
      throw new Error('Não é possível iniciar um bloco: já existe um bloco ativo.')
    }
    const block = FocusBlock.create(blockId, type, duration).start()
    const event: DomainEvent = isBreak(type)
      ? new BreakStarted(blockId, type, now)
      : new BlockStarted(blockId, type, now)
    return this.next({ currentBlock: block, pendingEvents: [event] })
  }

  pause(): FocusSession {
    return this.next({ currentBlock: this.requireCurrentBlock().pause() })
  }

  resume(): FocusSession {
    return this.next({ currentBlock: this.requireCurrentBlock().resume() })
  }

  tick(deltaMs: number): FocusSession {
    if (!this.currentBlock) {
      return this
    }
    return this.next({ currentBlock: this.currentBlock.tick(deltaMs) })
  }

  complete(now: number): FocusSession {
    const block = this.requireCurrentBlock()
    const wasFocus = !isBreak(block.type)
    const cycleAfter =
      block.type === BlockType.LongBreak
        ? 0
        : wasFocus
          ? this.completedFocusInCycle + 1
          : this.completedFocusInCycle
    return this.next({
      currentBlock: block.complete(),
      completedFocusInCycle: cycleAfter,
      completedToday: wasFocus ? this.completedToday + 1 : this.completedToday,
      pendingEvents: [new BlockCompleted(block.id, block.type, now)],
    })
  }

  abandon(now: number): FocusSession {
    const block = this.requireCurrentBlock()
    const wasFocus = !isBreak(block.type)
    return this.next({
      currentBlock: block.abandon(),
      abandonedToday: wasFocus ? this.abandonedToday + 1 : this.abandonedToday,
      pendingEvents: [new BlockAbandoned(block.id, block.type, now)],
    })
  }

  private requireCurrentBlock(): FocusBlock {
    if (!this.currentBlock) {
      throw new Error('Nenhum bloco em andamento.')
    }
    return this.currentBlock
  }
}

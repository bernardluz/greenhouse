import type { Duration } from '../../shared/value-objects/Duration'
import type { BlockType } from '../value-objects/BlockType'
import { TimerState, TimerStatus } from '../value-objects/TimerState'

/**
 * Entidade que representa um bloco individual do ciclo (foco ou pausa).
 * Sabe apenas sobre sua duração planejada e seu progresso — a marcação de
 * tempo real é responsabilidade da infraestrutura (SRP). Imutável: cada
 * operação retorna uma nova instância.
 */
export class FocusBlock {
  private constructor(
    readonly id: string,
    readonly type: BlockType,
    readonly plannedDuration: Duration,
    readonly elapsedMs: number,
    readonly state: TimerState,
  ) {}

  static create(id: string, type: BlockType, plannedDuration: Duration): FocusBlock {
    return new FocusBlock(id, type, plannedDuration, 0, TimerState.idle())
  }

  /** Reconstrói um bloco a partir de estado persistido. */
  static restore(
    id: string,
    type: BlockType,
    plannedDuration: Duration,
    elapsedMs: number,
    state: TimerState,
  ): FocusBlock {
    return new FocusBlock(id, type, plannedDuration, Math.max(0, elapsedMs), state)
  }

  get plannedMs(): number {
    return this.plannedDuration.milliseconds
  }

  get remainingMs(): number {
    return Math.max(0, this.plannedMs - this.elapsedMs)
  }

  get remainingSeconds(): number {
    return Math.ceil(this.remainingMs / 1000)
  }

  /** Progresso entre 0 e 1. */
  get progress(): number {
    return Math.min(1, this.elapsedMs / this.plannedMs)
  }

  get isElapsed(): boolean {
    return this.elapsedMs >= this.plannedMs
  }

  private withState(state: TimerState, elapsedMs: number = this.elapsedMs): FocusBlock {
    return new FocusBlock(this.id, this.type, this.plannedDuration, elapsedMs, state)
  }

  start(): FocusBlock {
    return this.withState(this.state.transitionTo(TimerStatus.Running))
  }

  pause(): FocusBlock {
    return this.withState(this.state.transitionTo(TimerStatus.Paused))
  }

  resume(): FocusBlock {
    return this.withState(this.state.transitionTo(TimerStatus.Running))
  }

  /** Avança o tempo decorrido. Só tem efeito enquanto o bloco está em execução. */
  tick(deltaMs: number): FocusBlock {
    if (!this.state.is(TimerStatus.Running) || deltaMs <= 0) {
      return this
    }
    const elapsed = Math.min(this.plannedMs, this.elapsedMs + deltaMs)
    return this.withState(this.state, elapsed)
  }

  complete(): FocusBlock {
    return this.withState(this.state.transitionTo(TimerStatus.Completed), this.plannedMs)
  }

  abandon(): FocusBlock {
    return this.withState(this.state.transitionTo(TimerStatus.Abandoned))
  }
}

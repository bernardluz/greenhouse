/**
 * Estados do timer e suas transições válidas. Concentra a regra de quais
 * mudanças de estado são permitidas, mantendo essa lógica fora das entidades.
 * Imutável: transicionar produz uma nova instância.
 */
export const TimerStatus = {
  Idle: 'Idle',
  Running: 'Running',
  Paused: 'Paused',
  Completed: 'Completed',
  Abandoned: 'Abandoned',
} as const

export type TimerStatus = (typeof TimerStatus)[keyof typeof TimerStatus]

const TRANSITIONS: Record<TimerStatus, readonly TimerStatus[]> = {
  Idle: [TimerStatus.Running],
  Running: [TimerStatus.Paused, TimerStatus.Completed, TimerStatus.Abandoned],
  Paused: [TimerStatus.Running, TimerStatus.Abandoned],
  Completed: [],
  Abandoned: [],
}

export class TimerState {
  private constructor(private readonly _status: TimerStatus) {}

  static idle(): TimerState {
    return new TimerState(TimerStatus.Idle)
  }

  static of(status: TimerStatus): TimerState {
    return new TimerState(status)
  }

  get status(): TimerStatus {
    return this._status
  }

  is(status: TimerStatus): boolean {
    return this._status === status
  }

  get isActive(): boolean {
    return this._status === TimerStatus.Running || this._status === TimerStatus.Paused
  }

  get isTerminal(): boolean {
    return this._status === TimerStatus.Completed || this._status === TimerStatus.Abandoned
  }

  canTransitionTo(next: TimerStatus): boolean {
    return TRANSITIONS[this._status].includes(next)
  }

  transitionTo(next: TimerStatus): TimerState {
    if (!this.canTransitionTo(next)) {
      throw new Error(`Transição de timer inválida: ${this._status} → ${next}`)
    }
    return new TimerState(next)
  }

  equals(other: TimerState): boolean {
    return other instanceof TimerState && other._status === this._status
  }
}

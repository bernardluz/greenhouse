/**
 * Value Object compartilhado (Shared Kernel).
 * Representa um intervalo de tempo em minutos. Imutável e autovalidado:
 * só existe uma Duration se o valor for um número finito e positivo.
 * Igualdade é por valor — dois Duration de mesmo minuto são equivalentes.
 */
export class Duration {
  private constructor(private readonly _minutes: number) {}

  static ofMinutes(minutes: number): Duration {
    if (!Number.isFinite(minutes) || minutes <= 0) {
      throw new RangeError(
        `Duration deve ser um número finito e positivo de minutos; recebido: ${minutes}`,
      )
    }
    return new Duration(minutes)
  }

  get minutes(): number {
    return this._minutes
  }

  get seconds(): number {
    return this._minutes * 60
  }

  get milliseconds(): number {
    return this._minutes * 60_000
  }

  equals(other: Duration): boolean {
    return other instanceof Duration && other._minutes === this._minutes
  }

  toString(): string {
    return `${this._minutes}min`
  }
}

import { Duration } from '../../shared/value-objects/Duration'

interface FocusPreferencesInput {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  blocksUntilLongBreak: number
}

/**
 * Agregado de configuração. Encapsula as três durações e o tamanho do ciclo,
 * validando que nenhuma duração seja zero/negativa (via Duration) e que o
 * número de blocos até a pausa longa seja um inteiro positivo. Imutável.
 *
 * Não conhece BlockType: expõe as durações nominais e deixa o mapeamento
 * tipo→duração para a camada de aplicação, mantendo os contextos desacoplados.
 */
export class FocusPreferences {
  private constructor(
    readonly focusDuration: Duration,
    readonly shortBreakDuration: Duration,
    readonly longBreakDuration: Duration,
    readonly blocksUntilLongBreak: number,
  ) {}

  static default(): FocusPreferences {
    return FocusPreferences.create({
      focusMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      blocksUntilLongBreak: 4,
    })
  }

  static create(input: FocusPreferencesInput): FocusPreferences {
    if (!Number.isInteger(input.blocksUntilLongBreak) || input.blocksUntilLongBreak < 1) {
      throw new RangeError('blocksUntilLongBreak deve ser um inteiro maior ou igual a 1.')
    }
    return new FocusPreferences(
      Duration.ofMinutes(input.focusMinutes),
      Duration.ofMinutes(input.shortBreakMinutes),
      Duration.ofMinutes(input.longBreakMinutes),
      input.blocksUntilLongBreak,
    )
  }
}

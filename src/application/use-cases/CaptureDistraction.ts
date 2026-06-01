import { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import type { SessionRepository } from '~/domain/focus-session/repositories/SessionRepository'
import { ParkingLot } from '~/domain/parking-lot/entities/ParkingLot'
import type { DistractionRepository } from '~/domain/parking-lot/repositories/DistractionRepository'
import type { Clock } from '../ports/Clock'
import type { IdGenerator } from '../ports/IdGenerator'

export interface CaptureDistractionInput {
  text: string
}

/**
 * Captura um pensamento intrusivo sem parar o timer. A regra "só com foco em
 * andamento" é avaliada aqui (orquestração cross-context) e reforçada pelo
 * agregado ParkingLot, que recebe o sinal `focusInProgress`.
 */
export class CaptureDistraction {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly distractions: DistractionRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: CaptureDistractionInput): Promise<ParkingLot> {
    const session = await this.sessions.load()
    const focusInProgress =
      (session?.hasActiveBlock ?? false) && session?.currentBlock?.type === BlockType.Focus
    const items = await this.distractions.load()
    const lot = ParkingLot.restore(items).capture(
      this.ids.next(),
      input.text,
      this.clock.now(),
      focusInProgress,
    )
    await this.distractions.save(lot.items)
    return lot
  }
}

import type { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import type { SessionRepository } from '~/domain/focus-session/repositories/SessionRepository'
import { BlockSchedulingService } from '~/domain/focus-session/services/BlockSchedulingService'
import type { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import { FocusPreferences } from '~/domain/preferences/entities/FocusPreferences'
import type { PreferencesRepository } from '~/domain/preferences/repositories/PreferencesRepository'
import type { Clock } from '../ports/Clock'

export interface CompleteBlockResult {
  session: FocusSession
  /** Tipo sugerido para o próximo bloco (transição automática na apresentação). */
  nextType: BlockType
}

/**
 * Conclui o bloco corrente e calcula o tipo do próximo bloco via serviço de
 * agendamento. Não inicia o próximo (SRP): a transição automática é orquestrada
 * pela camada de apresentação combinando este caso de uso com StartFocusBlock.
 */
export class CompleteBlock {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly preferences: PreferencesRepository,
    private readonly scheduling: BlockSchedulingService,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<CompleteBlockResult> {
    const session = await this.sessions.load()
    if (!session?.currentBlock) {
      throw new Error('Não há bloco para concluir.')
    }
    const completedType = session.currentBlock.type
    const updated = session.complete(this.clock.now())
    await this.sessions.save(updated)

    const prefs = (await this.preferences.load()) ?? FocusPreferences.default()
    const nextType = this.scheduling.nextAfter(
      completedType,
      updated.completedFocusInCycle,
      prefs.blocksUntilLongBreak,
    )
    return { session: updated, nextType }
  }
}

import type { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import type { SessionRepository } from '~/domain/focus-session/repositories/SessionRepository'
import type { Clock } from '../ports/Clock'

/**
 * Encerra o bloco corrente antes do tempo planejado e persiste a sessão.
 */
export class AbandonBlock {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<FocusSession> {
    const session = await this.sessions.load()
    if (!session?.currentBlock) {
      throw new Error('Não há bloco para encerrar.')
    }
    const updated = session.abandon(this.clock.now())
    await this.sessions.save(updated)
    return updated
  }
}

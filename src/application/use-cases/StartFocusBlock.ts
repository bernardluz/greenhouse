import { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import type { SessionRepository } from '~/domain/focus-session/repositories/SessionRepository'
import { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import { FocusPreferences } from '~/domain/preferences/entities/FocusPreferences'
import type { PreferencesRepository } from '~/domain/preferences/repositories/PreferencesRepository'
import type { Duration } from '~/domain/shared/value-objects/Duration'
import type { Clock } from '../ports/Clock'
import type { IdGenerator } from '../ports/IdGenerator'

export interface StartFocusBlockInput {
  /** Tipo do bloco a iniciar; padrão Focus (botão principal). */
  type?: BlockType
}

/**
 * Inicia um bloco, usando a última configuração salva para a duração. Sem
 * configuração obrigatória — viabiliza o "início em um toque". Reutilizável
 * para pausas (passando o tipo), sustentando a transição automática.
 */
export class StartFocusBlock {
  constructor(
    private readonly sessions: SessionRepository,
    private readonly preferences: PreferencesRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async execute(input: StartFocusBlockInput = {}): Promise<FocusSession> {
    const type = input.type ?? BlockType.Focus
    const prefs = (await this.preferences.load()) ?? FocusPreferences.default()
    const duration = this.durationFor(type, prefs)
    const session = (await this.sessions.load()) ?? FocusSession.start(this.ids.next())
    const updated = session.startBlock(this.ids.next(), type, duration, this.clock.now())
    await this.sessions.save(updated)
    return updated
  }

  private durationFor(type: BlockType, prefs: FocusPreferences): Duration {
    switch (type) {
      case BlockType.ShortBreak:
        return prefs.shortBreakDuration
      case BlockType.LongBreak:
        return prefs.longBreakDuration
      default:
        return prefs.focusDuration
    }
  }
}

import { FocusBlock } from '~/domain/focus-session/entities/FocusBlock'
import { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import type { SessionRepository } from '~/domain/focus-session/repositories/SessionRepository'
import type { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import { TimerState, type TimerStatus } from '~/domain/focus-session/value-objects/TimerState'
import { Duration } from '~/domain/shared/value-objects/Duration'

interface StoredBlock {
  id: string
  type: BlockType
  plannedMinutes: number
  elapsedMs: number
  status: TimerStatus
}

interface StoredSession {
  id: string
  currentBlock: StoredBlock | null
  completedFocusInCycle: number
  completedToday: number
  abandonedToday: number
}

const KEY = 'greenhouse:session'

/**
 * Persistência do agregado FocusSession via localStorage. Mapeia entre o objeto
 * de domínio e um formato plano de armazenamento, mantendo o domínio ignorante
 * quanto ao mecanismo de persistência.
 */
export class LocalStorageSessionRepository implements SessionRepository {
  constructor(private readonly storage: Storage = localStorage) {}

  async load(): Promise<FocusSession | null> {
    const raw = this.storage.getItem(KEY)
    if (!raw) {
      return null
    }
    try {
      return this.toDomain(JSON.parse(raw) as StoredSession)
    } catch {
      return null
    }
  }

  async save(session: FocusSession): Promise<void> {
    this.storage.setItem(KEY, JSON.stringify(this.toStored(session)))
  }

  async clear(): Promise<void> {
    this.storage.removeItem(KEY)
  }

  private toStored(session: FocusSession): StoredSession {
    const block = session.currentBlock
    return {
      id: session.id,
      currentBlock: block
        ? {
            id: block.id,
            type: block.type,
            plannedMinutes: block.plannedDuration.minutes,
            elapsedMs: block.elapsedMs,
            status: block.state.status,
          }
        : null,
      completedFocusInCycle: session.completedFocusInCycle,
      completedToday: session.completedToday,
      abandonedToday: session.abandonedToday,
    }
  }

  private toDomain(data: StoredSession): FocusSession {
    const stored = data.currentBlock
    const currentBlock = stored
      ? FocusBlock.restore(
          stored.id,
          stored.type,
          Duration.ofMinutes(stored.plannedMinutes),
          stored.elapsedMs,
          TimerState.of(stored.status),
        )
      : null
    return FocusSession.restore({
      id: data.id,
      currentBlock,
      completedFocusInCycle: data.completedFocusInCycle,
      completedToday: data.completedToday,
      abandonedToday: data.abandonedToday,
    })
  }
}

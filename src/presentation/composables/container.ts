import type { TimerService } from '~/application/ports/TimerService'
import { AbandonBlock } from '~/application/use-cases/AbandonBlock'
import { CaptureDistraction } from '~/application/use-cases/CaptureDistraction'
import { CompleteBlock } from '~/application/use-cases/CompleteBlock'
import { StartFocusBlock } from '~/application/use-cases/StartFocusBlock'
import { UpdatePreferences } from '~/application/use-cases/UpdatePreferences'
import type { SessionRepository } from '~/domain/focus-session/repositories/SessionRepository'
import { BlockSchedulingService } from '~/domain/focus-session/services/BlockSchedulingService'
import type { DistractionRepository } from '~/domain/parking-lot/repositories/DistractionRepository'
import type { PreferencesRepository } from '~/domain/preferences/repositories/PreferencesRepository'
import { UuidGenerator } from '~/infrastructure/id/UuidGenerator'
import { LocalStorageDistractionRepository } from '~/infrastructure/persistence/LocalStorageDistractionRepository'
import { LocalStoragePreferencesRepository } from '~/infrastructure/persistence/LocalStoragePreferencesRepository'
import { LocalStorageSessionRepository } from '~/infrastructure/persistence/LocalStorageSessionRepository'
import { BrowserClock } from '~/infrastructure/time/BrowserClock'
import { BrowserTimerService } from '~/infrastructure/timer/BrowserTimerService'

export interface Container {
  readonly sessions: SessionRepository
  readonly distractions: DistractionRepository
  readonly preferences: PreferencesRepository
  readonly timer: TimerService
  readonly startFocusBlock: StartFocusBlock
  readonly completeBlock: CompleteBlock
  readonly abandonBlock: AbandonBlock
  readonly captureDistraction: CaptureDistraction
  readonly updatePreferences: UpdatePreferences
}

let instance: Container | null = null

/**
 * Composition Root: monta os casos de uso com as implementações concretas de
 * infraestrutura. Lazy e cliente-apenas — só é construído na primeira chamada
 * (dentro de onMounted/handlers), garantindo que o localStorage exista.
 */
export function getContainer(): Container {
  if (instance) {
    return instance
  }
  const sessions = new LocalStorageSessionRepository()
  const distractions = new LocalStorageDistractionRepository()
  const preferences = new LocalStoragePreferencesRepository()
  const clock = new BrowserClock()
  const ids = new UuidGenerator()
  const scheduling = new BlockSchedulingService()

  instance = {
    sessions,
    distractions,
    preferences,
    timer: new BrowserTimerService(1000),
    startFocusBlock: new StartFocusBlock(sessions, preferences, clock, ids),
    completeBlock: new CompleteBlock(sessions, preferences, scheduling, clock),
    abandonBlock: new AbandonBlock(sessions, clock),
    captureDistraction: new CaptureDistraction(sessions, distractions, clock, ids),
    updatePreferences: new UpdatePreferences(preferences),
  }
  return instance
}

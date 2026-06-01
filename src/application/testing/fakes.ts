import type { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import type { SessionRepository } from '~/domain/focus-session/repositories/SessionRepository'
import type { DistractionItem } from '~/domain/parking-lot/entities/DistractionItem'
import type { DistractionRepository } from '~/domain/parking-lot/repositories/DistractionRepository'
import type { FocusPreferences } from '~/domain/preferences/entities/FocusPreferences'
import type { PreferencesRepository } from '~/domain/preferences/repositories/PreferencesRepository'
import type { Clock } from '../ports/Clock'
import type { IdGenerator } from '../ports/IdGenerator'

/**
 * Implementações em memória dos contratos, usadas nos testes da aplicação.
 * Servem também de implementação de referência intercambiável (LSP).
 */
export class InMemorySessionRepository implements SessionRepository {
  private current: FocusSession | null = null

  async load(): Promise<FocusSession | null> {
    return this.current
  }

  async save(session: FocusSession): Promise<void> {
    this.current = session
  }

  async clear(): Promise<void> {
    this.current = null
  }
}

export class InMemoryPreferencesRepository implements PreferencesRepository {
  private current: FocusPreferences | null = null

  async load(): Promise<FocusPreferences | null> {
    return this.current
  }

  async save(preferences: FocusPreferences): Promise<void> {
    this.current = preferences
  }
}

export class InMemoryDistractionRepository implements DistractionRepository {
  private items: DistractionItem[] = []

  async load(): Promise<DistractionItem[]> {
    return [...this.items]
  }

  async save(items: readonly DistractionItem[]): Promise<void> {
    this.items = [...items]
  }

  async clear(): Promise<void> {
    this.items = []
  }
}

export class FixedClock implements Clock {
  constructor(private value: number) {}

  now(): number {
    return this.value
  }

  set(value: number): void {
    this.value = value
  }
}

export class SequentialIdGenerator implements IdGenerator {
  private counter = 0

  next(): string {
    this.counter += 1
    return `id-${this.counter}`
  }
}

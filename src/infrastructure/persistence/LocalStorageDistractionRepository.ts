import { DistractionItem } from '~/domain/parking-lot/entities/DistractionItem'
import type { DistractionRepository } from '~/domain/parking-lot/repositories/DistractionRepository'
import type { DistractionStatus } from '~/domain/parking-lot/value-objects/DistractionStatus'

interface StoredDistraction {
  id: string
  text: string
  capturedAt: number
  status: DistractionStatus
}

const KEY = 'greenhouse:distractions'

/**
 * Persistência das distrações via localStorage, mapeando entre DistractionItem
 * e um formato plano de armazenamento.
 */
export class LocalStorageDistractionRepository implements DistractionRepository {
  constructor(private readonly storage: Storage = localStorage) {}

  async load(): Promise<DistractionItem[]> {
    const raw = this.storage.getItem(KEY)
    if (!raw) {
      return []
    }
    try {
      const data = JSON.parse(raw) as StoredDistraction[]
      return data.map((d) => DistractionItem.restore(d.id, d.text, d.capturedAt, d.status))
    } catch {
      return []
    }
  }

  async save(items: readonly DistractionItem[]): Promise<void> {
    const data: StoredDistraction[] = items.map((item) => ({
      id: item.id,
      text: item.text,
      capturedAt: item.capturedAt,
      status: item.status,
    }))
    this.storage.setItem(KEY, JSON.stringify(data))
  }

  async clear(): Promise<void> {
    this.storage.removeItem(KEY)
  }
}

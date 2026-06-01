// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import { DistractionItem } from '~/domain/parking-lot/entities/DistractionItem'
import { DistractionStatus } from '~/domain/parking-lot/value-objects/DistractionStatus'
import { LocalStorageDistractionRepository } from './LocalStorageDistractionRepository'

describe('LocalStorageDistractionRepository', () => {
  beforeEach(() => localStorage.clear())

  it('retorna lista vazia quando não há nada salvo', async () => {
    expect(await new LocalStorageDistractionRepository().load()).toEqual([])
  })

  it('salva e recarrega distrações preservando status', async () => {
    const repo = new LocalStorageDistractionRepository()
    await repo.save([
      DistractionItem.capture('d1', 'a', 1000),
      DistractionItem.capture('d2', 'b', 2000).resolve(),
    ])
    const loaded = await repo.load()
    expect(loaded).toHaveLength(2)
    expect(loaded[0]?.status).toBe(DistractionStatus.Open)
    expect(loaded[1]?.status).toBe(DistractionStatus.Resolved)
  })

  it('retorna lista vazia para dados corrompidos', async () => {
    localStorage.setItem('greenhouse:distractions', 'not json')
    expect(await new LocalStorageDistractionRepository().load()).toEqual([])
  })
})

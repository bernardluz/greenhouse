import { describe, expect, it } from 'vitest'
import { BlockType } from '../value-objects/BlockType'
import { BlockSchedulingService } from './BlockSchedulingService'

describe('BlockSchedulingService', () => {
  const service = new BlockSchedulingService()
  const blocksUntilLongBreak = 4

  it('após um foco que não fecha o ciclo, agenda pausa curta', () => {
    expect(service.nextAfter(BlockType.Focus, 1, blocksUntilLongBreak)).toBe(BlockType.ShortBreak)
    expect(service.nextAfter(BlockType.Focus, 2, blocksUntilLongBreak)).toBe(BlockType.ShortBreak)
    expect(service.nextAfter(BlockType.Focus, 3, blocksUntilLongBreak)).toBe(BlockType.ShortBreak)
  })

  it('a cada N focos, agenda pausa longa', () => {
    expect(service.nextAfter(BlockType.Focus, 4, blocksUntilLongBreak)).toBe(BlockType.LongBreak)
    expect(service.nextAfter(BlockType.Focus, 8, blocksUntilLongBreak)).toBe(BlockType.LongBreak)
  })

  it('após qualquer pausa, agenda foco', () => {
    expect(service.nextAfter(BlockType.ShortBreak, 2, blocksUntilLongBreak)).toBe(BlockType.Focus)
    expect(service.nextAfter(BlockType.LongBreak, 4, blocksUntilLongBreak)).toBe(BlockType.Focus)
  })
})

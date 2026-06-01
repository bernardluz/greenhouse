import { describe, expect, it } from 'vitest'
import { BlockType, isBreak, isFocus } from './BlockType'

describe('BlockType', () => {
  it('expõe os três tipos de bloco', () => {
    expect(BlockType.Focus).toBe('Focus')
    expect(BlockType.ShortBreak).toBe('ShortBreak')
    expect(BlockType.LongBreak).toBe('LongBreak')
  })

  it('identifica blocos de foco', () => {
    expect(isFocus(BlockType.Focus)).toBe(true)
    expect(isFocus(BlockType.ShortBreak)).toBe(false)
  })

  it('identifica blocos de pausa (curta e longa)', () => {
    expect(isBreak(BlockType.ShortBreak)).toBe(true)
    expect(isBreak(BlockType.LongBreak)).toBe(true)
    expect(isBreak(BlockType.Focus)).toBe(false)
  })
})

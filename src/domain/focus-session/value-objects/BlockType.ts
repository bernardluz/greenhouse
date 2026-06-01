/**
 * Tipos de bloco do ciclo Pomodoro. Modelado como objeto const + união de
 * literais para manter tipagem forte e permitir extensão (OCP): novos tipos de
 * bloco podem surgir sem alterar consumidores que dependem dos helpers.
 */
export const BlockType = {
  Focus: 'Focus',
  ShortBreak: 'ShortBreak',
  LongBreak: 'LongBreak',
} as const

export type BlockType = (typeof BlockType)[keyof typeof BlockType]

export function isFocus(type: BlockType): boolean {
  return type === BlockType.Focus
}

export function isBreak(type: BlockType): boolean {
  return type === BlockType.ShortBreak || type === BlockType.LongBreak
}

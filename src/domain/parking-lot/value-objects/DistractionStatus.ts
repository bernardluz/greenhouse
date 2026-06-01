/**
 * Estado de triagem de uma distração capturada.
 * Open: recém-capturada, ainda não revisada.
 * Resolved: tratada na pausa.
 * Discarded: descartada como irrelevante.
 */
export const DistractionStatus = {
  Open: 'Open',
  Resolved: 'Resolved',
  Discarded: 'Discarded',
} as const

export type DistractionStatus = (typeof DistractionStatus)[keyof typeof DistractionStatus]

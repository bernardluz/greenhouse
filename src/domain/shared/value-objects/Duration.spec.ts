import { describe, expect, it } from 'vitest'
import { Duration } from './Duration'

describe('Duration', () => {
  it('cria a partir de minutos positivos e converte unidades', () => {
    const d = Duration.ofMinutes(25)
    expect(d.minutes).toBe(25)
    expect(d.seconds).toBe(1500)
    expect(d.milliseconds).toBe(1_500_000)
  })

  it('aceita durações fracionárias positivas', () => {
    expect(Duration.ofMinutes(0.5).seconds).toBe(30)
  })

  it('rejeita zero', () => {
    expect(() => Duration.ofMinutes(0)).toThrow(RangeError)
  })

  it('rejeita valores negativos', () => {
    expect(() => Duration.ofMinutes(-5)).toThrow(RangeError)
  })

  it('rejeita valores não finitos', () => {
    expect(() => Duration.ofMinutes(Number.NaN)).toThrow(RangeError)
    expect(() => Duration.ofMinutes(Number.POSITIVE_INFINITY)).toThrow(RangeError)
  })

  it('considera iguais duas durações de mesmo valor', () => {
    expect(Duration.ofMinutes(5).equals(Duration.ofMinutes(5))).toBe(true)
    expect(Duration.ofMinutes(5).equals(Duration.ofMinutes(10))).toBe(false)
  })
})

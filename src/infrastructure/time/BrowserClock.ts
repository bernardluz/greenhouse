import type { Clock } from '~/application/ports/Clock'

/** Implementação de Clock baseada no relógio do navegador. */
export class BrowserClock implements Clock {
  now(): number {
    return Date.now()
  }
}

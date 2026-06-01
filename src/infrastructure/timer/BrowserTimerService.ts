import type { TimerService } from '~/application/ports/TimerService'

const DEFAULT_INTERVAL_MS = 250

/**
 * Adapter de timer baseado em setInterval. Mede o tempo real decorrido entre
 * ticks (em vez de assumir o intervalo nominal), compensando drift do
 * setInterval e períodos de aba inativa.
 */
export class BrowserTimerService implements TimerService {
  private handle: ReturnType<typeof setInterval> | null = null
  private lastTick = 0

  constructor(private readonly intervalMs: number = DEFAULT_INTERVAL_MS) {}

  start(onTick: (deltaMs: number) => void): void {
    this.stop()
    this.lastTick = Date.now()
    this.handle = setInterval(() => {
      const now = Date.now()
      const delta = now - this.lastTick
      this.lastTick = now
      onTick(delta)
    }, this.intervalMs)
  }

  stop(): void {
    if (this.handle !== null) {
      clearInterval(this.handle)
      this.handle = null
    }
  }
}

/**
 * Porta enxuta para a contagem de tempo (ISP): apenas iniciar e parar. A
 * implementação concreta (navegador) vive na infraestrutura, tornando o
 * mecanismo de tempo real um detalhe substituível.
 */
export interface TimerService {
  /** Inicia os ticks; `onTick` recebe o tempo real decorrido desde o tick anterior, em ms. */
  start(onTick: (deltaMs: number) => void): void
  stop(): void
}

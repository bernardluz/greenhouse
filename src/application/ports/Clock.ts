/**
 * Porta para obtenção do tempo atual (epoch ms). Abstrai `Date.now()` para
 * manter a aplicação determinística e testável; a infraestrutura fornece a
 * implementação real do navegador.
 */
export interface Clock {
  now(): number
}

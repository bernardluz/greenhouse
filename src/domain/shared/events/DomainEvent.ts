/**
 * Contrato base para eventos de domínio.
 * Eventos são fatos imutáveis emitidos pelas raízes de agregado; a camada de
 * aplicação reage a eles (persistir estado, atualizar contadores) sem que o
 * domínio conheça a infraestrutura.
 */
export interface DomainEvent {
  readonly type: string
  /** Momento da ocorrência em epoch ms, fornecido pela aplicação via Clock. */
  readonly occurredAt: number
}

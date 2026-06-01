import { DistractionStatus } from '../value-objects/DistractionStatus'

const MAX_TEXT_LENGTH = 280

/**
 * Entidade que representa um pensamento intrusivo capturado durante o foco.
 * Guarda o texto, o instante da captura e o status de triagem. Imutável:
 * mudar o status produz uma nova instância.
 */
export class DistractionItem {
  private constructor(
    readonly id: string,
    readonly text: string,
    readonly capturedAt: number,
    readonly status: DistractionStatus,
  ) {}

  static capture(id: string, text: string, capturedAt: number): DistractionItem {
    const normalized = text.trim()
    if (normalized.length === 0) {
      throw new Error('A distração não pode ser vazia.')
    }
    return new DistractionItem(
      id,
      normalized.slice(0, MAX_TEXT_LENGTH),
      capturedAt,
      DistractionStatus.Open,
    )
  }

  /** Reconstrói uma distração a partir de estado persistido. */
  static restore(
    id: string,
    text: string,
    capturedAt: number,
    status: DistractionStatus,
  ): DistractionItem {
    return new DistractionItem(id, text, capturedAt, status)
  }

  get isOpen(): boolean {
    return this.status === DistractionStatus.Open
  }

  resolve(): DistractionItem {
    return new DistractionItem(this.id, this.text, this.capturedAt, DistractionStatus.Resolved)
  }

  discard(): DistractionItem {
    return new DistractionItem(this.id, this.text, this.capturedAt, DistractionStatus.Discarded)
  }
}

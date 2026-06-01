import { BlockType, isBreak } from '../value-objects/BlockType'

/**
 * Serviço de domínio sem estado: decide o próximo tipo de bloco com base no
 * tipo recém-concluído e em quantos blocos de foco já foram completados no
 * ciclo. A regra não pertence a uma única entidade, por isso vive aqui (e é
 * extensível sem alterar o agregado — OCP).
 */
export class BlockSchedulingService {
  /**
   * @param completedType          tipo do bloco que acabou de ser concluído
   * @param completedFocusInCycle  focos completados no ciclo (incluindo o atual, se foco)
   * @param blocksUntilLongBreak   quantidade de focos até a pausa longa
   */
  nextAfter(
    completedType: BlockType,
    completedFocusInCycle: number,
    blocksUntilLongBreak: number,
  ): BlockType {
    if (isBreak(completedType)) {
      return BlockType.Focus
    }
    const reachedCycleEnd =
      completedFocusInCycle > 0 && completedFocusInCycle % blocksUntilLongBreak === 0
    return reachedCycleEnd ? BlockType.LongBreak : BlockType.ShortBreak
  }
}

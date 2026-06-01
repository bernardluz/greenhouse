import { computed, onMounted, shallowRef } from 'vue'
import type { DistractionItem } from '~/domain/parking-lot/entities/DistractionItem'
import { ParkingLot } from '~/domain/parking-lot/entities/ParkingLot'
import { getContainer } from './container'

/**
 * Estado reativo do parking lot e comandos de triagem. A captura passa pelo
 * caso de uso (que valida o foco em andamento); a triagem (resolver/descartar)
 * reaplica as operações do agregado e persiste.
 */
export function useParkingLot() {
  const items = shallowRef<DistractionItem[]>([])
  const openItems = computed(() => items.value.filter((item) => item.isOpen))

  onMounted(async () => {
    items.value = await getContainer().distractions.load()
  })

  /** Retorna true se capturou; false se não havia foco em andamento ou texto vazio. */
  async function capture(text: string): Promise<boolean> {
    try {
      const lot = await getContainer().captureDistraction.execute({ text })
      items.value = [...lot.items]
      return true
    } catch {
      return false
    }
  }

  async function resolve(id: string): Promise<void> {
    const lot = ParkingLot.restore(items.value).resolve(id)
    await getContainer().distractions.save(lot.items)
    items.value = [...lot.items]
  }

  async function discard(id: string): Promise<void> {
    const lot = ParkingLot.restore(items.value).discard(id)
    await getContainer().distractions.save(lot.items)
    items.value = [...lot.items]
  }

  return { items, openItems, capture, resolve, discard }
}

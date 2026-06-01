import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import type { FocusSession } from '~/domain/focus-session/entities/FocusSession'
import { BlockType } from '~/domain/focus-session/value-objects/BlockType'
import { TimerStatus } from '~/domain/focus-session/value-objects/TimerState'
import { getContainer } from './container'

/**
 * Orquestra o ciclo de foco para a apresentação: expõe estado reativo derivado
 * do agregado FocusSession e os comandos, conectando o adapter de timer aos
 * casos de uso. Toda regra de negócio permanece no domínio/aplicação.
 */
export function useFocusSession() {
  const session = shallowRef<FocusSession | null>(null)

  const currentBlock = computed(() => session.value?.currentBlock ?? null)
  const status = computed(() => currentBlock.value?.state.status ?? TimerStatus.Idle)
  const blockType = computed<BlockType | null>(() => currentBlock.value?.type ?? null)
  const isRunning = computed(() => status.value === TimerStatus.Running)
  const isPaused = computed(() => status.value === TimerStatus.Paused)
  const isActive = computed(() => currentBlock.value?.state.isActive ?? false)
  const isFocus = computed(() => blockType.value === BlockType.Focus)
  const remainingSeconds = computed(() => currentBlock.value?.remainingSeconds ?? 0)
  const progress = computed(() => currentBlock.value?.progress ?? 0)
  const completedToday = computed(() => session.value?.completedToday ?? 0)
  const abandonedToday = computed(() => session.value?.abandonedToday ?? 0)

  function onTick(deltaMs: number): void {
    if (!session.value) {
      return
    }
    const ticked = session.value.tick(deltaMs)
    session.value = ticked
    void getContainer().sessions.save(ticked)
    if (ticked.currentBlock?.isElapsed) {
      void handleElapsed()
    }
  }

  async function handleElapsed(): Promise<void> {
    const container = getContainer()
    container.timer.stop()
    const completedType = session.value?.currentBlock?.type
    const result = await container.completeBlock.execute()
    session.value = result.session
    // Após um foco, transiciona automaticamente para a pausa sugerida;
    // após uma pausa, aguarda o usuário iniciar o próximo foco (1 toque).
    if (completedType === BlockType.Focus) {
      await startBlock(result.nextType)
    }
  }

  async function startBlock(type?: BlockType): Promise<void> {
    const container = getContainer()
    session.value = await container.startFocusBlock.execute(type ? { type } : {})
    container.timer.start(onTick)
  }

  async function start(): Promise<void> {
    await startBlock(BlockType.Focus)
  }

  async function pause(): Promise<void> {
    if (!session.value || !isRunning.value) {
      return
    }
    getContainer().timer.stop()
    session.value = session.value.pause()
    await getContainer().sessions.save(session.value)
  }

  async function resume(): Promise<void> {
    if (!session.value || !isPaused.value) {
      return
    }
    session.value = session.value.resume()
    await getContainer().sessions.save(session.value)
    getContainer().timer.start(onTick)
  }

  async function abandon(): Promise<void> {
    if (!session.value?.currentBlock) {
      return
    }
    const container = getContainer()
    container.timer.stop()
    session.value = await container.abandonBlock.execute()
  }

  onMounted(async () => {
    const container = getContainer()
    session.value = await container.sessions.load()
    if (session.value?.currentBlock?.state.is(TimerStatus.Running)) {
      container.timer.start(onTick)
    }
  })

  onUnmounted(() => {
    getContainer().timer.stop()
  })

  return {
    session,
    currentBlock,
    status,
    blockType,
    isRunning,
    isPaused,
    isActive,
    isFocus,
    remainingSeconds,
    progress,
    completedToday,
    abandonedToday,
    start,
    startBlock,
    pause,
    resume,
    abandon,
  }
}

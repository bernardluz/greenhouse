<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { FocusPreferences } from '~/domain/preferences/entities/FocusPreferences'
import { getContainer } from '~/presentation/composables/container'
import { useFocusSession } from '~/presentation/composables/useFocusSession'
import { useParkingLot } from '~/presentation/composables/useParkingLot'

const {
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
  pause,
  resume,
  abandon,
} = useFocusSession()

const {
  items: distractions,
  openItems,
  capture,
  resolve,
  discard,
} = useParkingLot()

const parkingPanel = ref<{ focusInput: () => void } | null>(null)

interface PreferencesForm {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  blocksUntilLongBreak: number
}

const prefs = ref<PreferencesForm>({
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  blocksUntilLongBreak: 4,
})

function toForm(preferences: FocusPreferences): PreferencesForm {
  return {
    focusMinutes: preferences.focusDuration.minutes,
    shortBreakMinutes: preferences.shortBreakDuration.minutes,
    longBreakMinutes: preferences.longBreakDuration.minutes,
    blocksUntilLongBreak: preferences.blocksUntilLongBreak,
  }
}

async function loadPrefs(): Promise<void> {
  const stored = await getContainer().preferences.load()
  prefs.value = toForm(stored ?? FocusPreferences.default())
}

async function savePrefs(value: PreferencesForm): Promise<void> {
  try {
    prefs.value = toForm(await getContainer().updatePreferences.execute(value))
  } catch {
    // valores inválidos — mantém os anteriores (validação no domínio)
  }
}

function focusCapture(): void {
  parkingPanel.value?.focusInput()
}

function onKeydown(event: KeyboardEvent): void {
  const target = event.target as HTMLElement | null
  const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'
  if (!typing && (event.key === 'c' || event.key === 'C') && isActive.value && isFocus.value) {
    event.preventDefault()
    focusCapture()
  }
}

onMounted(() => {
  void loadPrefs()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="app">
    <header class="app__top">
      <h1 class="brand">🌱 Greenhouse</h1>
      <DailyCounter :completed="completedToday" :abandoned="abandonedToday" />
    </header>

    <main class="app__main">
      <section class="stage">
        <TimerDisplay
          :remaining-seconds="remainingSeconds"
          :progress="progress"
          :block-type="blockType"
          :is-focus="isFocus"
        />
        <ControlsBar
          :is-active="isActive"
          :is-running="isRunning"
          :is-paused="isPaused"
          :is-focus="isFocus"
          @start="start"
          @pause="pause"
          @resume="resume"
          @abandon="abandon"
          @capture="focusCapture"
        />
        <p class="hint">
          Durante o foco, pressione <kbd>C</kbd> para capturar uma distração sem parar o timer.
        </p>
        <PreferencesPanel
          :focus-minutes="prefs.focusMinutes"
          :short-break-minutes="prefs.shortBreakMinutes"
          :long-break-minutes="prefs.longBreakMinutes"
          :blocks-until-long-break="prefs.blocksUntilLongBreak"
          @save="savePrefs"
        />
      </section>

      <ParkingLotPanel
        ref="parkingPanel"
        :items="distractions"
        :open-items="openItems"
        :capture-enabled="isActive && isFocus"
        @capture="capture"
        @resolve="resolve"
        @discard="discard"
      />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space);
  display: flex;
  flex-direction: column;
  gap: var(--space);
}
.app__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.brand {
  font-size: 1.5rem;
  letter-spacing: -0.01em;
}
.app__main {
  flex: 1;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: var(--space);
  align-items: start;
}
.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: var(--space) 0;
}
.hint {
  color: var(--muted);
  font-size: 0.85rem;
  text-align: center;
}
kbd {
  font-family: var(--mono);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.1rem 0.4rem;
  font-size: 0.8rem;
}
@media (max-width: 800px) {
  .app__main {
    grid-template-columns: 1fr;
  }
}
</style>

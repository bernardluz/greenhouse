<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { FocusPreferences } from '~/domain/preferences/entities/FocusPreferences'
import { getContainer } from '~/presentation/composables/container'
import { useFocusSession } from '~/presentation/composables/useFocusSession'
import { useParkingLot } from '~/presentation/composables/useParkingLot'

const {
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

const { items: distractions, openItems, capture, resolve, discard } = useParkingLot()

/** Estado de matéria do vidro: repouso (limpo), foco (embaçado), pausa (limpa parcial). */
const matterState = computed<'rest' | 'focus' | 'break'>(() => {
  if (!isActive.value) {
    return 'rest'
  }
  return isFocus.value ? 'focus' : 'break'
})

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
  prefs.value = toForm((await getContainer().preferences.load()) ?? FocusPreferences.default())
}

async function savePrefs(value: PreferencesForm): Promise<void> {
  try {
    prefs.value = toForm(await getContainer().updatePreferences.execute(value))
  } catch {
    // valores inválidos — validação no domínio mantém os anteriores
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
  <div class="greenhouse" :data-matter="matterState">
    <GreenhouseBackdrop :matter-state="matterState" :progress="progress" />

    <header class="greenhouse__head recede">
      <span class="mark">Greenhouse</span>
      <DailyCounter :completed="completedToday" :abandoned="abandonedToday" />
    </header>

    <main class="greenhouse__main">
      <section class="bench">
        <TimerDisplay
          :remaining-seconds="remainingSeconds"
          :block-type="blockType"
          :matter-state="matterState"
        />
        <div class="bench__controls">
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
        </div>
        <p class="hint recede">
          durante o foco, tecle <kbd>C</kbd> para arquivar uma distração sem limpar o vidro.
        </p>
        <div class="bench__prefs recede">
          <PreferencesPanel
            :focus-minutes="prefs.focusMinutes"
            :short-break-minutes="prefs.shortBreakMinutes"
            :long-break-minutes="prefs.longBreakMinutes"
            :blocks-until-long-break="prefs.blocksUntilLongBreak"
            @save="savePrefs"
          />
        </div>
      </section>

      <ParkingLotPanel
        ref="parkingPanel"
        class="greenhouse__shelf"
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
.greenhouse {
  position: relative;
  min-height: 100dvh;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1.5rem, 1rem + 3vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 4);
}
.greenhouse__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--u);
}
.mark {
  font-family: var(--font-display);
  font-style: italic;
  font-variation-settings: 'opsz' 40, 'wght' 480;
  font-size: 1.5rem;
  color: var(--paper);
  letter-spacing: -0.01em;
}

/* Composição assimétrica: relógio deslocado, prateleira encostada na lateral */
.greenhouse__main {
  flex: 1;
  display: grid;
  grid-template-columns: 1.7fr 0.9fr;
  gap: calc(var(--u) * 5);
  align-items: center;
}
.bench {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 4);
  padding-block: calc(var(--u) * 4);
  align-items: flex-start;
}
.bench :deep(.clock) {
  justify-items: flex-start;
}
.bench__controls {
  width: 100%;
}
.hint {
  font-family: var(--font-body);
  font-style: italic;
  color: var(--copper-verdet);
  font-size: 0.95rem;
}
kbd {
  font-family: var(--font-label);
  border: 1px solid color-mix(in oklab, var(--copper) 50%, transparent);
  padding: 1px 7px;
  color: var(--brass);
  font-size: 0.85em;
}

/* Nitidez é hierarquia: no foco, o secundário recua opticamente (restaura no hover/foco) */
.recede {
  transition:
    opacity 1.2s ease,
    filter 1.2s ease;
}
.greenhouse[data-matter='focus'] .recede {
  opacity: 0.3;
  filter: blur(2.5px);
}
.greenhouse[data-matter='focus'] .recede:hover,
.greenhouse[data-matter='focus'] .recede:focus-within {
  opacity: 0.92;
  filter: blur(0);
}

/* Controles ficam discretos no foco mas sempre clicáveis (sem blur, restauram no hover) */
.bench__controls {
  transition: opacity 0.6s ease;
}
.greenhouse[data-matter='focus'] .bench__controls {
  opacity: 0.5;
}
.greenhouse[data-matter='focus'] .bench__controls:hover,
.greenhouse[data-matter='focus'] .bench__controls:focus-within {
  opacity: 1;
}

/* A prateleira desfoca no foco; o input limpa localmente ao receber foco (gesto de captura) */
.greenhouse__shelf {
  transition:
    opacity 1.2s ease,
    filter 1.2s ease;
}
.greenhouse[data-matter='focus'] .greenhouse__shelf {
  opacity: 0.3;
  filter: blur(4px);
}
.greenhouse[data-matter='focus'] .greenhouse__shelf:focus-within {
  opacity: 1;
  filter: blur(0);
}

@media (max-width: 880px) {
  .greenhouse__main {
    grid-template-columns: 1fr;
    gap: calc(var(--u) * 3);
  }
  .bench {
    align-items: center;
  }
  .bench :deep(.clock) {
    justify-items: center;
  }
  .bench :deep(.controls) {
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .recede,
  .greenhouse__shelf,
  .bench__controls {
    transition: opacity 0.25s linear;
  }
  .greenhouse[data-matter='focus'] .recede,
  .greenhouse[data-matter='focus'] .greenhouse__shelf {
    filter: none;
  }
}
</style>

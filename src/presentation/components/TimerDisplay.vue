<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  remainingSeconds: number
  progress: number
  blockType: string | null
  isFocus: boolean
}>()

const label = computed(() => {
  switch (props.blockType) {
    case 'Focus':
      return 'Foco'
    case 'ShortBreak':
      return 'Pausa curta'
    case 'LongBreak':
      return 'Pausa longa'
    default:
      return 'Pronto para focar'
  }
})

const time = computed(() => {
  const total = Math.max(0, props.remainingSeconds)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const RADIUS = 130
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const dashOffset = computed(
  () => CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, props.progress))),
)
</script>

<template>
  <div class="timer" :class="{ 'timer--break': blockType && !isFocus }">
    <svg class="ring" viewBox="0 0 300 300" aria-hidden="true">
      <circle class="ring__track" cx="150" cy="150" :r="RADIUS" />
      <circle
        class="ring__progress"
        cx="150"
        cy="150"
        :r="RADIUS"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="timer__center">
      <span class="timer__label">{{ label }}</span>
      <time class="timer__time" :datetime="`PT${Math.max(0, remainingSeconds)}S`">{{ time }}</time>
    </div>
  </div>
</template>

<style scoped>
.timer {
  position: relative;
  width: min(74vw, 300px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  --accent: var(--focus);
}
.timer--break {
  --accent: var(--break);
}
.ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.ring__track {
  fill: none;
  stroke: var(--surface-2);
  stroke-width: 14;
}
.ring__progress {
  fill: none;
  stroke: var(--accent);
  stroke-width: 14;
  stroke-linecap: round;
  transition:
    stroke-dashoffset 0.6s linear,
    stroke 0.4s ease;
  filter: drop-shadow(0 0 12px oklch(74% 0.17 150 / 0.35));
}
.timer__center {
  position: absolute;
  display: grid;
  justify-items: center;
  gap: 0.3rem;
}
.timer__label {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.78rem;
  color: var(--muted);
}
.timer__time {
  font-family: var(--mono);
  font-size: clamp(3rem, 1.5rem + 8vw, 4.5rem);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
</style>

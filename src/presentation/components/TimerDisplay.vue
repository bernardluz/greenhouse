<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  remainingSeconds: number
  blockType: string | null
  matterState: 'rest' | 'focus' | 'break'
}>()

const label = computed(() => {
  switch (props.blockType) {
    case 'Focus':
      return 'em foco'
    case 'ShortBreak':
      return 'pausa curta'
    case 'LongBreak':
      return 'pausa longa'
    default:
      return 'pronto'
  }
})

const time = computed(() => {
  const total = Math.max(0, props.remainingSeconds)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})
</script>

<template>
  <div class="clock" :data-matter="matterState">
    <span class="clock__label">{{ label }}</span>
    <time class="clock__time" :datetime="`PT${Math.max(0, remainingSeconds)}S`">{{ time }}</time>
  </div>
</template>

<style scoped>
.clock {
  display: grid;
  justify-items: center;
  gap: calc(var(--u) * 1.5);
  --tone: var(--paper);
}
.clock[data-matter='focus'] {
  --tone: var(--signal-focus);
}
.clock[data-matter='break'] {
  --tone: var(--signal-rest);
}

.clock__label {
  font-family: var(--font-label);
  text-transform: lowercase;
  letter-spacing: 0.34em;
  font-size: clamp(0.7rem, 0.6rem + 0.4vw, 0.85rem);
  color: var(--copper-verdet);
  padding-left: 0.34em;
}

/* Número gravado em metal: Fraunces em optical size alto = contraste dramático */
.clock__time {
  font-family: var(--font-display);
  font-optical-sizing: auto;
  font-variation-settings: 'opsz' 144, 'wght' 560;
  font-size: clamp(5rem, 2rem + 22vw, 13rem);
  line-height: 0.82;
  font-variant-numeric: tabular-nums;
  color: var(--tone);
  transition: color 1.1s ease;
  text-shadow: 0 0 44px color-mix(in oklab, var(--tone) 22%, transparent);
}
</style>

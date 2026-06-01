<script setup lang="ts">
defineProps<{
  isActive: boolean
  isRunning: boolean
  isPaused: boolean
  isFocus: boolean
}>()

const emit = defineEmits<{
  start: []
  pause: []
  resume: []
  abandon: []
  capture: []
}>()
</script>

<template>
  <div class="controls">
    <button v-if="!isActive" class="iron iron--start" @click="emit('start')">
      <span class="iron__glyph" aria-hidden="true">→</span> iniciar foco
    </button>
    <button v-if="isRunning" class="iron" @click="emit('pause')">pausar</button>
    <button v-if="isPaused" class="iron" @click="emit('resume')">retomar</button>
    <button v-if="isActive" class="iron iron--quiet" @click="emit('abandon')">encerrar</button>
    <button
      v-if="isActive && isFocus"
      class="iron iron--quiet"
      title="Capturar distração (tecla C)"
      @click="emit('capture')"
    >
      anotar distração
    </button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--u);
  align-items: center;
}

/* Ferragem de estufa: borda fina em cobre, vidro translúcido, canto vivo biselado */
.iron {
  font-family: var(--font-label);
  letter-spacing: 0.12em;
  text-transform: lowercase;
  color: var(--paper);
  padding: calc(var(--u) * 1.25) calc(var(--u) * 2);
  border: 1px solid color-mix(in oklab, var(--copper) 65%, transparent);
  background: color-mix(in oklab, var(--glass-mid) 55%, transparent);
  backdrop-filter: blur(6px);
  clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
  transition:
    border-color 0.3s ease,
    color 0.3s ease,
    transform 0.2s ease;
}
.iron:hover {
  border-color: var(--brass);
  color: var(--brass);
  transform: translateY(-1px);
}

/* Iniciar: única presença forte no repouso (reduzir atrito de início é o objetivo nº 1) */
.iron--start {
  font-family: var(--font-display);
  font-style: italic;
  font-variation-settings: 'opsz' 40, 'wght' 500;
  text-transform: none;
  letter-spacing: 0;
  font-size: 1.35rem;
  padding: calc(var(--u) * 2) calc(var(--u) * 3.5);
  color: var(--glass-deep);
  background: linear-gradient(155deg, var(--brass), var(--copper));
  border-color: var(--brass);
}
.iron--start:hover {
  color: var(--glass-deep);
  transform: translateY(-2px);
}
.iron__glyph {
  font-family: var(--font-label);
  margin-right: 0.4em;
}
.iron--quiet {
  color: var(--copper-verdet);
  border-color: color-mix(in oklab, var(--copper-verdet) 35%, transparent);
}
</style>

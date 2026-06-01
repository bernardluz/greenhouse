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
    <button v-if="!isActive" class="btn btn--primary" @click="emit('start')">▶ Iniciar foco</button>
    <button v-if="isRunning" class="btn btn--primary" @click="emit('pause')">⏸ Pausar</button>
    <button v-if="isPaused" class="btn btn--primary" @click="emit('resume')">▶ Retomar</button>
    <button v-if="isActive" class="btn btn--ghost" @click="emit('abandon')">⏹ Encerrar</button>
    <button
      v-if="isActive && isFocus"
      class="btn btn--accent"
      title="Capturar distração (tecla C)"
      @click="emit('capture')"
    >
      ✎ Capturar distração
    </button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.btn {
  padding: 0.8rem 1.4rem;
  border-radius: 999px;
  font-weight: 600;
  transition:
    transform 0.15s ease,
    background 0.2s ease,
    color 0.2s ease;
}
.btn:hover {
  transform: translateY(-2px);
}
.btn:active {
  transform: translateY(0);
}
.btn--primary {
  background: var(--focus);
  color: oklch(20% 0.03 150);
}
.btn--ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
}
.btn--ghost:hover {
  color: var(--text);
  border-color: var(--muted);
}
.btn--accent {
  background: var(--surface-2);
  color: var(--text);
}
.btn--accent:hover {
  background: oklch(38% 0.04 155);
}
</style>

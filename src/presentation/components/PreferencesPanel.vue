<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  blocksUntilLongBreak: number
}>()

const emit = defineEmits<{
  save: [
    value: {
      focusMinutes: number
      shortBreakMinutes: number
      longBreakMinutes: number
      blocksUntilLongBreak: number
    },
  ]
}>()

const form = reactive({
  focusMinutes: props.focusMinutes,
  shortBreakMinutes: props.shortBreakMinutes,
  longBreakMinutes: props.longBreakMinutes,
  blocksUntilLongBreak: props.blocksUntilLongBreak,
})

watch(props, () => {
  form.focusMinutes = props.focusMinutes
  form.shortBreakMinutes = props.shortBreakMinutes
  form.longBreakMinutes = props.longBreakMinutes
  form.blocksUntilLongBreak = props.blocksUntilLongBreak
})

function save(): void {
  emit('save', { ...form })
}
</script>

<template>
  <details class="valves">
    <summary class="valves__summary">
      <span aria-hidden="true">⚘</span> ajustar a estufa
    </summary>
    <form class="valves__grid" @submit.prevent="save">
      <label class="valve">
        <span class="valve__name">foco</span>
        <span class="valve__field">
          <input v-model.number="form.focusMinutes" type="number" min="1" step="1" />
          <span class="valve__unit">min</span>
        </span>
      </label>
      <label class="valve">
        <span class="valve__name">pausa curta</span>
        <span class="valve__field">
          <input v-model.number="form.shortBreakMinutes" type="number" min="1" step="1" />
          <span class="valve__unit">min</span>
        </span>
      </label>
      <label class="valve">
        <span class="valve__name">pausa longa</span>
        <span class="valve__field">
          <input v-model.number="form.longBreakMinutes" type="number" min="1" step="1" />
          <span class="valve__unit">min</span>
        </span>
      </label>
      <label class="valve">
        <span class="valve__name">ciclo</span>
        <span class="valve__field">
          <input v-model.number="form.blocksUntilLongBreak" type="number" min="1" step="1" />
          <span class="valve__unit">blocos</span>
        </span>
      </label>
      <button class="valves__save" type="submit">registrar</button>
    </form>
  </details>
</template>

<style scoped>
.valves {
  font-family: var(--font-label);
  max-width: 460px;
  width: 100%;
  border-top: 1px solid color-mix(in oklab, var(--copper) 30%, transparent);
  padding-top: var(--u);
}
.valves__summary {
  cursor: pointer;
  list-style: none;
  text-transform: lowercase;
  letter-spacing: 0.16em;
  color: var(--copper-verdet);
  padding: calc(var(--u) * 0.75) 0;
  user-select: none;
}
.valves__summary::-webkit-details-marker {
  display: none;
}
.valves__summary:hover {
  color: var(--brass);
}
.valves__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: calc(var(--u) * 1.5);
  padding-top: var(--u);
}
.valve {
  display: grid;
  gap: 4px;
}
.valve__name {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--ink-faded);
  text-transform: lowercase;
}
/* Manípulo de registro de irrigação: anel de latão em vez de slider genérico */
.valve__field {
  display: flex;
  align-items: center;
  gap: var(--u);
  border: 1px solid color-mix(in oklab, var(--copper) 45%, transparent);
  border-left: 3px solid var(--brass);
  background: color-mix(in oklab, var(--glass-mid) 45%, transparent);
  padding: calc(var(--u) * 0.6) var(--u);
}
.valve__field input {
  width: 100%;
  background: none;
  border: none;
  color: var(--paper);
  font-family: var(--font-display);
  font-variation-settings: 'opsz' 24, 'wght' 520;
  font-size: 1.25rem;
}
.valve__field input:focus {
  outline: none;
}
.valve__unit {
  font-size: 0.68rem;
  color: var(--copper-verdet);
}
.valves__save {
  grid-column: 1 / -1;
  padding: calc(var(--u) * 1.1);
  text-transform: lowercase;
  letter-spacing: 0.16em;
  color: var(--glass-deep);
  background: var(--brass);
  border: 1px solid var(--brass);
  clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
}
.valves__save:hover {
  background: var(--copper);
  border-color: var(--copper);
}
</style>

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
  <details class="prefs">
    <summary>⚙ Configurações</summary>
    <form class="prefs__grid" @submit.prevent="save">
      <label>
        Foco (min)
        <input v-model.number="form.focusMinutes" type="number" min="1" step="1" />
      </label>
      <label>
        Pausa curta (min)
        <input v-model.number="form.shortBreakMinutes" type="number" min="1" step="1" />
      </label>
      <label>
        Pausa longa (min)
        <input v-model.number="form.longBreakMinutes" type="number" min="1" step="1" />
      </label>
      <label>
        Blocos até a pausa longa
        <input v-model.number="form.blocksUntilLongBreak" type="number" min="1" step="1" />
      </label>
      <button class="prefs__save" type="submit">Salvar</button>
    </form>
  </details>
</template>

<style scoped>
.prefs {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  max-width: 420px;
  width: 100%;
}
summary {
  cursor: pointer;
  padding: 0.5rem 0;
  color: var(--muted);
  font-weight: 600;
  user-select: none;
}
summary:hover {
  color: var(--text);
}
.prefs__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 0.75rem 0;
}
label {
  display: grid;
  gap: 0.3rem;
  font-size: 0.82rem;
  color: var(--muted);
}
input {
  padding: 0.5rem 0.6rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
}
.prefs__save {
  grid-column: 1 / -1;
  padding: 0.6rem;
  border-radius: 10px;
  background: var(--focus);
  color: oklch(20% 0.03 150);
  font-weight: 600;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import type { DistractionItem } from '~/domain/parking-lot/entities/DistractionItem'

defineProps<{
  items: DistractionItem[]
  openItems: DistractionItem[]
  captureEnabled: boolean
}>()

const emit = defineEmits<{
  capture: [text: string]
  resolve: [id: string]
  discard: [id: string]
}>()

const draft = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

function submit(): void {
  const text = draft.value.trim()
  if (!text) {
    return
  }
  emit('capture', text)
  draft.value = ''
}

function focusInput(): void {
  inputEl.value?.focus()
}

defineExpose({ focusInput })
</script>

<template>
  <aside class="parking">
    <header class="parking__head">
      <h2>Parking lot</h2>
      <span class="parking__count">{{ openItems.length }} aberta(s)</span>
    </header>

    <form class="parking__form" @submit.prevent="submit">
      <input
        ref="inputEl"
        v-model="draft"
        class="parking__input"
        type="text"
        :placeholder="captureEnabled ? 'Anote a distração e volte ao foco…' : 'Inicie um foco para capturar'"
        :disabled="!captureEnabled"
        aria-label="Capturar distração"
      />
      <button class="parking__add" type="submit" :disabled="!captureEnabled">Anotar</button>
    </form>

    <ul v-if="items.length" class="parking__list">
      <li
        v-for="item in items"
        :key="item.id"
        class="item"
        :class="`item--${item.status.toLowerCase()}`"
      >
        <span class="item__text">{{ item.text }}</span>
        <div v-if="item.isOpen" class="item__actions">
          <button title="Marcar como resolvida" @click="emit('resolve', item.id)">✓</button>
          <button title="Descartar" @click="emit('discard', item.id)">✕</button>
        </div>
        <span v-else class="item__badge">
          {{ item.status === 'Resolved' ? 'resolvida' : 'descartada' }}
        </span>
      </li>
    </ul>
    <p v-else class="parking__empty">Nenhuma distração capturada ainda.</p>
  </aside>
</template>

<style scoped>
.parking {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}
.parking__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.parking__head h2 {
  font-size: 1.1rem;
}
.parking__count {
  font-size: 0.8rem;
  color: var(--muted);
}
.parking__form {
  display: flex;
  gap: 0.5rem;
}
.parking__input {
  flex: 1;
  min-width: 0;
  padding: 0.7rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
}
.parking__input:disabled {
  opacity: 0.55;
}
.parking__add {
  padding: 0 1rem;
  border-radius: 12px;
  background: var(--focus);
  color: oklch(20% 0.03 150);
  font-weight: 600;
}
.parking__add:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.parking__list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
}
.item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  background: var(--surface-2);
  border-radius: 12px;
  transition: opacity 0.2s ease;
}
.item--resolved,
.item--discarded {
  opacity: 0.5;
}
.item--discarded .item__text {
  text-decoration: line-through;
}
.item__text {
  flex: 1;
  font-size: 0.92rem;
  word-break: break-word;
}
.item__actions {
  display: flex;
  gap: 0.3rem;
}
.item__actions button {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--bg);
  color: var(--muted);
  transition:
    color 0.2s ease,
    background 0.2s ease;
}
.item__actions button:hover {
  color: var(--text);
  background: oklch(38% 0.04 155);
}
.item__badge {
  font-size: 0.72rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.parking__empty {
  color: var(--muted);
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem 0;
}
</style>

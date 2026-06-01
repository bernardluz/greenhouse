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

/** Inclinação determinística por id — etiquetas pregadas à mão. */
function tilt(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0
  }
  const degrees = ((hash % 5) - 2) * 0.8
  return `rotate(${degrees}deg)`
}

function stamp(at: number): string {
  return new Date(at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <aside class="shelf">
    <header class="shelf__head">
      <span class="shelf__title">prateleira</span>
      <span class="shelf__count">{{ openItems.length }} em aberto</span>
    </header>

    <form class="shelf__capture" @submit.prevent="submit">
      <input
        ref="inputEl"
        v-model="draft"
        class="shelf__input"
        type="text"
        :placeholder="captureEnabled ? 'arquive o pensamento…' : 'inicie um foco para anotar'"
        :disabled="!captureEnabled"
        aria-label="Capturar distração"
      />
      <button class="shelf__file" type="submit" :disabled="!captureEnabled" aria-label="Arquivar">↵</button>
    </form>

    <ul v-if="items.length" class="specimens">
      <li
        v-for="item in items"
        :key="item.id"
        class="specimen"
        :class="`specimen--${item.status.toLowerCase()}`"
        :style="{ transform: tilt(item.id) }"
      >
        <span class="specimen__pin" aria-hidden="true" />
        <div class="specimen__body">
          <span class="specimen__text">{{ item.text }}</span>
          <span class="specimen__date">{{ stamp(item.capturedAt) }}</span>
        </div>
        <div v-if="item.isOpen" class="specimen__actions">
          <button title="Marcar como resolvida" @click="emit('resolve', item.id)">✓</button>
          <button title="Descartar" @click="emit('discard', item.id)">✕</button>
        </div>
      </li>
    </ul>
    <p v-else class="shelf__empty">nenhum espécime arquivado.</p>
  </aside>
</template>

<style scoped>
.shelf {
  font-family: var(--font-label);
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 1.5);
  padding-left: calc(var(--u) * 2.5);
  border-left: 1px solid color-mix(in oklab, var(--copper) 30%, transparent);
}
.shelf__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.shelf__title {
  letter-spacing: 0.24em;
  text-transform: lowercase;
  color: var(--copper-verdet);
}
.shelf__count {
  font-size: 0.72rem;
  color: var(--ink-faded);
}
.shelf__capture {
  display: flex;
  gap: var(--u);
}
.shelf__input {
  flex: 1;
  min-width: 0;
  background: color-mix(in oklab, var(--paper) 8%, transparent);
  border: 1px solid color-mix(in oklab, var(--copper-verdet) 30%, transparent);
  color: var(--paper);
  padding: calc(var(--u) * 0.9) var(--u);
  font-size: 0.85rem;
}
.shelf__input::placeholder {
  color: var(--ink-faded);
}
.shelf__file {
  border: 1px solid color-mix(in oklab, var(--copper) 50%, transparent);
  color: var(--brass);
  width: 38px;
}
.shelf__file:disabled {
  opacity: 0.35;
}
.specimens {
  list-style: none;
  padding: var(--u) 0 0;
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 1.5);
}

/* Etiqueta de herbário: papel de algodão real, tinta sépia, alfinete de cobre */
.specimen {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--u);
  background: var(--paper);
  color: var(--ink);
  padding: calc(var(--u) * 1.2) calc(var(--u) * 1.4);
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.28);
  transition:
    opacity 0.4s ease,
    box-shadow 0.3s ease;
}
.specimen__pin {
  position: absolute;
  top: -5px;
  left: 50%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--copper);
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--copper) 40%, transparent);
}
.specimen__body {
  flex: 1;
  display: grid;
  gap: 2px;
}
.specimen__text {
  font-size: 0.88rem;
  word-break: break-word;
}
.specimen__date {
  font-size: 0.68rem;
  color: var(--ink-faded);
  letter-spacing: 0.06em;
}
.specimen--resolved {
  opacity: 0.55;
}
.specimen--discarded {
  opacity: 0.4;
}
.specimen--discarded .specimen__text {
  text-decoration: line-through;
}
.specimen__actions {
  display: flex;
  gap: 4px;
}
.specimen__actions button {
  width: 24px;
  height: 24px;
  color: var(--ink-faded);
  border: 1px solid color-mix(in oklab, var(--ink) 20%, transparent);
}
.specimen__actions button:hover {
  color: var(--ink);
  border-color: var(--ink);
}
.shelf__empty {
  color: var(--ink-faded);
  font-size: 0.8rem;
}
</style>

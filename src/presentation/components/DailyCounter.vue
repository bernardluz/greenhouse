<script setup lang="ts">
defineProps<{
  completed: number
  abandoned: number
}>()
</script>

<template>
  <div class="ledger" aria-label="Histórico do dia">
    <span class="ledger__n">{{ completed }}</span> cultivados
    <span class="ledger__sep" aria-hidden="true">·</span>
    <span class="ledger__n">{{ abandoned }}</span> interrompidos
  </div>
</template>

<style scoped>
.ledger {
  font-family: var(--font-label);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: var(--copper-verdet);
  text-transform: lowercase;
}
.ledger__n {
  color: var(--paper);
  font-weight: 600;
}
.ledger__sep {
  margin: 0 0.55em;
  opacity: 0.5;
}
</style>

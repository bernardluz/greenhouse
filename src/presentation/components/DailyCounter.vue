<script setup lang="ts">
defineProps<{
  completed: number
  abandoned: number
}>()
</script>

<template>
  <div class="counter" aria-label="Histórico do dia">
    <div class="counter__item">
      <strong>{{ completed }}</strong>
      <span>completos</span>
    </div>
    <div class="counter__divider" aria-hidden="true" />
    <div class="counter__item">
      <strong>{{ abandoned }}</strong>
      <span>abandonados</span>
    </div>
  </div>
</template>

<style scoped>
.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
}
.counter__item {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}
.counter__item strong {
  font-size: 1.2rem;
  font-variant-numeric: tabular-nums;
}
.counter__item span {
  font-size: 0.78rem;
  color: var(--muted);
}
.counter__divider {
  width: 1px;
  height: 22px;
  background: var(--border);
}
</style>

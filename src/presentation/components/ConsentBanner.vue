<script setup lang="ts">
import { useAnalyticsConsent } from '~/presentation/composables/useAnalyticsConsent'

const { visible, grant, deny } = useAnalyticsConsent()
</script>

<template>
  <Transition name="slip">
    <aside v-if="visible" class="consent" role="dialog" aria-label="Consentimento de métricas">
      <p class="consent__text">
        Uma medição anônima (Google Analytics) me ajuda a entender o uso real e
        cultivar o app. O que você anota continua só no seu navegador.
      </p>
      <div class="consent__actions">
        <button class="consent__btn consent__btn--ok" @click="grant">permitir</button>
        <button class="consent__btn" @click="deny">recusar</button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
/* Etiqueta de herbário arquivada no canto, no tema Condensation */
.consent {
  position: fixed;
  bottom: calc(var(--u) * 3);
  right: calc(var(--u) * 3);
  max-width: 320px;
  z-index: 20;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-label);
  padding: calc(var(--u) * 2);
  border-left: 3px solid var(--brass);
  box-shadow: 3px 4px 0 rgba(0, 0, 0, 0.32);
}
.consent__text {
  font-size: 0.82rem;
  line-height: 1.55;
}
.consent__actions {
  display: flex;
  gap: var(--u);
  margin-top: calc(var(--u) * 1.5);
}
.consent__btn {
  flex: 1;
  padding: calc(var(--u) * 0.8);
  text-transform: lowercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  color: var(--ink-faded);
  border: 1px solid color-mix(in oklab, var(--ink) 30%, transparent);
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}
.consent__btn:hover {
  color: var(--ink);
  border-color: var(--ink);
}
.consent__btn--ok {
  background: var(--brass);
  border-color: var(--brass);
  color: var(--glass-deep);
}
.consent__btn--ok:hover {
  background: var(--copper);
  border-color: var(--copper);
  color: var(--paper);
}

/* a etiqueta desliza para a prateleira, como no gesto de captura */
.slip-enter-active,
.slip-leave-active {
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
}
.slip-enter-from,
.slip-leave-to {
  transform: translateY(14px);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .slip-enter-active,
  .slip-leave-active {
    transition: opacity 0.2s linear;
  }
  .slip-enter-from,
  .slip-leave-to {
    transform: none;
  }
}
</style>

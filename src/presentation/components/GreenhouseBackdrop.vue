<script setup lang="ts">
defineProps<{
  matterState: 'rest' | 'focus' | 'break'
  progress: number
}>()
</script>

<template>
  <div class="backdrop" :data-matter="matterState" aria-hidden="true">
    <!-- caixilhos de ferro da estufa -->
    <div class="mullions" />
    <!-- ornamento botânico: privilégio do repouso, recua no foco -->
    <svg class="flora" viewBox="0 0 200 600" preserveAspectRatio="xMaxYMid slice">
      <path
        d="M180 590 C 140 490 175 430 150 370 C 130 320 165 280 140 220 C 120 170 160 130 150 70"
        fill="none"
        stroke="var(--leaf)"
        stroke-width="1.2"
        opacity="0.55"
      />
      <path d="M150 370 C 110 360 95 330 90 310 C 120 315 142 340 150 370 Z" fill="var(--leaf)" opacity="0.35" />
      <path d="M140 220 C 175 215 192 240 196 260 C 168 256 150 242 140 220 Z" fill="var(--leaf)" opacity="0.3" />
      <path d="M150 70 C 120 62 108 38 106 18 C 134 24 150 46 150 70 Z" fill="var(--leaf-bright)" opacity="0.28" />
    </svg>
    <!-- névoa de condensação nas bordas, mais densa conforme o bloco avança -->
    <div class="fog" :style="{ '--p': progress }" />
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(
      120% 80% at 85% -10%,
      color-mix(in oklab, var(--copper) 18%, transparent),
      transparent 55%
    ),
    radial-gradient(
      90% 70% at 8% 112%,
      color-mix(in oklab, var(--leaf) 16%, transparent),
      transparent 60%
    ),
    var(--glass-dark);
  transition: background 1.2s ease;
}
.backdrop[data-matter='focus'] {
  background:
    radial-gradient(
      100% 80% at 85% -10%,
      color-mix(in oklab, var(--copper) 5%, transparent),
      transparent 55%
    ),
    var(--glass-deep);
}

.mullions {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent calc(12.5% - 1px),
    color-mix(in oklab, var(--glass-fog) 60%, transparent) calc(12.5% - 1px),
    color-mix(in oklab, var(--glass-fog) 60%, transparent) 12.5%
  );
  opacity: 0.5;
  transition:
    opacity 1.2s ease,
    filter 1.2s ease;
}

.flora {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 230px;
  opacity: 0.9;
  transition:
    opacity 1.2s ease,
    filter 1.2s ease;
}

/* No foco, ornamento é ruído: recolhe e desfoca */
.backdrop[data-matter='focus'] .flora {
  opacity: 0.06;
  filter: blur(7px);
}
.backdrop[data-matter='focus'] .mullions {
  opacity: 0.18;
  filter: blur(2px);
}
.backdrop[data-matter='break'] .flora {
  opacity: 0.45;
}

.fog {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: radial-gradient(
    120% 120% at 50% 50%,
    transparent 52%,
    color-mix(in oklab, var(--glass-fog) 72%, transparent) 100%
  );
  transition: opacity 1.2s ease;
}
.backdrop[data-matter='focus'] .fog {
  opacity: calc(0.25 + var(--p, 0) * 0.6);
}

/* prefers-reduced-motion: condensação vira corte de opacidade, sem blur animado */
@media (prefers-reduced-motion: reduce) {
  .backdrop,
  .mullions,
  .flora,
  .fog {
    transition:
      opacity 0.25s linear,
      background 0.25s linear;
  }
  .backdrop[data-matter='focus'] .flora,
  .backdrop[data-matter='focus'] .mullions {
    filter: none;
  }
}
</style>

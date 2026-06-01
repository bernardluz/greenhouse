<script setup lang="ts">
// Componente raiz: monta o roteador e define os tokens da direção "Condensation"
// (estufa vitoriana ao entardecer) — paleta, tipografia serif/mono e reset.
</script>

<template>
  <NuxtPage />
</template>

<style>
:root {
  /* Base: vidro de estufa ao entardecer */
  --glass-deep: #0e1a14;
  --glass-dark: #14241b;
  --glass-mid: #1e3328;
  --glass-fog: #2a4538;

  /* Folhagem: verdes vivos, com parcimônia */
  --leaf: #4a7c59;
  --leaf-bright: #6fa67c;

  /* Cobre oxidado: único acento quente */
  --copper: #b06a3e;
  --copper-verdet: #7fa68b;
  --brass: #c9a24b;

  /* Papel e tinta: herbário */
  --paper: #e8e2d0;
  --ink: #2b2a24;
  --ink-faded: #6b6452;

  /* Sinalização funcional */
  --signal-rest: #7fa68b;
  --signal-focus: #c9a24b;

  /* Tipografia — sem nenhuma sans de sistema */
  --font-display: 'Fraunces Variable', 'Spectral', Georgia, serif;
  --font-body: 'Newsreader Variable', 'Source Serif 4', Georgia, serif;
  --font-label: 'Spline Sans Mono Variable', 'IBM Plex Mono', monospace;

  /* Unidade base 8px (uso deliberadamente não-uniforme) */
  --u: 8px;

  color-scheme: dark;
}

* {
  box-sizing: border-box;
  margin: 0;
}

html,
body,
#__nuxt {
  height: 100%;
}

body {
  font-family: var(--font-body);
  background: var(--glass-dark);
  color: var(--paper);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  line-height: 1.55;
}

button {
  font: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

input {
  font: inherit;
  color: inherit;
}

/* Foco visível em latão, canto vivo — nada de raio universal */
:focus-visible {
  outline: 2px solid var(--brass);
  outline-offset: 3px;
}

::selection {
  background: var(--brass);
  color: var(--glass-deep);
}
</style>

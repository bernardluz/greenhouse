<script setup lang="ts">
// Componente raiz do Nuxt: monta o roteador e define os tokens/estilos globais.
</script>

<template>
  <NuxtPage />
</template>

<style>
:root {
  --bg: oklch(22% 0.02 150);
  --surface: oklch(27% 0.03 155);
  --surface-2: oklch(32% 0.035 155);
  --border: oklch(40% 0.03 155 / 0.5);
  --text: oklch(96% 0.01 150);
  --muted: oklch(72% 0.02 150);
  --focus: oklch(74% 0.17 150);
  --break: oklch(76% 0.12 235);
  --danger: oklch(70% 0.18 25);
  --radius: 18px;
  --space: clamp(1rem, 0.6rem + 1.5vw, 2rem);
  --font: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, 'SFMono-Regular', 'Cascadia Code', monospace;
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
  font-family: var(--font);
  background:
    radial-gradient(1100px 560px at 82% -12%, oklch(32% 0.07 162 / 0.55), transparent 62%),
    var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  line-height: 1.5;
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

:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
  border-radius: 8px;
}
</style>

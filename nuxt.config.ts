// Greenhouse — configuração Nuxt.
// App 100% client-side: sem SSR, sem backend, sem requisições de rede em runtime.
// O Nuxt só "enxerga" a camada de apresentação (src/presentation/*).
// As camadas internas (domain/application/infrastructure) são TypeScript puro,
// importadas via alias `~/<camada>`, o que reforça a separação DDD.
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src',
  compatibilityDate: '2025-06-01',
  devtools: { enabled: true },

  // Fontes self-hosted (empacotadas no bundle) — zero requisição de rede em runtime.
  css: [
    '@fontsource-variable/fraunces/opsz.css',
    '@fontsource-variable/newsreader/index.css',
    '@fontsource-variable/spline-sans-mono/index.css',
  ],

  modules: ['nuxt-gtag'],

  // Google Analytics 4 em modo manual: o gtag.js só carrega após o
  // consentimento do usuário (Consent Mode) — nenhuma rede até o aceite.
  gtag: {
    id: 'G-FX3NXLW0C8',
    initMode: 'manual',
  },

  dir: {
    pages: 'presentation/pages',
  },

  components: [
    { path: '~/presentation/components', pathPrefix: false },
  ],

  imports: {
    dirs: ['presentation/composables'],
  },

  app: {
    head: {
      title: 'Greenhouse — Foco para TDAH',
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Timer de foco baseado em Pomodoro, adaptado para o cérebro com TDAH.',
        },
      ],
    },
  },
})

// Tipos auxiliares para o nuxt-gtag conviver com o tsconfig standalone do
// projeto (que não inclui os tipos gerados em .nuxt). Em runtime o Nuxt resolve
// o auto-import de `useGtag` e a chave de configuração `gtag`; aqui apenas
// declaramos o suficiente para o typecheck.

declare module '@nuxt/schema' {
  interface NuxtConfig {
    gtag?: {
      id?: string
      initMode?: 'auto' | 'manual'
      [key: string]: unknown
    }
  }
}

declare global {
  function useGtag(): {
    gtag: (...args: unknown[]) => void
    initialize: (id?: string) => void
    disableAnalytics: (id?: string) => void
    enableAnalytics: (id?: string) => void
  }
}

export {}

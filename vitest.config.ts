import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Testes das camadas internas (domínio, aplicação, infraestrutura) rodam sem Nuxt.
// O alias `~` espelha o srcDir do Nuxt para que os imports `~/...` funcionem nos testes.
export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/domain/**',
        'src/application/**',
        'src/infrastructure/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})

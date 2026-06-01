import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'greenhouse:analytics-consent'

/**
 * Consentimento de métricas (Google Analytics). Com `initMode: 'manual'`, o
 * gtag.js só é carregado após o aceite — nenhuma requisição de rede até lá.
 * A escolha persiste no localStorage; o banner só reaparece enquanto não houver
 * decisão registrada.
 */
export function useAnalyticsConsent() {
  const visible = ref(false)

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'granted') {
      useGtag().initialize()
    } else if (stored !== 'denied') {
      visible.value = true
    }
  })

  function grant(): void {
    localStorage.setItem(STORAGE_KEY, 'granted')
    useGtag().initialize()
    visible.value = false
  }

  function deny(): void {
    localStorage.setItem(STORAGE_KEY, 'denied')
    visible.value = false
  }

  return { visible, grant, deny }
}

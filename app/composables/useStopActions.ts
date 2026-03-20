import type { Stop } from '~~/shared/types'

export function useStopActions(stop: Ref<Stop | undefined>) {
  const { t } = useI18n()

  async function shareStop(): Promise<void> {
    if (!stop.value) return
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: stop.value.name,
          text: t(`stopDesc.${stop.value.id}`),
          url,
        })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  function openGoogleMaps(): void {
    if (!stop.value) return
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.value.lat},${stop.value.lng}&travelmode=walking`
    window.open(url, '_blank')
  }

  return {
    shareStop,
    openGoogleMaps,
  }
}

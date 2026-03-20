import { stops } from '~/data/stops'
import type { Stop } from '~~/shared/types'

/** Error types for GPS — allows UI to show specific guidance */
export type GpsErrorType =
  | 'geolocation_unavailable' // browser doesn't support geolocation
  | 'permission_denied' // user denied OR OS-level location off for browser
  | 'position_unavailable' // GPS/network couldn't determine position
  | 'timeout' // took too long

function classifyError(err: GeolocationPositionError): GpsErrorType {
  switch (err.code) {
    case 1:
      return 'permission_denied'
    case 2:
      return 'position_unavailable'
    case 3:
      return 'timeout'
    default:
      return 'position_unavailable'
  }
}

export function useNearestStop() {
  const userPosition = ref<{ lat: number; lng: number } | null>(null)
  const gpsGranted = ref(false)
  const gpsLoading = ref(false)
  const gpsError = ref<GpsErrorType | null>(null)

  // VueUse — SSR-safe (auto-imported via @vueuse/nuxt)
  const permissionState = usePermission('geolocation')
  const isSupported = useSupported(() => navigator && 'geolocation' in navigator)

  function findNearestStop(lat: number, lng: number): Stop {
    let nearest: Stop = stops[0]!
    let minDist = Infinity
    for (const stop of stops) {
      const dist = haversineDistance(lat, lng, stop.lat, stop.lng)
      if (dist < minDist) {
        minDist = dist
        nearest = stop
      }
    }
    return nearest
  }

  function distanceToStop(stop: Stop): number | null {
    if (!userPosition.value) return null
    return Math.round(
      haversineDistance(userPosition.value.lat, userPosition.value.lng, stop.lat, stop.lng),
    )
  }

  /**
   * Pre-check: is geolocation already denied at OS or browser level?
   * On iOS, permissions.query may return 'prompt' even when denied — so this
   * is only a hint, not authoritative. We still attempt getCurrentPosition.
   */
  async function isAlreadyDenied(): Promise<boolean> {
    try {
      if (typeof navigator === 'undefined' || !navigator.permissions) return false
      const result = await navigator.permissions.query({ name: 'geolocation' })
      return result.state === 'denied'
    } catch {
      // permissions.query not supported (older browsers) — not denied
      return false
    }
  }

  async function requestGps(): Promise<{ lat: number; lng: number } | null> {
    if (!isSupported.value) {
      gpsError.value = 'geolocation_unavailable'
      return null
    }

    gpsLoading.value = true
    gpsError.value = null

    // Pre-check: if already denied, fail fast with guidance
    const denied = await isAlreadyDenied()
    if (denied) {
      gpsError.value = 'permission_denied'
      gpsGranted.value = false
      gpsLoading.value = false
      return null
    }

    try {
      // Strategy: low accuracy first (fast network, 10s), then high accuracy (GPS, 25s)
      // On iOS Chrome where OS denies — first call fails instantly with code 1
      let position: GeolocationPosition
      try {
        position = await getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 120000,
        })
      } catch (lowAccErr) {
        const le = lowAccErr as GeolocationPositionError
        // Permission denied — no point retrying with high accuracy
        if (le.code === 1) throw lowAccErr
        // Timeout/unavailable — try GPS hardware with longer timeout
        position = await getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 25000,
          maximumAge: 60000,
        })
      }

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      userPosition.value = coords
      gpsGranted.value = true
      gpsLoading.value = false
      return coords
    } catch (err) {
      gpsError.value = classifyError(err as GeolocationPositionError)
      gpsGranted.value = false
      gpsLoading.value = false
      return null
    }
  }

  const nearestStop = computed(() => {
    if (!userPosition.value) return stops[0]
    return findNearestStop(userPosition.value.lat, userPosition.value.lng)
  })

  return {
    userPosition,
    gpsGranted,
    gpsLoading,
    gpsError,
    nearestStop,
    findNearestStop,
    distanceToStop,
    requestGps,
    permissionState,
    isSupported,
  }
}

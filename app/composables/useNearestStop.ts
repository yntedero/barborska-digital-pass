import { stops } from '~/data/stops'
import type { Stop } from '~~/shared/types'

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a
    = Math.sin(dLat / 2) ** 2
      + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useNearestStop() {
  const userPosition = ref<{ lat: number, lng: number } | null>(null)
  const gpsGranted = ref(false)
  const gpsLoading = ref(false)
  const gpsError = ref<string | null>(null)

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
      haversineDistance(userPosition.value.lat, userPosition.value.lng, stop.lat, stop.lng)
    )
  }

  async function requestGps(): Promise<{ lat: number, lng: number } | null> {
    if (!navigator.geolocation) {
      gpsError.value = 'geolocation_unavailable'
      return null
    }

    gpsLoading.value = true
    gpsError.value = null

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          userPosition.value = coords
          gpsGranted.value = true
          gpsLoading.value = false
          resolve(coords)
        },
        (err) => {
          gpsError.value = err.code === 1 ? 'permission_denied' : 'position_unavailable'
          gpsGranted.value = false
          gpsLoading.value = false
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    })
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
    requestGps
  }
}

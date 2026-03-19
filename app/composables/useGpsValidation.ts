const VALIDATION_RADIUS_METERS = 50

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useGpsValidation() {
  const isLocating = ref(false)
  const error = ref<string | null>(null)
  const lastDistance = ref<number | null>(null)

  async function validatePosition(
    targetLat: number,
    targetLng: number,
  ): Promise<{ validated: boolean; distance: number | null }> {
    isLocating.value = true
    error.value = null
    lastDistance.value = null

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      error.value = 'geolocation_unavailable'
      isLocating.value = false
      return { validated: false, distance: null }
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 25000,
          maximumAge: 10000,
        })
      })

      const dist = haversineDistance(
        position.coords.latitude,
        position.coords.longitude,
        targetLat,
        targetLng,
      )
      lastDistance.value = Math.round(dist)
      isLocating.value = false
      return {
        validated: dist <= VALIDATION_RADIUS_METERS,
        distance: Math.round(dist),
      }
    } catch (err) {
      const geoErr = err as GeolocationPositionError
      error.value = geoErr.code === 1 ? 'permission_denied' : 'position_unavailable'
      isLocating.value = false
      return { validated: false, distance: null }
    }
  }

  return {
    isLocating,
    error,
    lastDistance,
    validatePosition,
    VALIDATION_RADIUS_METERS,
  }
}

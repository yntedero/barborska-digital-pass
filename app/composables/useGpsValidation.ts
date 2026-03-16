const VALIDATION_RADIUS_METERS = 200

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useGpsValidation() {
  const isLocating = ref(false)
  const error = ref<string | null>(null)
  const lastDistance = ref<number | null>(null)

  async function validatePosition(
    targetLat: number,
    targetLng: number
  ): Promise<{ validated: boolean; distance: number | null }> {
    isLocating.value = true
    error.value = null
    lastDistance.value = null

    if (!navigator.geolocation) {
      error.value = 'geolocation_unavailable'
      isLocating.value = false
      return { validated: false, distance: null }
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const dist = haversineDistance(
            position.coords.latitude,
            position.coords.longitude,
            targetLat,
            targetLng
          )
          lastDistance.value = Math.round(dist)
          isLocating.value = false
          resolve({
            validated: dist <= VALIDATION_RADIUS_METERS,
            distance: Math.round(dist)
          })
        },
        (err) => {
          error.value = err.code === 1 ? 'permission_denied' : 'position_unavailable'
          isLocating.value = false
          resolve({ validated: false, distance: null })
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  return {
    isLocating,
    error,
    lastDistance,
    validatePosition,
    VALIDATION_RADIUS_METERS
  }
}

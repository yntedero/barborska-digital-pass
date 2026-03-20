import { defineStore, skipHydrate } from 'pinia'
import type { PassportEntry, StampState } from '~~/shared/types'
import { STAMPS_FOR_CERTIFICATE, TOTAL_STOPS } from '~/data/stages'

export const usePassportStore = defineStore('passport', () => {
  // skipHydrate prevents Pinia SSR hydration from overwriting localStorage values
  const stamps = skipHydrate(
    useLocalStorage<Record<number, PassportEntry>>('barborska-passport', {}),
  )
  const gdprConsent = skipHydrate(useLocalStorage<boolean | null>('barborska-gdpr', null))
  const gpsGranted = skipHydrate(useLocalStorage<boolean | null>('barborska-gps', null))
  const profileAge = skipHydrate(useLocalStorage<number | null>('barborska-profile-age', null))
  const profileCountry = skipHydrate(
    useLocalStorage<string | null>('barborska-profile-country', null),
  )
  const profileCompleted = skipHydrate(useLocalStorage<boolean>('barborska-profile-done', false))

  function getState(stopId: number): StampState {
    return stamps.value[stopId]?.state ?? null
  }

  function setState(stopId: number, state: StampState) {
    stamps.value = {
      ...stamps.value,
      [stopId]: { state, timestamp: new Date().toISOString() },
    }
  }

  function markViewed(stopId: number) {
    if (!getState(stopId)) {
      setState(stopId, 'viewed')
    }
  }

  function checkIn(stopId: number, gpsValidated: boolean) {
    setState(stopId, gpsValidated ? 'validated' : 'partial')
  }

  const stampCounts = computed(() => {
    let visitedCount = 0
    let validatedCount = 0
    for (const entry of Object.values(stamps.value)) {
      if (entry.state === 'validated') {
        visitedCount++
        validatedCount++
      } else if (entry.state === 'partial') {
        visitedCount++
      }
    }
    return { visited: visitedCount, validated: validatedCount }
  })

  const visited = computed(() => stampCounts.value.visited)
  const validated = computed(() => stampCounts.value.validated)

  const progress = computed(() => Math.round((visited.value / TOTAL_STOPS) * 100))

  const eligible = computed(() => validated.value >= STAMPS_FOR_CERTIFICATE)

  return {
    stamps,
    gdprConsent,
    gpsGranted,
    profileAge,
    profileCountry,
    profileCompleted,
    getState,
    setState,
    markViewed,
    checkIn,
    visited,
    validated,
    progress,
    eligible,
    STAMPS_FOR_CERTIFICATE,
    TOTAL_STOPS,
  }
})

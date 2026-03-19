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

  const visited = computed(
    () =>
      Object.values(stamps.value).filter((e) => e.state === 'partial' || e.state === 'validated')
        .length,
  )

  const validated = computed(
    () => Object.values(stamps.value).filter((e) => e.state === 'validated').length,
  )

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

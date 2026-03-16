<script setup lang="ts">
const props = defineProps<{
  stopId: number
  lat: number
  lng: number
}>()

const { t } = useI18n()
const passport = usePassportStore()
const { isLocating, error, lastDistance, validatePosition } = useGpsValidation()

const checkInResult = ref<'validated' | 'partial' | null>(null)
const showAnimation = ref(false)
const errorMessage = ref<string | null>(null)

const currentState = computed(() => passport.getState(props.stopId))
const alreadyCheckedIn = computed(() =>
  currentState.value === 'validated' || currentState.value === 'partial'
)

async function handleCheckIn() {
  if (alreadyCheckedIn.value) return
  errorMessage.value = null

  const result = await validatePosition(props.lat, props.lng)

  if (error.value) {
    // GPS failed — do partial check-in
    passport.checkIn(props.stopId, false)
    checkInResult.value = 'partial'
    errorMessage.value = error.value === 'permission_denied'
      ? t('stop.gpsPermissionDenied')
      : t('stop.gpsUnavailable')
  } else {
    passport.checkIn(props.stopId, result.validated)
    checkInResult.value = result.validated ? 'validated' : 'partial'
  }

  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(checkInResult.value === 'validated' ? [50, 30, 100] : [50])
  }

  showAnimation.value = true
  setTimeout(() => {
    showAnimation.value = false
  }, 1800)
}

const buttonLabel = computed(() => {
  if (isLocating.value) return t('stop.checking')
  if (currentState.value === 'validated') return t('stop.validated')
  if (currentState.value === 'partial') return t('stop.partial')
  return t('stop.checkIn')
})

const buttonIcon = computed(() => {
  if (isLocating.value) return 'i-lucide-loader-2'
  if (currentState.value === 'validated') return 'i-lucide-check-circle-2'
  if (currentState.value === 'partial') return 'i-lucide-map-pin-check'
  return 'i-lucide-map-pin-plus'
})
</script>

<template>
  <div>
    <button
      class="w-full relative overflow-hidden rounded-xl px-6 py-4 font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 min-h-[56px]"
      :class="[
        showAnimation && checkInResult === 'validated' ? 'check-in-success' : '',
        showAnimation && checkInResult === 'partial' ? 'check-in-partial' : '',
        currentState === 'validated'
          ? 'bg-(--color-trail-500) text-white'
          : currentState === 'partial'
            ? 'bg-amber-500 text-white'
            : 'bg-gradient-to-r from-(--color-gold-400) to-(--color-gold-600) text-white shadow-lg shadow-(--color-gold-500)/25 hover:shadow-(--color-gold-500)/40 active:scale-[0.98]'
      ]"
      :disabled="isLocating || alreadyCheckedIn"
      :aria-busy="isLocating"
      :aria-label="buttonLabel"
      @click="handleCheckIn"
    >
      <!-- Pulse background for loading -->
      <div
        v-if="isLocating"
        class="absolute inset-0 bg-white/10 animate-pulse"
        aria-hidden="true"
      />

      <UIcon
        :name="buttonIcon"
        class="size-6 relative"
        :class="isLocating ? 'animate-spin' : ''"
      />
      <span class="relative">{{ buttonLabel }}</span>

      <!-- Distance badge -->
      <span
        v-if="lastDistance !== null && checkInResult"
        class="absolute top-2 right-3 text-xs font-normal opacity-80"
      >
        {{ lastDistance }} m
      </span>
    </button>

    <!-- Error message -->
    <p
      v-if="errorMessage && !alreadyCheckedIn"
      class="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1"
      role="alert"
    >
      <UIcon
        name="i-lucide-info"
        class="size-3 flex-shrink-0"
      />
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
@keyframes check-in-success {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74, 124, 58, 0.6); }
  30% { transform: scale(1.04); }
  60% { box-shadow: 0 0 0 16px rgba(74, 124, 58, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(74, 124, 58, 0); }
}

@keyframes check-in-partial {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.5); }
  30% { transform: scale(1.03); }
  60% { box-shadow: 0 0 0 12px rgba(245, 158, 11, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}

.check-in-success {
  animation: check-in-success 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.check-in-partial {
  animation: check-in-partial 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

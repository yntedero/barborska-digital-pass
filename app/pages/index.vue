<template>
  <!-- Loading -->
  <div
    v-if="flowState === 'loading'"
    class="flex items-center justify-center min-h-[60vh]"
  >
    <div class="text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="size-8 text-(--color-gold-500) animate-spin mx-auto mb-2"
      />
      <p class="text-sm text-(--color-sand-400)">
        {{ t('common.loading') }}
      </p>
    </div>
  </div>

  <!-- GPS Permission Request -->
  <VisitorGpsPermissionDialog
    v-else-if="flowState === 'gps-request'"
    mode="request"
    @enable="handleEnableGps"
    @skip="handleSkipGps"
  />

  <!-- GPS Limited Mode -->
  <VisitorGpsPermissionDialog
    v-else-if="flowState === 'gps-limited'"
    mode="limited"
    @enable="handleRetryGps"
    @skip="handleLimitedContinue"
  />

  <!-- GDPR Consent -->
  <div
    v-else-if="flowState === 'gdpr'"
    class="min-h-dvh bg-(--color-sand-50) dark:bg-(--color-sand-950) flex items-center justify-center"
  >
    <div
      class="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        class="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-(--color-gold-200)/20 dark:bg-(--color-gold-900)/10 blur-3xl"
      />
      <div
        class="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-(--color-gold-300)/15 dark:bg-(--color-gold-800)/10 blur-3xl"
      />
    </div>
    <VisitorGdprConsent
      @accept="handleGdprAccept"
      @decline="handleGdprDecline"
    />
  </div>

  <!-- Main content: nearest stop -->
  <div
    v-else-if="flowState === 'ready' && stop"
    class="pb-24"
  >
    <!-- Limited mode banner -->
    <div
      v-if="!passport.gpsGranted"
      class="px-4 pt-3"
    >
      <VisitorLimitedModeBanner @enable-gps="handleRetryGps" />
    </div>

    <!-- Map -->
    <div class="px-4 mt-3">
      <VisitorStopMap
        :stop="stop"
        :show-nearby="true"
        :user-position="userPosition"
        @stop-click="(id: number) => navigateTo(localePath(`/stop/${id}`))"
      />
    </div>

    <!-- Stop navigation arrows -->
    <VisitorStopNav
      :current-stop-id="stop.id"
      :current-stop-name="stop.name"
    />

    <!-- Content -->
    <div class="px-4 mt-2 space-y-5">
      <!-- Badge + Name card -->
      <div
        class="bg-white dark:bg-(--color-sand-800) rounded-xl shadow-lg border border-(--color-sand-200) dark:border-(--color-sand-700) p-5 transition-all duration-500"
        :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <!-- Stage badge -->
        <div class="flex items-center gap-2 mb-2">
          <div
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-(--color-gold-50) dark:bg-(--color-gold-950) border border-(--color-gold-200)/50 dark:border-(--color-gold-800)/50"
          >
            <UIcon
              name="i-lucide-route"
              class="size-3 text-(--color-gold-500)"
            />
            <span
              class="text-xs font-semibold text-(--color-gold-600) dark:text-(--color-gold-400)"
            >
              {{ t('stop.stage') }} {{ stop.stage }}
            </span>
          </div>
          <span class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
            {{ t('stop.stopLabel') }} {{ stop.name }} {{ t('stop.of') }} 29
          </span>

          <!-- Stamp state badge -->
          <UBadge
            v-if="stampState === 'validated'"
            color="success"
            variant="subtle"
            size="sm"
            class="ml-auto"
          >
            <UIcon
              name="i-lucide-check-circle-2"
              class="size-3 mr-1"
            />
            {{ t('stop.validated') }}
          </UBadge>
          <UBadge
            v-else-if="stampState === 'partial'"
            color="warning"
            variant="subtle"
            size="sm"
            class="ml-auto"
          >
            <UIcon
              name="i-lucide-map-pin-check"
              class="size-3 mr-1"
            />
            {{ t('stop.partial') }}
          </UBadge>
        </div>

        <!-- Stop name -->
        <h1
          class="font-heading text-2xl md:text-3xl font-bold text-(--color-sand-800) dark:text-(--color-sand-50) mb-2 leading-tight"
        >
          {{ stop.name }}
        </h1>

        <!-- Stage route -->
        <p
          v-if="stage"
          class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500) flex items-center gap-1"
        >
          <UIcon
            name="i-lucide-route"
            class="size-3"
          />
          {{ stage.from }} → {{ stage.to }} · {{ stage.distance }} km
        </p>

        <!-- Description -->
        <p
          class="mt-3 text-sm text-(--color-sand-600) dark:text-(--color-sand-300) leading-relaxed"
        >
          {{ stop.desc }}
        </p>
      </div>

      <!-- Check-in button -->
      <div
        class="transition-all duration-500 delay-100"
        :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <VisitorCheckInButton
          :stop-id="stop.id"
          :lat="stop.lat"
          :lng="stop.lng"
        />
      </div>

      <!-- Route info card (next stop + Google Maps) -->
      <div
        class="transition-all duration-500 delay-150"
        :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <VisitorNextStopCard
          :current-stop-id="stop.id"
          :user-position="userPosition"
        />
      </div>

      <!-- Fact cards -->
      <div
        class="transition-all duration-500 delay-200"
        :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <VisitorFactCards :stop-id="stop.id" />
      </div>

      <!-- Facilities -->
      <div
        class="transition-all duration-500 delay-300"
        :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <VisitorFacilityGrid :facilities="stop.facilities" />
      </div>

      <!-- Action buttons -->
      <div
        class="flex gap-2 transition-all duration-500 delay-[400ms]"
        :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <UButton
          :to="localePath('/map')"
          variant="outline"
          color="neutral"
          size="md"
          class="flex-1 min-h-[44px]"
        >
          <UIcon
            name="i-lucide-map"
            class="size-4"
          />
          {{ t('stop.fullMap') }}
        </UButton>
        <UButton
          variant="outline"
          color="neutral"
          size="md"
          class="flex-1 min-h-[44px]"
          @click="openGoogleMaps"
        >
          <UIcon
            name="i-lucide-navigation"
            class="size-4"
          />
          {{ t('stop.googleMaps') }}
        </UButton>
        <UButton
          variant="outline"
          color="neutral"
          size="md"
          class="min-h-[44px] min-w-[44px]"
          :aria-label="t('stop.share')"
          @click="shareStop"
        >
          <UIcon
            name="i-lucide-share-2"
            class="size-4"
          />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { getStage } = useTrailData()
const passport = usePassportStore()
const { userPosition, nearestStop, requestGps } = useNearestStop()

definePageMeta({
  layout: 'default'
})

// Flow states
type FlowState = 'loading' | 'gps-request' | 'gps-limited' | 'gdpr' | 'ready'
const flowState = ref<FlowState>('loading')

const stop = computed(() => nearestStop.value)
const stage = computed(() => (stop.value ? getStage(stop.value.stage) : undefined))
const stampState = computed(() => (stop.value ? passport.getState(stop.value.id) : null))

// Initialize flow on mount
onMounted(async () => {
  // If GPS and GDPR already resolved, go straight to ready
  if (passport.gpsGranted !== null && passport.gdprConsent !== null) {
    if (passport.gpsGranted) {
      // Try to get fresh position
      await requestGps()
    }
    flowState.value = 'ready'
    return
  }

  // If GPS state unknown, request permission
  if (passport.gpsGranted === null) {
    flowState.value = 'gps-request'
    return
  }

  // If GPS resolved but GDPR not
  if (passport.gdprConsent === null && passport.gpsGranted) {
    flowState.value = 'gdpr'
    return
  }

  flowState.value = 'ready'
})

async function handleEnableGps() {
  const result = await requestGps()
  if (result) {
    passport.gpsGranted = true
    // GPS granted — now show GDPR
    if (passport.gdprConsent === null) {
      flowState.value = 'gdpr'
    } else {
      flowState.value = 'ready'
    }
  } else {
    // GPS denied — show limited mode dialog
    passport.gpsGranted = false
    flowState.value = 'gps-limited'
  }
}

function handleSkipGps() {
  passport.gpsGranted = false
  // Skip GDPR too since no location data collected
  if (passport.gdprConsent === null) {
    passport.gdprConsent = false
  }
  flowState.value = 'ready'
}

function handleLimitedContinue() {
  passport.gpsGranted = false
  if (passport.gdprConsent === null) {
    passport.gdprConsent = false
  }
  flowState.value = 'ready'
}

async function handleRetryGps() {
  const result = await requestGps()
  if (result) {
    passport.gpsGranted = true
    if (passport.gdprConsent === null) {
      flowState.value = 'gdpr'
    } else {
      flowState.value = 'ready'
    }
  }
}

function handleGdprAccept() {
  passport.gdprConsent = true
  flowState.value = 'ready'
}

function handleGdprDecline() {
  passport.gdprConsent = false
  flowState.value = 'ready'
}

// Mark stop as viewed
watch(
  () => stop.value?.id,
  (id) => {
    if (id) passport.markViewed(id)
  },
  { immediate: true }
)

// Share
async function shareStop() {
  if (!stop.value) return
  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({
        title: stop.value.name,
        text: stop.value.desc,
        url
      })
    } catch {
      /* cancelled */
    }
  } else {
    await navigator.clipboard.writeText(url)
  }
}

function openGoogleMaps() {
  if (!stop.value) return
  const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.value.lat},${stop.value.lng}&travelmode=walking`
  window.open(url, '_blank')
}

// Content animation
const contentReady = ref(false)
watch(flowState, (state) => {
  if (state === 'ready') {
    contentReady.value = false
    nextTick(() => {
      requestAnimationFrame(() => {
        contentReady.value = true
      })
    })
  }
})
</script>

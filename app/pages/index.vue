<template>
  <div>
    <!-- Loading -->
    <div
      v-if="flowState === 'loading'"
      class="flex items-center justify-center min-h-[calc(100dvh-3.5rem-3.5rem)]"
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

    <!-- Onboarding modals — always mounted, controlled via :open prop -->
    <VisitorGpsPermissionDialog
      :open="
        flowState === 'gps-request' || flowState === 'gps-limited' || flowState === 'gps-denied'
      "
      :mode="
        flowState === 'gps-denied' ? 'denied' : flowState === 'gps-limited' ? 'limited' : 'request'
      "
      @enable="flowState === 'gps-request' ? handleEnableGps() : handleRetryGps()"
      @skip="flowState === 'gps-request' ? handleSkipGps() : handleLimitedContinue()"
    />

    <VisitorGdprConsent
      :open="flowState === 'gdpr'"
      @accept="handleGdprAccept"
      @decline="handleGdprDecline"
    />

    <VisitorProfileForm
      :open="flowState === 'profile'"
      @submit="handleProfileSubmit"
    />

    <!-- Main content: nearest stop -->
    <div
      v-if="flowState === 'ready' && stop"
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
          :key="`map-${stop.id}-${$i18n.locale}`"
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
          class="transition-all duration-500"
          :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
        >
          <UCard :ui="{ root: 'shadow-lg' }">
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
              <VisitorStampBadge :state="stampState" />
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
              {{ t('stopDesc.' + stop.id) }}
            </p>
          </UCard>
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
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { getStage } = useTrailData()
const passport = usePassportStore()
const { userPosition, nearestStop, requestGps, gpsError } = useNearestStop()
const stop = computed(() => nearestStop.value)
const { shareStop, openGoogleMaps } = useStopActions(stop)

definePageMeta({
  layout: 'default',
})

// Flow states
type FlowState =
  | 'loading'
  | 'gps-request'
  | 'gps-limited'
  | 'gps-denied'
  | 'gdpr'
  | 'profile'
  | 'ready'
const flowState = ref<FlowState>('loading')

const stage = computed(() => (stop.value ? getStage(stop.value.stage) : undefined))
const stampState = computed(() => (stop.value ? passport.getState(stop.value.id) : null))

// Initialize flow on mount
onMounted(async () => {
  // If GPS and GDPR already resolved, check profile
  if (passport.gpsGranted !== null && passport.gdprConsent !== null) {
    if (passport.gdprConsent && !passport.profileCompleted) {
      flowState.value = 'profile'
      return
    }
    flowState.value = 'ready'
    // Non-blocking: refresh GPS position in background
    if (passport.gpsGranted) {
      requestGps()
    }
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

function goToNextStep() {
  if (passport.gdprConsent === null) {
    flowState.value = 'gdpr'
  } else if (passport.gdprConsent && !passport.profileCompleted) {
    flowState.value = 'profile'
  } else {
    flowState.value = 'ready'
  }
}

async function handleEnableGps() {
  const result = await requestGps()
  if (result) {
    passport.gpsGranted = true
    goToNextStep()
  } else {
    passport.gpsGranted = false
    // Show specific dialog based on error type
    if (gpsError.value === 'permission_denied') {
      flowState.value = 'gps-denied'
    } else {
      flowState.value = 'gps-limited'
    }
  }
}

function handleSkipGps() {
  passport.gpsGranted = false
  goToNextStep()
}

function handleLimitedContinue() {
  passport.gpsGranted = false
  goToNextStep()
}

async function handleRetryGps() {
  const result = await requestGps()
  if (result) {
    passport.gpsGranted = true
    goToNextStep()
  }
}

function handleGdprAccept() {
  passport.gdprConsent = true
  goToNextStep()
}

function handleGdprDecline() {
  passport.gdprConsent = false
  flowState.value = 'ready'
}

function handleProfileSubmit(data: { age: number; country: string }) {
  passport.profileAge = data.age
  passport.profileCountry = data.country
  passport.profileCompleted = true
  flowState.value = 'ready'
}

// Mark stop as viewed
watch(
  () => stop.value?.id,
  (id) => {
    if (id) passport.markViewed(id)
  },
  { immediate: true },
)

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

<template>
  <div
    v-if="stop"
    class="pb-24"
  >
    <!-- Map -->
    <div class="px-4 mt-3">
      <VisitorStopMap
        :key="`stopmap-${stop.id}-${$i18n.locale}`"
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
    <div class="px-4 relative z-10 space-y-5">
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
              {{ t('stop.stopLabel') }} {{ stop.id }} {{ t('stop.of') }} 29
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

      <!-- Route info / Next stop -->
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
        class="flex gap-2 transition-all duration-500 delay-500"
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

  <!-- Stop not found -->
  <div
    v-else
    class="flex flex-col items-center justify-center min-h-[60vh] px-4"
  >
    <UIcon
      name="i-lucide-map-pin-off"
      class="size-16 text-(--color-sand-300) dark:text-(--color-sand-600) mb-4"
    />
    <p class="text-(--color-sand-500) dark:text-(--color-sand-400) text-center">
      {{ t('stop.notFound') }}
    </p>
    <UButton
      :to="localePath('/stop/1')"
      color="primary"
      variant="soft"
      size="md"
      class="mt-4 min-h-[44px]"
    >
      {{ t('stop.goToFirst') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { getStop, getStage } = useTrailData()
const passport = usePassportStore()
const { userPosition, requestGps } = useNearestStop()
const stopId = computed(() => Number(route.params.id))
const stop = computed(() => getStop(stopId.value))
const { shareStop, openGoogleMaps } = useStopActions(stop)

definePageMeta({
  layout: 'default',
})

// Try to get GPS position if granted
onMounted(async () => {
  if (passport.gpsGranted) {
    await requestGps()
  }
})

const stage = computed(() => (stop.value ? getStage(stop.value.stage) : undefined))
const stampState = computed(() => passport.getState(stopId.value))

// Redirect invalid stop IDs to stop 1, and mark valid ones as viewed
watch(
  stopId,
  (id) => {
    if (!getStop(id)) {
      navigateTo(localePath('/stop/1'), { replace: true })
    } else {
      passport.markViewed(id)
    }
  },
  { immediate: true },
)

// Content entrance animation
const contentReady = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    contentReady.value = true
  })
})

// Reset animation on stop change
watch(stopId, () => {
  contentReady.value = false
  nextTick(() => {
    requestAnimationFrame(() => {
      contentReady.value = true
    })
  })
})
</script>

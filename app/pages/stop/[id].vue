<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { getStop, getStage } = useTrailData()
const passport = usePassportStore()

definePageMeta({
  layout: 'default'
})

const stopId = computed(() => Number(route.params.id))
const stop = computed(() => getStop(stopId.value))
const stage = computed(() => stop.value ? getStage(stop.value.stage) : undefined)
const stampState = computed(() => passport.getState(stopId.value))

// Redirect invalid stop IDs to stop 1
watch(stopId, (id) => {
  if (!getStop(id)) {
    navigateTo(localePath('/stop/1'), { replace: true })
  }
}, { immediate: true })

// Mark as viewed when page loads
watch(stopId, (id) => {
  if (id && getStop(id)) {
    passport.markViewed(id)
  }
}, { immediate: true })

// Share functionality
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
      // User cancelled
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

<template>
  <div
    v-if="stop"
    class="pb-24"
  >
    <!-- Map -->
    <VisitorStopMap
      :stop="stop"
      :show-nearby="true"
    />

    <!-- Content -->
    <div class="px-4 -mt-4 relative z-10 space-y-5">
      <!-- Badge + Name card -->
      <div
        class="bg-white dark:bg-(--color-sand-800) rounded-xl shadow-lg border border-(--color-sand-200) dark:border-(--color-sand-700) p-5 transition-all duration-500"
        :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <!-- Stage badge -->
        <div class="flex items-center gap-2 mb-2">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-(--color-gold-50) dark:bg-(--color-gold-950) border border-(--color-gold-200)/50 dark:border-(--color-gold-800)/50">
            <UIcon
              name="i-lucide-route"
              class="size-3 text-(--color-gold-500)"
            />
            <span class="text-xs font-semibold text-(--color-gold-600) dark:text-(--color-gold-400)">
              {{ t('stop.stage') }} {{ stop.stage }}
            </span>
          </div>
          <span class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
            {{ t('stop.stopLabel') }} {{ stop.id }} {{ t('stop.of') }} 29
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
        <h1 class="font-heading text-2xl md:text-3xl font-bold text-(--color-sand-800) dark:text-(--color-sand-50) mb-2 leading-tight">
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
        <p class="mt-3 text-sm text-(--color-sand-600) dark:text-(--color-sand-300) leading-relaxed">
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

      <!-- Next stop -->
      <div
        class="transition-all duration-500 delay-[400ms]"
        :class="contentReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <VisitorNextStopCard :current-stop-id="stop.id" />
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

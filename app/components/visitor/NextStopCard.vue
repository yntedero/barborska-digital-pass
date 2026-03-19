<template>
  <!-- Last stop completion message -->
  <div
    v-if="isLastStop"
    class="bg-gradient-to-r from-(--color-gold-50) to-(--color-gold-100) dark:from-(--color-gold-950) dark:to-(--color-gold-900)/50 rounded-xl border border-(--color-gold-200)/50 dark:border-(--color-gold-800)/50 p-5 text-center"
  >
    <UIcon
      name="i-lucide-flag"
      class="size-8 text-(--color-gold-500) mx-auto mb-2"
    />
    <h4
      class="font-heading text-lg font-bold text-(--color-gold-700) dark:text-(--color-gold-300) mb-1"
    >
      {{ t('stop.lastStopTitle') }}
    </h4>
    <p class="text-sm text-(--color-gold-600) dark:text-(--color-gold-400)">
      {{ t('stop.lastStopDesc') }}
    </p>
  </div>

  <!-- Route info card -->
  <div
    v-else-if="nextStop"
    class="bg-white dark:bg-(--color-sand-800) rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-700) overflow-hidden"
  >
    <!-- Next stop link -->
    <NuxtLink
      :to="localePath(`/stop/${nextStop.id}`)"
      class="block p-4 hover:bg-(--color-sand-50) dark:hover:bg-(--color-sand-750) transition-colors group"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-(--color-gold-500) uppercase tracking-wide mb-1">
            {{ t('route.nextStop') }}
          </p>
          <h4
            class="font-heading text-lg font-semibold text-(--color-sand-800) dark:text-(--color-sand-100) truncate"
          >
            {{ nextStop.name }}
          </h4>
          <div class="flex items-center gap-3 mt-1.5">
            <span
              v-if="distanceFormatted"
              class="flex items-center gap-1 text-xs text-(--color-sand-500) dark:text-(--color-sand-400)"
            >
              <UIcon
                name="i-lucide-ruler"
                class="size-3.5"
              />
              {{ distanceFormatted }}
              <span class="text-(--color-sand-400) dark:text-(--color-sand-500)">
                {{ t('route.betweenStops') }}
              </span>
            </span>
            <span
              v-if="walkingTimeFormatted"
              class="flex items-center gap-1 text-xs text-(--color-sand-500) dark:text-(--color-sand-400)"
            >
              <UIcon
                name="i-lucide-footprints"
                class="size-3.5"
              />
              ~{{ walkingTimeFormatted }}
            </span>
          </div>
        </div>
        <div
          class="ml-3 w-10 h-10 rounded-full bg-(--color-gold-50) dark:bg-(--color-gold-950) flex items-center justify-center group-hover:bg-(--color-gold-100) dark:group-hover:bg-(--color-gold-900) transition-colors"
        >
          <UIcon
            name="i-lucide-chevron-right"
            class="size-5 text-(--color-gold-500) group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </div>
    </NuxtLink>

    <!-- Google Maps navigation button -->
    <div class="border-t border-(--color-sand-100) dark:border-(--color-sand-700) px-4 py-3">
      <button
        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950)/50 hover:bg-(--color-gold-100) dark:hover:bg-(--color-gold-900)/50 text-sm font-medium text-(--color-gold-600) dark:text-(--color-gold-400) transition-colors active:scale-[0.98]"
        @click="openGoogleMapsNavigation"
      >
        <UIcon
          name="i-lucide-navigation"
          class="size-4"
        />
        {{ t('route.navigate') }}
        <span class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
          · {{ t('route.navigateDesc') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    currentStopId: number
    userPosition?: { lat: number; lng: number } | null
  }>(),
  {
    userPosition: null,
  },
)

const { t } = useI18n()
const localePath = useLocalePath()
const { getStop, getNextStop, distanceBetweenStops, estimateWalkingTime } = useTrailData()

const currentStop = computed(() => getStop(props.currentStopId))
const nextStop = computed(() => getNextStop(props.currentStopId))
const isLastStop = computed(() => props.currentStopId >= 29)

const distance = computed(() => {
  if (!currentStop.value || !nextStop.value) return null
  return distanceBetweenStops(currentStop.value, nextStop.value)
})

const distanceFormatted = computed(() => {
  if (distance.value == null) return ''
  return distance.value < 1
    ? `${Math.round(distance.value * 1000)} m`
    : `${distance.value.toFixed(1)} km`
})

const walkingTime = computed(() => {
  if (distance.value == null) return null
  return estimateWalkingTime(distance.value)
})

const walkingTimeFormatted = computed(() => {
  if (walkingTime.value == null) return ''
  if (walkingTime.value < 60) return `${walkingTime.value} min`
  const hours = Math.floor(walkingTime.value / 60)
  const mins = walkingTime.value % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
})

function openGoogleMapsNavigation() {
  if (!nextStop.value) return
  let url = `https://www.google.com/maps/dir/?api=1&destination=${nextStop.value.lat},${nextStop.value.lng}&travelmode=walking`
  if (props.userPosition) {
    url = `https://www.google.com/maps/dir/?api=1&origin=${props.userPosition.lat},${props.userPosition.lng}&destination=${nextStop.value.lat},${nextStop.value.lng}&travelmode=walking`
  }
  window.open(url, '_blank')
}
</script>

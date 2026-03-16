<script setup lang="ts">
const props = defineProps<{
  currentStopId: number
}>()

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
</script>

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
    <h4 class="font-heading text-lg font-bold text-(--color-gold-700) dark:text-(--color-gold-300) mb-1">
      {{ t('stop.lastStopTitle') }}
    </h4>
    <p class="text-sm text-(--color-gold-600) dark:text-(--color-gold-400)">
      {{ t('stop.lastStopDesc') }}
    </p>
  </div>

  <!-- Next stop card -->
  <NuxtLink
    v-else-if="nextStop"
    :to="localePath(`/stop/${nextStop.id}`)"
    class="block bg-white dark:bg-(--color-sand-800) rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-700) p-4 hover:border-(--color-gold-300) dark:hover:border-(--color-gold-700) hover:shadow-sm transition-all duration-200 active:scale-[0.99] group"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-xs font-medium text-(--color-gold-500) uppercase tracking-wide mb-1">
          {{ t('stop.nextStop') }}
        </p>
        <h4 class="font-heading text-lg font-semibold text-(--color-sand-800) dark:text-(--color-sand-100) truncate">
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
          </span>
          <span
            v-if="walkingTimeFormatted"
            class="flex items-center gap-1 text-xs text-(--color-sand-500) dark:text-(--color-sand-400)"
          >
            <UIcon
              name="i-lucide-footprints"
              class="size-3.5"
            />
            {{ walkingTimeFormatted }}
          </span>
        </div>
      </div>
      <div class="ml-3 w-10 h-10 rounded-full bg-(--color-gold-50) dark:bg-(--color-gold-950) flex items-center justify-center group-hover:bg-(--color-gold-100) dark:group-hover:bg-(--color-gold-900) transition-colors">
        <UIcon
          name="i-lucide-chevron-right"
          class="size-5 text-(--color-gold-500) group-hover:translate-x-0.5 transition-transform"
        />
      </div>
    </div>
  </NuxtLink>
</template>

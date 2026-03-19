<template>
  <div class="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2">
    <!-- Previous stop -->
    <div class="min-w-0">
      <NuxtLink
        v-if="prevStop"
        :to="localePath(`/stop/${prevStop.id}`)"
        class="group inline-flex items-center gap-1 py-1.5 active:scale-[0.97] transition-all duration-200 max-w-full"
      >
        <UIcon
          name="i-lucide-chevron-left"
          class="size-4 text-(--color-gold-500) flex-shrink-0 group-hover:-translate-x-0.5 transition-transform duration-200"
        />
        <span
          class="text-sm font-medium text-(--color-gold-500) truncate group-hover:text-(--color-gold-600) dark:group-hover:text-(--color-gold-400) transition-colors"
        >
          {{ prevStop.name }}
        </span>
      </NuxtLink>
    </div>

    <!-- Current stop name (always centered) -->
    <span
      class="font-heading font-bold text-(--color-sand-800) dark:text-(--color-sand-100) px-3 whitespace-nowrap"
    >
      {{ currentStopName }}
    </span>

    <!-- Next stop -->
    <div class="min-w-0 text-right">
      <NuxtLink
        v-if="nextStop"
        :to="localePath(`/stop/${nextStop.id}`)"
        class="group inline-flex items-center gap-1 py-1.5 active:scale-[0.97] transition-all duration-200 max-w-full justify-end"
      >
        <span
          class="text-sm font-medium text-(--color-gold-500) truncate group-hover:text-(--color-gold-600) dark:group-hover:text-(--color-gold-400) transition-colors"
        >
          {{ nextStop.name }}
        </span>
        <UIcon
          name="i-lucide-chevron-right"
          class="size-4 text-(--color-gold-500) flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentStopId: number
  currentStopName: string
}>()

const localePath = useLocalePath()
const { getPrevStop, getNextStop } = useTrailData()

const prevStop = computed(() => getPrevStop(props.currentStopId))
const nextStop = computed(() => getNextStop(props.currentStopId))
</script>

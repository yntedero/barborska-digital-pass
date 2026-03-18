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

<template>
  <div class="flex items-center justify-between px-4 py-2">
    <!-- Previous stop -->
    <NuxtLink
      v-if="prevStop"
      :to="localePath(`/stop/${prevStop.id}`)"
      class="group flex items-center gap-1 py-1.5 active:scale-[0.97] transition-all duration-200 min-w-0 max-w-[42%]"
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
    <div
      v-else
      class="flex-1"
    />

    <!-- Current stop name -->
    <span class="font-bold text-(--color-gold-500) tabular-nums sha">
      {{ currentStopName }}
    </span>

    <!-- Next stop -->
    <NuxtLink
      v-if="nextStop"
      :to="localePath(`/stop/${nextStop.id}`)"
      class="group flex items-center gap-1 py-1.5 active:scale-[0.97] transition-all duration-200 min-w-0 max-w-[42%] justify-end"
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
    <div
      v-else
      class="flex-1"
    />
  </div>
</template>

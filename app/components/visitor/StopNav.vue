<script setup lang="ts">
const props = defineProps<{
  currentStopId: number
}>()

const localePath = useLocalePath()
const { getStop, getPrevStop, getNextStop } = useTrailData()

const prevStop = computed(() => getPrevStop(props.currentStopId))
const nextStop = computed(() => getNextStop(props.currentStopId))
const currentStop = computed(() => getStop(props.currentStopId))
</script>

<template>
  <div class="flex items-center justify-between gap-2 px-4 py-2">
    <!-- Previous stop -->
    <NuxtLink
      v-if="prevStop"
      :to="localePath(`/stop/${prevStop.id}`)"
      class="group flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-(--color-sand-100)/80 dark:hover:bg-(--color-sand-800)/80 active:scale-[0.97] min-w-0 max-w-[45%]"
    >
      <UIcon
        name="i-lucide-chevron-left"
        class="size-4 text-(--color-gold-400) flex-shrink-0 group-hover:-translate-x-0.5 transition-transform duration-200"
      />
      <span class="text-sm font-medium text-(--color-sand-600) dark:text-(--color-sand-300) truncate group-hover:text-(--color-gold-600) dark:group-hover:text-(--color-gold-400) transition-colors">
        {{ prevStop.name }}
      </span>
    </NuxtLink>
    <div
      v-else
      class="flex-1"
    />

    <!-- Current stop indicator -->
    <div class="flex-shrink-0 flex items-center justify-center">
      <div class="w-7 h-7 rounded-full bg-gradient-to-b from-(--color-gold-400) to-(--color-gold-600) flex items-center justify-center shadow-sm ring-2 ring-(--color-gold-200)/40 dark:ring-(--color-gold-800)/40">
        <span class="text-white text-[10px] font-bold leading-none">{{ currentStop?.id }}</span>
      </div>
    </div>

    <!-- Next stop -->
    <NuxtLink
      v-if="nextStop"
      :to="localePath(`/stop/${nextStop.id}`)"
      class="group flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-(--color-sand-100)/80 dark:hover:bg-(--color-sand-800)/80 active:scale-[0.97] min-w-0 max-w-[45%] justify-end"
    >
      <span class="text-sm font-medium text-(--color-sand-600) dark:text-(--color-sand-300) truncate group-hover:text-(--color-gold-600) dark:group-hover:text-(--color-gold-400) transition-colors">
        {{ nextStop.name }}
      </span>
      <UIcon
        name="i-lucide-chevron-right"
        class="size-4 text-(--color-gold-400) flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200"
      />
    </NuxtLink>
    <div
      v-else
      class="flex-1"
    />
  </div>
</template>

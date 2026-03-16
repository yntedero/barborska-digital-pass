<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string | number
  change: number
  icon: string
}>()

const isPositive = computed(() => props.change > 0)
const isNeutral = computed(() => props.change === 0)

const changeLabel = computed(() => {
  const direction = isPositive.value ? 'up' : 'down'
  return `${Math.abs(props.change)}% ${direction} from last period`
})
</script>

<template>
  <div class="group rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) p-5 flex flex-col gap-3 hover:shadow-md hover:border-(--color-gold-200) dark:hover:border-(--color-gold-800) transition-all duration-200">
    <div class="flex items-center justify-between">
      <div class="size-10 rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950) flex items-center justify-center group-hover:scale-105 transition-transform">
        <UIcon
          :name="icon"
          class="size-5 text-(--color-gold-500)"
        />
      </div>
      <div
        v-if="!isNeutral"
        class="flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1"
        :class="isPositive
          ? 'text-(--color-trail-700) dark:text-(--color-trail-300) bg-(--color-trail-50) dark:bg-(--color-trail-950)'
          : 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950'"
        role="status"
        :aria-label="changeLabel"
      >
        <UIcon
          :name="isPositive ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
          class="size-3.5"
        />
        {{ Math.abs(change) }}%
      </div>
    </div>
    <div>
      <p class="text-3xl font-bold font-heading text-(--color-sand-900) dark:text-(--color-sand-50) tracking-tight">
        {{ value }}
      </p>
      <p class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400) mt-1">
        {{ label }}
      </p>
    </div>
  </div>
</template>

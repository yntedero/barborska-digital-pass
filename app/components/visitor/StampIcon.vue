<template>
  <div class="relative flex items-center justify-center group">
    <!-- Outer glow ring for validated -->
    <div
      v-if="state === 'validated'"
      class="absolute rounded-full stamp-pulse"
      :class="ringSize"
      aria-hidden="true"
    />

    <!-- Main stamp circle -->
    <div
      class="relative rounded-full flex items-center justify-center font-heading font-bold transition-all duration-300"
      :class="[
        sizeClasses,
        state === 'validated'
          ? 'bg-gradient-to-br from-(--color-gold-300) via-(--color-gold-500) to-(--color-gold-600) text-white shadow-md shadow-(--color-gold-500)/40 ring-2 ring-(--color-gold-300)/30'
          : state === 'partial'
            ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm ring-1 ring-amber-300/30'
            : state === 'viewed'
              ? 'border-2 border-dashed border-(--color-gold-300) dark:border-(--color-gold-700) text-(--color-gold-400) bg-(--color-gold-50)/50 dark:bg-(--color-gold-950)/50'
              : 'border-2 border-(--color-sand-200) dark:border-(--color-sand-700) text-(--color-sand-300) dark:text-(--color-sand-600) bg-(--color-sand-100) dark:bg-(--color-sand-800)'
      ]"
      role="img"
      :aria-label="
        state === 'validated'
          ? `Stop ${stopId} - GPS verified`
          : state === 'partial'
            ? `Stop ${stopId} - Visited`
            : state === 'viewed'
              ? `Stop ${stopId} - Viewed`
              : `Stop ${stopId} - Not visited`
      "
    >
      <!-- Validated: check icon with shimmer -->
      <template v-if="state === 'validated'">
        <UIcon
          name="i-lucide-check"
          :class="iconSize"
        />
        <!-- Gold shimmer overlay -->
        <div
          class="absolute inset-0 rounded-full overflow-hidden"
          aria-hidden="true"
        >
          <div
            class="stamp-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
          />
        </div>
      </template>

      <!-- Partial: number -->
      <span v-else-if="state === 'partial'">
        {{ stopId }}
      </span>

      <!-- Viewed: number with outline -->
      <span v-else-if="state === 'viewed'">
        {{ stopId }}
      </span>

      <!-- Empty: number greyed out -->
      <span v-else>
        {{ stopId }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StampState } from '~~/shared/types'

const props = withDefaults(
  defineProps<{
    state: StampState
    stopId: number
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'md'
  }
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-8 h-8 text-xs'
    case 'lg':
      return 'w-16 h-16 text-base'
    default:
      return 'w-12 h-12 text-sm'
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-3'
    case 'lg':
      return 'size-6'
    default:
      return 'size-4'
  }
})

const ringSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-10 h-10'
    case 'lg':
      return 'w-[72px] h-[72px]'
    default:
      return 'w-14 h-14'
  }
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.stamp-shimmer {
  animation: shimmer 3s ease-in-out infinite;
  animation-delay: 1s;
}
</style>

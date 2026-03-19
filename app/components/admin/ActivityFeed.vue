<template>
  <div
    class="rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) p-5"
  >
    <h3 class="font-heading font-semibold text-(--color-sand-900) dark:text-(--color-sand-50) mb-4">
      {{ t('admin.charts.activity') }}
    </h3>

    <div class="relative max-h-80 overflow-y-auto pr-1">
      <!-- Scroll fade indicator at bottom -->
      <div
        class="sticky bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-(--color-sand-900) to-transparent pointer-events-none z-10"
      />

      <div class="space-y-0.5">
        <div
          v-for="event in events"
          :key="event.id"
          class="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-(--color-sand-50) dark:hover:bg-(--color-sand-800)/60 transition-colors group"
        >
          <!-- Icon with type-specific color -->
          <div
            class="size-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            :class="
              typeConfig[event.type]?.bgColor ?? 'bg-(--color-sand-100) dark:bg-(--color-sand-800)'
            "
          >
            <UIcon
              :name="typeConfig[event.type]?.icon ?? 'i-lucide-activity'"
              class="size-4"
              :class="typeConfig[event.type]?.iconColor ?? 'text-(--color-sand-500)'"
            />
          </div>

          <!-- Message -->
          <div class="flex-1 min-w-0">
            <p class="text-sm text-(--color-sand-800) dark:text-(--color-sand-200) truncate">
              {{ event.message }}
            </p>
          </div>

          <!-- Time -->
          <time
            class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500) shrink-0 whitespace-nowrap tabular-nums"
          >
            {{ formatTime(event.time) }}
          </time>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityEvent } from '~~/shared/types'

defineProps<{
  events: ActivityEvent[]
}>()

const { t } = useI18n()

const typeConfig: Record<string, { icon: string; iconColor: string; bgColor: string }> = {
  checkin: {
    icon: 'i-lucide-circle-check-big',
    iconColor: 'text-(--color-trail-500)',
    bgColor: 'bg-(--color-trail-50) dark:bg-(--color-trail-950)',
  },
  visitor: {
    icon: 'i-lucide-user-plus',
    iconColor: 'text-(--color-gold-500)',
    bgColor: 'bg-(--color-gold-50) dark:bg-(--color-gold-950)',
  },
  popular: {
    icon: 'i-lucide-flame',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
}

function formatTime(time: string): string {
  // If already formatted like "2m ago", return as-is
  if (time.includes('ago') || time.includes('pred')) return time
  // Try to parse as ISO and format relative
  return time
}
</script>

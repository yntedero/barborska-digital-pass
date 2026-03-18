<template>
  <div class="rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) p-5">
    <div class="mb-5">
      <h3 class="font-heading font-semibold text-(--color-sand-900) dark:text-(--color-sand-50)">
        {{ t('admin.funnel.title') }}
      </h3>
      <p class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400) mt-0.5">
        {{ t('admin.funnel.subtitle') }}
      </p>
    </div>

    <div class="space-y-2.5">
      <div
        v-for="(item, index) in funnelItems"
        :key="item.stage"
        class="flex items-center gap-3 group"
      >
        <!-- Stage label -->
        <span class="text-xs font-medium text-(--color-sand-500) dark:text-(--color-sand-400) w-16 shrink-0 text-right">
          {{ t('admin.table.stage') }} {{ item.stage }}
        </span>

        <!-- Bar container -->
        <div class="flex-1 relative">
          <div
            class="h-9 rounded-lg flex items-center px-3 transition-all duration-500 group-hover:opacity-90"
            :style="{
              width: `${Math.max(item.widthPercent, 8)}%`,
              backgroundColor: COLORS[index % COLORS.length],
              boxShadow: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.1)' : 'inset 0 1px 0 rgba(255,255,255,0.25)'
            }"
          >
            <span class="text-xs font-bold text-white whitespace-nowrap drop-shadow-sm">
              {{ item.visitors.toLocaleString() }}
            </span>
          </div>
        </div>

        <!-- Drop percentage -->
        <div class="w-20 shrink-0">
          <span
            v-if="item.dropPercent !== null && item.dropPercent > 0"
            class="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-1.5 py-0.5 rounded"
          >
            <UIcon
              name="i-lucide-arrow-down"
              class="size-3"
            />
            {{ item.dropPercent }}%
          </span>
          <span
            v-else-if="item.dropPercent !== null && item.dropPercent < 0"
            class="inline-flex items-center gap-1 text-xs font-semibold text-(--color-trail-600) dark:text-(--color-trail-400) bg-(--color-trail-50) dark:bg-(--color-trail-950) px-1.5 py-0.5 rounded"
          >
            <UIcon
              name="i-lucide-arrow-up"
              class="size-3"
            />
            {{ Math.abs(item.dropPercent) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Retention summary -->
    <div class="mt-5 pt-4 border-t border-(--color-sand-200) dark:border-(--color-sand-800)">
      <div class="flex items-center justify-between">
        <span class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400)">
          {{ t('admin.table.stage') }} 1 &rarr; {{ t('admin.table.stage') }} {{ data.length }}
        </span>
        <div class="flex items-center gap-2">
          <div class="w-24 h-2 rounded-full bg-(--color-sand-100) dark:bg-(--color-sand-800) overflow-hidden">
            <div
              class="h-full rounded-full bg-(--color-gold-500) transition-all duration-700"
              :style="{ width: `${retentionPercent}%` }"
            />
          </div>
          <span class="text-lg font-bold font-heading text-(--color-gold-500)">
            {{ retentionPercent }}%
          </span>
          <span class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400)">
            {{ t('admin.funnel.retained') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: { stage: number, visitors: number }[]
}>()

const { t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const maxVisitors = computed(() => {
  if (props.data.length === 0) return 1
  return Math.max(...props.data.map(d => d.visitors))
})

const funnelItems = computed(() => {
  return props.data.map((item, index) => {
    const widthPercent = (item.visitors / maxVisitors.value) * 100
    const prev = index > 0 ? props.data[index - 1].visitors : null
    const dropPercent = prev !== null
      ? Math.round(((prev - item.visitors) / prev) * 100)
      : null
    return {
      stage: item.stage,
      visitors: item.visitors,
      widthPercent,
      dropPercent
    }
  })
})

const retentionPercent = computed(() => {
  if (props.data.length === 0) return 0
  return Math.round((props.data[props.data.length - 1].visitors / props.data[0].visitors) * 100)
})

const COLORS = [
  '#c49225', '#d4a843', '#d4843a', '#c47a3a',
  '#4a7c3a', '#6a9e5c', '#4a90d9', '#7a6e5a', '#9a8c78'
]
</script>

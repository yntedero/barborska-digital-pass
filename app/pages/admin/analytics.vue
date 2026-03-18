<template>
  <div class="space-y-8">
    <!-- Page heading -->
    <div>
      <h1
        class="font-heading text-2xl font-bold text-(--color-sand-900) dark:text-(--color-sand-50)"
      >
        {{ t('admin.analytics') }}
      </h1>
    </div>

    <!-- Funnel -->
    <AdminStageFunnel :data="analyticsData.stageFunnel" />

    <!-- Per-stage stat cards -->
    <section>
      <h2
        class="text-xs font-semibold uppercase tracking-wider text-(--color-sand-400) dark:text-(--color-sand-500) mb-3"
      >
        {{ t('admin.section.stageBreakdown') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="stage in stages"
          :key="stage.id"
          class="rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) p-4 hover:shadow-md hover:border-(--color-gold-200) dark:hover:border-(--color-gold-800) transition-all"
        >
          <div class="flex items-center gap-2 mb-2">
            <UBadge
              variant="subtle"
              color="primary"
              size="xs"
            >
              {{ t('admin.table.stage') }} {{ stage.id }}
            </UBadge>
            <span class="text-xs text-(--color-sand-400)">{{ stage.distance }} km</span>
          </div>
          <p class="text-sm font-medium text-(--color-sand-800) dark:text-(--color-sand-200)">
            {{ stage.from }} &rarr; {{ stage.to }}
          </p>
          <div class="mt-2 flex items-center gap-2">
            <span class="text-lg font-bold font-heading text-(--color-gold-500)">
              {{ analyticsData.stageCheckins[stage.id - 1]?.toLocaleString() }}
            </span>
            <span class="text-xs text-(--color-sand-400)">
              {{ t('admin.table.checkins').toLowerCase() }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Stops table -->
    <div
      class="rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) overflow-hidden"
    >
      <div class="p-5 border-b border-(--color-sand-200) dark:border-(--color-sand-800)">
        <h3 class="font-heading font-semibold text-(--color-sand-900) dark:text-(--color-sand-50)">
          {{ t('admin.stopsTable') }} ({{ stops.length }})
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="border-b border-(--color-sand-200) dark:border-(--color-sand-800) bg-(--color-sand-50) dark:bg-(--color-sand-800)"
            >
              <th
                v-for="col in [
                  { key: 'name' as SortKey, label: t('admin.table.name') },
                  { key: 'stage' as SortKey, label: t('admin.table.stage') },
                  { key: 'views' as SortKey, label: t('admin.table.views') },
                  { key: 'checkins' as SortKey, label: t('admin.table.checkins') },
                  { key: 'verified' as SortKey, label: t('admin.table.verified') },
                ]"
                :key="col.key"
                class="text-left px-4 py-3 font-medium text-(--color-sand-600) dark:text-(--color-sand-400) cursor-pointer hover:text-(--color-gold-500) transition-colors select-none"
                @click="toggleSort(col.key)"
              >
                <div class="flex items-center gap-1.5">
                  {{ col.label }}
                  <UIcon
                    :name="sortIcon(col.key)"
                    class="size-3.5 transition-colors"
                    :class="sortKey === col.key ? 'text-(--color-gold-500)' : ''"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="stop in sortedStops"
              :key="stop.id"
              class="border-b border-(--color-sand-100) dark:border-(--color-sand-800) hover:bg-(--color-sand-50) dark:hover:bg-(--color-sand-800)/60 transition-colors"
            >
              <td
                class="px-4 py-3 font-medium text-(--color-sand-800) dark:text-(--color-sand-200)"
              >
                {{ stop.name }}
              </td>
              <td class="px-4 py-3">
                <UBadge
                  variant="subtle"
                  color="primary"
                  size="xs"
                >
                  {{ t('admin.table.stage') }} {{ stop.stage }}
                </UBadge>
              </td>
              <td
                class="px-4 py-3 text-(--color-sand-600) dark:text-(--color-sand-400) tabular-nums"
              >
                {{ stop.views.toLocaleString() }}
              </td>
              <td
                class="px-4 py-3 text-(--color-sand-600) dark:text-(--color-sand-400) tabular-nums"
              >
                {{ stop.checkins.toLocaleString() }}
              </td>
              <td
                class="px-4 py-3 text-(--color-sand-600) dark:text-(--color-sand-400) tabular-nums"
              >
                {{ stop.verified.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { analyticsData } from '~/data/analytics'
import { stops } from '~/data/stops'
import { stages } from '~/data/stages'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()

type SortKey = 'name' | 'stage' | 'views' | 'checkins' | 'verified'
const sortKey = ref<SortKey>('views')
const sortAsc = ref(false)

// Generate realistic numbers for each stop
const stopStats = computed(() => {
  return stops.map((stop) => {
    // Base values seeded from stop id for determinism
    const seed = stop.id
    const views = Math.round(2400 - ((seed * 67) % 1800) + Math.sin(seed) * 200)
    const checkins = Math.round(views * (0.25 + (seed % 10) / 40))
    const verified = Math.round(checkins * (0.6 + (seed % 7) / 20))
    return {
      id: stop.id,
      name: stop.name,
      stage: stop.stage,
      views: Math.max(120, views),
      checkins: Math.max(30, checkins),
      verified: Math.max(15, verified),
    }
  })
})

const sortedStops = computed(() => {
  const list = [...stopStats.value]
  list.sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortAsc.value ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortAsc.value ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
  })
  return list
})

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = false
  }
}

function sortIcon(key: SortKey) {
  if (sortKey.value !== key) return 'i-lucide-arrow-up-down'
  return sortAsc.value ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'
}
</script>

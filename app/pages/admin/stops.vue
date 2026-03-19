<template>
  <div class="space-y-6">
    <!-- Page heading -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <h1
        class="font-heading text-2xl font-bold text-(--color-sand-900) dark:text-(--color-sand-50)"
      >
        {{ t('admin.stopsTable') }}
      </h1>
      <div class="w-full sm:w-64">
        <UInput
          v-model="search"
          :placeholder="t('admin.table.search')"
          icon="i-lucide-search"
          size="sm"
        />
      </div>
    </div>

    <!-- Table -->
    <UCard>
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
              v-for="stop in filteredStops"
              :key="stop.id"
              class="border-b border-(--color-sand-100) dark:border-(--color-sand-800) hover:bg-(--color-gold-50)/50 dark:hover:bg-(--color-sand-800)/60 transition-colors cursor-default"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-map-pin"
                    class="size-4 text-(--color-gold-500) shrink-0"
                  />
                  <span class="font-medium text-(--color-sand-800) dark:text-(--color-sand-200)">
                    {{ stop.name }}
                  </span>
                </div>
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
              <td class="px-4 py-3">
                <div class="flex items-center gap-1.5">
                  <UIcon
                    name="i-lucide-shield-check"
                    class="size-3.5 text-(--color-trail-500)"
                  />
                  <span class="text-(--color-sand-600) dark:text-(--color-sand-400) tabular-nums">
                    {{ stop.verified.toLocaleString() }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredStops.length === 0"
        class="p-12 text-center text-(--color-sand-400)"
      >
        <UIcon
          name="i-lucide-search-x"
          class="size-8 mx-auto mb-2"
        />
        <p class="text-sm">
          {{ t('admin.table.noStopsFound', { query: search }) }}
        </p>
      </div>
    </UCard>

    <!-- Summary -->
    <p class="text-sm text-(--color-sand-400) text-right">
      {{ filteredStops.length }} / {{ stops.length }} {{ t('admin.stopsTable').toLowerCase() }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { stops } from '~/data/stops'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()

const search = ref('')

type SortKey = 'name' | 'stage' | 'views' | 'checkins' | 'verified'
const sortKey = ref<SortKey>('views')
const sortAsc = ref(false)

// Generate realistic numbers from stop data
const stopRows = computed(() => {
  return stops.map((stop) => {
    const seed = stop.id
    const views = Math.max(120, Math.round(2400 - ((seed * 67) % 1800) + Math.sin(seed) * 200))
    const checkins = Math.max(30, Math.round(views * (0.25 + (seed % 10) / 40)))
    const verified = Math.max(15, Math.round(checkins * (0.6 + (seed % 7) / 20)))
    return {
      id: stop.id,
      name: stop.name,
      stage: stop.stage,
      views,
      checkins,
      verified,
    }
  })
})

const filteredStops = computed(() => {
  let list = [...stopRows.value]
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter((s) => s.name.toLowerCase().includes(q))
  }
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

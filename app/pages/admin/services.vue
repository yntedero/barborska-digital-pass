<template>
  <div class="space-y-6">
    <!-- Page heading -->
    <div>
      <h1
        class="font-heading text-2xl font-bold text-(--color-sand-900) dark:text-(--color-sand-50)"
      >
        {{ t('admin.servicesTable') }}
      </h1>
    </div>

    <!-- Filters row -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div class="w-full sm:w-64">
        <UInput
          v-model="search"
          :placeholder="t('admin.table.search')"
          icon="i-lucide-search"
          size="sm"
        />
      </div>
      <div class="w-full sm:w-56">
        <USelect
          v-model="categoryFilter"
          :items="categories"
          value-key="value"
          label-key="label"
          size="sm"
          icon="i-lucide-filter"
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
                  { key: 'category' as SortKey, label: t('admin.table.category') },
                  { key: 'stopName' as SortKey, label: t('admin.table.stop') },
                  { key: 'views' as SortKey, label: t('admin.table.views') },
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
              <th
                class="text-left px-4 py-3 font-medium text-(--color-sand-600) dark:text-(--color-sand-400)"
              >
                {{ t('admin.table.pilgrim') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="svc in filteredServices"
              :key="svc.id"
              class="border-b border-(--color-sand-100) dark:border-(--color-sand-800) hover:bg-(--color-gold-50)/50 dark:hover:bg-(--color-sand-800)/60 transition-colors cursor-default"
            >
              <td
                class="px-4 py-3 font-medium text-(--color-sand-800) dark:text-(--color-sand-200)"
              >
                {{ svc.name }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  :style="{ backgroundColor: CATEGORY_COLORS[svc.category] || '#7a6e5a' }"
                >
                  {{ t('categories.' + svc.category) }}
                </span>
              </td>
              <td class="px-4 py-3 text-(--color-sand-600) dark:text-(--color-sand-400)">
                {{ svc.stopName }}
              </td>
              <td
                class="px-4 py-3 text-(--color-sand-600) dark:text-(--color-sand-400) tabular-nums"
              >
                {{ svc.views.toLocaleString() }}
              </td>
              <td class="px-4 py-3">
                <UBadge
                  v-if="svc.pilgrimFriendly"
                  variant="subtle"
                  color="primary"
                  size="xs"
                >
                  <UIcon
                    name="i-lucide-heart-handshake"
                    class="size-3 mr-1"
                  />
                  {{ t('admin.table.pilgrimFriendly') }}
                </UBadge>
                <span
                  v-else
                  class="text-(--color-sand-300) dark:text-(--color-sand-600)"
                >
                  —
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredServices.length === 0"
        class="p-12 text-center text-(--color-sand-400)"
      >
        <UIcon
          name="i-lucide-search-x"
          class="size-8 mx-auto mb-2"
        />
        <p class="text-sm">
          {{ t('admin.table.noServicesFound') }}
        </p>
      </div>
    </UCard>

    <!-- Summary -->
    <p class="text-sm text-(--color-sand-400) text-right">
      {{ filteredServices.length }} / {{ services.length }}
      {{ t('admin.servicesTable').toLowerCase() }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { services, CATEGORY_COLORS } from '~/data/services'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()
const { getServicesByCategory } = useTrailData()

const search = ref('')
const categoryFilter = ref<string>('all')

const categories = computed(() => {
  const cats = [...new Set(services.map((s) => s.category))]
  return [
    {
      value: 'all',
      label: `${t('admin.table.category')}: ${t('admin.table.all')} (${services.length})`,
    },
    ...cats.map((c) => ({
      value: c,
      label: `${t('categories.' + c)} (${getServicesByCategory(c).length})`,
    })),
  ]
})

// Static data — compute once at module level instead of on every re-render
const serviceRows = services.map((svc) => {
  const seed = svc.id
  const views = Math.max(50, Math.round(800 - ((seed * 23) % 600) + Math.sin(seed * 2) * 100))
  return { ...svc, views }
})

type SortKey = 'name' | 'category' | 'stopName' | 'views'
const { sortKey, toggleSort, sortIcon, sortList } = useTableSort<SortKey>('views')

const filteredServices = computed(() => {
  let list = [...serviceRows]
  if (categoryFilter.value !== 'all') {
    list = list.filter((s) => s.category === categoryFilter.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(
      (s) => s.name.toLowerCase().includes(q) || s.stopName.toLowerCase().includes(q),
    )
  }
  return sortList(list)
})
</script>

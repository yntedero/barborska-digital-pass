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
        <UCard
          v-for="stage in stages"
          :key="stage.id"
          :ui="{ root: 'hover:shadow-md transition-shadow' }"
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
        </UCard>
      </div>
    </section>

    <!-- Stops table -->
    <UCard>
      <div class="mb-4">
        <h3 class="font-heading font-semibold text-(--color-sand-900) dark:text-(--color-sand-50)">
          {{ t('admin.stopsTable') }} ({{ TOTAL_STOPS }})
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
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { analyticsData, stopStats } from '~/data/analytics'
import { stages, TOTAL_STOPS } from '~/data/stages'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()

type SortKey = 'name' | 'stage' | 'views' | 'checkins' | 'verified'
const { sortKey, toggleSort, sortIcon, sortList } = useTableSort<SortKey>('views')

const sortedStops = computed(() => sortList([...stopStats]))
</script>

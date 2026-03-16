<script setup lang="ts">
import { analyticsData } from '~/data/analytics'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()
</script>

<template>
  <div class="space-y-8">
    <!-- Page heading -->
    <div>
      <h1 class="font-heading text-2xl font-bold text-(--color-sand-900) dark:text-(--color-sand-50)">
        {{ t('admin.dashboard') }}
      </h1>
    </div>

    <!-- Section: Overview -->
    <section>
      <h2 class="text-xs font-semibold uppercase tracking-wider text-(--color-sand-400) dark:text-(--color-sand-500) mb-3">
        {{ t('admin.section.overview') }}
      </h2>
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminKpiCard
          v-for="kpi in analyticsData.kpis"
          :key="kpi.label"
          :label="kpi.label"
          :value="kpi.value"
          :change="kpi.change"
          :icon="kpi.icon"
        />
      </div>
    </section>

    <!-- Section: Charts & Insights -->
    <section>
      <h2 class="text-xs font-semibold uppercase tracking-wider text-(--color-sand-400) dark:text-(--color-sand-500) mb-3">
        {{ t('admin.section.charts') }}
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdminVisitTrendChart
          :data="analyticsData.dailyVisits"
          class="lg:col-span-2"
        />
        <AdminStageBarChart :data="analyticsData.stageCheckins" />
        <AdminTopStopsChart :data="analyticsData.topStops" />
        <AdminCountryDonut :data="analyticsData.countries" />
        <AdminTravelModePie :data="analyticsData.travelModes" />
        <AdminActivityFeed
          :events="analyticsData.activityFeed"
          class="lg:col-span-2"
        />
      </div>
    </section>
  </div>
</template>

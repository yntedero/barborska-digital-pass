<template>
  <div class="rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) p-5">
    <h3 class="font-heading font-semibold text-(--color-sand-900) dark:text-(--color-sand-50) mb-4">
      {{ t('admin.charts.byStage') }}
    </h3>
    <ClientOnly>
      <VChart
        :option="chartOption"
        autoresize
        class="w-full h-56 sm:h-64"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: number[]
}>()

const { t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: isDark.value ? 'rgba(26, 23, 20, 0.95)' : 'rgba(26, 23, 20, 0.9)',
    borderColor: '#c49225',
    borderWidth: 1,
    textStyle: { color: '#f5f0e8', fontSize: 12 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter(params: any) {
      const p = params[0]
      return `<strong>${p.name}</strong><br/>${p.value} ${t('admin.table.checkins').toLowerCase()}`
    }
  },
  grid: {
    left: 45,
    right: 16,
    top: 12,
    bottom: 30
  },
  xAxis: {
    type: 'category',
    data: props.data.map((_, i) => `${t('admin.table.stage')} ${i + 1}`),
    axisLabel: {
      color: isDark.value ? '#a89a82' : '#9a8c78',
      fontSize: 10,
      rotate: 0
    },
    axisLine: { lineStyle: { color: isDark.value ? '#3a3228' : '#ddd4c4' } },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: isDark.value ? '#a89a82' : '#9a8c78', fontSize: 10 },
    splitLine: { lineStyle: { color: isDark.value ? '#3a3228' : '#ece5d8', type: 'dashed' } },
    axisLine: { show: false },
    axisTick: { show: false }
  },
  series: [{
    type: 'bar',
    data: props.data,
    barWidth: '55%',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#c49225' },
          { offset: 1, color: '#d4a843' }
        ]
      },
      borderRadius: [6, 6, 0, 0]
    },
    emphasis: {
      itemStyle: {
        color: '#a67b1a'
      }
    }
  }]
}))
</script>

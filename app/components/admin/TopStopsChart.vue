<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const props = defineProps<{
  data: { name: string, views: number }[]
}>()

const option = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: isDark.value ? 'rgba(26, 23, 20, 0.95)' : 'rgba(26, 23, 20, 0.9)',
    borderColor: '#c49225',
    borderWidth: 1,
    textStyle: { color: '#f5f0e8', fontSize: 12 }
  },
  grid: { left: 130, right: 30, top: 10, bottom: 20 },
  xAxis: {
    type: 'value',
    axisLabel: { color: isDark.value ? '#a89a82' : '#6b5d4a', fontSize: 10 },
    splitLine: { lineStyle: { color: isDark.value ? '#3a3228' : '#ece5d8', type: 'dashed' } },
    axisLine: { show: false },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'category',
    data: [...props.data].reverse().map(d => d.name),
    axisLabel: {
      fontSize: 11,
      color: isDark.value ? '#a89a82' : '#6b5d4a',
      width: 115,
      overflow: 'truncate',
      ellipsis: '...'
    },
    axisLine: { show: false },
    axisTick: { show: false }
  },
  series: [{
    type: 'bar',
    data: [...props.data].reverse().map(d => d.views),
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          { offset: 0, color: '#c49225' },
          { offset: 1, color: '#d4a843' }
        ]
      },
      borderRadius: [0, 6, 6, 0]
    },
    barWidth: '55%',
    emphasis: {
      itemStyle: {
        color: '#a67b1a'
      }
    }
  }]
}))
</script>

<template>
  <div class="bg-white dark:bg-(--color-sand-900) rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) p-5">
    <h3 class="font-heading text-base font-semibold text-(--color-sand-950) dark:text-(--color-sand-100) mb-4">
      {{ t('admin.charts.topStops') }}
    </h3>
    <ClientOnly>
      <VChart
        :option="option"
        style="height: 320px; width: 100%"
        autoresize
      />
    </ClientOnly>
  </div>
</template>

<template>
  <UCard>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-heading font-semibold text-(--color-sand-900) dark:text-(--color-sand-50)">
        {{ t('admin.charts.visitTrend') }}
      </h3>
      <div class="flex gap-1">
        <UButton
          v-for="r in [7, 30, 90] as const"
          :key="r"
          size="xs"
          :variant="range === r ? 'solid' : 'ghost'"
          :label="`${r}d`"
          @click="range = r"
        />
      </div>
    </div>
    <ClientOnly>
      <VChart
        :option="chartOption"
        autoresize
        style="width: 100%; height: 224px"
      />
    </ClientOnly>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: { date: string; visits: number }[]
}>()

const { t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const range = ref<7 | 30 | 90>(30)

onMounted(() => {
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 200)
})

const filteredData = computed(() => {
  return props.data.slice(-range.value)
})

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
      return `<strong>${p.name}</strong><br/>${p.value} ${t('admin.table.views').toLowerCase()}`
    },
  },
  grid: {
    left: 45,
    right: 16,
    top: 12,
    bottom: 30,
  },
  xAxis: {
    type: 'category',
    data: filteredData.value.map((d) => d.date),
    axisLabel: {
      color: isDark.value ? '#a89a82' : '#9a8c78',
      fontSize: 10,
      formatter(val: string) {
        const parts = val.split('-')
        return `${parts[2]}.${parts[1]}.`
      },
      interval: range.value === 7 ? 0 : range.value === 30 ? 4 : 14,
    },
    axisLine: { lineStyle: { color: isDark.value ? '#3a3228' : '#ddd4c4' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: isDark.value ? '#a89a82' : '#9a8c78', fontSize: 10 },
    splitLine: { lineStyle: { color: isDark.value ? '#3a3228' : '#ece5d8', type: 'dashed' } },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [
    {
      type: 'line',
      data: filteredData.value.map((d) => d.visits),
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#c49225', width: 2.5 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: isDark.value ? 'rgba(196, 146, 37, 0.2)' : 'rgba(196, 146, 37, 0.25)',
            },
            { offset: 1, color: 'rgba(196, 146, 37, 0.02)' },
          ],
        },
      },
    },
  ],
}))
</script>

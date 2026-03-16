<script setup lang="ts">
const props = defineProps<{
  data: { name: string, value: number }[]
}>()

const { t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const COLORS = ['#c49225', '#4a7c3a', '#7a6e5a', '#4a90d9', '#c45c4a']

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: isDark.value ? 'rgba(26, 23, 20, 0.95)' : 'rgba(26, 23, 20, 0.9)',
    borderColor: '#c49225',
    borderWidth: 1,
    textStyle: { color: '#f5f0e8', fontSize: 12 },
    formatter: '{b}: {c}%'
  },
  legend: {
    bottom: 0,
    textStyle: {
      color: isDark.value ? '#a89a82' : '#6b5d4a',
      fontSize: 11
    },
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 16,
    icon: 'roundRect'
  },
  series: [{
    type: 'pie',
    radius: ['0%', '65%'],
    center: ['50%', '42%'],
    label: {
      show: true,
      formatter: '{b}\n{d}%',
      color: isDark.value ? '#a89a82' : '#7a6e5a',
      fontSize: 11,
      lineHeight: 16
    },
    labelLine: {
      lineStyle: { color: isDark.value ? '#4a4238' : '#c4b8a4' }
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.15)'
      },
      scaleSize: 6
    },
    data: props.data.map((d, i) => ({
      value: d.value,
      name: d.name,
      itemStyle: { color: COLORS[i % COLORS.length] }
    }))
  }]
}))
</script>

<template>
  <div class="rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) p-5">
    <h3 class="font-heading font-semibold text-(--color-sand-900) dark:text-(--color-sand-50) mb-4">
      {{ t('admin.charts.travelMode') }}
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

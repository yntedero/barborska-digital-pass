<template>
  <div
    class="rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) p-5"
  >
    <h3 class="font-heading font-semibold text-(--color-sand-900) dark:text-(--color-sand-50) mb-4">
      {{ t('admin.charts.countries') }}
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
  data: { name: string; value: number }[]
}>()

const { t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const COLORS = ['#c49225', '#d4843a', '#4a7c3a', '#4a90d9', '#c45c4a', '#7a6e5a']

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: isDark.value ? 'rgba(26, 23, 20, 0.95)' : 'rgba(26, 23, 20, 0.9)',
    borderColor: '#c49225',
    borderWidth: 1,
    textStyle: { color: '#f5f0e8', fontSize: 12 },
    formatter: '{b}: {c}%',
  },
  legend: {
    orient: 'vertical',
    right: 8,
    top: 'center',
    textStyle: {
      color: isDark.value ? '#a89a82' : '#6b5d4a',
      fontSize: 11,
    },
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 10,
    icon: 'roundRect',
  },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 13,
          fontWeight: 'bold',
          color: isDark.value ? '#f5f0e8' : '#1a1714',
        },
        scaleSize: 6,
      },
      labelLine: { show: false },
      data: props.data.map((d, i) => ({
        value: d.value,
        name: d.name,
        itemStyle: { color: COLORS[i % COLORS.length] },
      })),
    },
  ],
}))
</script>

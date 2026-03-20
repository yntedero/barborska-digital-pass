<template>
  <div>
    <h3
      class="font-heading text-lg font-semibold text-(--color-sand-800) dark:text-(--color-sand-100) mb-3"
    >
      {{ t('stop.facts') }}
    </h3>

    <!-- Scroll container with fade indicators -->
    <div class="relative">
      <!-- Right fade indicator -->
      <div
        class="absolute top-0 right-0 bottom-2 w-8 bg-gradient-to-l from-(--color-sand-50) dark:from-(--color-sand-950) to-transparent z-10 pointer-events-none rounded-r-xl"
        aria-hidden="true"
      />

      <div class="flex gap-3 overflow-x-auto scroll-hide pb-2 -mx-4 px-4">
        <div
          v-for="(fact, i) in facts"
          :key="i"
          class="flex-shrink-0 w-64 bg-white dark:bg-(--color-sand-800) rounded-xl p-4 border border-(--color-sand-200) dark:border-(--color-sand-700) shadow-sm hover:shadow-md hover:border-(--color-gold-200) dark:hover:border-(--color-gold-800) transition-all duration-200"
        >
          <div class="flex items-center gap-2 mb-2">
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-br from-(--color-gold-50) to-(--color-gold-100) dark:from-(--color-gold-950) dark:to-(--color-gold-900) flex items-center justify-center shadow-sm"
            >
              <UIcon
                :name="fact.icon"
                class="size-4 text-(--color-gold-500)"
              />
            </div>
            <h4 class="font-semibold text-sm text-(--color-sand-800) dark:text-(--color-sand-100)">
              {{ fact.title }}
            </h4>
          </div>
          <p class="text-xs text-(--color-sand-500) dark:text-(--color-sand-400) leading-relaxed">
            {{ fact.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stopId: number
}>()

const { t, te } = useI18n()
const { getStop } = useTrailData()

const stop = computed(() => getStop(props.stopId))

interface Fact {
  icon: string
  title: string
  description: string
}

const factIcons: Record<number, string[]> = {
  1: ['i-lucide-landmark', 'i-lucide-pickaxe', 'i-lucide-church'],
  2: ['i-lucide-church', 'i-lucide-mountain', 'i-lucide-footprints'],
  3: ['i-lucide-gem', 'i-lucide-home', 'i-lucide-users'],
  4: ['i-lucide-tree-pine', 'i-lucide-pickaxe', 'i-lucide-compass'],
  5: ['i-lucide-church', 'i-lucide-droplets', 'i-lucide-star'],
  6: ['i-lucide-scroll', 'i-lucide-factory', 'i-lucide-bat'],
  7: ['i-lucide-mountain-snow', 'i-lucide-utensils', 'i-lucide-map-pin'],
  8: ['i-lucide-flame', 'i-lucide-home', 'i-lucide-trees'],
  9: ['i-lucide-lock', 'i-lucide-swords', 'i-lucide-route'],
  10: ['i-lucide-tent', 'i-lucide-eye', 'i-lucide-mountain'],
  11: ['i-lucide-globe', 'i-lucide-church', 'i-lucide-users'],
  12: ['i-lucide-alert-triangle', 'i-lucide-gem', 'i-lucide-history'],
  13: ['i-lucide-coins', 'i-lucide-castle', 'i-lucide-soup'],
  14: ['i-lucide-mountain', 'i-lucide-gate', 'i-lucide-compass'],
  15: ['i-lucide-castle', 'i-lucide-shield', 'i-lucide-tree-pine'],
  16: ['i-lucide-thermometer', 'i-lucide-cave', 'i-lucide-book-open'],
  17: ['i-lucide-flame', 'i-lucide-castle', 'i-lucide-tree-pine'],
  18: ['i-lucide-award', 'i-lucide-graduation-cap', 'i-lucide-droplets'],
  19: ['i-lucide-church', 'i-lucide-palette', 'i-lucide-eye'],
  20: ['i-lucide-castle', 'i-lucide-target', 'i-lucide-trees'],
  21: ['i-lucide-waves', 'i-lucide-sandwich', 'i-lucide-sun'],
  22: ['i-lucide-mountain', 'i-lucide-home', 'i-lucide-footprints'],
  23: ['i-lucide-bed', 'i-lucide-castle', 'i-lucide-heart'],
  24: ['i-lucide-castle', 'i-lucide-maximize', 'i-lucide-drama'],
  25: ['i-lucide-castle', 'i-lucide-mountain', 'i-lucide-utensils'],
  26: ['i-lucide-thermometer', 'i-lucide-droplets', 'i-lucide-heart-pulse'],
  27: ['i-lucide-church', 'i-lucide-candle', 'i-lucide-book-open'],
  28: ['i-lucide-award', 'i-lucide-castle', 'i-lucide-coins'],
  29: ['i-lucide-telescope', 'i-lucide-church', 'i-lucide-flag'],
}

const defaultIcons = ['i-lucide-info', 'i-lucide-map-pin', 'i-lucide-footprints']

const facts = computed<Fact[]>(() => {
  const icons = factIcons[props.stopId] ?? defaultIcons
  const hasTranslatedFacts = te(`factData.${props.stopId}.0.title`)

  if (hasTranslatedFacts) {
    return icons.map((icon, i) => ({
      icon,
      title: t(`factData.${props.stopId}.${i}.title`),
      description: t(`factData.${props.stopId}.${i}.desc`),
    }))
  }

  return [
    {
      icon: 'i-lucide-info',
      title: stop.value?.name ?? '',
      description: t('stopDesc.' + props.stopId),
    },
    {
      icon: 'i-lucide-map-pin',
      title: t('factData.default.1.title'),
      description: t('factData.default.1.desc'),
    },
    {
      icon: 'i-lucide-footprints',
      title: t('factData.default.2.title'),
      description: t('factData.default.2.desc'),
    },
  ]
})
</script>

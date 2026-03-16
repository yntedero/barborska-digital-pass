<script setup lang="ts">
const props = defineProps<{
  villageName: string
  stopCount: number
  visitors: number
}>()

const { t } = useI18n()
const toast = useToast()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Hardcoded realistic demand-vs-supply percentages per category
const demandSupply = computed(() => {
  // Generate somewhat deterministic values based on village name length
  const seed = props.villageName.length
  return [
    {
      label: t('admin.village.accommodation'),
      icon: 'i-lucide-bed-double',
      demand: Math.min(95, 55 + (seed * 3) % 40),
      supply: Math.min(80, 20 + (seed * 7) % 45)
    },
    {
      label: t('admin.village.food'),
      icon: 'i-lucide-utensils',
      demand: Math.min(90, 60 + (seed * 5) % 30),
      supply: Math.min(85, 30 + (seed * 11) % 50)
    },
    {
      label: t('admin.village.water'),
      icon: 'i-lucide-droplets',
      demand: Math.min(85, 40 + (seed * 2) % 35),
      supply: Math.min(95, 50 + (seed * 9) % 45)
    }
  ]
})

const accommodationDemand = computed(() => demandSupply.value[0].demand)
const accommodationSupply = computed(() => demandSupply.value[0].supply)

function handleExportPdf() {
  toast.add({
    title: t('admin.village.exportPdf'),
    description: t('admin.village.exportSuccess', { name: props.villageName }),
    icon: 'i-lucide-file-down',
    color: 'primary'
  })
}
</script>

<template>
  <div class="rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h3 class="font-heading text-xl font-bold text-(--color-sand-900) dark:text-(--color-sand-50)">
          {{ villageName }}
        </h3>
        <div class="flex items-center gap-4 mt-1">
          <span class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400)">
            {{ stopCount }} {{ t('admin.village.stop', stopCount) }}
          </span>
          <span class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400)">
            {{ visitors }} {{ t('admin.village.visitors') }}
          </span>
        </div>
      </div>
      <UButton
        variant="soft"
        color="primary"
        size="sm"
        icon="i-lucide-file-down"
        @click="handleExportPdf"
      >
        {{ t('admin.village.exportPdf') }}
      </UButton>
    </div>

    <!-- Demand vs Supply bars -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-(--color-sand-700) dark:text-(--color-sand-300) mb-3">
        {{ t('admin.village.demand') }}
      </h4>

      <div class="space-y-4">
        <div
          v-for="item in demandSupply"
          :key="item.label"
          class="space-y-1.5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon
                :name="item.icon"
                class="size-4 text-(--color-sand-500)"
              />
              <span class="text-sm text-(--color-sand-700) dark:text-(--color-sand-300)">
                {{ item.label }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs font-medium">
              <span class="text-(--color-gold-600) dark:text-(--color-gold-400)">{{ item.demand }}% {{ t('admin.village.demandLabel').toLowerCase() }}</span>
              <span class="text-(--color-trail-600) dark:text-(--color-trail-400)">{{ item.supply }}% {{ t('admin.village.supplyLabel').toLowerCase() }}</span>
            </div>
          </div>
          <div
            class="relative h-3.5 rounded-full overflow-hidden"
            :class="isDark ? 'bg-(--color-sand-800)' : 'bg-(--color-sand-100)'"
          >
            <!-- Supply bar (behind) -->
            <div
              class="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              :class="isDark ? 'bg-(--color-trail-600) opacity-50' : 'bg-(--color-trail-400) opacity-60'"
              :style="{ width: `${item.supply}%` }"
            />
            <!-- Demand bar (front) -->
            <div
              class="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              :class="isDark ? 'bg-(--color-gold-500) opacity-70' : 'bg-(--color-gold-500) opacity-80'"
              :style="{ width: `${item.demand}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-4 mt-3">
        <div class="flex items-center gap-1.5">
          <div class="size-2.5 rounded-full bg-(--color-gold-500)" />
          <span class="text-xs text-(--color-sand-500) dark:text-(--color-sand-400)">{{ t('admin.village.demandLabel') }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="size-2.5 rounded-full bg-(--color-trail-400)" />
          <span class="text-xs text-(--color-sand-500) dark:text-(--color-sand-400)">{{ t('admin.village.supplyLabel') }}</span>
        </div>
      </div>
    </div>

    <!-- Insight alert -->
    <div class="rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950) border border-(--color-gold-200) dark:border-(--color-gold-800) p-4 flex items-start gap-3">
      <div class="size-8 rounded-full bg-(--color-gold-100) dark:bg-(--color-gold-900) flex items-center justify-center shrink-0">
        <UIcon
          name="i-lucide-lightbulb"
          class="size-4 text-(--color-gold-600) dark:text-(--color-gold-400)"
        />
      </div>
      <p class="text-sm text-(--color-sand-700) dark:text-(--color-sand-300) leading-relaxed">
        <strong class="text-(--color-gold-700) dark:text-(--color-gold-300)">{{ accommodationDemand }}%</strong>
        {{ t('admin.village.insight') }}
        <strong class="text-(--color-gold-700) dark:text-(--color-gold-300)">{{ accommodationSupply }}%</strong>
        {{ t('admin.village.insightEnd') }}
      </p>
    </div>
  </div>
</template>

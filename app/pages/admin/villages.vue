<template>
  <div class="space-y-6">
    <!-- Page heading -->
    <div>
      <h1
        class="font-heading text-2xl font-bold text-(--color-sand-900) dark:text-(--color-sand-50)"
      >
        {{ t('admin.village.title') }}
      </h1>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Village list — sidebar on desktop, horizontal pills on mobile -->
      <div class="lg:w-72 shrink-0">
        <!-- Mobile: horizontal scroll pills -->
        <div class="lg:hidden flex gap-2 overflow-x-auto scroll-hide pb-2">
          <button
            v-for="village in villages"
            :key="village.name"
            class="shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
            :class="
              selectedVillage === village.name
                ? 'bg-(--color-gold-500) text-white shadow-md'
                : 'bg-white dark:bg-(--color-sand-900) border border-(--color-sand-200) dark:border-(--color-sand-800) text-(--color-sand-600) dark:text-(--color-sand-400) hover:border-(--color-gold-300) dark:hover:border-(--color-gold-700)'
            "
            @click="selectedVillage = village.name"
          >
            {{ village.name }}
          </button>
        </div>

        <!-- Desktop: vertical list -->
        <div
          class="hidden lg:block rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-800) bg-white dark:bg-(--color-sand-900) overflow-hidden"
        >
          <div class="p-4 border-b border-(--color-sand-200) dark:border-(--color-sand-800)">
            <h3
              class="text-sm font-semibold text-(--color-sand-600) dark:text-(--color-sand-400) uppercase tracking-wide"
            >
              {{ t('admin.villages') }} ({{ villages.length }})
            </h3>
          </div>
          <div class="max-h-[600px] overflow-y-auto">
            <button
              v-for="village in villages"
              :key="village.name"
              class="w-full text-left px-4 py-3 flex items-center justify-between transition-all duration-150"
              :class="
                selectedVillage === village.name
                  ? 'bg-(--color-gold-50) dark:bg-(--color-gold-950)/50 border-l-3 border-(--color-gold-500)'
                  : 'hover:bg-(--color-sand-50) dark:hover:bg-(--color-sand-800)/60 border-l-3 border-transparent'
              "
              @click="selectedVillage = village.name"
            >
              <div>
                <p
                  class="text-sm font-medium transition-colors"
                  :class="
                    selectedVillage === village.name
                      ? 'text-(--color-gold-700) dark:text-(--color-gold-400)'
                      : 'text-(--color-sand-700) dark:text-(--color-sand-300)'
                  "
                >
                  {{ village.name }}
                </p>
                <p class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500) mt-0.5">
                  {{ village.visitors }} {{ t('admin.village.visitors') }}
                </p>
              </div>
              <UIcon
                v-if="selectedVillage === village.name"
                name="i-lucide-chevron-right"
                class="size-4 text-(--color-gold-500)"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Village report -->
      <div class="flex-1 min-w-0">
        <AdminVillageReport
          v-if="activeVillage"
          :key="activeVillage.name"
          :village-name="activeVillage.name"
          :stop-count="activeVillage.stopCount"
          :visitors="activeVillage.visitors"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { stops } from '~/data/stops'

definePageMeta({ layout: 'admin' })

const { t } = useI18n()

// Static data — compute once at module level instead of on every re-render
const villageMap = new Map<string, { name: string; stopCount: number; visitors: number }>()
for (const stop of stops) {
  const existing = villageMap.get(stop.name)
  if (existing) {
    existing.stopCount++
  } else {
    const seed = stop.name.length + stop.id
    const visitors = Math.max(45, Math.round(350 - ((seed * 11) % 250) + Math.sin(seed) * 80))
    villageMap.set(stop.name, { name: stop.name, stopCount: 1, visitors })
  }
}
const villages = [...villageMap.values()].sort((a, b) => b.visitors - a.visitors)

const selectedVillage = ref(villages[0]?.name ?? '')

const activeVillage = computed(() => {
  return villages.find((v) => v.name === selectedVillage.value) ?? villages[0]
})
</script>

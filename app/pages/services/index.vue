<template>
  <div class="pb-24">
    <!-- Header -->
    <div class="px-4 pt-6 pb-4">
      <h1
        class="font-heading text-2xl font-bold text-(--color-sand-800) dark:text-(--color-sand-50)"
      >
        {{ t('services.title') }}
      </h1>
      <p class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400) mt-1">
        {{ t('services.subtitle') }}
      </p>
    </div>

    <!-- Category filter pills -->
    <div
      class="flex gap-2 overflow-x-auto scroll-hide px-4 pb-4"
      role="tablist"
      :aria-label="t('services.filterLabel')"
    >
      <UButton
        v-for="cat in categories"
        :key="cat"
        size="xs"
        :variant="activeCategory === cat ? 'solid' : 'outline'"
        :icon="CATEGORY_ICONS[cat]"
        :label="t('categories.' + cat)"
        :style="
          activeCategory === cat
            ? { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] }
            : undefined
        "
        :class="activeCategory === cat ? 'text-white' : ''"
        class="flex-shrink-0 rounded-full"
        role="tab"
        :aria-selected="activeCategory === cat"
        @click="toggleCategory(cat)"
      />
    </div>

    <!-- Service count -->
    <div class="px-4 mb-3">
      <p class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
        {{ t('services.count', { count: filteredServices.length }) }}
      </p>
    </div>

    <!-- Service cards -->
    <div class="px-4 space-y-3">
      <TransitionGroup
        name="list"
        tag="div"
        class="space-y-3"
      >
        <NuxtLink
          v-for="svc in filteredServices"
          :key="svc.id"
          :to="localePath(`/services/${svc.id}`)"
          class="block bg-white dark:bg-(--color-sand-800) rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-700) p-4 hover:border-(--color-gold-300) dark:hover:border-(--color-gold-700) hover:shadow-sm transition-all duration-200 active:scale-[0.99]"
        >
          <div class="flex items-start gap-3">
            <!-- Category icon -->
            <div
              class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: CATEGORY_COLORS[svc.category] + '20' }"
            >
              <UIcon
                :name="CATEGORY_ICONS[svc.category]"
                class="size-5"
                :style="{ color: CATEGORY_COLORS[svc.category] }"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3
                  class="font-semibold text-sm text-(--color-sand-800) dark:text-(--color-sand-100) truncate"
                >
                  {{ svc.name }}
                </h3>
                <UBadge
                  v-if="svc.pilgrimFriendly"
                  color="success"
                  variant="subtle"
                  size="xs"
                >
                  {{ t('services.pilgrimFriendly') }}
                </UBadge>
              </div>

              <!-- Meta -->
              <div class="flex items-center gap-3 mt-1">
                <span
                  class="text-xs text-(--color-sand-500) dark:text-(--color-sand-400) flex items-center gap-1"
                >
                  <UIcon
                    name="i-lucide-map-pin"
                    class="size-3"
                  />
                  {{ svc.stopName }}
                </span>
                <span class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
                  {{ svc.distance }}
                </span>
              </div>

              <!-- Description preview -->
              <p
                class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500) mt-1.5 line-clamp-2"
              >
                {{ t('serviceDesc.' + svc.id) }}
              </p>
            </div>

            <!-- Chevron -->
            <UIcon
              name="i-lucide-chevron-right"
              class="size-4 text-(--color-sand-300) dark:text-(--color-sand-600) flex-shrink-0 mt-3"
            />
          </div>
        </NuxtLink>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServiceCategory } from '~~/shared/types'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '~/data/services'

const { t } = useI18n()
const localePath = useLocalePath()
const { services } = useTrailData()

const activeCategory = ref<ServiceCategory | null>(null)

const categories: ServiceCategory[] = ['bed', 'food', 'water', 'bike', 'shelter', 'medical']

const filteredServices = computed(() => {
  if (!activeCategory.value) return services
  return services.filter((s) => s.category === activeCategory.value)
})

function toggleCategory(cat: ServiceCategory) {
  activeCategory.value = activeCategory.value === cat ? null : cat
}
</script>

<style scoped>
.list-enter-active {
  transition: all 0.3s ease;
}
.list-leave-active {
  transition: all 0.2s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

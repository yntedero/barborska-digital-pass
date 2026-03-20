<template>
  <div
    class="relative"
    style="height: calc(100dvh - 56px - 60px)"
  >
    <!-- Map loading placeholder -->
    <div
      v-if="!mapReady"
      class="absolute inset-0 flex items-center justify-center bg-(--color-sand-100) dark:bg-(--color-sand-900) z-0"
    >
      <div class="text-center">
        <UIcon
          name="i-lucide-map"
          class="size-12 text-(--color-sand-300) dark:text-(--color-sand-600) mb-2 mx-auto animate-pulse"
        />
        <p class="text-sm text-(--color-sand-400)">
          {{ t('map.loadingMap') }}
        </p>
      </div>
    </div>

    <!-- Full-screen map -->
    <ClientOnly>
      <VisitorStopMap
        v-if="centerStop"
        :key="`fullmap-${$i18n.locale}`"
        :stop="centerStop"
        :show-all-stops="true"
        :show-all-services="true"
        :show-nearby="false"
        :full-height="true"
        :interactive="true"
        :user-position="userLocation"
        :filter-categories="activeCategories"
        @stop-click="handleStopClick"
        @service-click="handleServiceClick"
      />
      <template #fallback>
        <div
          class="absolute inset-0 flex items-center justify-center bg-(--color-sand-100) dark:bg-(--color-sand-900)"
        >
          <div class="text-center">
            <UIcon
              name="i-lucide-map"
              class="size-12 text-(--color-sand-300) dark:text-(--color-sand-600) mb-2 mx-auto animate-pulse"
            />
            <p class="text-sm text-(--color-sand-400)">
              {{ t('map.loadingMap') }}
            </p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Locate me button -->
    <div class="absolute top-4 right-4 z-[500]">
      <button
        class="w-12 h-12 bg-white dark:bg-(--color-sand-800) rounded-xl shadow-lg border border-(--color-sand-200) dark:border-(--color-sand-700) flex items-center justify-center hover:bg-(--color-sand-50) dark:hover:bg-(--color-sand-700) transition-all active:scale-95"
        :class="locationError ? 'ring-2 ring-red-300' : ''"
        :disabled="locatingUser"
        :aria-label="t('map.myLocation')"
        @click="locateUser"
      >
        <UIcon
          name="i-lucide-locate"
          class="size-5"
          :class="[
            locatingUser ? 'animate-pulse text-(--color-gold-500)' : '',
            locationError ? 'text-red-400' : 'text-(--color-gold-500)',
          ]"
        />
      </button>
    </div>

    <!-- Category filter buttons at bottom -->
    <div
      class="absolute left-0 right-0 z-[500] px-4"
      style="bottom: max(16px, env(safe-area-inset-bottom, 0px))"
    >
      <div
        class="bg-white/95 dark:bg-(--color-sand-800)/95 backdrop-blur-lg rounded-xl shadow-lg border border-(--color-sand-200) dark:border-(--color-sand-700) p-2"
      >
        <div class="flex gap-1.5 overflow-x-auto scroll-hide">
          <UButton
            v-for="cat in categories"
            :key="cat"
            size="xs"
            :variant="activeCategories.has(cat) ? 'solid' : 'ghost'"
            :icon="CATEGORY_ICONS[cat]"
            :label="t('categories.' + cat)"
            :style="
              activeCategories.has(cat)
                ? { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] }
                : undefined
            "
            :class="activeCategories.has(cat) ? 'text-white' : ''"
            class="flex-shrink-0"
            :aria-pressed="activeCategories.has(cat)"
            @click="toggleCategory(cat)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServiceCategory } from '~~/shared/types'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '~/data/services'
import { stops } from '~/data/stops'

const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({
  layout: 'default',
})

const categories: ServiceCategory[] = ['bed', 'food', 'water', 'bike', 'shelter', 'medical']
const activeCategories = ref<Set<ServiceCategory>>(new Set())

function toggleCategory(cat: ServiceCategory) {
  const newSet = new Set(activeCategories.value)
  if (newSet.has(cat)) {
    newSet.delete(cat)
  } else {
    newSet.add(cat)
  }
  activeCategories.value = newSet
}

// Use the first stop as center reference
const centerStop = computed(() => stops[0])

function handleStopClick(stopId: number) {
  navigateTo(localePath(`/stop/${stopId}`))
}

function handleServiceClick(serviceId: number) {
  navigateTo(localePath(`/services/${serviceId}`))
}

// User location — getCurrentPosition (reliable on all mobile browsers)
const userLocation = ref<{ lat: number; lng: number } | null>(null)
const locatingUser = ref(false)
const locationError = ref(false)
const geoSupported = useSupported(() => navigator && 'geolocation' in navigator)

async function locateUser() {
  if (!geoSupported.value) {
    locationError.value = true
    return
  }
  locatingUser.value = true
  locationError.value = false

  try {
    const pos = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 60000,
    })
    userLocation.value = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    }
    locatingUser.value = false
  } catch {
    locatingUser.value = false
    locationError.value = true
  }
}

// Map loaded state
const mapReady = ref(false)
onMounted(() => {
  mapReady.value = true
})
</script>

<template>
  <div
    v-if="service"
    class="pb-24"
  >
    <!-- Back button -->
    <div class="px-4 pt-4">
      <UButton
        variant="ghost"
        color="neutral"
        size="sm"
        class="min-h-[44px] -ml-2"
        @click="goBack"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-4"
        />
        {{ t('common.back') }}
      </UButton>
    </div>

    <!-- Map -->
    <div class="px-4 mt-3">
      <ClientOnly>
        <VisitorStopMap
          v-if="stop"
          :stop="{ ...stop, lat: service.lat, lng: service.lng }"
          :show-nearby="false"
        />
        <template #fallback>
          <div
            class="w-full h-56 rounded-xl bg-(--color-sand-100) dark:bg-(--color-sand-800) border border-(--color-sand-200) dark:border-(--color-sand-700) flex items-center justify-center"
          >
            <div class="text-center">
              <UIcon
                name="i-lucide-map"
                class="size-8 text-(--color-sand-300) dark:text-(--color-sand-600) mx-auto mb-1"
              />
              <p class="text-xs text-(--color-sand-400)">
                {{ t('map.loadingMap') }}
              </p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Content -->
    <div class="px-4 mt-4 space-y-4">
      <!-- Header card -->
      <div
        class="bg-white dark:bg-(--color-sand-800) rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-700) p-5"
      >
        <!-- Category badge -->
        <div class="flex items-center gap-2 mb-3">
          <UBadge
            variant="subtle"
            size="sm"
            :style="{
              backgroundColor: CATEGORY_COLORS[service.category] + '20',
              color: CATEGORY_COLORS[service.category]
            }"
          >
            <UIcon
              :name="CATEGORY_ICONS[service.category]"
              class="size-3 mr-1"
            />
            {{ CATEGORY_LABELS[service.category] }}
          </UBadge>
          <UBadge
            v-if="service.pilgrimFriendly"
            color="success"
            variant="subtle"
            size="sm"
          >
            {{ t('services.pilgrimFriendly') }}
          </UBadge>
        </div>

        <!-- Name -->
        <h1
          class="font-heading text-2xl font-bold text-(--color-sand-800) dark:text-(--color-sand-50) mb-2 leading-tight"
        >
          {{ service.name }}
        </h1>

        <!-- Description -->
        <p class="text-sm text-(--color-sand-600) dark:text-(--color-sand-300) leading-relaxed">
          {{ service.desc }}
        </p>
      </div>

      <!-- Info items -->
      <div
        class="bg-white dark:bg-(--color-sand-800) rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-700) divide-y divide-(--color-sand-100) dark:divide-(--color-sand-700)"
      >
        <!-- Near stop -->
        <div class="flex items-center gap-3 px-4 py-3 min-h-[52px]">
          <div
            class="w-9 h-9 rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950) flex items-center justify-center flex-shrink-0"
          >
            <UIcon
              name="i-lucide-map-pin"
              class="size-4 text-(--color-gold-500)"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
              {{ t('services.nearStop') }}
            </p>
            <p class="text-sm font-medium text-(--color-sand-800) dark:text-(--color-sand-100)">
              {{ service.stopName }}
            </p>
          </div>
          <NuxtLink
            v-if="stop"
            :to="localePath(`/stop/${stop.id}`)"
            class="text-xs text-(--color-gold-500) hover:underline font-medium min-h-[44px] flex items-center"
          >
            {{ t('stop.stopLabel') }} {{ stop.id }}
          </NuxtLink>
        </div>

        <!-- Distance -->
        <div class="flex items-center gap-3 px-4 py-3 min-h-[52px]">
          <div
            class="w-9 h-9 rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950) flex items-center justify-center flex-shrink-0"
          >
            <UIcon
              name="i-lucide-ruler"
              class="size-4 text-(--color-gold-500)"
            />
          </div>
          <div>
            <p class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
              {{ t('services.distance') }}
            </p>
            <p class="text-sm font-medium text-(--color-sand-800) dark:text-(--color-sand-100)">
              {{ service.distance }}
            </p>
          </div>
        </div>

        <!-- Hours -->
        <div
          v-if="service.hours"
          class="flex items-center gap-3 px-4 py-3 min-h-[52px]"
        >
          <div
            class="w-9 h-9 rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950) flex items-center justify-center flex-shrink-0"
          >
            <UIcon
              name="i-lucide-clock"
              class="size-4 text-(--color-gold-500)"
            />
          </div>
          <div>
            <p class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
              {{ t('services.hours') }}
            </p>
            <p class="text-sm font-medium text-(--color-sand-800) dark:text-(--color-sand-100)">
              {{ service.hours }}
            </p>
          </div>
        </div>

        <!-- Phone -->
        <div
          v-if="service.phone"
          class="flex items-center gap-3 px-4 py-3 min-h-[52px]"
        >
          <div
            class="w-9 h-9 rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950) flex items-center justify-center flex-shrink-0"
          >
            <UIcon
              name="i-lucide-phone"
              class="size-4 text-(--color-gold-500)"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500)">
              {{ t('services.call') }}
            </p>
            <a
              :href="`tel:${service.phone}`"
              class="text-sm font-medium text-(--color-gold-600) dark:text-(--color-gold-400) hover:underline"
            >
              {{ service.phone }}
            </a>
          </div>
          <a
            :href="`tel:${service.phone}`"
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950) text-(--color-gold-600) dark:text-(--color-gold-400) text-xs font-medium min-h-[44px] hover:bg-(--color-gold-100) dark:hover:bg-(--color-gold-900) transition-colors"
            :aria-label="`${t('services.call')} ${service.phone}`"
          >
            <UIcon
              name="i-lucide-phone"
              class="size-3.5"
            />
            {{ t('services.call') }}
          </a>
        </div>
      </div>

      <!-- Directions button -->
      <UButton
        block
        size="xl"
        color="primary"
        class="font-semibold min-h-[52px]"
        @click="openDirections"
      >
        <UIcon
          name="i-lucide-navigation"
          class="size-5"
        />
        {{ t('services.directions') }}
      </UButton>
    </div>
  </div>

  <!-- Service not found -->
  <div
    v-else
    class="flex flex-col items-center justify-center min-h-[60vh] px-4"
  >
    <UIcon
      name="i-lucide-compass"
      class="size-16 text-(--color-sand-300) dark:text-(--color-sand-600) mb-4"
    />
    <p class="text-(--color-sand-500) dark:text-(--color-sand-400) text-center">
      {{ t('services.notFound') }}
    </p>
    <UButton
      :to="localePath('/services')"
      color="primary"
      variant="soft"
      size="md"
      class="mt-4 min-h-[44px]"
    >
      {{ t('common.back') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_COLORS } from '~/data/services'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { getService, getStop } = useTrailData()

definePageMeta({
  layout: 'default'
})

const serviceId = computed(() => Number(route.params.id))
const service = computed(() => getService(serviceId.value))
const stop = computed(() => (service.value ? getStop(service.value.stopId) : undefined))

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo(localePath('/services'))
  }
}

function openDirections() {
  if (!service.value) return
  const url = `https://www.google.com/maps/dir/?api=1&destination=${service.value.lat},${service.value.lng}&travelmode=walking`
  window.open(url, '_blank')
}
</script>

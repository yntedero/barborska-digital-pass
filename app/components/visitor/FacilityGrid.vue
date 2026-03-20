<template>
  <div>
    <h3
      class="font-heading text-lg font-semibold text-(--color-sand-800) dark:text-(--color-sand-100) mb-3"
    >
      {{ t('stop.facilities') }}
    </h3>
    <div class="grid grid-cols-4 sm:grid-cols-4 gap-2">
      <div
        v-for="(facility, index) in allFacilities"
        :key="facility"
        class="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 transition-all duration-300"
        :class="[
          facilities.includes(facility)
            ? 'bg-(--color-trail-50) dark:bg-(--color-trail-950) border border-(--color-trail-200) dark:border-(--color-trail-800)'
            : 'bg-(--color-sand-100) dark:bg-(--color-sand-800) border border-(--color-sand-200) dark:border-(--color-sand-700) opacity-30',
        ]"
        :style="
          facilities.includes(facility) && ready
            ? { transitionDelay: `${index * 50}ms` }
            : undefined
        "
        :role="facilities.includes(facility) ? 'status' : undefined"
        :aria-label="`${t('facilities.' + facility)} — ${facilities.includes(facility) ? t('stop.facilityAvailable') : t('stop.facilityUnavailable')}`"
      >
        <UIcon
          :name="FACILITY_ICONS[facility]"
          class="size-5 transition-colors"
          :class="
            facilities.includes(facility)
              ? 'text-(--color-trail-500)'
              : 'text-(--color-sand-400) dark:text-(--color-sand-500)'
          "
        />
        <span
          class="text-[10px] font-medium text-center leading-tight"
          :class="
            facilities.includes(facility)
              ? 'text-(--color-trail-700) dark:text-(--color-trail-300)'
              : 'text-(--color-sand-400) dark:text-(--color-sand-500)'
          "
        >
          {{ t('facilities.' + facility) }}
        </span>

        <!-- Availability indicator -->
        <div
          v-if="facilities.includes(facility)"
          class="w-1 h-1 rounded-full bg-(--color-trail-400)"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FacilityType } from '~~/shared/types'
import { FACILITY_ICONS } from '~/data/stops'

defineProps<{
  facilities: FacilityType[]
}>()

const { t } = useI18n()

const allFacilities: FacilityType[] = [
  'wc',
  'water',
  'food',
  'bed',
  'bike',
  'parking',
  'medical',
  'shelter',
]

const ready = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    ready.value = true
  })
})
</script>

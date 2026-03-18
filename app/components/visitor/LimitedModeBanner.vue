<template>
  <div
    v-if="!dismissed"
    class="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/50 dark:border-amber-800/50 rounded-xl text-sm"
  >
    <UIcon
      name="i-lucide-map-pin-off"
      class="size-4 text-amber-500 flex-shrink-0"
    />
    <span class="flex-1 text-amber-700 dark:text-amber-300 text-xs">
      {{ t('gps.limitedBanner') }}
    </span>
    <button
      class="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex-shrink-0"
      @click="emit('enableGps')"
    >
      {{ t('gps.enableButton') }}
    </button>
    <button
      class="text-amber-400 dark:text-amber-600 hover:text-amber-600 dark:hover:text-amber-400 flex-shrink-0"
      :aria-label="t('common.close')"
      @click="dismissed = true"
    >
      <UIcon
        name="i-lucide-x"
        class="size-3.5"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  enableGps: []
}>()

const dismissed = ref(false)
</script>

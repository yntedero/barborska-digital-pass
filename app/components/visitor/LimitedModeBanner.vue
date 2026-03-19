<template>
  <UAlert
    v-if="!dismissed"
    icon="i-lucide-map-pin-off"
    :title="t('gps.limitedBanner')"
    color="warning"
    variant="soft"
    :close="true"
    :ui="{ root: 'items-center' }"
    @update:open="dismissed = true"
  >
    <template #actions>
      <UButton
        size="xs"
        color="warning"
        variant="subtle"
        :label="t('gps.enableButton')"
        @click="emit('enableGps')"
      />
    </template>
  </UAlert>
</template>

<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  enableGps: []
}>()

const dismissed = ref(false)
</script>

<template>
  <UBadge
    v-if="state === 'validated'"
    color="success"
    variant="subtle"
    size="sm"
    class="ml-auto"
  >
    <UIcon
      name="i-lucide-check-circle-2"
      class="size-3 mr-1"
    />
    {{ t('stop.validated') }}
  </UBadge>
  <UBadge
    v-else-if="state === 'partial'"
    color="warning"
    variant="subtle"
    size="sm"
    class="ml-auto"
  >
    <UIcon
      name="i-lucide-map-pin-check"
      class="size-3 mr-1"
    />
    {{ t('stop.partial') }}
  </UBadge>
</template>

<script setup lang="ts">
import type { StampState } from '~~/shared/types'

defineProps<{
  state: StampState
}>()

const { t } = useI18n()
</script>

<template>
  <UButton
    :to="switchLocalePath(otherLocale)"
    variant="ghost"
    color="neutral"
    size="sm"
    class="font-semibold text-xs tracking-wide min-w-[44px] min-h-[44px]"
    :aria-label="locale === 'sk' ? 'Switch to English' : 'Prepnúť na slovenčinu'"
  >
    {{ label }}
  </UButton>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const otherLocale = computed(() => (locale.value === 'sk' ? 'en' : 'sk'))
const label = computed(() => (locale.value === 'sk' ? 'EN' : 'SK'))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale, t } = useI18n()

useHead(() => ({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/logo.png' },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
}))

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogTitle: () => t('seo.title'),
  ogDescription: () => t('seo.description'),
})

// Global: suppress Leaflet cleanup errors during route/locale transitions
onErrorCaptured((err) => {
  if (err instanceof TypeError) {
    const msg = err.message
    if (
      msg.includes('_leaflet_id') ||
      msg.includes('Map container not found') ||
      msg.includes('Map container is already initialized') ||
      msg.includes('appendChild') ||
      msg.includes('removeLayer') ||
      msg.includes("Failed to execute 'observe'") ||
      (msg.includes('Cannot read properties of undefined') &&
        (msg.includes('off') || msg.includes('appendChild') || msg.includes('_panes')))
    ) {
      return false
    }
  }
})
</script>

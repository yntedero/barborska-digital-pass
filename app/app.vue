<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale, t } = useI18n()

useHead(() => ({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
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

// Global: suppress Leaflet cleanup errors during route transitions
onErrorCaptured((err) => {
  if (
    err instanceof TypeError &&
    (err.message.includes('_leaflet_id') ||
      err.message.includes('Map container not found') ||
      err.message.includes('Map container is already initialized'))
  ) {
    return false
  }
})
</script>

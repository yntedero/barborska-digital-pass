<script setup lang="ts">
const localePath = useLocalePath()
const passport = usePassportStore()

definePageMeta({
  layout: false
})

// If consent already given, redirect immediately (works on both server and client)
if (import.meta.client && passport.gdprConsent !== null) {
  await navigateTo(localePath('/stop/1'), { replace: true })
}

function handleAccept() {
  passport.gdprConsent = true
  navigateTo(localePath('/stop/1'), { replace: true })
}

function handleDecline() {
  passport.gdprConsent = false
  navigateTo(localePath('/stop/1'), { replace: true })
}

// Double-check on mount (covers SSR hydration edge case)
onMounted(() => {
  if (passport.gdprConsent !== null) {
    navigateTo(localePath('/stop/1'), { replace: true })
  }
})
</script>

<template>
  <div class="min-h-dvh bg-(--color-sand-50) dark:bg-(--color-sand-950) flex items-center justify-center">
    <!-- Background decoration -->
    <div
      class="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div class="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-(--color-gold-200)/20 dark:bg-(--color-gold-900)/10 blur-3xl" />
      <div class="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-(--color-gold-300)/15 dark:bg-(--color-gold-800)/10 blur-3xl" />
    </div>

    <VisitorGdprConsent
      @accept="handleAccept"
      @decline="handleDecline"
    />
  </div>
</template>

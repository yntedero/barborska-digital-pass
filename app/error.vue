<template>
  <div
    class="min-h-dvh bg-(--color-sand-50) dark:bg-(--color-sand-950) flex items-center justify-center px-4"
  >
    <div class="text-center max-w-sm w-full">
      <!-- Logo -->
      <div class="mb-6 flex justify-center">
        <img
          src="/logo.png"
          alt="Barborská cesta"
          class="size-20 drop-shadow-md"
        />
      </div>

      <!-- Status code -->
      <p class="font-heading text-7xl font-bold text-(--color-gold-500) mb-2 leading-none">
        {{ error?.statusCode || 500 }}
      </p>

      <!-- Title -->
      <h1
        class="font-heading text-2xl font-bold text-(--color-sand-800) dark:text-(--color-sand-50) mb-3"
      >
        {{ errorTitle }}
      </h1>

      <!-- Decorative divider -->
      <div class="flex items-center justify-center gap-3 mb-4">
        <div class="h-px w-12 bg-(--color-gold-300)/50" />
        <UIcon
          name="i-lucide-mountain"
          class="size-4 text-(--color-gold-400)"
        />
        <div class="h-px w-12 bg-(--color-gold-300)/50" />
      </div>

      <!-- Description -->
      <p
        class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400) leading-relaxed mb-8 px-2"
      >
        {{ errorDesc }}
      </p>

      <!-- Back home button -->
      <UButton
        size="lg"
        color="primary"
        class="min-h-[48px] min-w-[200px]"
        @click="handleError"
      >
        <UIcon
          name="i-lucide-route"
          class="size-4"
        />
        {{ t('error.backHome') }}
      </UButton>

      <!-- Tagline -->
      <p class="mt-10 text-xs text-(--color-sand-400) dark:text-(--color-sand-600)">
        {{ t('brand.tagline') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const is404 = computed(() => props.error?.statusCode === 404)
const isServerError = computed(() => (props.error?.statusCode ?? 500) >= 500)

const errorTitle = computed(() => {
  if (is404.value) return t('error.notFoundTitle')
  if (isServerError.value) return t('error.serverTitle')
  return t('error.title')
})

const errorDesc = computed(() => {
  if (is404.value) return t('error.notFoundDesc')
  if (isServerError.value) return t('error.serverDesc')
  return t('error.desc')
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

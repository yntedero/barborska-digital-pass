<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    :aria-label="mode === 'request' ? t('gps.enableTitle') : t('gps.limitedTitle')"
  >
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="visible"
        class="absolute inset-0 bg-(--color-sand-950)/50 backdrop-blur-sm"
        aria-hidden="true"
      />
    </Transition>

    <!-- Modal -->
    <Transition name="slide-up">
      <div
        v-if="visible"
        class="relative w-full max-w-md bg-white dark:bg-(--color-sand-900) rounded-2xl shadow-2xl overflow-hidden"
      >
        <!-- Header -->
        <div
          class="relative bg-gradient-to-br from-(--color-gold-50) to-(--color-gold-100) dark:from-(--color-gold-950) dark:to-(--color-sand-900) px-6 pt-8 pb-6 text-center"
        >
          <div class="relative">
            <div
              class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 dark:bg-(--color-sand-800)/80 shadow-lg mb-4 ring-1 ring-(--color-gold-200)/50 dark:ring-(--color-gold-800)/50"
            >
              <UIcon
                :name="mode === 'request' ? 'i-lucide-map-pin' : 'i-lucide-map-pin-off'"
                class="size-8 text-(--color-gold-500)"
              />
            </div>
            <h2
              class="font-heading text-2xl font-bold text-(--color-sand-800) dark:text-(--color-sand-100)"
            >
              {{ mode === 'request' ? t('gps.enableTitle') : t('gps.limitedTitle') }}
            </h2>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-5">
          <p
            class="text-sm text-(--color-sand-600) dark:text-(--color-sand-300) leading-relaxed text-center"
          >
            {{ mode === 'request' ? t('gps.enableDesc') : t('gps.limitedDesc') }}
          </p>
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6 space-y-2.5">
          <UButton
            block
            size="xl"
            color="primary"
            class="font-semibold min-h-[48px]"
            @click="emit('enable')"
          >
            <UIcon
              name="i-lucide-locate"
              class="size-5"
            />
            {{ mode === 'request' ? t('gps.enableButton') : t('gps.limitedEnableButton') }}
          </UButton>
          <UButton
            block
            size="lg"
            color="neutral"
            variant="ghost"
            class="text-sm min-h-[44px]"
            @click="emit('skip')"
          >
            {{ mode === 'request' ? t('gps.skipButton') : t('gps.limitedContinueButton') }}
          </UButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  mode: 'request' | 'limited'
}>()

const emit = defineEmits<{
  enable: []
  skip: []
}>()

const visible = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    visible.value = true
  })
})
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.96);
}
</style>

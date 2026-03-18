<template>
  <div
    class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    :aria-label="t('gdpr.title')"
  >
    <!-- Backdrop with grain texture -->
    <Transition name="fade">
      <div
        v-if="visible"
        class="absolute inset-0 bg-(--color-sand-950)/50 backdrop-blur-sm"
        aria-hidden="true"
      >
        <!-- Subtle diagonal pattern overlay -->
        <div
          class="absolute inset-0 opacity-[0.03]"
          style="background-image: repeating-linear-gradient(45deg, transparent, transparent 20px, currentColor 20px, currentColor 21px);"
        />
      </div>
    </Transition>

    <!-- Modal card -->
    <Transition name="slide-up">
      <div
        v-if="visible"
        class="relative w-full max-w-md bg-white dark:bg-(--color-sand-900) rounded-2xl shadow-2xl overflow-hidden"
      >
        <!-- Header with icon -->
        <div class="relative bg-gradient-to-br from-(--color-gold-50) to-(--color-gold-100) dark:from-(--color-gold-950) dark:to-(--color-sand-900) px-6 pt-8 pb-6 text-center overflow-hidden">
          <!-- Subtle pickaxe pattern background -->
          <div
            class="absolute inset-0 opacity-[0.04]"
            aria-hidden="true"
          >
            <div
              class="absolute inset-0"
              style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1'%3E%3Cpath d='M14.5 3.5l-11 11M2 14l4 4 8-8M15 3l3 3-3 3'/%3E%3C/svg%3E&quot;); background-size: 40px;"
            />
          </div>

          <div class="relative">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 dark:bg-(--color-sand-800)/80 shadow-lg mb-4 ring-1 ring-(--color-gold-200)/50 dark:ring-(--color-gold-800)/50">
              <UIcon
                name="i-lucide-shield-check"
                class="size-8 text-(--color-gold-500)"
              />
            </div>
            <h2 class="font-heading text-2xl font-bold text-(--color-sand-800) dark:text-(--color-sand-100)">
              {{ t('gdpr.title') }}
            </h2>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-5 space-y-4">
          <!-- What we collect -->
          <div
            class="flex gap-3"
            role="listitem"
          >
            <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950) flex items-center justify-center mt-0.5">
              <UIcon
                name="i-lucide-database"
                class="size-4 text-(--color-gold-500)"
              />
            </div>
            <div>
              <p class="font-semibold text-sm text-(--color-sand-800) dark:text-(--color-sand-100)">
                {{ t('gdpr.collect') }}
              </p>
              <p class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400) leading-relaxed">
                {{ t('gdpr.collectDesc') }}
              </p>
            </div>
          </div>

          <!-- Why -->
          <div
            class="flex gap-3"
            role="listitem"
          >
            <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-(--color-gold-50) dark:bg-(--color-gold-950) flex items-center justify-center mt-0.5">
              <UIcon
                name="i-lucide-heart-handshake"
                class="size-4 text-(--color-gold-500)"
              />
            </div>
            <div>
              <p class="font-semibold text-sm text-(--color-sand-800) dark:text-(--color-sand-100)">
                {{ t('gdpr.why') }}
              </p>
              <p class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400) leading-relaxed">
                {{ t('gdpr.whyDesc') }}
              </p>
            </div>
          </div>

          <!-- What we don't do -->
          <div
            class="flex gap-3"
            role="listitem"
          >
            <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-(--color-trail-50) dark:bg-(--color-trail-950) flex items-center justify-center mt-0.5">
              <UIcon
                name="i-lucide-shield-x"
                class="size-4 text-(--color-trail-500)"
              />
            </div>
            <div>
              <p class="font-semibold text-sm text-(--color-sand-800) dark:text-(--color-sand-100)">
                {{ t('gdpr.notDo') }}
              </p>
              <p class="text-sm text-(--color-sand-500) dark:text-(--color-sand-400) leading-relaxed">
                {{ t('gdpr.notDoDesc') }}
              </p>
            </div>
          </div>

          <!-- Note -->
          <p class="text-xs text-(--color-sand-400) dark:text-(--color-sand-500) italic border-t border-(--color-sand-200) dark:border-(--color-sand-700) pt-3">
            {{ t('gdpr.note') }}
          </p>
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6 space-y-2.5">
          <UButton
            block
            size="xl"
            color="primary"
            class="font-semibold min-h-[48px]"
            :aria-label="t('gdpr.accept')"
            @click="emit('accept')"
          >
            <UIcon
              name="i-lucide-check"
              class="size-5"
            />
            {{ t('gdpr.accept') }}
          </UButton>
          <UButton
            block
            size="lg"
            color="neutral"
            variant="ghost"
            class="text-sm min-h-[44px]"
            :aria-label="t('gdpr.decline')"
            @click="emit('decline')"
          >
            {{ t('gdpr.decline') }}
          </UButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  accept: []
  decline: []
}>()

const visible = ref(false)

onMounted(() => {
  // Trigger entrance animation after mount
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

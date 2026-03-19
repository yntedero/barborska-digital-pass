<template>
  <UModal
    v-model:open="visible"
    :close="false"
    :transition="true"
    :aria="{ describedby: undefined }"
  >
    <template #content>
      <div class="overflow-hidden rounded-2xl">
        <!-- Header -->
        <div
          class="relative bg-gradient-to-br from-(--color-gold-50) to-(--color-gold-100) dark:from-(--color-gold-950) dark:to-(--color-sand-900) px-6 pt-8 pb-6 text-center"
        >
          <div class="relative">
            <div
              class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 dark:bg-(--color-sand-800)/80 shadow-lg mb-4 ring-1 ring-(--color-gold-200)/50 dark:ring-(--color-gold-800)/50"
            >
              <UIcon
                :name="icon"
                class="size-8 text-(--color-gold-500)"
              />
            </div>
            <h2
              class="font-heading text-2xl font-bold text-(--color-sand-800) dark:text-(--color-sand-100)"
            >
              {{ title }}
            </h2>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-5">
          <p
            class="text-sm text-(--color-sand-600) dark:text-(--color-sand-300) leading-relaxed text-center"
          >
            {{ description }}
          </p>

          <!-- Settings instructions for denied mode -->
          <div
            v-if="mode === 'denied'"
            class="mt-4 space-y-2"
          >
            <div
              class="flex items-start gap-2.5 rounded-lg bg-(--color-sand-50) dark:bg-(--color-sand-800) p-3"
            >
              <UIcon
                name="i-lucide-smartphone"
                class="size-4 text-(--color-gold-500) mt-0.5 flex-shrink-0"
              />
              <p
                class="text-xs text-(--color-sand-600) dark:text-(--color-sand-300) leading-relaxed"
              >
                <strong>iOS:</strong>
                {{ t('gps.deniedIos') }}
              </p>
            </div>
            <div
              class="flex items-start gap-2.5 rounded-lg bg-(--color-sand-50) dark:bg-(--color-sand-800) p-3"
            >
              <UIcon
                name="i-lucide-smartphone"
                class="size-4 text-(--color-gold-500) mt-0.5 flex-shrink-0"
              />
              <p
                class="text-xs text-(--color-sand-600) dark:text-(--color-sand-300) leading-relaxed"
              >
                <strong>Android:</strong>
                {{ t('gps.deniedAndroid') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6 space-y-2.5">
          <UButton
            v-if="mode !== 'denied'"
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
            v-else
            block
            size="xl"
            color="primary"
            class="font-semibold min-h-[48px]"
            @click="emit('enable')"
          >
            <UIcon
              name="i-lucide-refresh-cw"
              class="size-5"
            />
            {{ t('gps.retryButton') }}
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
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  mode: 'request' | 'limited' | 'denied'
}>()

const emit = defineEmits<{
  enable: []
  skip: []
}>()

const title = computed(() => {
  if (props.mode === 'denied') return t('gps.deniedTitle')
  return props.mode === 'request' ? t('gps.enableTitle') : t('gps.limitedTitle')
})

const description = computed(() => {
  if (props.mode === 'denied') return t('gps.deniedDesc')
  return props.mode === 'request' ? t('gps.enableDesc') : t('gps.limitedDesc')
})

const icon = computed(() => {
  if (props.mode === 'denied') return 'i-lucide-shield-alert'
  return props.mode === 'request' ? 'i-lucide-map-pin' : 'i-lucide-map-pin-off'
})

const visible = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    visible.value = true
  })
})
</script>

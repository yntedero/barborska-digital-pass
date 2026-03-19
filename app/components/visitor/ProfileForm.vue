<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    :aria-label="t('profile.title')"
  >
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="visible"
        class="absolute inset-0 bg-(--color-sand-950)/50 backdrop-blur-sm"
        aria-hidden="true"
      />
    </Transition>

    <!-- Modal card -->
    <Transition name="slide-up">
      <div
        v-if="visible"
        class="relative w-full max-w-md bg-white dark:bg-(--color-sand-900) rounded-2xl shadow-2xl overflow-hidden"
      >
        <!-- Header with icon -->
        <div
          class="relative bg-gradient-to-br from-(--color-gold-50) to-(--color-gold-100) dark:from-(--color-gold-950) dark:to-(--color-sand-900) px-6 pt-8 pb-6 text-center"
        >
          <div class="relative">
            <div
              class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/80 dark:bg-(--color-sand-800)/80 shadow-lg mb-4 ring-1 ring-(--color-gold-200)/50 dark:ring-(--color-gold-800)/50"
            >
              <UIcon
                name="i-lucide-user-circle"
                class="size-8 text-(--color-gold-500)"
              />
            </div>
            <h2
              class="font-heading text-2xl font-bold text-(--color-sand-800) dark:text-(--color-sand-100)"
            >
              {{ t('profile.title') }}
            </h2>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-5 space-y-4">
          <p
            class="text-sm text-(--color-sand-600) dark:text-(--color-sand-300) leading-relaxed text-center"
          >
            {{ t('profile.desc') }}
          </p>

          <!-- Age input -->
          <div>
            <label
              for="profile-age"
              class="block text-sm font-semibold text-(--color-sand-700) dark:text-(--color-sand-200) mb-1.5"
            >
              {{ t('profile.age') }}
            </label>
            <input
              id="profile-age"
              v-model.number="age"
              type="number"
              min="1"
              max="120"
              inputmode="numeric"
              :placeholder="t('profile.agePlaceholder')"
              class="w-full px-4 py-3 rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-700) bg-(--color-sand-50) dark:bg-(--color-sand-800) text-(--color-sand-800) dark:text-(--color-sand-100) text-sm placeholder:text-(--color-sand-400) focus:outline-none focus:ring-2 focus:ring-(--color-gold-400)/50 focus:border-(--color-gold-400) transition-all"
            >
          </div>

          <!-- Country input -->
          <div>
            <label
              for="profile-country"
              class="block text-sm font-semibold text-(--color-sand-700) dark:text-(--color-sand-200) mb-1.5"
            >
              {{ t('profile.country') }}
            </label>
            <input
              id="profile-country"
              v-model="country"
              type="text"
              :placeholder="t('profile.countryPlaceholder')"
              class="w-full px-4 py-3 rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-700) bg-(--color-sand-50) dark:bg-(--color-sand-800) text-(--color-sand-800) dark:text-(--color-sand-100) text-sm placeholder:text-(--color-sand-400) focus:outline-none focus:ring-2 focus:ring-(--color-gold-400)/50 focus:border-(--color-gold-400) transition-all"
            >
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6 space-y-2.5">
          <UButton
            block
            size="xl"
            color="primary"
            class="font-semibold min-h-[48px]"
            :disabled="!isValid"
            @click="handleSubmit"
          >
            <UIcon
              name="i-lucide-check"
              class="size-5"
            />
            {{ t('profile.submit') }}
          </UButton>
          <UButton
            block
            size="lg"
            color="neutral"
            variant="ghost"
            class="text-sm min-h-[44px]"
            @click="emit('skip')"
          >
            {{ t('profile.skip') }}
          </UButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits<{
  submit: [data: { age: number; country: string }]
  skip: []
}>()

const age = ref<number | null>(null)
const country = ref('')

const isValid = computed(() => {
  return age.value && age.value > 0 && age.value <= 120 && country.value.trim().length > 0
})

function handleSubmit() {
  if (isValid.value) {
    emit('submit', { age: age.value!, country: country.value.trim() })
  }
}

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

<template>
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop (no click dismiss) -->
      <div
        class="absolute inset-0 bg-(--color-sand-950)/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <!-- Card -->
      <div
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
          <UFormField :label="t('profile.age')">
            <UInput
              v-model.number="age"
              type="number"
              :min="1"
              :max="120"
              inputmode="numeric"
              :placeholder="t('profile.agePlaceholder')"
              class="w-full"
            />
          </UFormField>

          <!-- Country autocomplete -->
          <UFormField :label="t('profile.country')">
            <UInputMenu
              v-model="selectedCountry"
              :items="countryItems"
              label-key="label"
              class="w-full"
              :placeholder="t('profile.countryPlaceholder')"
            >
              <template #leading="{ modelValue }">
                <span
                  v-if="modelValue"
                  class="size-5 text-center"
                >
                  {{ modelValue.emoji }}
                </span>
                <UIcon
                  v-else
                  name="i-lucide-earth"
                />
              </template>
              <template #item-leading="{ item }">
                <span class="size-5 text-center">{{ item.emoji }}</span>
              </template>
            </UInputMenu>
          </UFormField>
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6">
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
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { COUNTRIES, countryFlag } from '~/data/countries'

const { t, locale } = useI18n()

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  submit: [data: { age: number; country: string }]
}>()

const age = ref<number | null>(null)
const selectedCountry = ref<{
  label: string
  emoji: string
  code: string
  name: string
  nameSk: string
} | null>(null)

const countryItems = computed(() =>
  COUNTRIES.map((c) => ({
    ...c,
    label: locale.value === 'sk' ? c.nameSk : c.name,
    emoji: countryFlag(c.code),
  })),
)

const isValid = computed(() => {
  return age.value && age.value > 0 && age.value <= 120 && selectedCountry.value !== null
})

function handleSubmit() {
  if (isValid.value && selectedCountry.value) {
    emit('submit', {
      age: age.value!,
      country: selectedCountry.value.code,
    })
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

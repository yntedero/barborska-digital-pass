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

          <!-- Country autocomplete -->
          <div
            ref="countryWrapperRef"
            class="relative"
          >
            <label
              for="profile-country"
              class="block text-sm font-semibold text-(--color-sand-700) dark:text-(--color-sand-200) mb-1.5"
            >
              {{ t('profile.country') }}
            </label>
            <div class="relative">
              <!-- Selected flag prefix -->
              <span
                v-if="selectedCountry"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none z-10"
              >
                {{ countryFlag(selectedCountry.code) }}
              </span>
              <input
                id="profile-country"
                ref="countryInputRef"
                v-model="countrySearch"
                type="text"
                autocomplete="off"
                :placeholder="t('profile.countryPlaceholder')"
                class="w-full py-3 rounded-xl border border-(--color-sand-200) dark:border-(--color-sand-700) bg-(--color-sand-50) dark:bg-(--color-sand-800) text-(--color-sand-800) dark:text-(--color-sand-100) text-sm placeholder:text-(--color-sand-400) focus:outline-none focus:ring-2 focus:ring-(--color-gold-400)/50 focus:border-(--color-gold-400) transition-all"
                :class="selectedCountry ? 'pl-10 pr-4' : 'px-4'"
                @focus="handleFocus"
                @input="handleInput"
                @keydown.down.prevent="moveHighlight(1)"
                @keydown.up.prevent="moveHighlight(-1)"
                @keydown.enter.prevent="selectHighlighted"
                @keydown.escape="dropdownOpen = false"
              >
            </div>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div
                v-if="dropdownOpen && filteredCountries.length > 0"
                class="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-(--color-sand-800) border border-(--color-sand-200) dark:border-(--color-sand-700) rounded-xl shadow-xl max-h-48 overflow-y-auto scroll-hide"
              >
                <button
                  v-for="(c, idx) in filteredCountries"
                  :key="c.code"
                  type="button"
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors"
                  :class="[
                    idx === highlightedIndex
                      ? 'bg-(--color-gold-50) dark:bg-(--color-gold-950) text-(--color-sand-800) dark:text-(--color-sand-100)'
                      : 'text-(--color-sand-700) dark:text-(--color-sand-200) hover:bg-(--color-sand-50) dark:hover:bg-(--color-sand-700)',
                  ]"
                  @mousedown.prevent="selectCountry(c)"
                  @mouseenter="highlightedIndex = idx"
                >
                  <span class="text-lg flex-shrink-0">{{ countryFlag(c.code) }}</span>
                  <span class="truncate">{{ locale === 'sk' ? c.nameSk : c.name }}</span>
                </button>
              </div>
            </Transition>
          </div>
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
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { type Country, COUNTRIES, countryFlag } from '~/data/countries'

const { t, locale } = useI18n()

const emit = defineEmits<{
  submit: [data: { age: number; country: string }]
}>()

const age = ref<number | null>(null)
const countrySearch = ref('')
const selectedCountry = ref<Country | null>(null)
const dropdownOpen = ref(false)
const highlightedIndex = ref(0)
const countryInputRef = ref<HTMLInputElement | null>(null)
const countryWrapperRef = ref<HTMLElement | null>(null)

const filteredCountries = computed(() => {
  const q = countrySearch.value.toLowerCase().trim()
  if (!q) return COUNTRIES
  return COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(q)
    || c.nameSk.toLowerCase().includes(q)
    || c.code.toLowerCase() === q,
  )
})

function handleFocus() {
  dropdownOpen.value = true
  highlightedIndex.value = 0
  // If a country is already selected, show all options on focus
  if (selectedCountry.value) {
    countrySearch.value = ''
    selectedCountry.value = null
  }
}

function handleInput() {
  selectedCountry.value = null
  dropdownOpen.value = true
  highlightedIndex.value = 0
}

function moveHighlight(delta: number) {
  const len = filteredCountries.value.length
  if (len === 0) return
  highlightedIndex.value = (highlightedIndex.value + delta + len) % len
  // Scroll the highlighted item into view
  nextTick(() => {
    const container = countryWrapperRef.value?.querySelector('.overflow-y-auto')
    const item = container?.children[highlightedIndex.value] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  })
}

function selectHighlighted() {
  if (filteredCountries.value.length > 0) {
    selectCountry(filteredCountries.value[highlightedIndex.value])
  }
}

function selectCountry(c: Country) {
  selectedCountry.value = c
  countrySearch.value = locale.value === 'sk' ? c.nameSk : c.name
  dropdownOpen.value = false
}

// Close dropdown on outside click
onClickOutside(countryWrapperRef, () => {
  dropdownOpen.value = false
  // Revert text if no country selected
  if (!selectedCountry.value) {
    countrySearch.value = ''
  }
})

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

.dropdown-enter-active {
  transition: all 0.2s ease-out;
}
.dropdown-leave-active {
  transition: all 0.15s ease-in;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

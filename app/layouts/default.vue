<template>
  <div class="min-h-screen bg-(--color-sand-50) dark:bg-(--color-sand-950)">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-(--color-sand-50)/80 dark:bg-(--color-sand-950)/80 backdrop-blur-lg border-b border-(--color-gold-200)/30 dark:border-(--color-gold-900)/30">
      <div class="max-w-3xl mx-auto flex items-center justify-between px-4 h-14">
        <NuxtLink
          :to="localePath('/')"
          class="flex items-center gap-2 group"
        >
          <UIcon
            name="i-lucide-pickaxe"
            class="size-5 text-(--color-gold-500) group-hover:rotate-12 transition-transform duration-300"
          />
          <span class="font-heading text-lg font-bold text-(--color-gold-500)">{{ t('brand.name') }}</span>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav
          class="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            :class="isActive(item)
              ? 'bg-(--color-gold-100)/80 dark:bg-(--color-gold-950)/80 text-(--color-gold-600) dark:text-(--color-gold-400)'
              : 'text-(--color-sand-500) hover:text-(--color-sand-700) hover:bg-(--color-sand-100)/50 dark:text-(--color-sand-400) dark:hover:text-(--color-sand-200) dark:hover:bg-(--color-sand-800)/50'"
            :aria-current="isActive(item) ? 'page' : undefined"
          >
            <UIcon
              :name="item.icon"
              class="size-4"
            />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2">
          <VisitorLanguageSwitcher />
          <UColorModeButton />
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-3xl mx-auto">
      <slot />
    </main>

    <!-- Mobile bottom nav -->
    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-(--color-sand-50)/90 dark:bg-(--color-sand-950)/90 backdrop-blur-lg border-t border-(--color-gold-200)/30 dark:border-(--color-gold-900)/30"
      style="padding-bottom: env(safe-area-inset-bottom, 0px);"
      aria-label="Mobile navigation"
    >
      <div class="flex justify-around py-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] px-3 py-1.5 rounded-xl transition-all duration-200"
          :class="isActive(item)
            ? 'text-(--color-gold-500)'
            : 'text-(--color-sand-400) dark:text-(--color-sand-500) active:text-(--color-sand-600)'"
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <!-- Active indicator dot -->
          <span
            v-if="isActive(item)"
            class="absolute top-0.5 w-1 h-1 rounded-full bg-(--color-gold-500)"
          />
          <UIcon
            :name="item.icon"
            class="size-5"
          />
          <span class="text-[10px] font-medium leading-none">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const navItems = computed(() => [
  { label: t('nav.stops'), icon: 'i-lucide-map-pin', to: localePath('/'), match: '/' },
  { label: t('nav.services'), icon: 'i-lucide-compass', to: localePath('/services'), match: '/services' },
  { label: t('nav.map'), icon: 'i-lucide-map', to: localePath('/map'), match: '/map' },
  { label: t('nav.passport'), icon: 'i-lucide-book-open', to: localePath('/passport'), match: '/passport' }
])

function isActive(item: { to: string, match: string }) {
  const path = route.path
  // Strip locale prefix for matching
  const cleanPath = path.replace(/^\/(sk|en)/, '') || '/'
  if (item.match === '/') {
    // Home matches / and /stop/*
    return cleanPath === '/' || cleanPath.startsWith('/stop')
  }
  return cleanPath.startsWith(item.match)
}
</script>

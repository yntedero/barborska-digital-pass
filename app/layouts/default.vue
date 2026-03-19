<template>
  <div class="min-h-screen bg-(--color-sand-50) dark:bg-(--color-sand-950)">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 bg-(--color-sand-50)/80 dark:bg-(--color-sand-950)/80 backdrop-blur-lg border-b border-(--color-gold-200)/30 dark:border-(--color-gold-900)/30"
    >
      <div class="max-w-3xl mx-auto flex items-center justify-between px-4 h-14">
        <NuxtLink
          :to="localePath('/')"
          class="flex items-center gap-2 group"
        >
          <img
            src="/logo.png"
            alt="Barborská cesta"
            class="size-5 group-hover:rotate-12 transition-transform duration-300"
          />
          <span class="font-heading text-lg font-bold text-(--color-gold-500)">
            {{ t('brand.name') }}
          </span>
        </NuxtLink>

        <!-- Desktop nav -->
        <UNavigationMenu
          :items="desktopNavItems"
          class="hidden md:flex"
        />

        <div class="flex items-center gap-1.5">
          <VisitorLanguageSwitcher />
          <NuxtLink :to="localePath('/admin')">
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-bar-chart-3"
              :aria-label="t('admin.analytics')"
            />
          </NuxtLink>
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
      style="padding-bottom: env(safe-area-inset-bottom, 0px)"
      aria-label="Mobile navigation"
    >
      <div class="flex justify-around py-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] px-3 py-1.5 rounded-xl transition-all duration-200"
          :class="
            isActive(item)
              ? 'text-(--color-gold-500)'
              : 'text-(--color-sand-400) dark:text-(--color-sand-500) active:text-(--color-sand-600)'
          "
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
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const navItems = computed(() => [
  { label: t('nav.stops'), icon: 'i-lucide-map-pin', to: localePath('/'), match: '/' },
  {
    label: t('nav.services'),
    icon: 'i-lucide-compass',
    to: localePath('/services'),
    match: '/services',
  },
  { label: t('nav.map'), icon: 'i-lucide-map', to: localePath('/map'), match: '/map' },
  {
    label: t('nav.passport'),
    icon: 'i-lucide-book-open',
    to: localePath('/passport'),
    match: '/passport',
  },
])

// UNavigationMenu items with manual active state
const desktopNavItems = computed<NavigationMenuItem[]>(() =>
  navItems.value.map((item) => ({
    label: item.label,
    icon: item.icon,
    to: item.to,
    active: isActive(item),
  })),
)

function isActive(item: { to: string; match: string }) {
  const path = route.path
  const cleanPath = path.replace(/^\/(sk|en)/, '') || '/'
  if (item.match === '/') {
    return cleanPath === '/' || cleanPath.startsWith('/stop')
  }
  return cleanPath.startsWith(item.match)
}
</script>

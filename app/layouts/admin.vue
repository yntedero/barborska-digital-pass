<template>
  <div class="min-h-screen bg-(--color-sand-50) dark:bg-(--color-sand-950)">
    <!-- Admin header -->
    <header
      class="sticky top-0 z-50 bg-white/95 dark:bg-(--color-sand-900)/95 backdrop-blur border-b border-(--color-sand-200) dark:border-(--color-sand-800)"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
        <div class="flex items-center gap-3">
          <NuxtLink
            :to="localePath('/stop/1')"
            class="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="Barborská cesta"
              class="size-5"
            />
            <span class="font-heading text-lg font-bold text-(--color-gold-500)">
              {{ t('brand.name') }}
            </span>
          </NuxtLink>
          <UBadge
            color="primary"
            variant="subtle"
            size="xs"
          >
            Admin
          </UBadge>
        </div>

        <!-- Desktop tabs -->
        <UNavigationMenu
          :items="navMenuItems"
          class="hidden lg:flex"
        />

        <div class="flex items-center gap-2">
          <NuxtLink :to="localePath('/stop/1')">
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-arrow-left"
            >
              {{ t('admin.backToTrail') }}
            </UButton>
          </NuxtLink>
          <UColorModeButton />
        </div>
      </div>

      <!-- Mobile tabs (scrollable) -->
      <nav class="lg:hidden flex gap-1 px-4 pb-2 overflow-x-auto scroll-hide">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0"
          :class="
            route.path === tab.to
              ? 'bg-(--color-gold-50) dark:bg-(--color-gold-950) text-(--color-gold-600) dark:text-(--color-gold-400) shadow-sm'
              : 'text-(--color-sand-400) hover:text-(--color-sand-600)'
          "
        >
          <UIcon
            :name="tab.icon"
            class="size-3.5"
          />
          {{ tab.label }}
        </NuxtLink>
      </nav>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const tabs = computed(() => [
  { label: t('admin.dashboard'), to: localePath('/admin'), icon: 'i-lucide-layout-dashboard' },
  { label: t('admin.analytics'), to: localePath('/admin/analytics'), icon: 'i-lucide-bar-chart-3' },
  { label: t('admin.stopsTable'), to: localePath('/admin/stops'), icon: 'i-lucide-map-pin' },
  { label: t('admin.servicesTable'), to: localePath('/admin/services'), icon: 'i-lucide-compass' },
  { label: t('admin.villages'), to: localePath('/admin/villages'), icon: 'i-lucide-landmark' },
])

const navMenuItems = computed<NavigationMenuItem[]>(() =>
  tabs.value.map((tab) => ({
    label: tab.label,
    icon: tab.icon,
    to: tab.to,
    active: route.path === tab.to,
  })),
)
</script>

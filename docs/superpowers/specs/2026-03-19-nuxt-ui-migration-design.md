# Nuxt UI Full Migration — Design Spec

**Date:** 2026-03-19
**Approach:** Layered migration (by component type)
**Constraint:** All styling via Tailwind classes, no scoped `<style>` blocks where avoidable

## Overview

Migrate all custom HTML patterns to Nuxt UI (@nuxt/ui) components while preserving the existing gold/sand visual design. The migration covers modals, forms, cards, navigation, and utility components across the entire app (visitor + admin).

## Layer 1: Theming — `app.config.ts`

Configure global Nuxt UI component styles in `app.config.ts` → `ui` section so all components inherit the app's design language by default.

### Components to theme

**UModal:**
```ts
modal: {
  slots: {
    overlay: 'bg-(--color-sand-950)/50 backdrop-blur-sm',
    content: 'bg-white dark:bg-(--color-sand-900) rounded-2xl shadow-2xl sm:max-w-md w-[calc(100vw-2rem)]',
    header: 'p-0',  // custom gradient headers use full-bleed, no default padding
    body: 'px-6 py-5',
    footer: 'px-6 pb-6 flex flex-col gap-2.5'
  }
}
```

**UCard:**
```ts
card: {
  slots: {
    root: 'rounded-xl shadow-lg',
    header: 'p-5 pb-0',
    body: 'p-5',
    footer: 'p-5 pt-0'
  },
  defaultVariants: {
    variant: 'outline'
  }
}
```

**UInput:**
```ts
input: {
  slots: {
    root: 'rounded-xl'
  },
  defaultVariants: {
    size: 'lg',
    variant: 'outline'
  }
}
```

**UAlert:**
```ts
alert: {
  slots: {
    root: 'rounded-xl'
  },
  defaultVariants: {
    variant: 'soft'
  }
}
```

**UNavigationMenu:**
Custom theming via `:ui` prop per-instance to match bottom nav (mobile) and header nav (desktop) designs. Gold active indicator through Tailwind classes.

### Files changed
- `app/app.config.ts`

## Layer 2: Modals — UModal

Replace 3 custom dialog components that manually implement `<div role="dialog">` + `<Transition>` backdrop + slide-up animation with `<UModal>`.

### GpsPermissionDialog.vue
- **Before:** Manual `fixed inset-0` div, Transition fade backdrop, Transition slide-up card
- **After:** `<UModal v-model:open="visible" :close="false" :transition="true">`
- `#header` slot: gradient header div with icon (same Tailwind classes)
- `#body` slot: description text
- `#footer` slot: UButton (enable GPS) + UButton (skip)
- `:close="false"` — no X button, dialog is mandatory
- Remove scoped `<style>` block (fade/slide-up transitions handled by UModal)

### GdprConsent.vue
- **Before:** Same manual dialog pattern + pickaxe pattern overlay
- **After:** `<UModal v-model:open="visible" :close="false" :transition="true">`
- `#header` slot: gradient header with shield-check icon + pickaxe pattern
- `#body` slot: three info sections (collect, why, notDo) + note
- `#footer` slot: accept + decline UButtons
- Remove scoped `<style>` block

### ProfileForm.vue
- **Before:** Manual dialog + custom autocomplete dropdown (170+ lines)
- **After:** `<UModal v-model:open="visible" :close="false" :transition="true">`
- `#header` slot: gradient header with user-circle icon
- `#body` slot: form fields (migrated in Layer 3)
- `#footer` slot: submit UButton (no skip — mandatory)
- Remove scoped `<style>` block

### Files changed
- `app/components/visitor/GpsPermissionDialog.vue`
- `app/components/visitor/GdprConsent.vue`
- `app/components/visitor/ProfileForm.vue`

## Layer 3: Forms — UInput, UInputMenu, UFormField

Migrate ProfileForm.vue form fields to Nuxt UI form components.

### Age input
- **Before:** Custom `<input type="number">` with manual Tailwind classes
- **After:**
```vue
<UFormField :label="t('profile.age')">
  <UInput
    v-model="age"
    type="number"
    inputmode="numeric"
    :placeholder="t('profile.agePlaceholder')"
  />
</UFormField>
```
- Styling inherited from global `app.config.ts` theme

### Country autocomplete
- **Before:** ~170 lines of custom autocomplete: manual dropdown, highlight state, keyboard nav, `onClickOutside`, filtered list, flag emoji rendering
- **After:**
```vue
<UFormField :label="t('profile.country')">
  <UInputMenu
    v-model="selectedCountry"
    :items="countries"
    label-key="name"
    :placeholder="t('profile.countryPlaceholder')"
    class="w-full"
  >
    <template #leading="{ modelValue }">
      <span v-if="modelValue" class="size-5 text-center">
        {{ countryFlag(modelValue.code) }}
      </span>
      <UIcon v-else name="i-lucide-earth" />
    </template>
    <template #item-leading="{ item }">
      <span class="size-5 text-center">
        {{ countryFlag(item.code) }}
      </span>
    </template>
  </UInputMenu>
</UFormField>
```
- Built-in: keyboard navigation, search/filter, click outside, scroll
- Flag emojis via `#leading` and `#item-leading` slots
- `countries.ts` data file stays, `countryFlag()` utility stays
- Removes: `onClickOutside` dependency, manual `highlightedIndex`, manual `dropdownOpen`, `countryWrapperRef`, `countryInputRef`, all dropdown event handlers

### Files changed
- `app/components/visitor/ProfileForm.vue`

## Layer 4: Cards — UCard

Replace styled div cards with `<UCard>` across 8 locations.

### Visitor pages

**index.vue — Badge + Name card (stop info):**
- **Before:** `<div class="bg-white dark:bg-(--color-sand-800) rounded-xl shadow-lg border ...">` with content
- **After:** `<UCard>` with stop info as default slot content
- Stage badge, stop name, description, stage route — all in default slot

**stop/[id].vue — Stop info card:**
- Same pattern as index.vue
- **After:** `<UCard>` wrapping the badge + name + description content

### Passport page

**passport.vue — Progress card:**
- **Before:** Custom styled div with progress stats
- **After:** `<UCard>` default slot

**passport.vue — Stage cards (in loop):**
- **Before:** Styled divs per stage with stamp icons
- **After:** `<UCard>` per stage

### Admin components

**KpiCard.vue:**
- **Before:** `<div class="group rounded-xl border ... p-5 flex flex-col gap-3 hover:shadow-md">`
- **After:** `<UCard :ui="{ root: 'group hover:shadow-md transition-shadow' }">` — hover effect via `:ui` prop

**VillageReport.vue:**
- **Before:** Outer styled div wrapping report content
- **After:** `<UCard>` wrapper

### What stays custom
- FactCards.vue — horizontal scroll with fade effect
- NextStopCard.vue — custom gradient background
- CheckInButton.vue — not a card, it's a button with animations

### Files changed
- `app/pages/index.vue`
- `app/pages/stop/[id].vue`
- `app/pages/passport.vue`
- `app/components/admin/KpiCard.vue`
- `app/components/admin/VillageReport.vue`

## Layer 5: Navigation — UNavigationMenu

Replace manual navigation patterns in both layouts.

### default.vue — visitor navigation

**Desktop header + mobile bottom nav:**
- **Before:** Manual `<NuxtLink>` elements with `:class` conditional active state, animated indicator dot
- **After:** `<UNavigationMenu :items="navItems">` with items array:
```ts
const navItems: NavigationMenuItem[] = [
  { label: t('nav.stops'), icon: 'i-lucide-map-pin', to: localePath('/') },
  { label: t('nav.map'), icon: 'i-lucide-map', to: localePath('/map') },
  { label: t('nav.passport'), icon: 'i-lucide-stamp', to: localePath('/passport') },
  { label: t('nav.services'), icon: 'i-lucide-utensils', to: localePath('/services') }
]
```
- Active state: automatic via NuxtLink integration
- Mobile bottom bar: same `UNavigationMenu` with responsive Tailwind classes for `fixed bottom-0` positioning
- Gold active indicator: via `:ui` prop customizing active item classes

### admin.vue — admin tab navigation

- **Before:** Manual tab links with horizontal scroll, active indicator
- **After:** `<UNavigationMenu :items="adminTabs" orientation="horizontal">`
- Tabs: Dashboard, Stops, Services, Villages, Analytics with icons
- Scrollable on mobile via Tailwind overflow classes on container

### Files changed
- `app/layouts/default.vue`
- `app/layouts/admin.vue`

## Layer 6: Utilities — UAlert, UButton upgrades

### LimitedModeBanner.vue → UAlert
- **Before:** Custom div banner with icon + text + enable GPS button
- **After:**
```vue
<UAlert
  icon="i-lucide-satellite-dish"
  :title="t('gps.limitedBanner')"
  color="warning"
  variant="soft"
  :actions="[{ label: t('gps.enableButton'), click: () => emit('enableGps') }]"
/>
```

### passport.vue save note → UAlert
- **Before:** Custom styled info div
- **After:** `<UAlert icon="i-lucide-info" :description="t('passport.saveNote')" color="neutral" variant="soft" />`

### map.vue category filter buttons
- **Before:** Custom `<button>` elements with dynamic `:style` backgroundColor
- **After:** `<UButton>` per category with `:variant` toggle (`solid` when active, `ghost` when inactive), `:style` for dynamic category color

### admin VisitTrendChart.vue range buttons
- **Before:** Custom `<button>` for 7/30/90 day ranges
- **After:** `<UButton>` per range, `variant="solid"` for active, `variant="ghost"` for inactive

### Files changed
- `app/components/visitor/LimitedModeBanner.vue`
- `app/pages/passport.vue`
- `app/pages/map.vue`
- `app/components/admin/VisitTrendChart.vue`

## Components NOT migrated (justified)

| Component | Reason |
|---|---|
| CheckInButton.vue | Complex pulse/scale animations, haptic feedback — beyond UButton scope |
| StampIcon.vue | SVG-based circular stamp with conditional states — design-specific |
| FactCards.vue | Horizontal scroll with fade effect — intentional custom layout |
| NextStopCard.vue | Custom gradient background, Google Maps integration |
| StopMap.client.vue | Leaflet map component — third-party library |
| ECharts components (6) | Chart library components — not UI components |

## CSS changes

### app/assets/css/main.css
- Keep: Tailwind imports, `@nuxt/ui` import, theme colors, `leaflet-div-icon` fix, animations (`stamp-pulse`, `location-pulse`), `scroll-hide`, dark mode vars
- Remove: Nothing (all custom CSS is either theme or animation related, not component scaffolding)

## Migration order

1. `app.config.ts` theming
2. GpsPermissionDialog → UModal
3. GdprConsent → UModal
4. ProfileForm → UModal + UInput + UInputMenu + UFormField
5. index.vue cards → UCard
6. stop/[id].vue cards → UCard
7. passport.vue cards + alert → UCard + UAlert
8. KpiCard.vue → UCard
9. VillageReport.vue → UCard
10. default.vue nav → UNavigationMenu
11. admin.vue nav → UNavigationMenu
12. LimitedModeBanner → UAlert
13. map.vue buttons → UButton
14. VisitTrendChart buttons → UButton

## Success criteria

- All Nuxt UI components render with gold/sand theme
- Existing visual design preserved (same layout, colors, spacing)
- No scoped `<style>` blocks for component scaffolding (transitions, backdrops)
- All styling via Tailwind classes or `app.config.ts` `:ui` customization
- Lint passes (`pnpm lint`)
- App loads and navigates correctly (`pnpm dev`)

# Nuxt UI Full Migration — Design Spec

**Date:** 2026-03-19
**Approach:** Layered migration (by component type)
**Constraint:** All styling via Tailwind classes, no scoped `<style>` blocks where avoidable

## Overview

Migrate all custom HTML patterns to Nuxt UI (@nuxt/ui) components while preserving the existing gold/sand visual design. The migration covers modals, forms, cards, navigation, and utility components across the entire app (visitor + admin).

**Reference implementation:** `passport.vue` (line ~165) already uses `<UModal v-model:open>` with `#content` slot correctly. This is the canonical pattern for all modal migrations.

## Layer 1: Theming — `app.config.ts`

Configure global Nuxt UI component styles in `app.config.ts` → `ui` section so all components inherit the app's design language by default.

### Components to theme

**UModal:**
```ts
modal: {
  slots: {
    overlay: 'bg-(--color-sand-950)/50 backdrop-blur-sm',
    content: 'bg-white dark:bg-(--color-sand-900) rounded-2xl shadow-2xl sm:max-w-md w-[calc(100vw-2rem)]'
  }
}
```
Note: No header/body/footer slot theming — modals use `#content` slot for full layout control.

**UCard:**
```ts
card: {
  slots: {
    root: 'rounded-xl',
    header: 'p-5 pb-0',
    body: 'p-5',
    footer: 'p-5 pt-0'
  },
  defaultVariants: {
    variant: 'outline'
  }
}
```
Note: No global `shadow-lg` — shadows applied per-instance via `:ui` or class where needed (visitor cards get shadow, admin cards don't).

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
Custom theming via `:ui` prop per-instance. Gold active indicator through Tailwind classes.

### Files changed
- `app/app.config.ts`

## Layer 2: Modals — UModal with `#content` slot

Replace 3 custom dialog components that manually implement `<div role="dialog">` + `<Transition>` backdrop + slide-up animation with `<UModal>`.

All modals use the **`#content` slot** (not `#header`/`#body`/`#footer`) because the gradient headers require full-bleed layout control. This matches the existing pattern in `passport.vue`.

### GpsPermissionDialog.vue
- **Before:** Manual `fixed inset-0` div, Transition fade backdrop, Transition slide-up card
- **After:** `<UModal v-model:open="visible" :close="false" :transition="true">`
- `#content` slot contains the entire dialog layout:
  - Gradient header div with icon (same Tailwind classes as current)
  - Description text section
  - Action buttons (UButton enable GPS + UButton skip)
- Note: `:close="false"` is technically redundant when using `#content` slot (no default close button rendered), but kept as defensive documentation that these dialogs are mandatory.
- Remove scoped `<style>` block (fade/slide-up transitions handled by UModal)

### GdprConsent.vue
- **Before:** Same manual dialog pattern + pickaxe pattern overlay in backdrop
- **After:** `<UModal v-model:open="visible" :close="false" :transition="true">`
- `#content` slot contains the entire dialog layout:
  - Gradient header with shield-check icon + pickaxe pattern (moved from backdrop to header area)
  - Three info sections (collect, why, notDo) + note
  - Accept + decline UButtons
- Note: The diagonal line pattern currently on the backdrop moves into the header section inside `#content`, since UModal's overlay is themed globally and doesn't support per-instance pattern overlays easily.
- Remove scoped `<style>` block

### ProfileForm.vue
- **Before:** Manual dialog + custom autocomplete dropdown (170+ lines)
- **After:** `<UModal v-model:open="visible" :close="false" :transition="true">`
- `#content` slot contains the entire dialog layout:
  - Gradient header with user-circle icon
  - Form fields (migrated in Layer 3)
  - Submit UButton (no skip — mandatory)
- Remove scoped `<style>` block (including dropdown transition styles)

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

Replace styled div cards with `<UCard>` across visitor and admin pages. Visitor cards get `shadow-lg` via `:ui` or class; admin cards stay borderless/shadow-free unless they already have shadow.

### Visitor pages

**index.vue — Badge + Name card (stop info):**
- **Before:** `<div class="bg-white dark:bg-(--color-sand-800) rounded-xl shadow-lg border ...">` with content
- **After:** `<UCard :ui="{ root: 'shadow-lg' }">` with stop info as default slot content
- Stage badge, stop name, description, stage route — all in default slot

**stop/[id].vue — Stop info card:**
- Same pattern as index.vue
- **After:** `<UCard :ui="{ root: 'shadow-lg' }">` wrapping the badge + name + description content

**services/[id].vue — Service header card + info card:**
- **Before:** Two `bg-white ... rounded-xl border ...` divs (header card ~lines 52-92, info card ~lines 95-203)
- **After:** `<UCard>` for each, with `:ui="{ root: 'shadow-lg' }"` where applicable

### Passport page

**passport.vue — Progress card:**
- **Before:** Custom styled div with progress stats
- **After:** `<UCard :ui="{ root: 'shadow-lg' }">` default slot

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

**admin/analytics.vue — Stage stat cards + table wrapper:**
- **Before:** Per-stage cards in grid with `rounded-xl border ... bg-white ... hover:shadow-md`; stops table wrapped in `rounded-xl border ... bg-white` div
- **After:** `<UCard :ui="{ root: 'hover:shadow-md transition-shadow' }">` per stage; `<UCard>` wrapping the table

**Admin chart wrapper components:**
All admin chart components wrap content in `rounded-xl border ... bg-white dark:bg-(--color-sand-900) p-5` divs — same card pattern:
- ActivityFeed.vue → `<UCard>`
- StageFunnel.vue → `<UCard>`
- CountryDonut.vue → `<UCard>`
- VisitTrendChart.vue → `<UCard>`
- TopStopsChart.vue → `<UCard>`
- StageBarChart.vue → `<UCard>`
- TravelModePie.vue → `<UCard>`

**admin/stops.vue + admin/services.vue — Table wrapper cards:**
- **Before:** Table wrapped in `rounded-xl border ... bg-white` div
- **After:** `<UCard>` wrapper

### What stays custom
- FactCards.vue — horizontal scroll with fade effect
- NextStopCard.vue — custom gradient background
- CheckInButton.vue — not a card, it's a button with animations

### Files changed
- `app/pages/index.vue`
- `app/pages/stop/[id].vue`
- `app/pages/services/[id].vue`
- `app/pages/passport.vue`
- `app/pages/admin/analytics.vue`
- `app/pages/admin/stops.vue`
- `app/pages/admin/services.vue`
- `app/components/admin/KpiCard.vue`
- `app/components/admin/VillageReport.vue`
- `app/components/admin/ActivityFeed.vue`
- `app/components/admin/StageFunnel.vue`
- `app/components/admin/CountryDonut.vue`
- `app/components/admin/VisitTrendChart.vue`
- `app/components/admin/TopStopsChart.vue`
- `app/components/admin/StageBarChart.vue`
- `app/components/admin/TravelModePie.vue`

## Layer 5: Navigation — UNavigationMenu

Replace manual navigation patterns in both layouts.

### default.vue — visitor navigation

**Desktop header nav:**
- **Before:** Manual `<NuxtLink>` elements with `:class` conditional active state
- **After:** `<UNavigationMenu :items="navItems">` with items array:
```ts
const navItems: NavigationMenuItem[] = [
  { label: t('nav.stops'), icon: 'i-lucide-map-pin', to: localePath('/') },
  { label: t('nav.services'), icon: 'i-lucide-compass', to: localePath('/services') },
  { label: t('nav.map'), icon: 'i-lucide-map', to: localePath('/map') },
  { label: t('nav.passport'), icon: 'i-lucide-book-open', to: localePath('/passport') }
]
```
Note: Order and icons match the existing codebase exactly.
- Active state: automatic via NuxtLink integration
- Gold active indicator: via `:ui` prop customizing active item classes

**Mobile bottom nav — stays custom:**
The mobile bottom bar has a highly specific design: `fixed bottom-0`, `env(safe-area-inset-bottom)`, 10px font labels, active indicator dots, specific touch targets (64px min-width, 44px min-height). This level of customization would require extensive `:ui` overrides that negate UNavigationMenu's benefit. Keep as custom NuxtLink elements but **replace `<NuxtLink>` icon+label pattern with `<UButton>` variant="ghost"** for consistency.

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
- **Before:** Custom div banner with icon + text + enable GPS button + dismiss X
- **After:**
```vue
<UAlert
  icon="i-lucide-map-pin-off"
  :title="t('gps.limitedBanner')"
  color="warning"
  variant="soft"
  :close="true"
>
  <template #actions>
    <UButton
      size="xs"
      :label="t('gps.enableButton')"
      @click="emit('enableGps')"
    />
  </template>
</UAlert>
```
Note: Use `#actions` slot for buttons (not `:actions` prop) because UButton's `click` handler requires `@click` event binding, not a prop. `:close="true"` handles the dismiss X button.

### passport.vue save note → UAlert
- **Before:** Custom styled info div
- **After:** `<UAlert icon="i-lucide-info" :description="t('passport.saveNote')" color="neutral" variant="soft" />`

### map.vue category filter buttons
- **Before:** Custom `<button>` elements with dynamic `:style` backgroundColor
- **After:** `<UButton>` per category with `:variant` toggle (`solid` when active, `ghost` when inactive), `:style` for dynamic category color

### services/index.vue category filter buttons
- **Before:** Same custom `<button>` pattern as map.vue (identical code)
- **After:** Same `<UButton>` migration as map.vue

### admin VisitTrendChart.vue range buttons
- **Before:** Custom `<button>` for 7/30/90 day ranges
- **After:** `<UButton>` per range, `variant="solid"` for active, `variant="ghost"` for inactive

### Files changed
- `app/components/visitor/LimitedModeBanner.vue`
- `app/pages/passport.vue`
- `app/pages/map.vue`
- `app/pages/services/index.vue`
- `app/components/admin/VisitTrendChart.vue`

## Components NOT migrated (justified)

| Component | Reason |
|---|---|
| CheckInButton.vue | Complex pulse/scale animations, haptic feedback — beyond UButton scope |
| StampIcon.vue | SVG-based circular stamp with conditional states — design-specific |
| FactCards.vue | Horizontal scroll with fade effect — intentional custom layout |
| NextStopCard.vue | Custom gradient background, Google Maps integration |
| StopMap.client.vue | Leaflet map component — third-party library |
| ECharts components (6) | Chart wrappers migrate to UCard, but chart rendering stays ECharts |
| Mobile bottom nav (default.vue) | Highly specific mobile tab bar design — UNavigationMenu overrides would be excessive |

## Scoped style exceptions

| File | Reason |
|---|---|
| `services/index.vue` | TransitionGroup list animations — cannot be expressed as Tailwind utility classes |

## CSS changes

### app/assets/css/main.css
- Keep: Tailwind imports, `@nuxt/ui` import, theme colors, `leaflet-div-icon` fix, animations (`stamp-pulse`, `location-pulse`), `scroll-hide`, dark mode vars
- Remove: Nothing (all custom CSS is either theme or animation related, not component scaffolding)

## Migration order

1. `app.config.ts` theming
2. GpsPermissionDialog → UModal (`#content` slot)
3. GdprConsent → UModal (`#content` slot)
4. ProfileForm → UModal + UInput + UInputMenu + UFormField
5. index.vue cards → UCard
6. stop/[id].vue cards → UCard
7. services/[id].vue cards → UCard
8. passport.vue cards + alert → UCard + UAlert
9. KpiCard.vue → UCard
10. VillageReport.vue → UCard
11. admin/analytics.vue stage cards → UCard
12. Admin chart wrappers (7 components) → UCard
13. admin/stops.vue + admin/services.vue table wrappers → UCard
14. default.vue desktop nav → UNavigationMenu
15. admin.vue nav → UNavigationMenu
16. LimitedModeBanner → UAlert
17. map.vue + services/index.vue buttons → UButton
18. VisitTrendChart buttons → UButton

## Success criteria

- All Nuxt UI components render with gold/sand theme
- Existing visual design preserved (same layout, colors, spacing)
- No scoped `<style>` blocks for component scaffolding (transitions, backdrops)
- All styling via Tailwind classes or `app.config.ts` `:ui` customization
- Scoped styles only where justified (TransitionGroup animations)
- Lint passes (`pnpm lint`)
- App loads and navigates correctly (`pnpm dev`)

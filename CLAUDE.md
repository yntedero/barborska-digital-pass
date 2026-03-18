# Barborská Digital Pass

## Project Overview

A Nuxt 4 application for a digital pass experience with map-based stop tracking.

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3, TypeScript)
- **UI:** @nuxt/ui (PrimeVue-based components, Tailwind CSS 4)
- **State:** Pinia (`@pinia/nuxt`)
- **i18n:** `@nuxtjs/i18n` — Czech default, English secondary. Locale files in `app/locales/`.
- **Maps:** `@nuxtjs/leaflet` — client-only rendering
- **Charts:** `nuxt-echarts` with ECharts 6 — tree-shakeable, register charts/components in `nuxt.config.ts`
- **Utilities:** `@vueuse/nuxt` — auto-imported composables
- **Linting:** `@nuxt/eslint` with stylistic rules (no trailing commas, 1tbs braces)

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm lint` — ESLint check
- `pnpm typecheck` — TypeScript check
- `pnpm preview` — Preview production build

## Directory Structure

```
app/
  assets/css/main.css   — Tailwind + Nuxt UI imports, custom theme
  components/           — Auto-imported Vue components
  composables/          — Auto-imported composables (useXxx)
  locales/              — i18n JSON files (cs.json, en.json)
  pages/                — File-based routing
  stores/               — Pinia stores
  app.vue               — Root layout
  app.config.ts         — Runtime app config (UI colors)
nuxt.config.ts          — Module registration and config
```

## Conventions

- Components are auto-imported (no explicit imports needed)
- Composables in `app/composables/` are auto-imported
- Pinia stores in `app/stores/` are auto-imported via `@pinia/nuxt`
- VueUse composables are auto-imported via `@vueuse/nuxt`
- Leaflet components are client-only — wrap in `<ClientOnly>` or use `.client.vue` suffix
- i18n: use `$t('key')` in templates, `useI18n()` in script setup
- ECharts: use `<VChart>` component, options as reactive refs
- Colors: primary=green, neutral=slate (see app.config.ts)
- Never add Co-Authored-By Claude credentials to git commits

## MCP Servers Available

- **PrimeVue MCP** — query component docs, props, events, slots, theming
- **Context7** — fetch up-to-date library documentation
- **Figma** — read designs, generate code from Figma files
- **Playwright** — browser automation and testing
- **context-mode** — efficient large-output processing

## When Building Features

1. Use PrimeVue MCP to look up Nuxt UI / PrimeVue component APIs
2. Use Context7 MCP for latest Nuxt/Vue/library docs
3. Use `@vueuse/nuxt` composables before writing custom ones
4. Add translations to both `cs.json` and `en.json`
5. Use Pinia stores for shared state
6. Leaflet maps must be client-only rendered

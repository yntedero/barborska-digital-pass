# Barborská cesta — Digital Trail Guide
### Product Specification · v1.1 — Nuxt 4 Frontend Prototype

---

## About the Project

Barborská cesta is a 193 km hiking and pilgrimage trail in central Slovakia. It passes through 9 stages and 29 symbolic stops, starting and ending in Banská Bystrica. The trail is named after Saint Barbara, patron saint of miners — she died at 29, which is why there are exactly 29 stops.

Today, the trail has a serious problem: nobody knows how many people walk it. Visitors carry a paper passport and collect stamps at each stop, but there is no digital record of anything. Municipalities have no data to justify investing in better services. Pilgrims can't find accommodation, food, water, or bike repair digitally. The trail is invisible to the modern world.

We are building a **digital guide app** that solves all of this. It gives visitors everything they need on their phone — stop information, services, maps, navigation, and a digital stamp passport. At the same time, it demonstrates what a real analytics layer would look like for municipalities, route managers, and trail operators.

**This is a fully working frontend prototype.** All data is hardcoded or generated client-side. There is no backend server, no database, and no authentication system. The goal is to demonstrate the complete user experience, information architecture, and design — ready to be connected to a real backend in v2.

---

## What "Frontend Prototype" Means

Everything the user sees and interacts with is real. Every page, every button, every chart, every map marker works. The difference from a production app:

- **Data** comes from static JSON files and TypeScript seed data bundled with the app — not from a database.
- **Check-ins and passport stamps** are saved in the browser's `localStorage` — not synced to a server.
- **Analytics charts** display realistic pre-generated data — not live queries.
- **Admin panel** shows fully functional tables, charts, and reports — but the data behind them is static.
- **No login system.** The admin panel is accessible via URL. There is no authentication, no user accounts, no sessions.
- **No API endpoints.** All data is imported directly into Vue components from local files.

This prototype is designed so that connecting a real backend later requires **zero changes to the UI components** — only the data source changes.

---

## Context: The Trail

| Stage | From → To | Distance |
|-------|-----------|----------|
| 1 | Banská Bystrica → Staré Hory | 24.5 km |
| 2 | Staré Hory → Skalka | 30.5 km |
| 3 | Skalka → Kremnica | 20 km |
| 4 | Kremnica → Sklené Teplice | 30 km |
| 5 | Sklené Teplice → Banská Štiavnica | 12.8 km |
| 6 | Banská Štiavnica → Ostrá Lúka | 26.7 km |
| 7 | Ostrá Lúka → Zvolen | 15 km |
| 8 | Zvolen → Vlkanová | 23.5 km |
| 9 | Vlkanová → Banská Bystrica | 13.3 km |

**193 km total · 29 stops · 18 validated stamps needed for the official certificate**

Accommodation along the trail comes in three types — communal (run by municipalities, basic mattress + blanket, bring your own sleeping bag), private (run by businesses, proper linens and sometimes meals), and community (run by churches or civic organisations, quality varies).

Barborská cesta is also part of **MINES.B** — a European federation of 7 mining heritage trails across Slovakia, Italy, Spain, Slovenia, Belgium, France and Portugal.

**Hackathon context:** UMB Hackathon 2026, Výzva 3 — "How to increase the potential of Barborská cesta for territorial development, services, and business?" Scoring: Impact 30%, Feasibility 25%, Originality 20%, Sustainability 15%, Scalability 10%.

---

## The Two Sides of the App

The app has two completely separate worlds:

**The visitor side** — what hikers and pilgrims see on their phones. Open to everyone, no account required. Designed for mobile, works in sunlight, works with one hand, works with a low battery.

**The admin side** — what trail managers, tourism officials, and municipality representatives see. In this prototype, it is accessible directly via `/admin` URL without login. Shows realistic analytics, tables, reports, and insights using pre-generated data.

---

## GDPR & Privacy — First Things First

The very first time someone opens the app, before they see anything else, they see a **full-screen privacy consent screen.**

This screen exists even in the prototype because it demonstrates the UX flow and legal compliance design. The screen must:

- Explain clearly what data the production app would collect (which stops they visit, their approximate location when checking in, their country, age group, travel mode if they choose to share)
- Explain why (to understand visitor patterns and help municipalities improve services along the trail)
- Explain what we do NOT do (sell their data, share it with advertisers, track them outside the app)
- Give them a real choice: **"I agree"** or **"I don't agree"**

**In the prototype:** both choices lead to the same experience. The consent state is stored in `localStorage` so the screen doesn't appear again on the same device. A "Privacy settings" option is accessible from the footer or menu to change the choice.

---

## The Visitor App

### Design Philosophy

Every screen of the visitor app follows one rule: **a tired hiker with 20% battery needs to understand what they're looking at in 3 seconds.**

- One column, always. No sidebars, no complex grids.
- Big text. Big buttons. High contrast.
- Touch targets are large enough to tap with a gloved hand or sweaty finger.
- The most important action is always visible without scrolling.
- Never more than 4 choices visible at once.
- No heavy animations.
- Static content loads instantly from bundled data. Maps show a loading indicator while tiles download.

Colors follow the trail's brand: **gold-yellow** as the primary accent (from the official Barborská cesta palette — CMYK: 4, 25, 100, 0), **greens and earth tones** for nature, **black on white** for readability.

The app is available in **English and Slovak.** A language switcher is always visible.

---

### The Main Stop Page — The Most Important Screen

This is what a hiker sees when they **scan the QR code** at a physical trail marker, or when they tap a stop on the map. The URL format is `/stop/:id` — each stop has its own page.

**What they see, from top to bottom:**

**1. The map — positioned at the very top as a full-width section**

An interactive Leaflet map centered on the current stop. It shows:
- The user's position as a pulsing dot (if they've allowed GPS via browser Geolocation API)
- The current stop as a large highlighted marker
- The previous stop and next stop as smaller markers
- The trail path drawn in gold connecting the stops (polyline from hardcoded GPS coordinates)
- All nearby service points as small colored icons (a fork for food, a water droplet for water, a bed for accommodation, a wrench for bike repair, etc.)

Tapping a service icon on the map shows a popup: what it is, how far away, and a link to the service detail page. Tapping "View full map" navigates to the full map page.

**2. Stop identity**

The stop's name, large. A badge: "Stop 12 of 29 · Stage 4 · Kremnica". A short description — 2 to 3 sentences explaining what this place is, what makes it historically or culturally significant. Text sourced from the official Barborská cesta brochure.

**3. Check-in button**

A large, prominent gold button: "Check in here." Always visible without scrolling. This is the main action.

When tapped, the app:
- Requests browser geolocation (if not already granted)
- Calculates distance from the user's coordinates to the stop's GPS coordinates using the Haversine formula
- If within 200 meters: **validates the stamp** — saves a "validated" state to `localStorage`
- If more than 200 meters away: **records the visit as unvalidated** — saves a "partial" state, shows distance
- If geolocation is denied: records the visit without validation, with a gentle message

**4. Interesting facts**

2 to 5 short cards in a horizontal scroll. Each card has an icon, a short title, and 2–3 sentences of fact about this specific stop. Data comes from the bundled stop data file.

**5. Nearby facilities**

A grid of icons showing what's available at or near this stop: Toilet, Drinking water, Food, Laundry & gear drying, Accommodation, Bicycle parking & repair, E-bike charging, Rest shelter, Car parking, Emergency / first aid, Shoe drying.

Each icon is **green with a distance** if available, or **grey** if not available at this stop.

**6. Next stop**

A card showing the name of the next stop, distance in km, estimated walking time (calculated at 4 km/h average hiking pace), a teaser sentence, and a "Continue" button linking to the next stop's page. An "Open in Google Maps" button deep-links to directions.

**7. Actions row**

- "Show full map" — navigates to `/map`
- "Open in Google Maps" — deep-link with next stop coordinates
- "Share this stop" — uses the Web Share API (or copies URL to clipboard as fallback)

---

### The Services Page

Path: `/services`

Purpose: **quickly find something you need.**

At the top of the page, large filter buttons (multi-select): Accommodation, Food & drink, Water, Laundry & drying, Bicycle service, E-bike charging, Rest area / shelter, Parking, Medical / first aid, Shoe & gear care.

Selecting a filter instantly filters the list below. No page reload — reactive filtering via Vue computed properties against the bundled services data.

Each service card shows: name, category icons, village / location, distance from nearest stop, a "Pilgrim-Friendly" badge if certified, and a "View details" link.

**Service detail page** (`/services/:id`): Full name, certification badge, service tags, description, address, tappable phone number, tappable website, opening hours, distance from nearest stop, a Leaflet mini-map with a marker, and a "Get directions in Google Maps" button. For accommodation: shows the type (communal / private / community Alberg).

---

### The Digital Passport Page

Path: `/passport`

**At the top:**
- A progress bar: "You have visited X of 29 stops"
- A stamp counter: "Y validated · 18 needed for certificate"
- Current stage highlighted

**The main content:**

All 29 stops displayed in order, grouped into 9 stages. Each stop shows a stamp icon with one of four states:

- **Empty / grey** — not visited yet
- **Outline** — the stop's page was opened but no check-in
- **Partial / amber** — checked in, but GPS wasn't validated
- **Full gold** — GPS was validated, full stamp earned

All stamp states are read from and written to `localStorage`. Tapping a visited stop shows when they checked in and GPS status. Tapping an unvisited stop shows a brief info card.

At the bottom: a callout about saving progress — in the prototype this explains that data is stored locally in the browser. In production, this would be the "Create account" prompt.

---

### The Full Map Page

Path: `/map`

A full-screen interactive Leaflet map of the entire trail.

What it shows:
- The complete trail route as a gold polyline (from hardcoded GPS coordinate array)
- All 29 stops as numbered markers (tap to see stop name and link to stop page)
- All service points as smaller colored icons by category
- The user's GPS location (if permitted)

Controls:
- "My location" button to centre the map
- Filter toggles by service type (accommodation, food, water, etc.)
- Search by stop name (filters markers)

Tapping a stop opens a popup with name and "Go to stop" link.
Tapping a service opens a popup with name, category, and "View details" link.

---

## The Admin Panel

Path: `/admin` — accessible directly, no login required in this prototype.

### Dashboard

Path: `/admin` (default view)

**6 KPI cards at the top:**
- Total QR code scans (all time)
- Total validated check-ins (all time)
- Unique visitors this month
- Average stops completed per visitor
- Trail completion rate (% who reached stop 29)
- Most popular stop today

Each card shows the number large, with a change indicator (up/down arrow, green/red). All numbers come from pre-generated seed data.

**Charts below the KPIs:**
- **Visit trend** — Line chart, toggleable between 7 / 30 / 90 day views
- **Check-ins by stage** — Bar chart with 9 bars
- **Top 10 stops** — Horizontal bar chart ranked by views
- **Visitor countries** — Donut chart (Slovakia 45%, Czech Republic 25%, Germany 12%, Poland 8%, Austria 5%, other 5%)
- **Travel mode** — Pie chart (Walking 72%, Cycling 24%, Other 4%)

**Activity feed** — A scrolling list of the last 50 events (pre-generated). Shows check-ins, new visitors, popular stops. In the prototype this is static; in production it would auto-refresh every 30 seconds.

### Route Analytics

Path: `/admin/analytics`

**Stop-level table:** Sortable table of all 29 stops — page views, check-ins, validated check-ins, conversion rate, last visitor timestamp.

**Stage cards:** Cards for each stage — total visitors, % drop from previous stage, most-visited stop.

**Stage Drop-off Funnel:** The most important visualization. A visual funnel showing visitor volume across all 9 stages. Stage 1 is widest, narrowing at each drop-off with percentage labels. Makes it instantly obvious where the trail loses people.

### Stops Table

Path: `/admin/stops`

Sortable table of all 29 stops. Columns: stop name, stage, total page views, check-ins this month, validated check-ins, active status, last visit date. Search box filters by name.

### Services Table

Path: `/admin/services`

Full list of all services. Columns: service name, category, nearest stop, views this month, demand rank. Search and category dropdown filters.

### Village Reports

Path: `/admin/villages`

Left panel: list of villages with stops. Click to select.

Right panel: selected village's report — number of stops, unique visitors last month, bar chart of service demand vs supply, monthly visitor trend sparkline, and an "Export PDF" button (shows concept preview in prototype).

**The insight goal:** A mayor sees "340 visitors last month. 78% searched for accommodation. Only 23% found a place to stay."

---

## Data Architecture — How It Works Without a Backend

### Trail Data

All stop, stage, service, and facility data lives in TypeScript files inside the project:

- `data/stages.ts` — 9 stages with names, distances, descriptions
- `data/stops.ts` — 29 stops with GPS coordinates, descriptions, interesting facts, facility lists, stage assignments
- `data/services.ts` — 29 services along the trail with GPS, contact info, categories, opening hours
- `data/analytics.ts` — Pre-generated realistic analytics data for the admin panel (visitor counts, check-in distributions, country splits, daily trends)

These files are imported directly by Vue components. No API calls. Instant load.

### Client State

All visitor-side state is stored in `localStorage` via VueUse's `useLocalStorage`:

- **Passport stamps** — an object mapping stop IDs to their state (`null` | `"viewed"` | `"partial"` | `"validated"`) and timestamps
- **GDPR consent** — boolean, stored once
- **Guest ID** — a random UUID generated on first visit, stored for potential future analytics integration
- **Language preference** — `"sk"` or `"en"`

### GPS Validation

When a user taps "Check in", the app:
1. Calls `navigator.geolocation.getCurrentPosition()`
2. Receives latitude and longitude from the browser
3. Calculates distance to the stop using the Haversine formula (implemented as a utility function)
4. Compares against 200m threshold
5. Writes result to `localStorage`

No data leaves the browser. No server call. This is a fully client-side operation.

---

## Tech Stack — What We Use and Why

All packages are installed via **pnpm** and pinned to their latest stable versions as of March 2026.

### Nuxt 4 (`nuxt` ^4.4)

The framework. Nuxt 4 introduced the `app/` directory structure (all application code in `app/`, server code in `server/`, shared utilities in `shared/`), improved data fetching, vue-router v5, and better TypeScript project separation. Even though this is a frontend prototype, Nuxt gives us file-based routing, auto-imports, SSG capability via `nuxt generate`, and a clean project structure. When a backend is added later, Nuxt's server routes (`server/api/`) slot in without restructuring.

### Nuxt UI v4 (`@nuxt/ui` ^4.5)

The UI component library. Over 110 components: buttons, tables, cards, modals, form inputs, navigation menus, dropdowns, badges, toasts, tabs, accordions, command palette, and more. **Includes automatically (do not install separately):**
- **Tailwind CSS v4** — utility-first CSS framework
- **@nuxt/icon** — access to 200,000+ icons via Iconify (no need for lucide, heroicons, or any other icon package)
- **@nuxt/fonts** — automatic self-hosting of Google Fonts (no external CDN requests)

The `app.config.ts` file is used to customize the Nuxt UI theme (brand colors, border-radius, font families) to match the Barborská cesta palette.

### @nuxtjs/leaflet (^1.2)

Official Nuxt module for Leaflet maps. Provides Vue components (`<LMap>`, `<LTileLayer>`, `<LMarker>`, `<LPopup>`, `<LPolyline>`, `<LCircleMarker>`) that work safely with Nuxt's SSR. Used on the stop page (mini-map), the full map page, and service detail pages. **Includes Leaflet automatically** — do not install `leaflet` or `vue-leaflet` separately.

### @nuxtjs/i18n (^9)

Internationalization — language switching between Slovak and English. All text strings live in JSON files (`locales/sk.json`, `locales/en.json`). No hardcoded text in any Vue component. The language switcher is always visible in the header. The module handles URL prefixing, locale detection, and reactive translation via `$t()`.

### @vueuse/nuxt (^12)

A collection of Vue composables. Specifically used for:
- `useLocalStorage` — persisting passport stamps, GDPR consent, guest ID, and language preference
- `useGeolocation` — requesting GPS position for check-in validation
- `useClipboard` — fallback for the share feature on browsers without Web Share API

### @pinia/nuxt (^0.9)

Client-side state management. Two stores:
- **Passport store** — reads/writes stamp states from `localStorage`, computes progress statistics, handles check-in logic
- **UI store** — tracks current navigation state, mobile menu open/close, active filters on the services page

### nuxt-echarts (^0.3)

Apache ECharts integration for Nuxt. Used exclusively in the admin panel for all charts: line (visit trends), bar (check-ins by stage, top stops), donut (visitor countries), pie (travel mode), and funnel (stage drop-off). The module handles SSR compatibility and tree-shaking — only the chart types we declare in `nuxt.config.ts` are shipped to the client. **Includes echarts automatically** — do not install `echarts` or `vue-echarts` separately.

---

## What Is NOT in the Tech Stack

To be explicit about what we do **not** install or use:

- **No Tailwind CSS package** — included with Nuxt UI v4
- **No icon package** (`lucide`, `heroicons`, `@iconify/vue`, etc.) — Nuxt UI includes `@nuxt/icon`
- **No font package** (`@fontsource/*`, Google Fonts CDN links, etc.) — Nuxt UI includes `@nuxt/fonts` which self-hosts fonts automatically
- **No Leaflet package directly** (`leaflet`, `@vue-leaflet/vue-leaflet`) — `@nuxtjs/leaflet` wraps it
- **No ECharts package directly** (`echarts`, `vue-echarts`) — `nuxt-echarts` wraps it
- **No color mode package** (`@nuxtjs/color-mode`) — Nuxt UI v4 includes color mode support built-in
- **No axios or fetch library** — there are no API calls in the prototype
- **No authentication library** (`@logto/nuxt`, `@sidebase/nuxt-auth`, etc.) — no auth in the prototype
- **No database ORM** (`drizzle`, `prisma`, etc.) — no database in the prototype
- **No database driver** (`postgres.js`, `pg`, etc.) — no database connection
- **No Docker** — nothing to containerize in the prototype
- **No faker.js** — analytics data is pre-written, not generated at runtime
- **No npm or yarn** — we use **pnpm** exclusively

---

## Project Structure

Follows the Nuxt 4 `app/` directory convention — all application code lives inside `app/`, cleanly separated from config, server, and shared code.

```
barborska-cesta/
├── app.config.ts              # Nuxt UI theme (brand colors, border-radius, fonts)
├── nuxt.config.ts             # Modules, i18n config, echarts chart types
├── package.json               # pnpm workspace, all dependencies
├── pnpm-lock.yaml
├── tsconfig.json              # Single root tsconfig (Nuxt 4 convention)
│
├── shared/                    # Code shared between app and server (if server added later)
│   └── types/
│       └── index.ts           # TypeScript types for stops, services, stages, etc.
│
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css       # Minimal global styles (font imports handled by @nuxt/fonts)
│   │
│   ├── data/                  # All static data (replaces database)
│   │   ├── stages.ts          # 9 stages with names, distances, descriptions
│   │   ├── stops.ts           # 29 stops with GPS, descriptions, facts, facilities
│   │   ├── services.ts        # 29 services with GPS, contacts, categories, hours
│   │   └── analytics.ts       # Pre-generated admin panel data (KPIs, trends, events)
│   │
│   ├── composables/           # Auto-imported composables
│   │   ├── usePassport.ts     # Stamp states, check-in logic, progress calculation
│   │   ├── useGpsValidation.ts# Haversine distance, geolocation wrapper
│   │   └── useTrailData.ts    # Computed lookups: next stop, nearby services, etc.
│   │
│   ├── stores/                # Pinia stores (auto-imported)
│   │   ├── passport.ts        # Passport stamps, check-in state, progress stats
│   │   └── ui.ts              # Navigation state, mobile menu, active filters
│   │
│   ├── locales/               # i18n translation files
│   │   ├── sk.json            # Slovak translations (all UI text)
│   │   └── en.json            # English translations
│   │
│   ├── layouts/
│   │   ├── default.vue        # Visitor layout (header + bottom nav on mobile)
│   │   └── admin.vue          # Admin layout (sidebar navigation + top bar)
│   │
│   ├── pages/
│   │   ├── index.vue          # GDPR consent screen → redirect to /stop/1
│   │   ├── stop/
│   │   │   └── [id].vue       # Main stop page (map, check-in, facts, facilities)
│   │   ├── services/
│   │   │   ├── index.vue      # Services list with category filters
│   │   │   └── [id].vue       # Service detail (info, mini-map, directions)
│   │   ├── passport.vue       # Digital passport (29 stamps, 9 stages)
│   │   ├── map.vue            # Full-screen trail map
│   │   └── admin/
│   │       ├── index.vue      # Dashboard (KPIs + charts + activity feed)
│   │       ├── analytics.vue  # Route analytics + stage drop-off funnel
│   │       ├── stops.vue      # Stops management table
│   │       ├── services.vue   # Services management table
│   │       └── villages.vue   # Village reports with demand vs supply
│   │
│   ├── components/
│   │   ├── visitor/           # Visitor-side components
│   │   │   ├── StopMap.vue    # Leaflet map for stop page
│   │   │   ├── CheckInButton.vue  # GPS check-in with Haversine validation
│   │   │   ├── FactCards.vue  # Horizontal scrolling fact cards
│   │   │   ├── FacilityGrid.vue   # Facility availability icons
│   │   │   ├── NextStopCard.vue   # Next stop preview with distance/time
│   │   │   ├── StampIcon.vue  # Single passport stamp (4 visual states)
│   │   │   ├── GdprConsent.vue    # Full-screen privacy consent modal
│   │   │   └── LanguageSwitcher.vue
│   │   └── admin/             # Admin-side components
│   │       ├── KpiCard.vue    # Single KPI metric with change indicator
│   │       ├── VisitTrendChart.vue  # ECharts line chart
│   │       ├── StageBarChart.vue    # ECharts bar chart (9 stages)
│   │       ├── CountryDonut.vue     # ECharts donut chart
│   │       ├── TravelModePie.vue    # ECharts pie chart
│   │       ├── StageFunnel.vue      # ECharts funnel (drop-off visualization)
│   │       ├── ActivityFeed.vue     # Recent events scrolling list
│   │       └── VillageReport.vue    # Village detail panel with charts
│   │
│   └── public/
│       └── images/            # Stop photos, trail brand assets
│
└── server/                    # Empty for now — ready for v2 API routes
    └── .gitkeep
```

---

## Setup Guide — From Zero to Running App

**Prerequisites:** Node.js 22+ (LTS), pnpm 9+, a code editor.

**Step 1 — Get the project**

```bash
git clone <repository-url>
cd barborska-cesta
pnpm install
```

**Step 2 — Start the app**

```bash
pnpm dev
```

The app opens at `http://localhost:3000`.

**What you'll have running:**
- `http://localhost:3000` — the public trail guide (visitor side)
- `http://localhost:3000/admin` — the admin panel

That's it. No Docker, no database, no environment variables, no configuration. Clone, install, run.

**To build for production (static site):**

```bash
pnpm generate
```

This creates a fully static site in `.output/public/` that can be deployed to any static hosting (Netlify, Vercel, GitHub Pages, any web server). No Node.js server needed in production.

### Package Installation Reference

The project is initialized with:

```bash
pnpx nuxi@latest init barborska-cesta
cd barborska-cesta
pnpm add @nuxt/ui @nuxtjs/leaflet @nuxtjs/i18n @vueuse/nuxt @pinia/nuxt nuxt-echarts
```

This installs exactly **7 direct dependencies** (including `nuxt` itself). Everything else (Tailwind, icons, fonts, Leaflet, ECharts, vue-router, color mode) comes automatically through these modules.

### nuxt.config.ts Reference

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/leaflet',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-echarts',
  ],

  i18n: {
    locales: [
      { code: 'sk', file: 'sk.json', name: 'Slovenčina' },
      { code: 'en', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'sk',
    lazy: true,
    langDir: 'locales/',
  },

  echarts: {
    charts: ['LineChart', 'BarChart', 'PieChart', 'FunnelChart'],
    components: ['GridComponent', 'TooltipComponent', 'LegendComponent', 'TitleComponent'],
  },

  css: ['~/assets/css/main.css'],
})
```

---

## GPS / Location Privacy

Even without a backend, the GPS check-in is a real browser feature:

- Location access is requested only when the user taps "Check in" — never in the background
- The browser's Geolocation API provides coordinates
- The Haversine formula calculates distance to the stop
- The result (validated / not validated / distance in meters) is saved to `localStorage`
- **No coordinates are stored anywhere** — only the validation result
- If the user denies location permission, the check-in still works — it just saves as "unvalidated"

---

## What We're Not Building in This Version

- No backend server or API
- No database
- No user authentication or accounts
- No server-side data persistence (all data is in the browser)
- No certificate generation
- No real QR code printing (we test with direct URLs)
- No content management — stops and services are in static TypeScript files
- No payments or booking
- No comments or reviews
- No offline/PWA mode
- No audio guides
- No push notifications
- No email notifications

---

## What Comes Next (v2 — After the Hackathon)

The architecture is designed so that adding a backend requires **no changes to UI components** — only the data source changes.

**v2 — Backend integration:**
- Add Nuxt server routes (`server/api/`) for all data endpoints
- Install backend dependencies: `pnpm add drizzle-orm postgres` + `pnpm add -D drizzle-kit`
- Add Logto authentication: `pnpm add @logto/nuxt`
- Connect PostgreSQL via Docker Compose
- Replace `localStorage` passport with server-synced passport for logged-in users
- Enable real analytics data collection (page views, check-ins, service views)
- Generate real QR codes for each stop (print-ready PDFs)
- Real-time GPS validation (the client-side code already works — just add server recording)
- Content management interface for trail operators

**v3 and further:**
- Full role differentiation (admin vs read-only user)
- MINES.B integration — passports that work across all 7 European trails
- Audio guides at each stop
- Weather integration
- AI-powered recommendations
- PWA with offline support
- Certificate PDF generation after 18 validated stamps

---

## Design Reference

The visual design follows the **Heritage Craft** style direction:

- **Fonts:** Crimson Pro (headings, serif, warm) + Source Sans 3 (body, clean readability)
- **Primary accent:** Gold-yellow (#c49225 / CMYK 4,25,100,0 — official Barborská cesta brand color)
- **Palette:** Earth tones, greens for nature, high contrast for outdoor readability
- **Approach:** Warm and authentic, but not heavy — clean layout, generous whitespace, no decorative textures
- **Dark mode:** Supported, using warm dark tones (#1a1714 base) rather than pure black
- **Mobile-first:** One-column layout, large touch targets, bottom navigation bar
- **Map tiles:** OpenStreetMap via Leaflet — real geographic data, real trail coordinates

The interactive design prototype (JSX artifact) serves as the visual specification for all components and pages.

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/leaflet',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-echarts',
  ],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',

  echarts: {
    charts: ['BarChart', 'LineChart', 'PieChart', 'FunnelChart'],
    components: [
      'DatasetComponent',
      'GridComponent',
      'TooltipComponent',
      'LegendComponent',
      'TitleComponent',
    ],
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  i18n: {
    locales: [
      { code: 'sk', name: 'Slovenčina', file: 'sk.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'sk',
    lazy: true,
    strategy: 'prefix_except_default',
  },
})

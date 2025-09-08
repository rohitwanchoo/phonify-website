// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    'shadcn-nuxt',
    'nuxt-charts',
    'nuxt-echarts',
    'nuxt-auth-utils',
    '@nuxt/image',
    '@formkit/auto-animate/nuxt',

  ],
  icon: {
    customCollections: [
      {
        prefix: 'icons',
        dir: './app/assets/icons',
      },
    ],
  },
  echarts: {
    renderer: ['svg', 'canvas'],
    charts: ['BarChart', 'MapChart'],
    components: [
      'DatasetComponent',
      'GridComponent',
      'TooltipComponent',
      'ToolboxComponent',
      'GeoComponent',
      'VisualMapComponent',
    ],
  },
  css: ['~/assets/css/tailwind.css'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    // Private keys (only available on the server-side)
    // These will be automatically overridden by NUXT_SESSION_PASSWORD and NUXT_API_BASE_URL environment variables
    sessionPassword: '',
    apiBaseUrl: 'https://api.phonify.com',
    // Public keys (exposed to the client-side)
    public: {
      apiBaseUrl: '/api/proxy',
      asteriskDomain: process.env.NUXT_ASTERISK_DOMAIN || 'api.phonify.app',
      asteriskWsPort: process.env.NUXT_ASTERISK_WS_PORT || '8089',
    },
  },
  nitro: {
    // Configure development proxy to avoid CORS issues
    devProxy: {
      '/api/proxy': {
        // eslint-disable-next-line node/prefer-global/process
        target: process.env.NUXT_API_BASE_URL || 'https://api.phonify.com',
        changeOrigin: true,
        prependPath: false,
      },
    },
  },
})

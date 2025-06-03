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
    sessionPassword: '',
    // Public keys (exposed to the client-side)
    public: {
      apiBaseUrl: '/api/proxy',
    },
  },
  nitro: {
    // Configure development proxy to avoid CORS issues
    devProxy: {
      '/api/proxy': {
        target: 'https://api.voiptella.com',
        changeOrigin: true,
        prependPath: false,
      },
    },
  },
})
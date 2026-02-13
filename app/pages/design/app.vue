<script setup lang="ts">
useHead({
  title: 'Phonify - Internal App Design System',
  meta: [
    {
      name: 'description',
      content: 'Complete internal dashboard and app component showcase for Phonify template',
    },
  ],
})

definePageMeta({
  layout: 'default',
})

const componentSections = [
  {
    category: 'Dashboard Components',
    id: 'dashboard',
    components: [
      { id: 'campaign-switcher', name: 'Campaign Switcher', description: 'Campaign selection dropdown with filters' },
      { id: 'export-panel', name: 'Export Panel', description: 'Data export controls and options' },
      { id: 'anomaly-alerts', name: 'Anomaly Alerts', description: 'Real-time anomaly detection alerts' },
      { id: 'kpi-cards', name: 'KPI Cards', description: 'Key metric cards with counts' },
      { id: 'kpi-tracking', name: 'KPI Tracking', description: 'Real-time KPI performance tracking' },
      { id: 'system-health', name: 'System Health', description: 'System status and health monitoring' },
      { id: 'period-comparison', name: 'Period Comparison', description: 'Compare metrics across time periods' },
      { id: 'ai-metrics', name: 'AI Metrics', description: 'AI performance and analytics' },
      { id: 'lead-funnel', name: 'Lead Funnel', description: 'Lead conversion funnel visualization' },
      { id: 'wallet-metrics', name: 'Wallet Metrics', description: 'Wallet balance and transaction metrics' },
      { id: 'agent-leaderboard', name: 'Agent Leaderboard', description: 'Top performing agents ranking' },
      { id: 'peak-hours', name: 'Peak Hours', description: 'Call volume by hour analysis' },
      { id: 'disposition-trends', name: 'Disposition Trends', description: 'Call disposition analytics' },
      { id: 'callback-schedule', name: 'Callback Schedule', description: 'Scheduled callback management' },
      { id: 'activity-feed', name: 'Activity Feed', description: 'Recent activity timeline' },
    ],
  },
  {
    category: 'Campaign Management',
    id: 'campaign',
    components: [
      { id: 'campaign-table', name: 'Campaign Table', description: 'Campaign list with actions and filters' },
      { id: 'campaign-create', name: 'Campaign Creation Form', description: 'Multi-step campaign creation wizard' },
      { id: 'campaign-stepper', name: 'Campaign Stepper', description: 'Step-by-step campaign setup' },
    ],
  },
  {
    category: 'Dialing Interface',
    id: 'dialing',
    components: [
      { id: 'lead-details', name: 'Lead Details Panel', description: 'Detailed lead information during calls' },
      { id: 'send-sms', name: 'Send SMS Panel', description: 'SMS composition and sending interface' },
      { id: 'send-email', name: 'Send Email Panel', description: 'Email composition interface' },
    ],
  },
]

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Design System Header -->
    <div class="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">
              Phonify Internal Design System
            </h1>
            <p class="text-blue-100 mt-1">
              Dashboard, Campaign Management & Dialing Interface Components
            </p>
          </div>
          <div class="flex gap-3">
            <a
              href="/design"
              class="px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              Website Components
            </a>
            <a
              href="/"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors border border-blue-400"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Navigation -->
    <div class="sticky top-[105px] z-40 bg-white border-b border-gray-200 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span class="text-sm font-semibold text-gray-700 whitespace-nowrap mr-2">
            Categories:
          </span>
          <button
            v-for="section in componentSections"
            :key="section.id"
            @click="scrollToSection(section.id)"
            class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all whitespace-nowrap shadow-sm"
          >
            {{ section.category }}
          </button>
        </div>
      </div>
    </div>

    <!-- Component Sections -->
    <div class="py-8">
      <div class="container mx-auto px-4">
        <section
          v-for="section in componentSections"
          :id="section.id"
          :key="section.id"
          class="mb-16"
        >
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              {{ section.category }}
            </h2>
            <div class="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
          </div>

          <div class="space-y-12">
            <div
              v-for="comp in section.components"
              :id="comp.id"
              :key="comp.id"
              class="space-y-4"
            >
              <!-- Component Header -->
              <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold text-gray-900">
                      {{ comp.name }}
                    </h3>
                    <p class="text-gray-600 mt-2">
                      {{ comp.description }}
                    </p>
                  </div>
                  <div class="ml-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ section.category.split(' ')[0] }}
                    </span>
                  </div>
                </div>
                <div class="mt-4 bg-gray-50 rounded-md p-4 border border-gray-200">
                  <div class="flex items-start gap-2">
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Component Path:</span>
                    <code class="text-sm bg-gray-800 text-green-400 px-3 py-1 rounded font-mono break-all">
                      app/components/{{ comp.id }}/index.vue
                    </code>
                  </div>
                </div>
              </div>

              <!-- Component Preview Notice -->
              <div class="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <div class="text-center py-12">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">
                    Component: {{ comp.name }}
                  </h4>
                  <p class="text-gray-600 max-w-md mx-auto">
                    This component requires authentication and real-time data. View it in the actual application after logging in.
                  </p>
                  <a
                    href="/auth/login"
                    class="inline-block mt-4 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View in App
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-3">
            Complete Internal Design System
          </h3>
          <p class="text-gray-300 text-lg mb-6 max-w-3xl mx-auto">
            All dashboard, campaign management, and dialing interface components ready for reuse.
            Built with Vue 3, Nuxt 3, Tailwind CSS 4, and shadcn-vue.
          </p>
          <div class="flex items-center justify-center gap-6 mb-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-400">
                {{ componentSections.reduce((acc, sec) => acc + sec.components.length, 0) }}
              </div>
              <div class="text-sm text-gray-400 mt-1">
                Components
              </div>
            </div>
            <div class="w-px h-12 bg-gray-700" />
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-400">
                {{ componentSections.length }}
              </div>
              <div class="text-sm text-gray-400 mt-1">
                Categories
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4">
            <a
              href="https://github.com/rohitwanchoo/phonify-website"
              target="_blank"
              rel="noopener noreferrer"
              class="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              View Source Code
            </a>
            <a
              href="/design"
              class="px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Website Components
            </a>
            <a
              href="/"
              class="px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

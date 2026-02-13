<script setup lang="ts">
import { Button } from '~/components/ui/button'

useHead({
  title: 'Agency Solutions - Multi-Client Voice Platform | Phonify',
  meta: [
    {
      name: 'description',
      content: 'Manage multiple client campaigns from one platform. White-label dashboards, per-client billing, and multi-tenant analytics for agencies.',
    },
  ],
})

definePageMeta({
  layout: 'website',
})

const benefits = [
  {
    icon: 'lucide:layout-dashboard',
    title: 'White-label dashboards',
    description: 'Give each client their own branded experience with customizable dashboards.',
  },
  {
    icon: 'lucide:phone',
    title: 'Per-client number provisioning',
    description: 'Local numbers for each client with easy setup and management.',
  },
  {
    icon: 'lucide:receipt',
    title: 'Consolidated billing',
    description: 'One invoice for all clients with detailed per-client breakdowns.',
  },
  {
    icon: 'lucide:bar-chart-3',
    title: 'Multi-tenant analytics',
    description: 'See performance across all clients or drill down into individual campaigns.',
  },
]

const features = [
  'White-label interface with your branding',
  'Per-client workspaces and permissions',
  'Local number provisioning in any area code',
  'Consolidated billing with client breakdowns',
  'Cross-client analytics and reporting',
  'API access for custom integrations',
  'Bulk campaign management tools',
  'Dedicated account management',
]

const stats = [
  { value: '10+', label: 'Clients per manager' },
  { value: '50%', label: 'Admin time saved' },
  { value: '100%', label: 'White-label ready' },
  { value: 'Unlimited', label: 'Client workspaces' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="w-full bg-gradient-to-b from-stone-900 to-stone-800 py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="flex items-center gap-2 mb-6">
              <Icon name="lucide:building" class="w-5 h-5 text-[#D11E28]" />
              <span class="text-[#D11E28] font-medium text-sm uppercase tracking-wide">Agencies & BPOs</span>
            </div>
            <h1 class="text-4xl lg:text-5xl font-semibold text-white mb-6">
              Manage client campaigns from one platform
            </h1>
            <p class="text-xl text-stone-300 mb-8">
              Run multiple client accounts with white-label branding, separate workspaces, and consolidated billing—all from a single dashboard.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink to="/auth/signup">
                <Button class="h-12 px-8 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
                  Start Free Trial
                </Button>
              </NuxtLink>
              <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank">
                <Button variant="outline" class="h-12 px-8 border-stone-600 text-white hover:bg-stone-700 rounded-lg font-medium">
                  See It In Action
                </Button>
              </NuxtLink>
            </div>
          </div>
          <div class="bg-stone-700/50 rounded-2xl p-4">
            <img src="/images/website/sections/home/feature4.png" alt="Agency Dashboard" class="w-full rounded-xl">
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="w-full bg-white py-12 px-4 border-b border-stone-200">
      <div class="max-w-[1440px] mx-auto">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl font-bold text-[#D11E28] mb-2">{{ stat.value }}</div>
            <div class="text-stone-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="w-full bg-white py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
            Built for agency workflows
          </h2>
          <p class="text-lg text-stone-600 max-w-2xl mx-auto">
            Scale your agency with tools designed for multi-client management.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="bg-stone-50 rounded-xl p-6 border border-stone-100"
          >
            <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
              <Icon :name="benefit.icon" class="w-6 h-6 text-[#D11E28]" />
            </div>
            <h3 class="text-xl font-semibold text-stone-900 mb-2">{{ benefit.title }}</h3>
            <p class="text-stone-600">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features List -->
    <section class="w-full bg-stone-50 py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-6">
              Everything your agency needs
            </h2>
            <ul class="space-y-4">
              <li v-for="feature in features" :key="feature" class="flex items-start gap-3">
                <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="lucide:check" class="w-4 h-4 text-green-600" />
                </div>
                <span class="text-stone-700">{{ feature }}</span>
              </li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-stone-200">
            <img src="/images/website/sections/home/feature5.png" alt="Features" class="w-full rounded-xl">
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="w-full bg-stone-900 py-16 lg:py-24 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl lg:text-4xl font-semibold text-white mb-6">
          Ready to scale your agency?
        </h2>
        <p class="text-lg text-stone-400 mb-8">
          Join agencies already using Phonify to manage multiple clients efficiently.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/auth/signup">
            <Button class="h-12 px-8 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
              Start Free Trial
            </Button>
          </NuxtLink>
          <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank">
            <Button variant="outline" class="h-12 px-8 border-stone-600 text-white hover:bg-stone-700 rounded-lg font-medium">
              Talk to Sales
            </Button>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

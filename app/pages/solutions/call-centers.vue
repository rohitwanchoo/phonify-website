<script setup lang="ts">
import { Button } from '~/components/ui/button'

useHead({
  title: 'Call Center Solutions - AI Voice Automation | Phonify',
  meta: [
    {
      name: 'description',
      content: 'Scale your call center without scaling your headcount. Phonify\'s AI handles overflow calls, routes intelligently, and reduces wait times by 60%.',
    },
  ],
})

definePageMeta({
  layout: 'website',
})

const benefits = [
  {
    icon: 'lucide:users',
    title: 'Handle 10x more calls',
    description: 'AI answers overflow instantly, so no call goes unanswered even during peak hours.',
  },
  {
    icon: 'lucide:clock',
    title: '60% faster resolution',
    description: 'Smart routing gets callers to the right agent on the first try, every time.',
  },
  {
    icon: 'lucide:trending-down',
    title: 'Cut costs by 45%',
    description: 'Reduce headcount requirements while improving service quality.',
  },
  {
    icon: 'lucide:bar-chart',
    title: 'Real-time visibility',
    description: 'Live dashboards show queue status, agent performance, and SLA compliance.',
  },
]

const features = [
  'AI handles Tier 1 calls end-to-end',
  'Skills-based routing by language, product, or expertise',
  'Real-time queue management and overflow handling',
  'Agent performance scorecards and coaching insights',
  'Automated callback scheduling',
  'Call recording and AI transcription',
  'TCPA and DNC compliance built-in',
  'Multi-location and remote agent support',
]

const stats = [
  { value: '60%', label: 'Reduction in wait times' },
  { value: '45%', label: 'Cost savings' },
  { value: '3x', label: 'More calls handled' },
  { value: '99.9%', label: 'Uptime SLA' },
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
              <Icon name="lucide:headphones" class="w-5 h-5 text-[#D11E28]" />
              <span class="text-[#D11E28] font-medium text-sm uppercase tracking-wide">Call Centers</span>
            </div>
            <h1 class="text-4xl lg:text-5xl font-semibold text-white mb-6">
              Handle 10,000 calls/day without 10,000 reps
            </h1>
            <p class="text-xl text-stone-300 mb-8">
              Scale your call center operations with AI that handles overflow, routes intelligently, and keeps your SLAs green—all while reducing costs.
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
            <img src="/images/website/sections/home/feature1.png" alt="Call Center Dashboard" class="w-full rounded-xl">
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
            Built for high-volume operations
          </h2>
          <p class="text-lg text-stone-600 max-w-2xl mx-auto">
            Whether you're handling 500 or 50,000 calls per day, Phonify scales with your needs.
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
              Everything your call center needs
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
            <img src="/images/website/sections/home/feature4.png" alt="Features" class="w-full rounded-xl">
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="w-full bg-stone-900 py-16 lg:py-24 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl lg:text-4xl font-semibold text-white mb-6">
          Ready to transform your call center?
        </h2>
        <p class="text-lg text-stone-400 mb-8">
          Join 500+ call centers already using Phonify to scale operations and reduce costs.
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

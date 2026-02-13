<script setup>
import { Button } from '~/components/ui/button'

const useCases = [
  {
    id: 'call-centers',
    label: 'Call Centers',
    icon: 'lucide:headphones',
    headline: 'Handle 10,000 calls/day without 10,000 reps',
    features: [
      'AI answers overflow calls instantly',
      'Route by skill, language, or priority',
      'Real-time queue management',
      'Agent performance scorecards',
    ],
    stat: '60%',
    statLabel: 'reduction in wait times',
    link: '/solutions/call-centers',
    image: '/images/website/sections/home/feature1.png',
  },
  {
    id: 'sales-teams',
    label: 'Sales Teams',
    icon: 'lucide:trending-up',
    headline: 'Turn cold lists into warm conversations',
    features: [
      'Power dial through lists 5x faster',
      'AI qualifies leads before reps engage',
      'Automated follow-up sequences',
      'Meeting booking built-in',
    ],
    stat: '3x',
    statLabel: 'more conversations per rep',
    link: '/solutions/sales-teams',
    image: '/images/website/sections/home/feature2.png',
  },
  {
    id: 'support-teams',
    label: 'Support Teams',
    icon: 'lucide:life-buoy',
    headline: 'Resolve tickets without holding patterns',
    features: [
      'AI handles Tier 1 questions instantly',
      'Smart routing to specialists',
      'Callback scheduling',
      'CSAT tracking per interaction',
    ],
    stat: '45%',
    statLabel: 'calls resolved by AI',
    link: '/solutions/support-teams',
    image: '/images/website/sections/home/feature3-1.png',
  },
  {
    id: 'agencies',
    label: 'Agencies',
    icon: 'lucide:building',
    headline: 'Manage client campaigns from one platform',
    features: [
      'White-label dashboards',
      'Per-client number provisioning',
      'Consolidated billing',
      'Multi-tenant analytics',
    ],
    stat: '10+',
    statLabel: 'clients per account manager',
    link: '/solutions/agencies',
    image: '/images/website/sections/home/feature4.png',
  },
]

const selectedUseCase = ref(0)
</script>

<template>
  <section class="w-full bg-stone-900 py-16 lg:py-24 px-4">
    <div class="max-w-[1440px] mx-auto">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
        <p class="text-[#D11E28] font-medium text-sm mb-4 flex items-center justify-center gap-2">
          <span class="w-8 h-px bg-[#D11E28]" />
          USE CASES
          <span class="w-8 h-px bg-[#D11E28]" />
        </p>
        <h2 class="text-3xl lg:text-4xl font-semibold text-white mb-4">
          Built for teams who live on the phone
        </h2>
        <p class="text-lg text-stone-400">
          Whether you're scaling a call center or supercharging a sales team, Phonify adapts to your workflow.
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex flex-wrap justify-center gap-2 mb-12">
        <button
          v-for="(useCase, index) in useCases"
          :key="useCase.id"
          class="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200"
          :class="selectedUseCase === index
            ? 'bg-white text-stone-900'
            : 'bg-stone-800 text-stone-300 hover:bg-stone-700'"
          @click="selectedUseCase = index"
        >
          <Icon :name="useCase.icon" class="w-4 h-4" />
          <span class="font-medium text-sm">{{ useCase.label }}</span>
        </button>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <!-- Left: Details -->
        <div class="order-2 lg:order-1">
          <h3 class="text-2xl lg:text-3xl font-semibold text-white mb-6">
            {{ useCases[selectedUseCase].headline }}
          </h3>

          <ul class="space-y-4 mb-8">
            <li
              v-for="(feature, index) in useCases[selectedUseCase].features"
              :key="index"
              class="flex items-start gap-3"
            >
              <div class="w-6 h-6 bg-[#D11E28]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="lucide:check" class="w-4 h-4 text-[#D11E28]" />
              </div>
              <span class="text-stone-300">{{ feature }}</span>
            </li>
          </ul>

          <div class="flex items-center gap-6 mb-8 pb-8 border-b border-stone-700">
            <div>
              <div class="text-4xl font-bold text-white">
                {{ useCases[selectedUseCase].stat }}
              </div>
              <div class="text-sm text-stone-400">
                {{ useCases[selectedUseCase].statLabel }}
              </div>
            </div>
          </div>

          <NuxtLink :to="useCases[selectedUseCase].link">
            <Button class="h-12 px-6 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
              See {{ useCases[selectedUseCase].label }} Solution
              <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
            </Button>
          </NuxtLink>
        </div>

        <!-- Right: Image -->
        <div class="order-1 lg:order-2">
          <div class="bg-stone-800 rounded-2xl p-4 border border-stone-700">
            <img
              :src="useCases[selectedUseCase].image"
              :alt="useCases[selectedUseCase].label"
              class="w-full h-auto rounded-xl"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

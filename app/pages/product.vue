<script setup lang="ts">
import { Button } from '~/components/ui/button'

useHead({
  title: 'Product - AI Voice Platform | Phonify',
  meta: [
    {
      name: 'description',
      content: 'Explore Phonify\'s AI voice platform: AI voice agents, predictive dialer, omnichannel hub, real-time analytics, and enterprise-grade security.',
    },
  ],
})

definePageMeta({
  layout: 'website',
})

const features = [
  {
    id: 'ai-voice',
    icon: 'lucide:bot',
    title: 'AI Voice Agents',
    subtitle: 'Automated call handling that sounds human',
    description: 'Deploy AI that speaks naturally, follows your scripts, and handles objections. Works 24/7 without breaks, sick days, or turnover. Our AI understands context, manages multi-turn conversations, and seamlessly hands off to humans when needed.',
    capabilities: [
      'Natural language understanding with <500ms response time',
      'Custom voice selection and tone adjustment',
      'Script builder with conditional logic',
      'Sentiment detection and escalation triggers',
      'Multi-language support (20+ languages)',
      'Real-time transcription and summarization',
    ],
    image: '/images/website/sections/home/feature1.png',
  },
  {
    id: 'dialer',
    icon: 'lucide:phone-outgoing',
    title: 'Call Automation',
    subtitle: 'Dial smarter, connect faster',
    description: 'Predictive and power dialing that maximizes agent productivity. Our intelligent algorithms skip voicemails, detect answering machines, and connect your team only to live humans—tripling conversations per hour.',
    capabilities: [
      'Predictive dialer with dynamic pacing',
      'Power dialer for 1:1 campaigns',
      'Voicemail detection and auto-drop',
      'Answering machine detection (AMD)',
      'Skills-based call routing',
      'Queue callbacks and scheduling',
    ],
    image: '/images/website/sections/home/feature2.png',
  },
  {
    id: 'omnichannel',
    icon: 'lucide:layers',
    title: 'Omnichannel Hub',
    subtitle: 'Every conversation, one inbox',
    description: 'Unify calls, SMS, email, and ringless voicemail in a single interface. No more switching between tools or losing context. Every touchpoint logged, every conversation tracked, every follow-up automated.',
    capabilities: [
      'Two-way SMS with templates and scheduling',
      'Email sequences with open/click tracking',
      'Ringless voicemail campaigns',
      'Unified contact timeline',
      'Cross-channel automation workflows',
      'Team inbox with assignment rules',
    ],
    image: '/images/website/sections/home/feature3-1.png',
  },
  {
    id: 'analytics',
    icon: 'lucide:bar-chart-3',
    title: 'Real-Time Analytics',
    subtitle: 'Know what\'s working, instantly',
    description: 'Live dashboards that show call outcomes, agent performance, and campaign ROI in real-time. AI summarizes every call so managers don\'t have to listen to hours of recordings.',
    capabilities: [
      'Live campaign dashboards',
      'Agent performance scorecards',
      'Call outcome tracking and disposition',
      'AI-generated call summaries',
      'Custom report builder',
      'Scheduled report delivery',
    ],
    image: '/images/website/sections/home/feature4.png',
  },
  {
    id: 'integrations',
    icon: 'lucide:plug',
    title: 'Integrations',
    subtitle: '50+ native connections',
    description: 'Connect Phonify to your existing stack with native integrations. Every call auto-logged, every lead updated, every task created—without manual data entry.',
    capabilities: [
      'CRMs: Salesforce, HubSpot, Zoho, Pipedrive',
      'Helpdesks: Zendesk, Freshdesk, Intercom',
      'Productivity: Slack, Microsoft Teams',
      'Automation: Zapier, Make, webhooks',
      'Full REST API access',
      'Custom integration support',
    ],
    image: '/images/website/sections/home/feature5.png',
  },
]

const integrationLogos = [
  { name: 'Salesforce', icon: 'simple-icons:salesforce' },
  { name: 'HubSpot', icon: 'simple-icons:hubspot' },
  { name: 'Zoho', icon: 'simple-icons:zoho' },
  { name: 'Zendesk', icon: 'simple-icons:zendesk' },
  { name: 'Slack', icon: 'simple-icons:slack' },
  { name: 'Zapier', icon: 'simple-icons:zapier' },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="w-full bg-gradient-to-b from-stone-50 to-white py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto text-center">
        <p class="text-[#D11E28] font-medium text-sm mb-4">PLATFORM</p>
        <h1 class="text-4xl lg:text-5xl font-semibold text-stone-900 mb-6">
          Everything you need to automate voice at scale
        </h1>
        <p class="text-xl text-stone-600 max-w-2xl mx-auto mb-10">
          AI voice agents, predictive dialing, omnichannel outreach, and real-time analytics—all in one platform, without the enterprise complexity.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/auth/signup">
            <Button class="h-12 px-8 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
              Start Free Trial
              <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
            </Button>
          </NuxtLink>
          <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank">
            <Button variant="outline" class="h-12 px-8 border-stone-300 text-stone-700 rounded-lg font-medium">
              <Icon name="lucide:play-circle" class="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Feature Sections -->
    <template v-for="(feature, index) in features" :key="feature.id">
      <section
        :id="feature.id"
        class="w-full py-16 lg:py-24 px-4"
        :class="index % 2 === 0 ? 'bg-white' : 'bg-stone-50'"
      >
        <div class="max-w-[1440px] mx-auto">
          <div
            class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            :class="index % 2 === 1 ? 'lg:flex-row-reverse' : ''"
          >
            <!-- Content -->
            <div :class="index % 2 === 1 ? 'lg:order-2' : ''">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <Icon :name="feature.icon" class="w-5 h-5 text-[#D11E28]" />
                </div>
                <span class="text-sm font-medium text-[#D11E28] uppercase tracking-wide">{{ feature.title }}</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
                {{ feature.subtitle }}
              </h2>
              <p class="text-lg text-stone-600 mb-8">
                {{ feature.description }}
              </p>

              <!-- Capabilities List -->
              <ul class="space-y-3 mb-8">
                <li
                  v-for="(capability, capIndex) in feature.capabilities"
                  :key="capIndex"
                  class="flex items-start gap-3"
                >
                  <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="lucide:check" class="w-3 h-3 text-green-600" />
                  </div>
                  <span class="text-stone-600">{{ capability }}</span>
                </li>
              </ul>

              <NuxtLink to="/auth/signup">
                <Button variant="outline" class="h-11 px-6 border-stone-300 text-stone-700 rounded-lg font-medium">
                  Try {{ feature.title }}
                  <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
                </Button>
              </NuxtLink>
            </div>

            <!-- Image -->
            <div :class="index % 2 === 1 ? 'lg:order-1' : ''">
              <div class="bg-stone-100 rounded-2xl p-4 border border-stone-200">
                <img
                  :src="feature.image"
                  :alt="feature.title"
                  class="w-full h-auto rounded-xl"
                >
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Integrations Section -->
    <section class="w-full bg-stone-900 py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto text-center">
        <h2 class="text-3xl lg:text-4xl font-semibold text-white mb-4">
          Works with your existing stack
        </h2>
        <p class="text-lg text-stone-400 mb-12 max-w-2xl mx-auto">
          Native integrations with 50+ tools. No engineering required.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-8 lg:gap-12 mb-12">
          <div
            v-for="integration in integrationLogos"
            :key="integration.name"
            class="w-16 h-16 bg-stone-800 rounded-xl flex items-center justify-center"
          >
            <Icon :name="integration.icon" class="w-8 h-8 text-stone-400" />
          </div>
        </div>

        <NuxtLink to="#integrations">
          <Button variant="outline" class="h-11 px-6 border-stone-700 text-white hover:bg-stone-800 rounded-lg font-medium">
            View All Integrations
            <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
          </Button>
        </NuxtLink>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="w-full bg-white py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto">
        <div class="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-8 lg:p-12 text-center">
          <h2 class="text-3xl lg:text-4xl font-semibold text-white mb-4">
            Ready to automate your calls?
          </h2>
          <p class="text-lg text-stone-400 mb-8 max-w-xl mx-auto">
            Start a free trial with 200 credits. No credit card required.
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
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'

useHead({
  title: 'Enterprise - Custom AI Voice Solutions | Phonify',
  meta: [
    {
      name: 'description',
      content: 'Enterprise-grade AI voice platform with custom implementations, dedicated support, and enterprise security. Built for scale.',
    },
  ],
})

definePageMeta({
  layout: 'website',
})

const enterpriseFeatures = [
  {
    icon: 'lucide:shield-check',
    title: 'Enterprise Security',
    description: 'SOC 2 Type II, HIPAA, GDPR compliant. Custom security reviews and BAA available.',
  },
  {
    icon: 'lucide:users',
    title: 'Dedicated Support',
    description: 'Named account manager, priority support, and custom SLAs.',
  },
  {
    icon: 'lucide:settings',
    title: 'Custom Implementation',
    description: 'White-glove onboarding, custom integrations, and tailored workflows.',
  },
  {
    icon: 'lucide:server',
    title: 'Guaranteed Uptime',
    description: '99.99% uptime SLA with redundant infrastructure and disaster recovery.',
  },
  {
    icon: 'lucide:git-branch',
    title: 'API-First Platform',
    description: 'Full REST API access, webhooks, and custom integration support.',
  },
  {
    icon: 'lucide:lock',
    title: 'SSO & Access Control',
    description: 'SAML/OIDC SSO, role-based access control, and audit logs.',
  },
]

const requirements = [
  'Volume-based pricing for 10,000+ calls/month',
  'Custom AI voice training on your data',
  'Dedicated infrastructure options',
  'Custom data retention policies',
  'Priority feature requests',
  'Quarterly business reviews',
]

const logos = [
  'Enterprise 1',
  'Enterprise 2',
  'Enterprise 3',
  'Enterprise 4',
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="w-full bg-gradient-to-b from-stone-900 to-stone-800 py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto text-center">
        <p class="text-[#D11E28] font-medium text-sm mb-4">ENTERPRISE</p>
        <h1 class="text-4xl lg:text-5xl font-semibold text-white mb-6">
          AI voice automation at enterprise scale
        </h1>
        <p class="text-xl text-stone-300 max-w-2xl mx-auto mb-10">
          Custom implementations, dedicated support, and the security controls your organization requires. Built for teams handling millions of calls.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank">
            <Button class="h-12 px-8 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
              Talk to Sales
              <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
            </Button>
          </NuxtLink>
          <NuxtLink to="/contact-us">
            <Button variant="outline" class="h-12 px-8 border-stone-600 text-white hover:bg-stone-700 rounded-lg font-medium">
              Request Pricing
            </Button>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Trusted By -->
    <section class="w-full bg-white py-12 px-4 border-b border-stone-200">
      <div class="max-w-[1440px] mx-auto text-center">
        <p class="text-sm text-stone-500 mb-8">Trusted by enterprise teams worldwide</p>
        <div class="flex flex-wrap items-center justify-center gap-12 opacity-50">
          <div v-for="logo in logos" :key="logo" class="text-lg font-semibold text-stone-400">
            {{ logo }}
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="w-full bg-white py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
            Built for enterprise requirements
          </h2>
          <p class="text-lg text-stone-600 max-w-2xl mx-auto">
            Security, compliance, and support that meets your organization's standards.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in enterpriseFeatures"
            :key="feature.title"
            class="bg-stone-50 rounded-xl p-6 border border-stone-100"
          >
            <div class="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center mb-4">
              <Icon :name="feature.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-stone-900 mb-2">{{ feature.title }}</h3>
            <p class="text-stone-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What's Included -->
    <section class="w-full bg-stone-50 py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-6">
              What's included in Enterprise
            </h2>
            <p class="text-lg text-stone-600 mb-8">
              Everything in our standard plans, plus:
            </p>
            <ul class="space-y-4">
              <li v-for="req in requirements" :key="req" class="flex items-start gap-3">
                <div class="w-6 h-6 bg-[#D11E28] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="lucide:check" class="w-4 h-4 text-white" />
                </div>
                <span class="text-stone-700">{{ req }}</span>
              </li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl p-8 border border-stone-200">
            <h3 class="text-xl font-semibold text-stone-900 mb-6">Request Enterprise Pricing</h3>
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-stone-700 mb-1">Work Email</label>
                <input
                  type="email"
                  class="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#D11E28] focus:border-transparent outline-none"
                  placeholder="you@company.com"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-stone-700 mb-1">Company</label>
                <input
                  type="text"
                  class="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#D11E28] focus:border-transparent outline-none"
                  placeholder="Your company name"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-stone-700 mb-1">Monthly Call Volume</label>
                <select class="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#D11E28] focus:border-transparent outline-none">
                  <option>10,000 - 50,000</option>
                  <option>50,000 - 100,000</option>
                  <option>100,000 - 500,000</option>
                  <option>500,000+</option>
                </select>
              </div>
              <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank" class="block">
                <Button class="w-full h-12 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
                  Contact Sales
                </Button>
              </NuxtLink>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Security Certifications -->
    <section class="w-full bg-white py-16 lg:py-24 px-4">
      <div class="max-w-[1440px] mx-auto text-center">
        <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
          Security & Compliance
        </h2>
        <p class="text-lg text-stone-600 mb-12 max-w-2xl mx-auto">
          Enterprise-grade security that passes even the strictest procurement reviews.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          <div class="text-center">
            <div class="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Icon name="lucide:shield-check" class="w-10 h-10 text-green-600" />
            </div>
            <p class="font-semibold text-stone-900">SOC 2 Type II</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Icon name="lucide:lock" class="w-10 h-10 text-blue-600" />
            </div>
            <p class="font-semibold text-stone-900">HIPAA</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Icon name="lucide:file-check" class="w-10 h-10 text-purple-600" />
            </div>
            <p class="font-semibold text-stone-900">TCPA</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Icon name="lucide:globe" class="w-10 h-10 text-orange-600" />
            </div>
            <p class="font-semibold text-stone-900">GDPR</p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Icon name="lucide:credit-card" class="w-10 h-10 text-red-600" />
            </div>
            <p class="font-semibold text-stone-900">PCI DSS</p>
          </div>
        </div>

        <NuxtLink to="/security" class="inline-flex items-center text-[#D11E28] font-medium mt-8 hover:text-red-700">
          View Security Details
          <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
        </NuxtLink>
      </div>
    </section>

    <!-- CTA -->
    <section class="w-full bg-stone-900 py-16 lg:py-24 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl lg:text-4xl font-semibold text-white mb-6">
          Ready to talk enterprise?
        </h2>
        <p class="text-lg text-stone-400 mb-8">
          Our team will create a custom proposal based on your specific requirements.
        </p>
        <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank">
          <Button class="h-12 px-8 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
            Schedule a Call
            <Icon name="lucide:calendar" class="w-4 h-4 ml-2" />
          </Button>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

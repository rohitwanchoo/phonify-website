<script setup>
import { Button } from '~/components/ui/button'

const steps = [
  {
    number: '01',
    icon: 'lucide:plug',
    title: 'Connect',
    description: 'Link your CRM, import contacts, and provision local numbers. Our team handles setup or use our self-serve wizard.',
    details: ['Salesforce, HubSpot, Zoho sync', 'CSV import for contacts', 'Instant number provisioning'],
  },
  {
    number: '02',
    icon: 'lucide:settings',
    title: 'Configure',
    description: 'Build AI scripts with our drag-and-drop editor. Define routing rules, set call hours, customize hold music.',
    details: ['No-code script builder', 'Call flow designer', 'Custom voice selection'],
  },
  {
    number: '03',
    icon: 'lucide:rocket',
    title: 'Launch',
    description: 'Start campaigns and watch calls flow. Monitor live, adjust in real-time, scale as needed.',
    details: ['One-click campaign launch', 'Real-time monitoring', 'Instant scaling'],
  },
]
</script>

<template>
  <section class="w-full bg-white py-16 lg:py-24 px-4">
    <div class="max-w-[1440px] mx-auto">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
        <p class="text-[#D11E28] font-medium text-sm mb-4 flex items-center justify-center gap-2">
          <span class="w-8 h-px bg-[#D11E28]" />
          HOW IT WORKS
          <span class="w-8 h-px bg-[#D11E28]" />
        </p>
        <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
          Go live in 48 hours, not 48 days
        </h2>
        <p class="text-lg text-stone-600">
          No complex implementations. No lengthy onboarding. Start making AI-powered calls this week.
        </p>
      </div>

      <!-- Steps -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="relative"
        >
          <!-- Connector Line -->
          <div
            v-if="index < steps.length - 1"
            class="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-stone-300 to-transparent z-0"
          />

          <div class="bg-stone-50 rounded-2xl p-6 lg:p-8 border border-stone-100 relative z-10">
            <!-- Step Number -->
            <div class="flex items-center justify-between mb-6">
              <div class="w-14 h-14 bg-stone-900 rounded-xl flex items-center justify-center">
                <Icon :name="step.icon" class="w-6 h-6 text-white" />
              </div>
              <span class="text-4xl font-bold text-stone-200">{{ step.number }}</span>
            </div>

            <!-- Content -->
            <h3 class="text-xl font-semibold text-stone-900 mb-3">
              {{ step.title }}
            </h3>
            <p class="text-stone-600 mb-6">
              {{ step.description }}
            </p>

            <!-- Details -->
            <ul class="space-y-2">
              <li
                v-for="(detail, detailIndex) in step.details"
                :key="detailIndex"
                class="flex items-center gap-2 text-sm text-stone-500"
              >
                <Icon name="lucide:check" class="w-4 h-4 text-[#D11E28]" />
                {{ detail }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank">
          <Button class="h-12 px-8 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium">
            <Icon name="lucide:calendar" class="w-5 h-5 mr-2" />
            Book a 15-Minute Setup Call
          </Button>
        </NuxtLink>
        <p class="text-sm text-stone-500 mt-4">
          Or start a free trial and set up yourself in under 5 minutes
        </p>
      </div>
    </div>
  </section>
</template>

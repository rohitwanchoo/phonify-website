<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const defaultValue = 'item-1'

const faqs = [
  {
    value: 'item-1',
    question: 'How does Phonify\'s AI actually handle calls?',
    answer: 'Our AI voice agents use advanced language models to have natural conversations. They understand context, follow your custom scripts, handle objections, and respond in under 500ms. When calls require human expertise, AI seamlessly hands off with full context preserved.',
  },
  {
    value: 'item-2',
    question: 'How long does it take to get started?',
    answer: 'Most teams are live within 48 hours. Connect your CRM, upload contacts, configure your AI scripts with our no-code builder, and start making calls. Our team can handle setup for you, or use our self-serve wizard.',
  },
  {
    value: 'item-3',
    question: 'What integrations do you support?',
    answer: 'We have native integrations with Salesforce, HubSpot, Zoho, Pipedrive, Zendesk, Freshdesk, Intercom, Slack, and 50+ other tools. We also offer a full REST API and webhooks for custom integrations.',
  },
  {
    value: 'item-4',
    question: 'Is Phonify compliant with TCPA and other regulations?',
    answer: 'Yes. TCPA compliance is built into the platform with automatic DNC scrubbing, calling hour restrictions by timezone, and consent tracking. We\'re also SOC 2 Type II certified, HIPAA compliant (BAA available), and GDPR ready.',
  },
  {
    value: 'item-5',
    question: 'Can I bring my own phone numbers or carrier?',
    answer: 'Absolutely. You can port existing numbers, provision new local or toll-free numbers through us, or bring your own Twilio gateway. We support flexible telephony options to fit your setup.',
  },
  {
    value: 'item-6',
    question: 'How is pricing structured?',
    answer: 'We offer usage-based pricing with credits. Plans start at $9.90/month with 200 credits. Higher volume teams get better rates, and enterprise customers get custom pricing. No per-seat fees—pay only for what you use.',
  },
  {
    value: 'item-7',
    question: 'What kind of support do you offer?',
    answer: 'All plans include email and chat support. Pro and Enterprise plans get priority support with faster response times. Enterprise customers receive a dedicated account manager and custom SLAs.',
  },
]
</script>

<template>
  <section class="w-full bg-white py-16 lg:py-24 px-4">
    <div class="max-w-[1440px] mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <!-- Header -->
        <div class="lg:col-span-4">
          <p class="text-[#D11E28] font-medium text-sm mb-4 flex items-center gap-2">
            <span class="w-2 h-2 bg-[#D11E28] rounded-full" />
            FAQ
          </p>
          <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
            Questions, answered.
          </h2>
          <p class="text-stone-600 mb-6">
            Everything you need to know about Phonify. Can't find what you're looking for?
          </p>
          <NuxtLink to="/contact-us" class="inline-flex items-center text-[#D11E28] font-medium hover:text-red-700">
            Contact us
            <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
          </NuxtLink>
        </div>

        <!-- Accordion -->
        <div class="lg:col-span-8">
          <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
            <AccordionItem
              v-for="item in faqs"
              :key="item.value"
              :value="item.value"
              class="border-b border-stone-200 last:border-none"
            >
              <AccordionTrigger
                class="text-left text-base lg:text-lg font-medium py-5 hover:no-underline hover:text-[#D11E28] transition-colors"
              >
                {{ item.question }}
              </AccordionTrigger>
              <AccordionContent class="text-stone-600 pb-5 leading-relaxed">
                {{ item.answer }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  </section>
</template>

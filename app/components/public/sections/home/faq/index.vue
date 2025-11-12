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
    question: 'How does AI handle calls from start to finish?',
    answer: 'Our AI manages the entire call flow — from the first ring to resolution. It automatically logs outcomes, tracks call metrics, and ensures every follow-up is completed, giving your team the efficiency of a full call center without additional staff. Keywords: AI call handling, call flow automation, call tracking, efficiency ',
  },
  {
    value: 'item-2',
    question: 'Can I track call performance in real time?',
    answer: 'Yes! Real-time dashboards provide instant insights into inbound and outbound calls, average call durations, connection rates, and more. Monitor your team’s performance and optimize workflows effortlessly.',
  },
  {
    value: 'item-3',
    question: 'Does the system support multichannel communication?',
    answer: 'Absolutely. Manage calls, SMS, emails, and automated voice messages all in one platform. Each tool works independently, but together they create a seamless, unified workflow for your team.',
  },
  {
    value: 'item-4',
    question: 'How does AI help businesses scale without increasing staff?',
    answer: 'AI acts like extra team members, handling routine calls, follow-ups, and data logging. This allows businesses of any size to scale operations, improve response times, and maintain high-quality customer interactions without adding more employees.',
  },
  {
    value: 'item-5',
    question: 'Can I schedule calls and follow-ups efficiently?',
    answer: 'Yes! The integrated calendar tracks meetings, callbacks, and campaigns. Agents and admins can stay organized, ensuring no call or follow-up is missed while keeping workflows smooth.',
  },
  {
    value: 'item-6',
    question: 'Is the system secure and easy to manage?',
    answer: 'Security is built-in. Manage user roles, set IP restrictions, and track every login and system action. It’s designed to be both robust and simple, giving you total visibility without being complex.',
  },
  {
    value: 'item-7',
    question: 'How does Phonify improve productivity and performance for call centers?',
    answer: 'Phonify powers AI-driven calling where multiple agents can join campaigns at once. Agents and AI handle calls together (up to five per agent) so a 10-member team can manage 50 active calls. With Smart Routing, calls are automatically directed internally or between campaign agents through Cloud PBX and ACD queues. Plus, team extensions make internal transfers quick and effortless.',
  },
]
</script>

<template>
  <div class="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-20  px-4 md:px-28 py-8 md:py-24 ">
    <div class="flex flex-col gap-5">
      <h1 class="font-light text-base">
        <span
          class="inline-block w-3 h-3 bg-[#D11E28] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
        />
        FAQ’s
      </h1>
      <h2 class="font-medium text-2xl sm:text-4xl md:text-5xl leading-tight">
        Questions, <br class="hidden md:block">
        Answered.
      </h2>
    </div>

    <div class="flex-1 ml-0 lg:ml-10">
      <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
        <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
          <AccordionItem
            v-for="item in faqs" :key="item.value" :value="item.value"
            class="border-b border-dashed border-[#E7E5E4] last:border-none p-3"
          >
            <AccordionTrigger
              class="text-base sm:text-lg md:text-xl font-medium cursor-pointer hover:no-underline flex justify-between items-center w-full"
            >
              {{ item.question }}
            </AccordionTrigger>
            <AccordionContent class="text-[#44403C] text-sm md:text-base font-normal leading-relaxed">
              {{ item.answer }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const defaultValue = 'item-1'

const faqs = [
  { value: 'item-1', question: 'How does AI handle calls from start to finish?', answer: 'Phonify is a cloud-based call center management platform that helps businesses simplify communication, manage campaigns, and improve agent productivity — all through a single, intuitive dashboard.' },
  { value: 'item-2', question: 'Can I track call performance in real time?', answer: 'Absolutely, you can customize it freely.' },
  { value: 'item-3', question: 'Does the system support multichannel communication?', answer: 'Absolutely, you can customize it freely.' },
  { value: 'item-4', question: 'Can I schedule calls and follow-ups efficiently?', answer: 'Absolutely, you can customize it freely.' },
  { value: 'item-5', question: 'Is the system secure and easy to manage?', answer: 'Absolutely, you can customize it freely.' },
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

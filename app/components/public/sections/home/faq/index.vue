<script setup>
import { Icon } from '#components'
import { ref } from 'vue'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  { question: 'How does AI handle calls from start to finish?', answer: 'Phonify is a cloud-based call center management platform that helps businesses simplify communication, manage campaigns, and improve agent productivity — all through a single, intuitive dashboard.' },
  { question: 'Can I track call performance in real time?', answer: 'Absolutely, you can customize it freely.' },
  { question: 'Does the system support multichannel communication?', answer: 'Yes, it’s fully responsive and mobile-friendly.' },
  { question: 'Can I schedule calls and follow-ups efficiently?', answer: 'Yes, it’s fully responsive and mobile-friendly.' },
  { question: 'Is the system secure and easy to manage?', answer: 'Yes, it’s fully responsive and mobile-friendly.' },
]

const openItem = ref(null)

function toggleItem(value) {
  openItem.value = openItem.value === value ? null : value
}
</script>

<template>
  <div class="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-20  px-4 md:px-28 py-8 md:py-24">
    <!-- Left Section -->
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
      <Accordion type="single" collapsible class="space-y-3">
        <AccordionItem
          v-for="(faq, index) in faqs" :key="index" :value="`item-${index}`"
          class="border-dashed border-b-2 p-3"
        >
          <AccordionTrigger
            class="text-base sm:text-lg md:text-xl font-medium cursor-pointer hover:no-underline flex justify-between items-center w-full"
            @click="toggleItem(`item-${index}`)"
          >
            {{ faq.question }}
            <!-- <template #icon>
              <div class="border bg-[#F8F3F0] rounded-xs p-2 h-[42px] w-[42px] flex items-center justify-center">
                <Icon v-if="openItem !== `item-${index}`" name="material-symbols:add"
                  class="size-5 transition-all duration-200" />
                <Icon v-else name="material-symbols:remove" class="size-5 transition-all duration-200" />
              </div>
            </template> -->
          </AccordionTrigger>

          <AccordionContent
            v-show="openItem === `item-${index}`"
            class="text-[#44403C] text-sm md:text-base font-normal leading-relaxed"
          >
            {{ faq.answer }}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
</template>

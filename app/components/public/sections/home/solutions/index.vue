<script setup>
import SolutionsCard from '@/components/public/sections/home/solutions/Card.vue'

const cards = [
  {
    title: 'For Agents:',
    image: '/images/phonify-web/solutions/agents.svg',
    description:
            'Less clicking, more connecting. Log calls  automatically. Follow ups made easy.',
  },
  {
    title: 'For Managers:',
    image: '/images/phonify-web/solutions/managers.svg',
    description:
            'See everything. Measure what matters. Act  quickly.',
  },
  {
    title: 'For Businesses:',
    image: '/images/phonify-web/solutions/business.svg',
    description:
            'Run like a big team, even with a small one.  AI scales your operations.',
  },
]
</script>

<template>
  <section class="bg-[#F8F3F0] overflow-x-hidden">
    <div class="max-w-[1440px] mx-auto flex flex-col gap-12 md:gap-16  px-4 md:px-28 py-8 md:py-24">
      <div class="flex flex-col gap-4 md:text-center text-start">
        <div class="font-light text-base">
          <span
            class="inline-block w-3 h-3 bg-[#D11E28] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
          />
          Solutions
        </div>

        <h1 class="text-stone-900 text-2xl lg:text-5xl font-medium">
          Productivity that lifts the whole team
        </h1>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        <SolutionsCard
          v-for="(card, index) in cards" :key="index" :title="card.title" :image="card.image"
          :description="card.description"
        />
      </div>
    </div>
  </section>
</template>

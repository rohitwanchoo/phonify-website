<script setup>
import blogsCard from '@/components/public/sections/home/blogs/Card.vue'
import dotArrow from '~/assets/svg/public/dotArrow.svg'
import { Button } from '~/components/ui/button'

const cards = [
  {
    title: '5 Ways to Boost Agent Productivity with Smart Automation',
    image: '/images/phonify-web/blogs/productivity.png',
    description: 'Explore practical strategies to help your agents perform better ',
    date: '20 October 2025',
    author: 'John Doe',
  },
  {
    title: 'Building a Multi-Channel Customer Engagement Strategy',
    image: '/images/phonify-web/blogs/customer.png',
    description: 'Today’s customers expect more than calls — they want ',
    date: '20 October 2025',
    author: 'John Doe',
  },
  {
    title: 'From Calls to Conversions: How Phonify Simplifies Lead Management',
    image: '/images/phonify-web/blogs/lead-management.png',
    description: 'Learn how Phonify’s built-in lead management tools streamline ',
    date: '20 October 2025',
    author: 'John Doe',
  },
]
</script>

<template>
  <div class="bg-[#F8F3F0]">
    <div class="max-w-[1440px] mx-auto flex flex-col gap-6 md:gap-16  px-4 md:px-28 py-8 md:py-24 ">
      <div class="flex flex-col gap-4 md:gap-5 text-start">
        <h1 class="font-light text-base">
          <span
            class="inline-block w-3 h-3 bg-[#D11E28] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
          />
          Blogs
        </h1>

        <div class="flex flex-col lg:flex-row justify-between">
          <h2 class="font-medium text-2xl sm:text-4xl md:text-5xl leading-tight">
            Explore Our Blog
          </h2>
          <p class="font-extralight text-base sm:text-lg md:text-xl">
            Dive into our blog for expert insights, tips, and industry
            <br class="hidden lg:block">
            trends to elevate your project management journey.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        <blogsCard
          v-for="(card, index) in cards" :key="index" :title="card.title" :image="card.image"
          :description="card.description" :date="card.date" :author="card.author"
        />
      </div>

      <div class="flex justify-center">
        <Button class="w-full md:w-fit h-12 px-6 py-3 bg-[#1F1E1C] text-white hover:bg-[#33312F] rounded-xs">
          View more
          <img :src="dotArrow" alt="icon" class="size-4">
        </Button>
      </div>
    </div>
  </div>
</template>

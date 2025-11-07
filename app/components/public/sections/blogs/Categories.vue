<script setup>
import { PublicSectionsHomeBlogsCard } from '#components'
import dotArrow from '~/assets/svg/public/dotArrow.svg'
import { Button } from '~/components/ui/button'

const categories = [
  {
    name: 'All Blogs',
    active: true,
  },
  {
    name: 'New Features',
    active: false,
  },
  {
    name: 'Marketing',
    active: false,
  },
  {
    name: 'Technology',
    active: false,
  },
  {
    name: 'New Updates',
    active: false,
  },
  {
    name: 'Tips & Tricks',
    active: false,
  },
  {
    name: 'About Us',
    active: false,
  },
]

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
  <div class="max-w-[1440px] mx-auto w-full px-4 lg:px-28 py-8 lg:py-16 space-y-6 lg:space-y-10">
    <div class="flex gap-3 flex-col lg:flex-row lg:justify-between lg:items-center">
      <h2 class="text-stone-900 text-xl lg:text-5xl font-medium capitalize">
        Lorem ipsum dolor.
      </h2>
      <p class="text-stone-700 text-base lg:text-xl font-extralight leading-8">
        Lorem ipsum dolor sit amet consectetur. Non eget in viverra orci.
      </p>
    </div>
    <div class="flex items-center lg:justify-center gap-5 overflow-x-auto">
      <Button v-for="category in categories" :key="category.name" :variant="category.active ? 'default' : 'outline'" :class="category.active ? 'bg-stone-900' : 'border-stone-300 text-stone-700'" class="h-12 rounded-xs">
        {{ category.name }}
      </Button>
    </div>
    <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PublicSectionsHomeBlogsCard
        v-for="(card, index) in cards" :key="index" :title="card.title" :image="card.image"
        :description="card.description" :date="card.date" :author="card.author"
      />
    </div>

    <div class="flex justify-center">
      <Button class="w-full md:w-fit h-12 px-6 py-3 bg-[#1F1E1C] text-white hover:bg-[#33312F] rounded-xs">
        View more
        <img :src="dotArrow" alt="icon" class="size-4 rotate-90">
      </Button>
    </div>
  </div>
</template>

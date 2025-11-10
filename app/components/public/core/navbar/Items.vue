<script setup>
import dotArrow from '~/assets/svg/public/dotArrow.svg'
import { Button } from '~/components/ui/button'

const route = useRoute()

const items = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Features',
    link: '#features',
  },
  {
    name: 'Pricing',
    link: '/pricing',
  },
  {
    name: 'Blogs',
    link: '/blogs',
  },
  {
    name: 'Contact Us',
    link: '/contact-us',
  },
]
</script>

<template>
  <div class="w-full px-4 lg:px-0 pt-8 lg:pt-0 pb-6 lg:pb-0 bg-gray-50 lg:bg-white flex flex-col lg:flex-row justify-start lg:justify-between items-center gap-6">
    <ul class="flex flex-col lg:flex-row items-center gap-6">
      <li v-for="item in items" :key="item.link" class=" text-gray-700 hover:text-black cursor-pointer" :class="route.path === item.link ? 'underline text-gray-900' : ''">
        <NuxtLink :to="item.link">
          {{ item.name }}
        </NuxtLink>
      </li>
    </ul>
    <div class="w-full lg:w-fit flex flex-col lg:flex-row-reverse justify-end items-center gap-3">
      <Button class="h-12 w-full lg:w-fit px-10 py-3 bg-[#1F1E1C] lg:bg-[#D11E28] rounded-xs flex justify-center items-center gap-2 text-white font-medium">
        Start free trail
        <img :src="dotArrow" class="size-4">
      </Button>
      <Button variant="link" class="h-12 w-full lg:w-fit px-10 py-3 bg-[#E7E5E4] rounded-xs text-black font-normal">
        Sign in
      </Button>
    </div>
  </div>
</template>

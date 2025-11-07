<script setup>
import dotArrow from '~/assets/svg/public/dotArrow.svg'
import dotArrowBlack from '~/assets/svg/public/dotArrowBlack.svg'

import { Button } from '~/components/ui/button'
</script>

<template>
  <div class="w-full space-y-10">
    <div class="h-full flex items-start justify-between gap-12">
      <div class="h-full flex flex-col justify-between">
        <div class="space-y-5 w-full h-full">
          <div class="flex justify-between items-center">
            <div class="flex justify-start items-center">
              <p class="justify-start text-red-600 text-sm line-clamp-6">
                Featured
              </p>
              <div class="size-1 bg-black mx-1.5" />
              <p class="justify-start text-stone-900 text-sm line-clamp-6">
                Marketing
              </p>
            </div>
            <p class="justify-start text-zinc-700 text-xs font-light line-clamp-6">
              12 Mins Read
            </p>
          </div>
          <div class="space-y-4">
            <h2 class="text-stone-900 text-3xl font-medium">
              5 Ways to Boost Agent Productivity with Smart Automation
            </h2>
            <p class="text-stone-700 text-base leading-6 line-clamp-3">
              Explore practical strategies to help your agents perform better — from auto-dialing and IVR routing to lead recycling and real-time analytics. Automation doesn’t replace people — it empowers them.
            </p>
            <Button variant="link" class="text-stone-900 text-base font-medium px-0">
              Read full article
              <img :src="dotArrowBlack" alt="icon" class="size-4">
            </Button>
          </div>
        </div>
        <div class="flex-1 flex justify-start items-center gap-3 mt-10">
          <p class="justify-start text-zinc-700 text-sm font-light line-clamp-6">
            20 October 2025
          </p>
          <div class="size-1 bg-black mx-1.5" />
          <p class="text-sm line-clamp-6">
            <span class="text-zinc-700 font-light">
              by
            </span>
            <span class="text-stone-900 underline">
              John Doe
            </span>
          </p>
        </div>
      </div>
      <!-- Image -->
      <div class="max-w-[620px] min-w-[400px] w-full">
        <img src="/images/website/sections/blogs/blog1.png" alt="image" class="w-full h-full object-cover">
      </div>
    </div>
    <div class="w-full flex items-center justify-between">
      <p class="justify-start text-zinc-700 text-sm font-light line-clamp-6">
        01 / 03
      </p>
      <div class="flex items-center gap-3">
        <Button size="icon" class="bg-stone-900 text-white  rounded-xs">
          <img :src="dotArrow" alt="icon" class="size-4 rotate-180">
        </Button>
        <Button size="icon" class="bg-stone-900 text-white rounded-xs">
          <img :src="dotArrow" alt="icon" class="size-4">
        </Button>
      </div>
    </div>
    <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed">
  </div>
</template>

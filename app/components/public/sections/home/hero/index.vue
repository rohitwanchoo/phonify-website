<script setup>
import dotArrow from '~/assets/svg/public/dotArrow.svg'
import { Button } from '~/components/ui/button'
</script>

<template>
  <div class="w-full  bg-gradient-to-b from-white to-white">
    <div class="max-w-[1440px] mx-auto w-full py-8 px-4 md:pt-[66px] md:pb-[100px] space-y-6 md:space-y-[66px]">
      <div class="flex justify-between items-end gap-3 flex-col md:flex-row">
        <div class="space-y-4">
          <div class="hidden md:flex w-fit h-12 pl-1.5 pr-5 py-3 bg-stone-100 rounded-[50px] border border-stone-300 justify-center items-center gap-3">
            <div class="px-3.5 py-2 bg-[#1F1E1C] rounded-[40px] flex justify-center items-center gap-2.5 text-white text-sm font-extralight">
              New
            </div>
            <div class="justify-start text-[#1F1E1C] font-extralight leading-6">
              All-in-one call centre management
            </div>
          </div>
          <div class="max-w-[600px] justify-start leading md:leading-[76px] text-3xl md:text-6xl">
            <span class="text-neutral-800 font-medium">
              Built to Power Every Phone System, With <br>
            </span>
            <span class="text-[#D11E28] font-semibold italic">AI at the Core.</span>
          </div>
        </div>
        <div class="space-y-4 md:space-y-10">
          <p class="md:max-w-96 text-end text-stone-700 text-base md:text-xl font-extralight leading-6 md:leading-8">
            For call centers where every second counts.<br>Phonify’s AI cuts the clutter, automates the routine, and keeps your team moving efficiently from call to call.
          </p>
          <div class="flex justify-end items-center gap-3 flex-col md:flex-row">
            <!-- <Button class="w-full md:w-fit h-12 px-6 py-3 bg-[#1F1E1C] text-white rounded-xs">
              Start free trail
              <img :src="dotArrow" class="size-4">
            </Button> -->
            <NuxtLink to="/" class="w-full md:w-fit">
              <Button variant="outline" class="w-full md:w-fit h-12 px-6 py-3 bg-[#E7E5E4] border-0 text-black rounded-xs font-medium">
                Book a demo
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="w-full rounded-md">
        <img src="/images/website/sections/home/hero-img.png" alt="image" class="w-full hidden md:block">
        <img src="/images/website/sections/home/hero-mob.png" alt="image" class="w-full md:hidden">
      </div>
    </div>
  </div>
</template>

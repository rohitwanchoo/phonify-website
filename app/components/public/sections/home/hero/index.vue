<script setup>
// import dotArrow from '~/assets/svg/public/dotArrow.svg'
import { Button } from '~/components/ui/button'
</script>

<template>
  <div class="w-full bg-gradient-to-b from-white to-white">
    <div class="max-w-[1440px] mx-auto w-full py-8 px-4 lg:pt-[66px] lg:pb-[100px] space-y-6 lg:space-y-[66px]">
      <div class="flex justify-between items-end gap-3 flex-col lg:flex-row">
        <div class="space-y-4 max-lg:w-full">
          <div class="hidden lg:flex w-fit h-12 pl-1.5 pr-5 py-3 bg-stone-100 rounded-[50px] border border-stone-300 justify-center items-center gap-3">
            <div class="px-3.5 py-2 bg-[#1F1E1C] rounded-[40px] flex justify-center items-center gap-2.5 text-white text-sm font-extralight">
              New
            </div>
            <div class="justify-start text-[#1F1E1C] font-extralight leading-6">
              All-in-One AI-powered VoIP Phone System
            </div>
          </div>
          <div class="w-full lg:max-w-[600px] justify-start leading lg:leading-[76px] text-3xl lg:text-6xl">
            <span class="text-neutral-800 font-medium">
              Built to Power Every Phone System, With <br>
            </span>
            <span class="text-[#D11E28] font-semibold italic">AI at the Core.</span>
          </div>
        </div>
        <div class="max-lg:w-full space-y-4 lg:space-y-10">
          <p class="lg:max-w-96 text-start lg:text-end text-stone-700 text-base lg:text-xl font-extralight leading-6 lg:leading-8">
            For call centers where every second counts.<br>Phonify’s AI cuts the clutter, automates the routine, and keeps your team moving efficiently from call to call.
          </p>
          <div class="flex justify-end items-center gap-3 flex-col lg:flex-row">
            <!-- <Button class="w-full lg:w-fit h-12 px-6 py-3 bg-[#1F1E1C] text-white rounded-xs">
              Start free trail
              <img :src="dotArrow" class="size-4">
            </Button> -->
            <NuxtLink to="https://bookings.easify.appteam/phonify/learn-all-about-phonify" target="_blank" class="w-full lg:w-fit">
              <Button variant="outline" class="w-full lg:w-fit h-12 px-6 py-3 bg-[#E7E5E4] border-0 text-black rounded-xs font-medium">
                Book a demo
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="w-full rounded-md overflow-hidden h-[50dvh] lg:h-full">
        <img src="/images/website/sections/home/hero-img.png" alt="image" class="w-full h-full  rounded-md object-cover object-center">
        <!-- <img src="/images/website/sections/home/hero-mob.png" alt="image" class="w-full lg:hidden"> -->
      </div>
    </div>
  </div>
</template>

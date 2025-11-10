<script setup>
import dotArrow from '~/assets/svg/public/dotArrow.svg'
import { Button } from '~/components/ui/button'
</script>

<template>
  <div class="w-full h-[300px] lg:h-[480px] bg-[#1F1E1C] flex items-center justify-center px-4 relative">
    <img src="/images/website/sections/waves.gif" alt="" class="absolute top-0 left-0 w-full h-full object-cover grayscale opacity-80">
    <div class="absolute top-0 left-0 w-full h-full bg-black/70 z-10" />
    <div class="z-10">
      <h1 class="text-2xl lg:text-5xl text-center text-white font-medium mb-3">
        Ready to Make <span class="font-semibold italic">Calls Easy?</span>
      </h1>
      <p class="text-center justify-start text-stone-200 text-base font-extralight leading-6">
        Try Phonify and see how simple call management can be.
      </p>
      <div class="flex flex-col lg:flex-row justify-center items-center gap-3 mt-4 lg:mt-8">
        <!-- <Button class="h-12 w-full lg:w-fit bg-[#D11E28] text-white rounded-xs">
          Start free trial
          <img :src="dotArrow" class="size-4">
        </Button> -->
        <NuxtLink to="/" class="h-12 w-full lg:w-fit bg-[#D11E28] text-white rounded-xs">
          <Button variant="outline" class="h-12 w-full lg:w-fit bg-white/5 border border-white/40 text-white rounded-xs font-medium px-8">
            Book a Demo
          </Button>
        </NuxtLink>
        
      </div>
    </div>
  </div>
</template>

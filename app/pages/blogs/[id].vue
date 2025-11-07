<script setup>
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div class="w-full bg-white">
    <div class="max-w-[1440px] mx-auto px-28 pt-16">
      <div class="flex flex-col justify-start gap-5">
        <div>
          <NuxtLink class="flex justify-start items-center gap-1 text-stone-900" to="/blogs">
            <Icon name="material-symbols:arrow-back-ios-new" size="16" class="text-stone-900" />
            Back
          </NuxtLink>
        </div>
        <div class="justify-start text-red-600 text-base font-light font-['Blauer_Nue'] leading-6">
          Marketing
        </div>
        <div class="text-center justify-start text-stone-900 text-5xl font-medium font-['Montserrat']">
          5 Ways to Boost Agent Productivity with <br>Smart Automation
        </div>
        <div class="inline-flex justify-start items-center gap-3">
          <div class="justify-start text-stone-600 text-lg font-light font-['Montserrat'] leading-9 line-clamp-6">
            20 October 2025
          </div>
          <div class="justify-start" />
          <div class="justify-start">
            <span class="text-stone-600 text-lg font-light font-['Montserrat'] leading-9 line-clamp-6">by </span><span class="text-stone-800 text-lg font-medium font-['Montserrat'] underline leading-9 line-clamp-6">John Doe</span>
          </div>
        </div>
      </div>
      <div class="h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-zinc-300" />
      <img class="h-[500px] rounded-sm" src="https://placehold.co/1272x500">
      <div class="h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-zinc-300" />
    </div>
  </div>
</template>

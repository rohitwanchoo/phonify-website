<script setup lang="ts">
import bulbIcon from '~/assets/svg/public/pricing/bulb.svg'
import { Button } from '~/components/ui/button'

useHead({
  title: 'Pricing - Phonify',
})

definePageMeta({
  layout: 'website',
})

const openCredit = ref(false)

const plan = [
  {
    name: 'Basic',
    price: '$9.90',
    description: 'Perfect for small teams looking for reliable communication tools.',
    credit: 200,
    unlimitedCalls: 'true',
    dialerCalls: 'false',
    aiIntegratedCalls: 'false',
    addOns: ['$10 for add-on SMS', '$2.5/number', '$5/toll free number'],
  },
  {
    name: 'Pro',
    price: '$19.99',
    description: 'Designed for fast-growing businesses needing more scale.',
    credit: 2000,
    unlimitedCalls: 'true',
    dialerCalls: 'true',
    aiIntegratedCalls: 'false',
    addOns: ['$10 for add-on SMS', '$2.5/number', '$5/toll free number'],
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    description: 'The best choice for large-scale, high-volume operations.',
    credit: 5000,
    unlimitedCalls: 'true',
    dialerCalls: 'true',
    aiIntegratedCalls: 'true',
    addOns: ['$10 for add-on SMS', '$2.5/number', '$5/toll free number'],
  },
]

const customPlan = {
  name: 'CusBring your own gateway*',
  price: '$49.99',
  description: '*Only Twilio gateway is supported as of now.',
  credit: 10000,
  unlimitedCalls: 'hidden',
  dialerCalls: 'hidden',
  aiIntegratedCalls: 'hidden',
  addOns: ['$5 for add-on users', 'Only needs to pay platform fees: 1 Credit/min for Calls & 1 Credit per SMS'],
}
</script>

<template>
  <main>
    <section class="w-full bg-white px-4 lg:px-28 py-8 lg:py-16">
      <div class="max-w-[1440px] mx-auto">
        <div class="flex flex-col items-center gap-3 lg:gap-5">
          <h1 class="w-full text-start lg:text-center text-stone-900 text-2xl lg:text-5xl font-medium capitalize">
            Find the perfect plan<br>for your needs
          </h1>
          <p class="max-w-[678px] text-start lg:text-center text-stone-700 text-base lg:text-xl font-extralight">
            Wether you are an individual, growing team, or a large enterprise phonify has a plan that fits your needs with no hidden fees.
          </p>
        </div>
        <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed my-10 hidden lg:block">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-10">
          <PublicSectionsPricingCard v-for="item in plan" :key="item.name" :plan="item" />
        </div>
        <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed my-6 lg:my-10">
        <div class="p-6 flex flex-col lg:flex-row lg:justify-between gap-6 items-center border border-zinc-200 rounded-xs overflow-hidden">
          <PublicSectionsPricingCard :plan="customPlan" custom-class="border-none !px-0 !pt-0 !pb-0 w-full lg:min-w-96" btn-class="hidden lg:flex" />
          <img src="/images/website/sections/pricing/custom-plan.png" alt="image" class="h-auto">
          <Button class="w-full h-11 mt-auto rounded-xs bg-[#D1222C] text-white hover:bg-[#D1222C]/90 lg:hidden">
            Choose Plan
          </Button>
        </div>
        <div class="mt-6 lg:mt-10 p-3 bg-amber-50 rounded-xs border border-orange-200 flex lg:items-center flex-col lg:flex-row lg:justify-between gap-2">
          <div class="flex items-start gap-1">
            <img :src="bulbIcon" alt="icon" class="text-lg">
            <p class="text-stone-700 lg:text-stone-900 text-sm lg:text-base font-normal">
              Phonify uses a credit system. The credit usage varies based on various features in Phonify
            </p>
          </div>
          <PublicSectionsPricingDialog>
            <Button variant="link" class="underline text-red-600 hover:text-red-500 px-[26px] lg:px-0 py-0 w-fit font-normal" @click="openCredit = true">
              View Credits Breakdown
            </Button>
          </PublicSectionsPricingDialog>
        </div>
      </div>
    </section>
    <section class="px-4 lg:px-28 py-8 lg:py-24 bg-stone-100">
      <PublicSectionsPricingFaq />
    </section>
  </main>
  <PublicSectionsPricingDialog />
</template>

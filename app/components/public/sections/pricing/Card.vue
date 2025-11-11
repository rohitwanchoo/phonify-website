<script setup lang="ts">
import aiIcon from '~/assets/svg/public/pricing/ai.svg'
import callIcon from '~/assets/svg/public/pricing/call.svg'
import coinIcon from '~/assets/svg/public/pricing/coin.svg'
import phoneKeypadIcon from '~/assets/svg/public/pricing/phone-keypad.svg'
import pointIcon from '~/assets/svg/public/pricing/point.svg'
import { Button } from '~/components/ui/button'

const _props = defineProps({
  plan: {
    type: Object,
    default: () => ({}),
  },
  customClass: {
    type: String,
    default: '',
  },
  btnClass: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="w-full px-3.5 pt-6 pb-3 bg-white rounded-xs border border-zinc-200 flex flex-col gap-4" :class="customClass">
    <div class="space-y-3 lg:space-y-6">
      <div class="space-y-4">
        <p class="text-black">
          {{ plan.name }}
        </p>
        <div class="flex justify-start items-center gap-1 lg:gap-1.5">
          <p class="text-stone-900 text-3xl font-medium">
            {{ plan.price }}
          </p>
          <p class="text-stone-900 text-lg font-medium">
            /User per month
          </p>
        </div>
        <p class="text-black/60">
          {{ plan.description }}
        </p>
      </div>
      <ul class="space-y-3">
        <li class="flex items-center gap-2.5">
          <img :src="coinIcon" alt="icon" class="size-[18px]">
          <p class="text-black text-sm lg:text-base">
            {{ formatWithCommas(plan.credit) }}
            <span class="text-black/60 text-xs lg:text-base">
              Credit
            </span>
          </p>
        </li>
        <li v-if="plan.unlimitedCalls !== 'hidden'" class="flex items-center gap-2.5" :class="{ 'opacity-10': plan.unlimitedCalls === 'false' }">
          <img :src="callIcon" alt="icon" class="size-[18px]">
          <p class="text-black text-sm lg:text-base">
            Unlimited
            <span class="text-black/60 text-xs lg:text-base">
              Calls
            </span>
          </p>
        </li>
        <li v-if="plan.dialerCalls !== 'hidden'" class="flex items-center gap-2.5" :class="{ 'opacity-10': plan.dialerCalls === 'false' }">
          <img :src="phoneKeypadIcon" alt="icon" class="size-[18px]">
          <p class="text-black text-sm lg:text-base">
            Dialer
            <span class="text-black/60 text-xs lg:text-base">
              Calls
            </span>
          </p>
        </li>
        <li v-if="plan.aiIntegratedCalls !== 'hidden'" class="flex items-center gap-2.5" :class="{ 'opacity-10': plan.aiIntegratedCalls === 'false' }">
          <img :src="aiIcon" alt="icon" class="size-[18px]">
          <p class="text-black text-sm lg:text-base">
            AI Integrated
            <span class="text-black/60 text-xs lg:text-base">
              Calls
            </span>
          </p>
        </li>
        <li>
          <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed">
        </li>
        <li v-for="addOn in plan.addOns" :key="addOn" class="flex items-center gap-2.5">
          <img :src="pointIcon" alt="icon" class="size-[18px]">
          <p class="text-black/70 text-sm lg:text-base">
            {{ addOn }}
          </p>
        </li>
      </ul>
    </div>
    <Button class="w-full h-11 mt-auto rounded-xs bg-[#D1222C] text-white hover:bg-[#D1222C]/90" :class="btnClass">
      Choose Plan
    </Button>
  </div>
</template>

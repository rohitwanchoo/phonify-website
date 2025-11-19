<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const features = [
  {
    feature: 'Branded Calls',
    credit: '1/min',
  },
  {
    feature: 'AI Call',
    credit: '4/min',
  },
  {
    feature: 'SMS',
    credit: '4/(160 Characters)',
  },
  {
    feature: 'Ringless Voicemail',
    credit: '5',
  },
  {
    feature: 'Email',
    credit: '1',
  },
]
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="max-w-96 lg:max-w-[500px] w-full px-6 py-8 rounded-xs gap-6">
      <DialogHeader class="gap-1">
        <DialogTitle class="text-stone-900 text-2xl font-medium text-center">
          Credit Breakdown
        </DialogTitle>
        <DialogDescription class="text-center text-stone-700 text-base font-extralight ">
          Here is the credit usage of various features in Phonify.
        </DialogDescription>
      </DialogHeader>
      <ul class="p-3 bg-stone-100 rounded-xs space-y-3">
        <li class="pb-2 border-b border-zinc-200 flex justify-between items-center">
          <h6 class="opacity-80 justify-start text-stone-900 text-sm">
            Feature
          </h6>
          <p class="opacity-80 text-[#D11E28] text-sm">
            Credits
          </p>
        </li>
        <li v-for="(item, index) in features" :key="index" class="flex items-center justify-between gap-2">
          <h6 class="text-zinc-700 text-sm font-medium">
            {{ item.feature }}
          </h6>
          <p class="text-[#D11E28] text-sm font-medium">
            {{ item.credit }}
          </p>
        </li>
      </ul>
    </DialogContent>
  </Dialog>
</template>

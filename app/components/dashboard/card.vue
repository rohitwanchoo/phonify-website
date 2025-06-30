<script setup lang="ts">
defineProps<{
  image: string
  title: string
  value: 'loading' | number
}>()
</script>

<template>
  <div class="card-main p-[12px] rounded-xl bg-white shadow-md">
    <div class="flex lg:flex-col lg:items-left xl:flex-col xl:items-left 2xl:flex-row  2xl:items-center gap-2">
      <div class="min-w-[26px] min-h-[26px] w-[26px] h-[26px]">
        <img :src="image" alt="" class="w-full h-full object-contain">
      </div>
      <div>
        <h2 class="text-bases font-normal">
          {{ title }}
        </h2>
      </div>
    </div>
    <div class="mt-2">
      <h1 class="text-2xl font-extrabold">
        <div v-if="value === 'loading'">
          <Icon name="eos-icons:loading" />
        </div>
        <div v-else>
          {{ formatWithCommas(value) }}
        </div>
      </h1>
    </div>
  </div>
</template>

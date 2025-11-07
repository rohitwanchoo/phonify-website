<script setup>
import { ref } from 'vue'

defineProps({
  icon: String, // base icon name without "-outline"
  value: String,
  description: String,
})

const isHovered = ref(false)
</script>

<template>
  <div
    class="relative group flex flex-row sm:flex-col justify-between border border-[#F2F3F0] bg-[#FDFDFD] rounded-[2px]
           w-full max-w-[361px] min-h-[94px] md:w-[300px] md:h-[350px]
           px-4 py-5 md:p-8 md:pl-4
           gap-[19px] md:gap-32
           mx-auto box-border overflow-hidden cursor-pointer transition-all duration-500 ease-in-out"
    @mouseover="isHovered = true" @mouseleave="isHovered = false"
  >
    <!-- Background hover effect -->
    <div
      class="absolute inset-0 bg-black origin-top-left scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out z-0"
    />

    <!-- Icon -->
    <div
      class="relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-[2px] border border-[#0000001A] bg-[#F5F5F4] transition-all duration-300 group-hover:bg-white"
    >
      <Icon
        :name="isHovered ? icon : `${icon}-outline`" size="25"
        :class="isHovered ? 'text-[#D11E28] transition-colors duration-300' : 'text-black transition-colors duration-300'"
      />
    </div>

    <!-- Text Content -->
    <div
      class="relative z-10 flex flex-col md:gap-2 justify-center sm:justify-between sm:items-start flex-1 overflow-hidden transition-colors duration-500"
    >
      <h3
        class="text-2xl sm:text-3xl md:text-5xl font-semibold transition-colors duration-500"
        :class="isHovered ? 'text-white' : 'text-[#D11E28]'"
      >
        {{ value }}
      </h3>
      <p
        class="italic font-normal text-sm sm:text-xl leading-tight break-words transition-colors duration-500"
        :class="isHovered ? 'text-white' : 'text-[#44403C]'" v-html="description"
      />
    </div>
  </div>
</template>

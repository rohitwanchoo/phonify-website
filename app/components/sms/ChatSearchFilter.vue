<script setup lang="ts">
import { ref } from 'vue'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const selected = ref('last7')

const options = [
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'Last 30 Days', value: 'last30' },
  { label: 'Custom Date', value: 'custom' },
  { label: 'All Chats', value: 'all' },
]
</script>

<template>
  <div class="w-full relative">
    <!-- Arrow Pointer (placed behind the dropdown) -->
    <div class="absolute -top-2 right-5 z-0">
      <div class="w-4 h-4 bg-white rotate-45 border border-gray-200" />
    </div>

    <!-- Filter Dropdown -->
    <div class="relative z-10 bg-white rounded-lg shadow-md w-full p-4 space-y-4 mt-3">
      <p class="text-sm font-medium text-gray-500">
        Search Filter
      </p>

      <div
        v-for="option in options"
        :key="option.value"
        class="flex items-center space-x-2"
      >
        <input
          :id="option.value"
          v-model="selected"
          type="radio"
          :value="option.value"
          class="appearance-none w-3 h-3 border border-[#1C2B36] rounded-full checked:bg-[#00A086] checked:border-[#00A086] focus:ring-1 transition-colors duration-200"
        >
        <label :for="option.value" class="text-sm text-[#1C2B36] cursor-pointer">
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

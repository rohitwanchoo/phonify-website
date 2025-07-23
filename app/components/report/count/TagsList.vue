<script setup>
const props = defineProps({
  heading: {
    type: String,
    default: 'Heading Here',
  },
  data: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="w-full min-h-20 my-5 border border-gray-100 rounded-sm">
    <div class="border-b-1 border-gray-100 w-full">
      <h3 class="text-lg m-4">
        {{ heading }}
      </h3>
    </div>

    <div v-if="data.length > 0" class="w-full grid grid-cols-3 gap-3 p-3">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="w-full min-h-15 bg-[#00A0860D] border border-[#00A0861A] rounded-sm flex items-center justify-between px-3"
      >
        <div class="flex gap-2 items-center">
          <div class="bg-primary rounded-full flex items-center p-1.5">
            <Icon :name="item.icon" class="text-lg text-white" />
          </div>
          <p class="text-sm text-gray-500">
            {{ item.text }}
          </p>
        </div>
        <p class="font-semibold">
          {{ item.number }}
        </p>
      </div>
    </div>

    <div v-else class="w-full p-4 text-center text-gray-500">
      No data available
    </div>
  </div>
</template>

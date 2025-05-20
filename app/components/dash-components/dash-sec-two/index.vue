<script setup lang="ts">
import AreaChart from '@/components/ui/chart-area/index.vue'

const data = [
  { name: 'Jan', predicted: 120000 },
  { name: 'Feb', predicted: 120000 },
  { name: 'Mar', predicted: 150000 },
  { name: 'Apr', predicted: 160000 },
  { name: 'May', predicted: 180000 },
  { name: 'Jun', predicted: 200000 },
  { name: 'Jul', predicted: 200000 },
  { name: 'Aug', predicted: 200000 },
  { name: 'Sep', predicted: 210000 },
  { name: 'Oct', predicted: 210000 },
  { name: 'Nov', predicted: 190000 },
  { name: 'Dec', predicted: 200000 },
]
</script>

<template>
  <div class="grid grid-cols-2">
    <AreaChart
      :data="data"
      index="name"
      :categories="['predicted']"
    />
  </div>
</template>

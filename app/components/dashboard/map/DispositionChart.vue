<script setup lang="ts">
const { data: posts } = useNuxtData('dispositions-wise-call')

const data = computed(() => {
  return posts.value?.map((item: any) => {
    if (item.title) {
      return item.rowCount
    }
  }).filter(Boolean)
})

const label = computed(() => {
  // Fixed colors array
  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4', '#ef4444', '#ec4899', '#14b8a6', '#8b5cf6', '#f97316']

  return posts.value?.map((item: any, index: number) => {
    if (item.title) {
      return {
        name: item.title,
        // Use color from fixed array, cycle through if more items than colors
        color: colors[index % colors.length],
      }
    }
  }).filter(Boolean)
})
</script>

<template>
  <DonutChart
    :data="data"
    :height="300"
    :radius="0"
    type="semi"
    :labels="label"
  >
    <div class="absolute text-center">
      <div v-if="!data.length" class="text-(--ui-text-muted)">
        No data
      </div>
    </div>
  </DonutChart>
</template>

<style>
.css-czc1aa-bullet-legend-component{
    padding-left: 20px;
    padding-right: 20px;
}
</style>

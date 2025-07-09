<script setup lang="ts">
import moment from 'moment'

const date = ref('2025-07-10')
const selectedDate = ref(String(new Date()))
const activeView = ref<'month' | 'week' | 'day'>('month')

const monthActive = computed(() => activeView.value === 'month')

watch(selectedDate, (newVal) => {
  const formattedDate = moment(newVal).format('yyyy-MM-DD')
  date.value = formattedDate
})
</script>

<template>
  <!-- {{ monthActive }} -->
  <!-- {{ date }} -->
  <div class="flex gap-x-6">
    <CalendarEvent v-model:selected-date="selectedDate" v-model:active-view="activeView" class="w-full" />
    <div :class="!monthActive ? 'max-h-[calc(100vh-458px)]' : 'max-h-[calc(100vh-150px)]'" class=" space-y-6">
      <CalendarDaySelector v-show="!monthActive" />
      <CalendarEventList v-model:date-value="date" />
    </div>
  </div>
</template>

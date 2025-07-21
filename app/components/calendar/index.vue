<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import moment from 'moment'

const date = ref()
const selectedDate = ref(String(new Date()))
const activeView = ref<'month' | 'week' | 'day'>('month')

const monthActive = computed(() => activeView.value === 'month')

function onDateChange(val: Date) {
  const formattedDate = moment(val).format('YYYY-MM-DD')
  date.value = parseDate(formattedDate)
}

function test(val: any) {
  if (val) {
    const date = new Date(val)
    selectedDate.value = date
    activeView.value = 'day'
  }
}

// watch(selectedDate, (newVal) => {
//   const formattedDate = moment(newVal).format('yyyy-MM-DD')
//   date.value = formattedDate
// })
</script>

<template>
  <div class="flex gap-x-6">
    <CalendarEvent v-model:selected-date="selectedDate" v-model:active-view="activeView" class="w-full" @on-date-change="onDateChange" />
    <div v-auto-animate :class="!monthActive ? 'max-h-[calc(100vh-458px)]' : 'max-h-[calc(100vh-150px)]'" class=" space-y-6">
      <CalendarDaySelector v-model:date-value="date" @update:date-value="test" />
      <CalendarEventList />
    </div>
  </div>
</template>

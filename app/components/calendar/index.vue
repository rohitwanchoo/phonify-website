<script setup lang="ts">
import moment from 'moment'

const date = ref()
const selectedDate = ref(String(new Date()))
const activeView = ref<'month' | 'week' | 'day'>()

const monthActive = computed(() => activeView.value === 'month')

watch(selectedDate, (newVal) => {
  // const formattedDate = moment(newVal).format('yyyy-mm-DD')
  // date.value = newVal
})
</script>

<template>
  {{ date }}
  <div class="flex gap-x-6">
    <CalendarEvent v-model:selected-date="selectedDate" v-model:active-view="activeView" class="w-full" />
    <div :class="!monthActive ? 'max-h-[calc(100vh-458px)]' : 'max-h-[calc(100vh-150px)]'" class=" space-y-6">
      <CalendarDaySelector v-if="!monthActive" v-model="date" />
      <CalendarEventList />
    </div>
  </div>
</template>

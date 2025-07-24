<script setup lang="ts">
const callSchedules = ref([
  {
    data: [
      { id: 1, day: 'Monday', from: '08:00:00', to: '17:00:00' },
      { id: 2, day: 'Tuesday', from: '08:00:00', to: '17:00:00' },
      { id: 3, day: 'Wednesday', from: '08:00:00', to: '17:00:00' },
      { id: 4, day: 'Thursday', from: '08:00:00', to: '17:00:00' },
      { id: 5, day: 'Friday', from: '08:00:00', to: '16:00:00' },
      { id: 6, day: 'Saturday', from: '09:00:00', to: '13:00:00' },
      { id: 7, day: 'Sunday', from: '', to: '' },
    ]
  },
  {
    data: [
      { id: 1, day: 'Monday', from: '09:00:00', to: '18:00:00' },
      { id: 2, day: 'Tuesday', from: '09:00:00', to: '18:00:00' },
      { id: 3, day: 'Wednesday', from: '09:00:00', to: '18:00:00' },
      { id: 4, day: 'Thursday', from: '09:00:00', to: '18:00:00' },
      { id: 5, day: 'Friday', from: '09:00:00', to: '17:00:00' },
      { id: 6, day: 'Saturday', from: '', to: '' },
      { id: 7, day: 'Sunday', from: '', to: '' },
    ]
  },
  {
    data: [
      { id: 1, day: 'Monday', from: '07:30:00', to: '16:30:00' },
      { id: 2, day: 'Tuesday', from: '07:30:00', to: '16:30:00' },
      { id: 3, day: 'Wednesday', from: '07:30:00', to: '16:30:00' },
      { id: 4, day: 'Thursday', from: '07:30:00', to: '16:30:00' },
      { id: 5, day: 'Friday', from: '07:30:00', to: '15:30:00' },
      { id: 6, day: 'Saturday', from: '08:00:00', to: '12:00:00' },
      { id: 7, day: 'Sunday', from: '10:00:00', to: '14:00:00' },
    ]
  },
  {
    data: [
      { id: 1, day: 'Monday', from: '10:00:00', to: '19:00:00' },
      { id: 2, day: 'Tuesday', from: '10:00:00', to: '19:00:00' },
      { id: 3, day: 'Wednesday', from: '10:00:00', to: '19:00:00' },
      { id: 4, day: 'Thursday', from: '10:00:00', to: '19:00:00' },
      { id: 5, day: 'Friday', from: '10:00:00', to: '18:00:00' },
      { id: 6, day: 'Saturday', from: '11:00:00', to: '15:00:00' },
      { id: 7, day: 'Sunday', from: '', to: '' },
    ]
  },
  {
    data: [
      { id: 1, day: 'Monday', from: '06:00:00', to: '15:00:00' },
      { id: 2, day: 'Tuesday', from: '06:00:00', to: '15:00:00' },
      { id: 3, day: 'Wednesday', from: '06:00:00', to: '15:00:00' },
      { id: 4, day: 'Thursday', from: '06:00:00', to: '15:00:00' },
      { id: 5, day: 'Friday', from: '06:00:00', to: '14:00:00' },
      { id: 6, day: 'Saturday', from: '07:00:00', to: '11:00:00' },
      { id: 7, day: 'Sunday', from: '08:00:00', to: '12:00:00' },
    ]
  },
  {
    data: [
      { id: 1, day: 'Monday', from: '12:00:00', to: '21:00:00' },
      { id: 2, day: 'Tuesday', from: '12:00:00', to: '21:00:00' },
      { id: 3, day: 'Wednesday', from: '12:00:00', to: '21:00:00' },
      { id: 4, day: 'Thursday', from: '12:00:00', to: '21:00:00' },
      { id: 5, day: 'Friday', from: '12:00:00', to: '20:00:00' },
      { id: 6, day: 'Saturday', from: '13:00:00', to: '17:00:00' },
      { id: 7, day: 'Sunday', from: '', to: '' },
    ]
  },
])

const dialogData = ref({
  open: false,
  title: '',
  data: []
})

const handleEditClick = (schedule: any, title: string) => {
  dialogData.value = {
    open: true,
    title: title,
    data: JSON.parse(JSON.stringify(schedule.data))
  }
}

const handleDialogSubmit = (data: any) => {
  console.log('Updated data:', data)
  // Find and update the corresponding schedule in callSchedules
  const index = callSchedules.value.findIndex(s => s.data === data.data)
  if (index !== -1) {
    callSchedules.value[index].data = data.data
  }
  dialogData.value.open = false
}
</script>

<template>
  <div class="w-full mt-5 flex flex-col gap-4">
    <InboundSettingsCallTimesCard
      v-for="(schedule, index) in callSchedules"
      :key="index"
      :schedule-data="schedule.data"
      :title="`Call Timing ${index + 1}`"
      @edit="handleEditClick(schedule, `Call Timing ${index + 1}`)"
    />

    <InboundSettingsCallTimesDialog
      :open="dialogData.open"
      :row-data="{
        title: dialogData.title,
        description: 'Current call timing schedule',
        data: dialogData.data
      }"
      @update:open="dialogData.open = $event"
      @submit="handleDialogSubmit"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['edit'])



const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const callSchedules = computed(() => {
  const grouped: Record<
    number,
    { id: number, name: string, description: string, default?: { from: string, to: string }, data: any[] }
  > = {}

  props.list.forEach((item: any) => {
    if (!grouped[item.department_id]) {
      grouped[item.department_id] = {
        id: item.department_id,
        name: item.name,
        description: item.description,
        data: [],
      }
    }

    if (item.day.toLowerCase() === 'default') {
      grouped[item.department_id]!.default = {
        from: item.from_time,
        to: item.to_time,
      }
    }
    else {
      grouped[item.department_id]!.data.push({
        id: item.id,
        day: capitalizeDay(item.day),
        from: item.from_time,
        to: item.to_time,
      })
    }
  })

  // normalize each department to have all 7 days, using default if missing
  return Object.values(grouped).map((group) => {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      data: DAYS.map((day, idx) => {
        const found = group.data.find(s => s.day === day)
        return {
          id: idx + 1,
          day,
          from: found ? found.from : group.default?.from || '',
          to: found ? found.to : group.default?.to || '',
        }
      }),
    }
  })
})

function capitalizeDay(day: string) {
  if (!day)
    return ''
  const lower = day.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

const dialogData = ref({
  open: false,
  id: null,
  title: '',
  description: '',
  data: [],
})

function handleEditClick(schedule: any) {
  dialogData.value = {
    open: true,
    id: schedule.id,
    title: schedule.name,
    description: schedule.description,
    data: JSON.parse(JSON.stringify(schedule.data)),
  }
}

function handleDialogSubmit(data: any) {
  dialogData.value.open = false
  emit('edit', data)
}
</script>

<template>
  <div class="w-full mt-5 flex flex-col gap-4">
    <InboundSettingsCallTimesCard
      v-for="(schedule, index) in callSchedules"
      :key="index"
      :schedule-data="schedule.data"
      :title="schedule.name"
      :description="schedule.description"
      @edit="handleEditClick(schedule)"
    />

    <InboundSettingsCallTimesDialog
      :open="dialogData.open"
      :row-data="{
        id: dialogData.id,
        title: dialogData.title,
        description: dialogData.description,
        data: dialogData.data,
      }"
      @update:open="dialogData.open = $event"
      @submit="handleDialogSubmit"
    />
  </div>
</template>

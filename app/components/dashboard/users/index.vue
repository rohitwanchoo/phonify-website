<script setup lang="ts">
import type { DateRange } from 'reka-ui'

import moment from 'moment'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Separator } from '@/components/ui/separator'

const emits = defineEmits<{ onDatePickerChange: DateRange }>()

interface AreaChartItem {
  label: string
  in: number
  out: number
}

const areaChartData = ref<AreaChartItem[]>([
  // { label: 'January', in: 1000, out: 500 },
  // { label: 'February', in: 100, out: 300 },
  // { label: 'March', in: 2000, out: 300 },
  // { label: 'April', in: 2500, out: 3200 },
  // { label: 'May', in: 3000, out: 3300 },
  // { label: 'June', in: 4500, out: 5400 },
  // { label: 'July', in: 5000, out: 6500 },
  // { label: 'August', in: 5500, out: 7600 },
  // { label: 'September', in: 6000, out: 6700 },
  // { label: 'October', in: 6500, out: 9800 },
  // { label: 'November', in: 7000, out: 3900 },
  // { label: 'December', in: 7500, out: 4000 },
])

const { data: users } = await useLazyAsyncData('dashboard-user-list', () =>
  useApi().post('/extension-list'), {
  transform: res => res.data,
})

const range = ref([
  {
    startTime: '2025-06-21 00:00:00',
    endTime: '2025-06-21 23:59:59',
  },
  {
    startTime: '2025-06-22 00:00:00',
    endTime: '2025-06-22 23:59:59',
  },
  {
    startTime: '2025-06-23 00:00:00',
    endTime: '2025-06-23 23:59:59',
  },
  {
    startTime: '2025-06-24 00:00:00',
    endTime: '2025-06-24 23:59:59',
  },
  {
    startTime: '2025-06-25 00:00:00',
    endTime: '2025-06-25 23:59:59',
  },
  {
    startTime: '2025-06-26 00:00:00',
    endTime: '2025-06-26 23:59:59',
  },
  {
    startTime: '2025-06-27 00:00:00',
    endTime: '2025-06-27 23:59:59',
  },
])
const { data: chartData, refresh: refreshChartData } = await useLazyAsyncData('dashboard-chart-data', () =>
  useApi().post('/cdr-count-range', { range: range.value }), {
  transform: res => res.data,
})

function getCurrentWeekRange() {
  const startOfWeek = moment().startOf('week').add(1, 'day') // Monday
  const days: { startTime: string, endTime: string }[] = []

  for (let i = 0; i < 7; i++) {
    const day = moment(startOfWeek).add(i, 'days')
    days.push({
      startTime: day.format('YYYY-MM-DD 00:00:00'),
      endTime: day.format('YYYY-MM-DD 23:59:59'),
    })
  }

  return days
}

function getMonthlyRangesUpToCurrent() {
  const currentMonth = moment().month() // 0-indexed: 0 = Jan, 5 = June
  const year = moment().year()

  const ranges: { startTime: string, endTime: string }[] = []

  for (let i = 0; i <= currentMonth; i++) {
    const start = moment({ year, month: i, day: 1 }).startOf('month')
    const end = moment({ year, month: i, day: 1 }).endOf('month')

    ranges.push({
      startTime: start.format('YYYY-MM-DD 00:00:00'),
      endTime: end.format('YYYY-MM-DD 23:59:59'),
    })
  }

  return ranges
}

function monthlyFilter() {
  range.value = getMonthlyRangesUpToCurrent()
  refreshChartData().then(() => {
    areaChartData.value = []
    chartData.value.forEach((el: { IN: number, OUT: number }, index: number) => {
      areaChartData.value.push({
        in: el.IN,
        out: el.OUT,
        label: moment().month(index).format('MMMM'), // Get month name based on index
      })
    })
  })
}

function weeklyFilter() {
  range.value = getCurrentWeekRange()
  refreshChartData().then(() => {
    areaChartData.value = []
    chartData.value.forEach((el: { IN: number, OUT: number }, index: number) => {
      areaChartData.value.push({
        in: el.IN,
        out: el.OUT,
        label: moment().startOf('week').add(1, 'day').add(index, 'days').format('dddd'),
      })
    })
  })
}

function dailyFilter() {
  range.value = [
    {
      startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
  ]
  refreshChartData().then(() => {
    areaChartData.value = []
    chartData.value.forEach((el: { IN: number, OUT: number }) => {
      areaChartData.value.push({
        in: el.IN,
        out: el.OUT,
        label: '',
      })
    })
  })
}

function onWeekFilterChange(val: any) {
  switch (val) {
    case 1: // Monthly
      monthlyFilter()
      break
    case 2: // Weekly
      weeklyFilter()
      break
    case 3: // Daily
      dailyFilter()
      break
    default:
      break
  }
}

const filters = [
  {
    id: 1,
    name: 'Monthly',
  },
  {
    id: 2,
    name: 'Weekly',
  },
  {
    id: 3,
    name: 'Daily',
  },
]
const selectedUser = ref(0)
const selectedFilter = ref(2)

const data = [
  {
    id: 1,
    title: 'Outbound Manual',
    calls: '23,849',
    avgDuration: '00:12:32',
  },
  {
    id: 2,
    title: 'Outbound ',
    calls: '23,849',
    avgDuration: '00:12:32',
  },
  {
    id: 3,
    title: 'Inbound Manual Calls',
    calls: '23,849',
    avgDuration: '00:12:32',
  },
  {
    id: 4,
    title: 'Inbound Dialer Calls',
    calls: '23,849',
    avgDuration: '00:12:32',
  },
]

const dateValue = ref<DateRange>()
function onDatePickerUpdate(val: DateRange) {
  emits('onDatePickerChange', val)
}

function clearDate() {
  debugger
  dateValue.value = undefined
}
onMounted(() => {
  weeklyFilter()
})
</script>

<template>
  <div class="border rounded-lg p-5">
    <div class="flex item-center justify-between gap-[20px]">
      <Select v-model="selectedUser">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select User" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="user in users" :key="user.id" :value="user.id">
              {{ `${user.first_name} ${user.last_name}` }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div class="flex gap-x-2">
        <Select v-model="selectedFilter" @update:model-value="onWeekFilterChange">
          <SelectTrigger class="w-[130px]">
            <SelectValue placeholder="Select Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="filter in filters" :key="filter.id" :value="filter.id">
                {{ filter.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div class="border-1 rounded-lg h-[36px] border-gray-200 hover:bg-accent">
          <BaseDateRangePicker v-model:model-value="dateValue" @update:model-value="onDatePickerUpdate"  />
          <XIcon v-if="dateValue?.start && dateValue?.end" @click="clearDate" />
        </div>
      </div>
    </div>
    <Separator class="my-6" />
    <div class="grid grid-cols-1 xl:grid-cols-7 w-full gap-6">
      <div class="xl:col-span-4">
        <DashboardUsersChart :area-chart-data="areaChartData" />
      </div>
      <div class="grid grid-cols-2 w-full xl:col-span-3 gap-4">
        <div v-for="item in data" :key="item.id" class="bg-white rounded-lg border p-3 w-full max-h-[103px] col-span-2 md:col-span-1">
          <h2 class=" font-medium text-black mb-3">
            {{ item.title }}
          </h2>
          <div class="space-y-1">
            <div class="flex justify-between items-center">
              <span class="text-[#000000B2] text-sm font-normal">Calls</span>
              <span class="text-[#1D3E51] font-medium text-sm">{{ item.calls }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#000000B2] text-sm font-normal">Avg Duration</span>
              <span class="text-[#000000B2] text-sm font-normal">{{ item.avgDuration }}</span>
            </div>
          </div>
        </div>
        <div class="border col-span-2 rounded-lg p-3 flex item-center justify-between text-sm font-medium">
          <div>
            Total Agents Logged In
          </div>
          <div>
            43
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DateRange } from 'reka-ui'
import { MoreHorizontal, XIcon } from 'lucide-vue-next'
import approveIcon from '~/assets/svg/dashboard/callback.svg'
import smsReceivedIcon from '~/assets/svg/dashboard/smsReceived.svg'
import smsSentIcon from '~/assets/svg/dashboard/smsSent.svg'
import voicemailReceivedIcon from '~/assets/svg/dashboard/voicemail.svg'
import unreadVoicemailIcon from '~/assets/svg/dashboard/unreadVoicemail.svg'



import moment from 'moment'

import { ref } from 'vue'

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

const props = withDefaults(defineProps<{
  totalAgents?: number | 'loading'
  counts?: {
    callbacks: number | 'loading'
    smsReceived: number | 'loading'
    smsSent: number | 'loading'
    voicemailReceived: number | 'loading'
    unreadVoicemail: number | 'loading'
  }
}>(), {
  totalAgents: 0,
})
// const emits = defineEmits<{ onDatePickerChange: any }>()
const emits = defineEmits(['onDatePickerUpdate', 'onUserSelect'])
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
])
const { data: chartData, refresh: refreshChartData } = await useLazyAsyncData('dashboard-chart-data', () =>
  useApi().post('/cdr-count-range', { range: range.value }), {
  transform: res => res.data,
  immediate: false,
})

function getCurrentWeekRange() {
  const startOfWeek = moment().subtract(6, 'days') // Get date from 7 days ago
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
const cardData = computed(() => [
  {
    image: approveIcon,
    title: 'Call Back',
    value: props.counts?.callbacks,
  },
  {
    image: smsReceivedIcon,
    title: 'SMS Received',
    value: props.counts?.smsReceived,
  },
  {
    image: smsSentIcon,
    title: 'SMS Sent',
    value: props.counts?.smsSent,
  },
  {
    image: voicemailReceivedIcon,
    title: 'Voicemail Received',
    value: props.counts?.voicemailReceived,
  },
  {
    image: unreadVoicemailIcon,
    title: 'Unread Voicemail',
    value: props.counts?.unreadVoicemail,
  },
])

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

const dateValue = ref<any>()
function onDatePickerChange(val: any) {
  emits('onDatePickerUpdate', val)
}

function clearDate() {
  emits('onDatePickerUpdate', { start: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), end: moment().format('YYYY-MM-DD HH:mm:ss') })
  dateValue.value = null
}
onMounted(() => {
  weeklyFilter()
})
</script>

<template>
  <div class="border rounded-lg">
    <div class="flex item-center justify-between gap-[20px] px-[20px] py-[12px]">
      <Select v-model="selectedUser" @update:model-value="(val) => emits('onUserSelect', val)">
        <SelectTrigger class="w-[180px] !h-11">
          <SelectValue placeholder="Select User" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">
              All Users
            </SelectItem>
            <SelectItem v-for="user in users" :key="user.id" :value="user.id">
              {{ `${user.first_name} ${user.last_name}` }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div class="flex gap-x-2">
        <Select v-model="selectedFilter" @update:model-value="onWeekFilterChange">
          <SelectTrigger class="w-[130px] !h-11">
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
        <div class="border-1 rounded-[8px] h-11 border-gray-200 hover:bg-accent flex">
          <BaseDateRangePicker v-model:model-value="dateValue" @update:model-value="onDatePickerChange" />
          <XIcon v-if="dateValue?.start && dateValue?.end" class="w-4 mr-2 h-full cursor-pointer" @click="clearDate" />
        </div>
      </div>
    </div>

    <Separator class="" />
    <div class="p-5 space-y-5">
      <div v-if="props.counts" class=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <div
          v-for="(card, index) in cardData"
          :key="index"
          :image="card.image"
          :title="card.title"
          :value="card.value"
        >
          <div class="p-[12px] rounded-xl bg-white border">
            <div class="flex gap-x-2">
              <div class="min-w-[26px] min-h-[26px] w-[26px] h-[26px]">
                <img :src="card.image" alt="" class="w-full h-full object-contain">
              </div>
              <div class="text-[16px] font-normal">
                {{ card.title }}
              </div>
            </div>
            <div class="mt-2">
              <h1 class="text-2xl font-extrabold">
                <div v-if="card.value === 'loading'">
                  <Icon name="eos-icons:loading" />
                </div>
                <div v-else>
                  {{ formatWithCommas(card.value ?? 0) }}
                </div>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
        <div class="col-span-3">
          <DashboardUsersChart :area-chart-data="areaChartData" />
        </div>
        <div class="grid grid-cols-2 w-full col-span-3 xl:col-span-2 gap-4">
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
            <div v-if="totalAgents === 'loading'">
              <Icon name="eos-icons:loading" />
            </div>
            <div v-else>
              {{ totalAgents }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export interface Campaign {
  siNo?: number
  name: string
  callTime: string
  usedCampaigns: number
  dialed: string
  hoppers: number
  dialingMode: string
  dateTime: {
    date: string
    time: string
  }
  calltimeStatus: boolean
  actions?: string

}

interface Meta {
  current_page: number
  per_page: number
  last_page: number
  total: number
}
const meta = ref<Meta>({
  current_page: 1,
  per_page: 10,
  last_page: 10,
  total: 50,
})
const data = ref<Campaign[]>([
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: true,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: true,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: true,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: true,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
])
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Call Times">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <div>
          <CallTimesCreate />
        </div>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <CallTimesTable :list="data" :meta="meta" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export interface Campaign {
  siNo?: number
  name: string
  callTime: string
  list: number
  dialed: string
  hoppers: number
  dialingMode: string
  dateTime: {
    date: string
    time: string
  }
  campaignStatus: boolean
  actions?: string

}

const list = ref<Campaign[]>([
  {
    name: 'Campaign 1',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: true,
  },
  {
    name: 'Campaign 2',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: true,
  },
  {
    name: 'Campaign 3',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: true,
  },
  {
    name: 'Campaign 4',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: true,
  },
  {
    name: 'Campaign 5',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: false,
  },
  {
    name: 'Campaign 5',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: false,
  },
  {
    name: 'Campaign 5',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: false,
  },
  {
    name: 'Campaign 5',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: false,
  },
  {
    name: 'Campaign 5',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: false,
  },
  {
    name: 'Campaign 5',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: false,
  },
  {
    name: 'Campaign 5',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: false,
  },
  {
    name: 'Campaign 5',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: false,
  },
  {
    name: 'Campaign 5',
    callTime: '9:00 AM to 6:00 PM',
    list: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    campaignStatus: false,
  },
])

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 10,
  total: 50,
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Campaign">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Nuxt-link to="/app/campaign/new-campaign">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Create Campaign
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <CampaignTable :list="list" :meta="meta" />
    </div>
  </div>
</template>

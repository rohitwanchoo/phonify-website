<script setup lang="ts">
import usersIcon from '~/assets/svg/dashboard/users.svg'
import phoneIcon from '~/assets/svg/dashboard/phone.svg'
import campaignsIcon from '~/assets/svg/dashboard/campaigns.svg'
import leadsIcon from '~/assets/svg/dashboard/leads.svg'
import listsIcon from '~/assets/svg/dashboard/list.svg'



interface Counts {
  users: number | string
  phoneNumbers: number | string
  campaigns: number | string
  leads: number | string
  lists: number | string
  callbacks: number | string
  smsReceived: number | string
  smsSent: number | string
  voicemailReceived: number | string
  unreadVoicemail: number | string
}

const props = defineProps<{
  counts: Counts
}>()
// import DashCard from '@/components/cards/dash-sec-one-cards/index.vue'

const cardData = computed(() => [
  {
    image: usersIcon,
    title: 'Users',
    value: props.counts.users,
  },
  {
    image: phoneIcon,
    title: 'Phone Numbers',
    value: props.counts.phoneNumbers,
  },
  {
    image: campaignsIcon,
    title: 'Campaigns',
    value: props.counts.campaigns,
  },
  {
    image: leadsIcon,
    title: 'Leads',
    value: props.counts.leads,
  },
  {
    image: listsIcon,
    title: 'Lists',
    value: props.counts.lists,
  },
])
</script>

<template>
  <div class="gap-4 bg-[#E9F5F3] p-[20px] rounded-xl overflow-x-auto">
    <div class=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
      <DashboardCard
        v-for="(card, index) in cardData"
        :key="index"
        :image="card.image"
        :title="card.title"
        :value="card.value"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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
    image: '/images/dashboard/users.png',
    title: 'Users',
    value: props.counts.users,
  },
  {
    image: '/images/dashboard/phone.png',
    title: 'Phone Numbers',
    value: props.counts.phoneNumbers,
  },
  {
    image: '/images/dashboard/campaigns.png',
    title: 'Campaigns',
    value: props.counts.campaigns,
  },
  {
    image: '/images/dashboard/leads.png',
    title: 'Leads',
    value: props.counts.leads,
  },
  {
    image: '/images/dashboard/lists.png',
    title: 'Lists',
    value: props.counts.lists,
  },
  {
    image: '/images/dashboard/callback.png',
    title: 'Call Back',
    value: props.counts.callbacks,
  },
  {
    image: '/images/dashboard/smsrecieve.png',
    title: 'SMS Received',
    value: props.counts.smsReceived,
  },
  {
    image: '/images/dashboard/smssent.png',
    title: 'SMS Sent',
    value: props.counts.smsSent,
  },
  {
    image: '/images/dashboard/voicemail.png',
    title: 'Voicemail Received',
    value: props.counts.voicemailReceived,
  },
  {
    image: '/images/dashboard/Unread.png',
    title: 'Unread Voicemail',
    value: props.counts.unreadVoicemail,
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

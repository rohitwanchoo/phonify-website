<script setup lang="ts">
// import DashCard from '@/components/cards/dash-sec-one-cards/index.vue'

const cardData = [
  {
    image: '/images/dashboard/users.png',
    title: 'Users',
    value: '567',
  },
  {
    image: '/images/dashboard/phone.png',
    title: 'Phone Numbers',
    value: '32',
  },
  {
    image: '/images/dashboard/campaigns.png',
    title: 'Campaigns',
    value: '45',
  },
  {
    image: '/images/dashboard/leads.png',
    title: 'Leads',
    value: '324',
  },
  {
    image: '/images/dashboard/lists.png',
    title: 'Lists',
    value: '31',
  },
  {
    image: '/images/dashboard/callback.png',
    title: 'Call Back',
    value: '5763',
  },
  {
    image: '/images/dashboard/smsrecieve.png',
    title: 'SMS Recieved',
    value: '23123',
  },
  {
    image: '/images/dashboard/smssent.png',
    title: 'SMS Sent  ',
    value: '412,214',
  },
  {
    image: '/images/dashboard/voicemail.png',
    title: 'Voicemail Recieved',
    value: '1,232',
  },
  {
    image: '/images/dashboard/Unread.png',
    title: 'Unread Voicemail',
    value: '322',
  },
]
</script>

<template>
  <div class="gap-4 bg-[#E9F5F3] p-[20px] rounded-xl overflow-x-auto">
    <div class=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
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

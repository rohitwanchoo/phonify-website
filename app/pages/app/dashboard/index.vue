<script setup lang="ts">
import moment from 'moment'
// Protect this page with authentication
definePageMeta({
  middleware: 'auth',
})

const { data: userCount } = await useLazyAsyncData('dashboard-user-count', () =>
  useApi().post('/user-count'), {
  transform: res => res.data,
})

const { data: phoneNumbersCounts } = await useLazyAsyncData('dashboard-phone-number', () =>
  useApi().get('/count-dids'), {
  transform: res => res.data[0],
})

const { data: campaignsCount } = await useLazyAsyncData('dashboard-campaign', () =>
  useApi().post('/campaigns-count'), {
  transform: res => res.data,
})

const { data: leadsCount } = await useLazyAsyncData('dashboard-leads', () =>
  useApi().post('/lead-count'), {
  transform: res => res.data,
})

const { data: listCount } = await useLazyAsyncData('dashboard-list-count', () =>
  useApi().get('/count-lists'), {
  transform: res => res.data[0],
})

const { data: callbackCount } = await useLazyAsyncData('dashboard-callback-count', () =>
  useApi().post('/callback'), {
  transform: res => res.data || 0,

})

const dateFilter = ref({
  startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
})

const { data: smsCount, refresh: refreshSmsCount } = await useLazyAsyncData('dashboard-sms-count', () =>
  useApi().post('/sms-count', dateFilter), {
  transform: res => res.data,
})

const { data: voicemailCount, refresh: refreshVoiceMailCount } = await useLazyAsyncData('dashboard-voicemail-count', () =>
  useApi().post('/voicemail-count', dateFilter), {
  transform: res => res.data,
})

const counts = computed(() => ({
  users: userCount.value || 0,
  phoneNumbers: phoneNumbersCounts.value || 0,
  campaigns: campaignsCount.value || 0,
  leads: leadsCount.value || 0,
  lists: listCount.value || 0,
  callbacks: callbackCount.value || 0,
  smsReceived: smsCount.value?.incoming || 0,
  smsSent: smsCount.value?.outgoing || 0,
  voicemailReceived: voicemailCount.value?.read || 0,
  unreadVoicemail: voicemailCount.value?.unread || 0,
}))

function onDatePickerChange(val: { start: Date, end: Date }) {
  dateFilter.value.startTime = moment(val.start).format('YYYY-MM-DD HH:mm:ss')
  dateFilter.value.endTime = moment(val.end).format('YYYY-MM-DD HH:mm:ss')
  refreshSmsCount()
  refreshVoiceMailCount()
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 md:rounded-tl-xl bg-white">
    <dashboardCardsSection :counts />
    <dashboardUsers :on-date-picker-change="onDatePickerChange" />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <dashboardMap />
      <dashboardCalendar />
    </div>
    <dashboardTable />
  </div>
</template>

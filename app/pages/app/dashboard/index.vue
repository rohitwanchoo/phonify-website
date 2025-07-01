<script setup lang="ts">
import moment from 'moment'
// Protect this page with authentication
definePageMeta({
  middleware: 'auth',
})

const { data: userCount, status: userCountStatus } = await useLazyAsyncData('dashboard-user-count', () =>
  useApi().post('/user-count'), {
  transform: res => res.data,
})

const { data: phoneNumbersCounts, status: phoneNumbersCountsStatus } = await useLazyAsyncData('dashboard-phone-number', () =>
  useApi().get('/count-dids'), {
  transform: res => res.data[0],
})

const { data: campaignsCount, status: campaignsCountStatus } = await useLazyAsyncData('dashboard-campaign', () =>
  useApi().post('/campaigns-count'), {
  transform: res => res.data,
})

const { data: leadsCount, status: leadsCountStatus } = await useLazyAsyncData('dashboard-leads', () =>
  useApi().post('/lead-count'), {
  transform: res => res.data,
})

const { data: listCount, status: listCountStatus } = await useLazyAsyncData('dashboard-list-count', () =>
  useApi().get('/count-lists'), {
  transform: res => res.data[0],
})

const { data: callbackCount, status: callbackCountStatus } = await useLazyAsyncData('dashboard-callback-count', () =>
  useApi().post('/callback'), {
  transform: res => res.data || 0,

})

const dateFilter = ref<{ startTime: string, endTime: string, userId?: number[] }>({
  startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
})

const { data: smsCount, refresh: refreshSmsCount, status: smsCountStatus } = await useLazyAsyncData('dashboard-sms-count', () =>
  useApi().post('/sms-count', dateFilter.value), {
  transform: res => res.data,
})

const { data: voicemailCount, refresh: refreshVoiceMailCount, status: voicemailCountStatus } = await useLazyAsyncData('dashboard-voicemail-count', () =>
  useApi().post('/voicemail-count', dateFilter.value), {
  transform: res => res.data,
})

// Inbound/Outbound Call Summary
// TODO: integrate after api error fix
const { data: callCount, refresh: refreshCallCount, status: callCountStaus } = await useLazyAsyncData('inbound-outbound-call-summery', () =>
  useApi().post('/cdr-call-count', { ...dateFilter.value }), {
  transform: res => res.data,
})

// state wise call report
const { data: stateWiseCalls, refresh: refreshStateWiseCalls, status: stateWiseCallsStatus } = await useLazyAsyncData('state-wise-call-report', () =>
  useApi().post('/state-wise-call', dateFilter.value), {
  transform: res => res.data,
  immediate: false,
})

// agent wise call summery
const { data: agentWiseCallCount, refresh: refreshAgentWiseCall, status: agentWiseCallStatus } = await useLazyAsyncData('agent-wise-call-summery', () =>
  useApi().post('/cdr-call-agent-count', dateFilter.value), {
  transform: res => res.data.totalAgent,
})

const totalAgentCount = computed(() => {
  return agentWiseCallStatus.value === 'pending' ? 'loading' : agentWiseCallCount.value
})

function setStateWiseCalls() {
  refreshStateWiseCalls()
}

const counts = computed(() => ({
  users: userCountStatus.value === 'pending' ? 'loading' : userCount.value || 0,
  phoneNumbers: phoneNumbersCountsStatus.value === 'pending' ? 'loading' : phoneNumbersCounts.value || 0,
  campaigns: campaignsCountStatus.value === 'pending' ? 'loading' : campaignsCount.value || 0,
  leads: leadsCountStatus.value === 'pending' ? 'loading' : leadsCount.value || 0,
  lists: listCountStatus.value === 'pending' ? 'loading' : listCount.value || 0,
  callbacks: callbackCountStatus.value === 'pending' ? 'loading' : callbackCount.value || 0,
  smsReceived: smsCountStatus.value === 'pending' ? 'loading' : smsCount.value?.incoming || 0,
  smsSent: smsCountStatus.value === 'pending' ? 'loading' : smsCount.value?.outgoing || 0,
  voicemailReceived: voicemailCountStatus.value === 'pending' ? 'loading' : voicemailCount.value?.read || 0,
  unreadVoicemail: voicemailCountStatus.value === 'pending' ? 'loading' : voicemailCount.value?.unread || 0,
}))

function onDatePickerChange(val: { start: Date, end: Date }) {
  dateFilter.value.startTime = moment(val.start).format('YYYY-MM-DD HH:mm:ss')
  dateFilter.value.endTime = moment(val.end).format('YYYY-MM-DD HH:mm:ss')
  if (dateFilter.value.startTime && dateFilter.value.endTime) {
    refreshSmsCount()
    refreshVoiceMailCount()
    refreshCallCount()
    setStateWiseCalls()
    refreshAgentWiseCall()
  }
}

function onUserSelect(val: any) {
  dateFilter.value = { ...dateFilter.value, userId: [val] }
  if (val === 'all')
    delete dateFilter?.value?.userId

  refreshSmsCount()
  refreshVoiceMailCount()
  refreshCallCount()
  setStateWiseCalls()
  refreshAgentWiseCall()
}

onMounted(() => {
  setStateWiseCalls()
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 md:rounded-tl-xl bg-white">
    <dashboardCardsSection :counts />
    <dashboardUsers :total-agents="totalAgentCount" @on-date-picker-update="onDatePickerChange" @on-user-select="onUserSelect" />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <dashboardMap :api-data="stateWiseCalls" />
      <dashboardCalendar />
    </div>
    <dashboardTable :payload="dateFilter" />
  </div>
</template>

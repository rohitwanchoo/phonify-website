<script setup lang="ts">
import moment from 'moment'
// Protect this page with authentication
definePageMeta({
  middleware: 'auth',
})

const dateFilter = ref<{ startTime: string, endTime: string, userId?: number[] }>({
  startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
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

// scheduled Meetings
// TODO: not getting data here
const { data: scheduledMeetings, refresh: refreshscheduledMeetings, status: scheduledMeetingStatus } = await useLazyAsyncData('get-scheduled-meeting', () =>
  useApi().post('/callback', dateFilter.value), {
  transform: res => res.data,
})

const totalAgentCount = computed(() => {
  return agentWiseCallStatus.value === 'pending' ? 'loading' : agentWiseCallCount.value
})

function setStateWiseCalls() {
  refreshStateWiseCalls()
}

const { data: dashboardData, status: dashboardDataStatus, refresh: refreshDashboardData } = await useLazyAsyncData('dashboard-data', () =>
  useApi().post('/dashboard', dateFilter.value), {
  transform: res => res.data,
})

const counts = computed(() => ({
  users: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value.totalUsers || 0,
  phoneNumbers: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value.totalDids || 0,
  campaigns: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value.totalCampaigns || 0,
  leads: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value.totalLeads || 0,
  lists: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value.totalList || 0,
  callbacks: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value.totalCallbacks || 0,
  smsReceived: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value?.incomingSms || 0,
  smsSent: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value?.outgoingSms || 0,
  voicemailReceived: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value?.receivedVoicemail || 0,
  unreadVoicemail: dashboardDataStatus.value === 'pending' ? 'loading' : dashboardData.value?.unreadVoicemail || 0,
}))

const { data: callCount, refresh: refreshCallCount, status: callCountStaus } = await useLazyAsyncData('inbound-outbound-call-summery', () =>
  useApi().post('/cdr-call-count', { ...dateFilter.value, route: 'OUT', type: 'dialer',
  }), {
  transform: res => res.data,
})

const { data: dispositionsData, refresh: refreshDispositions, status: dispositionsStatus } = await useLazyAsyncData('dispositions-wise-call', () =>
  useApi().post('/disposition-wise-call', { ...dateFilter.value }), {
  transform: res => res.data,
})

function onDatePickerChange(val: { start: Date, end: Date }) {
  dateFilter.value.startTime = moment(val.start).format('YYYY-MM-DD HH:mm:ss')
  dateFilter.value.endTime = moment(val.end).format('YYYY-MM-DD HH:mm:ss')
  if (dateFilter.value.startTime && dateFilter.value.endTime) {
    refreshDashboardData()
    refreshCallCount()
    setStateWiseCalls()
    refreshAgentWiseCall()
    refreshDispositions()
  }
}

function onUserSelect(val: any) {
  dateFilter.value = { ...dateFilter.value, userId: [val] }
  if (val === 'all')
    delete dateFilter?.value?.userId

  // refreshDashboardData()
  refreshCallCount()
  setStateWiseCalls()
  refreshAgentWiseCall()
  refreshDispositions()
}

const selectedCampaignId = ref<number | null>(null)

function onCampaignChange(campaignId: number | null) {
  selectedCampaignId.value = campaignId
  // Refresh data with campaign filter if needed
  // This can be extended to filter all dashboard data by campaign
}

onMounted(() => {
  setStateWiseCalls()
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 md:rounded-tl-xl bg-white">
    <!-- Dashboard Header with Campaign Filter & Export -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <dashboardCampaignSwitcher @campaign-change="onCampaignChange" />
      <dashboardExportPanel />
    </div>

    <!-- Anomaly Alerts Banner -->
    <dashboardAnomalyAlerts />

    <!-- Top Cards Section -->
    <dashboardCardsSection :counts />

    <!-- KPI Tracking & System Health Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <dashboardKpiTracking />
      </div>
      <dashboardSystemHealth />
    </div>

    <!-- Users/Analytics Section -->
    <dashboardUsers :counts :total-agents="totalAgentCount" @on-date-picker-update="onDatePickerChange" @on-user-select="onUserSelect" />

    <!-- Period Comparison & AI Metrics Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <dashboardPeriodComparison />
      <dashboardAiMetrics />
    </div>

    <!-- Lead Funnel & Wallet Metrics Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <dashboardLeadFunnel />
      <dashboardWalletMetrics />
    </div>

    <!-- Map & Agent Leaderboard Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <dashboardMap :api-data="stateWiseCalls" />
      <dashboardAgentLeaderboard />
    </div>

    <!-- Peak Hours & Disposition Trends Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <dashboardPeakHours />
      <dashboardDispositionTrends />
    </div>

    <!-- Callbacks & Activity Feed Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <dashboardCallbackSchedule />
      <dashboardActivityFeed />
    </div>

    <!-- Calendar Section -->
    <dashboardCalendar />

    <!-- Tables Section -->
    <dashboardTable :payload="dateFilter" />
  </div>
</template>

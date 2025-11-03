<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import {
  DateFormatter,
  getLocalTimeZone,
  today,
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const { user } = useAuth()

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

// Set default dates: end date is today, start date is 7 days before
const currentDate = today(getLocalTimeZone())
const startDate = ref<DateValue>(currentDate.subtract({ days: 7 }))
const endDate = ref<DateValue>(currentDate)

// Helper function to format DateValue to required API format
function formatDateForAPI(dateValue: DateValue | undefined): string {
  if (!dateValue) {
    // Return default date or current date if no date is selected
    return new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  // Convert DateValue to JavaScript Date
  const jsDate = dateValue.toDate(getLocalTimeZone())

  // Format to 'YYYY-MM-DD HH:mm:ss' format
  const year = jsDate.getFullYear()
  const month = String(jsDate.getMonth() + 1).padStart(2, '0')
  const day = String(jsDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day} 00:00:00`
}

const { data: agentWiseDialerCallStatistics, status: agentWiseDialerCallStatisticsStatus, refresh: agentWiseDialerCallStatisticsRefresh } = await useLazyAsyncData('dialer-all-count-crm', () =>
  useApi().post('/dialer-all-count-crm', {
    start_date: formatDateForAPI(startDate.value as DateValue),
    end_date: formatDateForAPI(endDate.value as DateValue),
  }), {
  transform: res => res,
  immediate: true,
})

const { data: callSummaryData, status: callSummaryStatus, refresh: callSummaryRefresh } = await useLazyAsyncData('call-summary', () =>
  useApi().post('/cdr-dashboard-summary', {
    startTime: formatDateForAPI(startDate.value as DateValue),
    endTime: formatDateForAPI(endDate.value as DateValue),
    userId: [user.value?.id],
  }), {
  transform: res => res,
  immediate: true,
})

const { data: smsCountData, status: smsCountStatus, refresh: smsCountRefresh } = await useLazyAsyncData('sms-count', () =>
  useApi().post('/sms-count', {
    userId: [user.value?.id],
    startTime: formatDateForAPI(startDate.value as DateValue),
    endTime: formatDateForAPI(endDate.value as DateValue),
  }), {
  transform: res => res,
  immediate: true,
})

const { data: stateWiseCallData, status: stateWiseCallStatus, refresh: rfreshStateWiseCall } = await useLazyAsyncData('state-wise-call', () =>
  useApi().post('/state-wise-call', {
    startTime: formatDateForAPI(startDate.value as DateValue),
    endTime: formatDateForAPI(endDate.value as DateValue),
  }), {
  transform: res => res,
  immediate: true,
})

function filterData() {
  // Validate that both dates are selected
  agentWiseDialerCallStatisticsRefresh()
  callSummaryRefresh()
  smsCountRefresh()
  rfreshStateWiseCall()
}

// Make callsData reactive to API response changes, only compute after API call completes
const callsData = computed(() => {
  // Return default/loading state while API is pending
  if (callSummaryStatus.value === 'pending') {
    return [
      {
        text: 'Total Number Of Outbound Calls Made Manually',
        icon: 'material-symbols:touch-app',
        number: 0,
      },
      {
        text: 'Total Number Of Outbound Calls via Dialer',
        icon: 'material-symbols:dialpad',
        number: 0,
      },
      {
        text: 'Total Number Of Outbound Calls via C2C',
        icon: 'material-symbols:group',
        number: 0,
      },
      {
        text: 'Total Number Of Outbound Calls',
        icon: 'material-symbols:phone-forwarded',
        number: 0,
      },
      {
        text: 'Inbound Calls',
        icon: 'material-symbols:phone-callback',
        number: 0,
      },
    ]
  }

  // Return actual data after API call completes
  return [
    {
      text: 'Total Number Of Outbound Calls Made Manually',
      icon: 'material-symbols:touch-app',
      number: callSummaryData.value?.data?.outBoundManual?.calls,
    },
    {
      text: 'Total Number Of Outbound Calls via Dialer',
      icon: 'material-symbols:dialpad',
      number: callSummaryData.value?.data?.outBoundDialer?.calls,
    },
    {
      text: 'Total Number Of Outbound Calls via C2C',
      icon: 'material-symbols:group',
      number: callSummaryData.value?.data?.outBoundDialerC2C?.calls,
    },
    {
      text: 'Total Number Of Outbound Calls',
      icon: 'material-symbols:phone-forwarded',
      number: (callSummaryData.value?.data?.outBoundManual?.calls)
        + (callSummaryData.value?.data?.outBoundDialer?.calls)
        + (callSummaryData.value?.data?.outBoundDialerC2C?.calls)
        + (callSummaryData.value?.data?.outBoundPredictive?.calls),
    },
    {
      text: 'Inbound Calls',
      icon: 'material-symbols:phone-callback',
      number: (callSummaryData.value?.data?.inBoundManual?.calls)
        + (callSummaryData.value?.data?.inBoundDialer?.calls),
    },
  ]
})

// todo need to integrate fax count
const reportData = computed(() => {
  if (smsCountStatus.value === 'pending') {
    return [
      {
        text: 'Total Number Of SMS Received',
        icon: 'mdi:message-arrow-left',
        number: 0,
      },
      {
        text: 'Total Number Of SMS Sent',
        icon: 'mdi:message-arrow-right',
        number: 0,
      },
      {
        text: 'FAX Received',
        icon: 'material-symbols:fax',
        number: 0,
      },
      {
        text: 'FAX Sent',
        icon: 'material-symbols:fax',
        number: 0,
      },
    ]
  }
  return [
    {
      text: 'Total Number Of SMS Received',
      icon: 'mdi:message-arrow-left',
      number: smsCountData.value?.data?.incoming,
    },
    {
      text: 'Total Number Of SMS Sent',
      icon: 'mdi:message-arrow-right',
      number: smsCountData.value?.data?.outgoing,
    },
    {
      text: 'FAX Received',
      icon: 'material-symbols:fax',
      number: 0,
    },
    {
      text: 'FAX Sent',
      icon: 'material-symbols:fax',
      number: 0,
    },
  ]
})
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Count Reports">
      <template #actions>
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              :class="cn(
                'justify-between text-left font-normal min-w-[150px] h-11',
                !startDate && 'text-muted-foreground',
              )"
            >
              {{ startDate ? df.format(startDate.toDate(getLocalTimeZone())) : "From:" }}
              <CalendarIcon class="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar v-model="startDate as DateValue" initial-focus />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              :class="cn(
                'justify-between text-left font-normal min-w-[150px] h-11',
                !endDate && 'text-muted-foreground',
              )"
            >
              {{ endDate ? df.format(endDate.toDate(getLocalTimeZone())) : "To:" }}
              <CalendarIcon class=" h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto  p-0">
            <Calendar v-model="endDate as DateValue" initial-focus />
          </PopoverContent>
        </Popover>
        <!-- Trigger Button -->
        <Button class="h-11" :disabled="agentWiseDialerCallStatisticsStatus === 'pending' || callSummaryStatus === 'pending' || stateWiseCallStatus === 'pending'" :loading="agentWiseDialerCallStatisticsStatus === 'pending' || callSummaryStatus === 'pending' || smsCountStatus === 'pending' || stateWiseCallStatus === 'pending'" @click="filterData">
          <Icon name="material-symbols:search" size="20" class="text-white" />
          Search
        </Button>
        <!-- TO DO: Api needed for export to pdf
        <Button class="h-11" variant="outline">
          <Icon name="lsicon:file-pdf-filled" class="text-xl text-red-600 border-primary" />
          Export PDF
        </Button> -->
      </template>
    </BaseHeader>
    <!-- tags here -->
    <div>
      <ReportCountTagsList heading="Total Inbound/OutBound Calls" :data="callsData" :loading="callSummaryStatus === 'pending'" />
      <ReportCountTagsList heading="Total SMS/FAX Report Details" :data="reportData" :loading="smsCountStatus === 'pending'" />
    </div>

    <!-- tables here -->
    <div>
      <ReportCountTableAgentWise :agent-wise-dialer-call-data="agentWiseDialerCallStatistics?.data.agent" />
      <ReportCountTableDidWise />
      <ReportCountTableAreaWise :data="stateWiseCallData?.data" :loading="stateWiseCallStatus === 'pending'" />
    </div>
  </div>
</template>

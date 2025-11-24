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

const { data: dialerAllCountData, status: dialerAllCountStatus, refresh: dialerAllCountRefresh } = await useLazyAsyncData('dialer-all-count-crm', () =>
  useApi().post('/dialer-all-count', {
    start_date: formatDateForAPI(startDate.value as DateValue),
    end_date: formatDateForAPI(endDate.value as DateValue),
    extensions: [user.value?.extension],
  }), {
  transform: res => res,
  immediate: true,
})

function filterData() {
  // Validate that both dates are selected
  dialerAllCountRefresh()
}

// Make callsData reactive to API response changes, only compute after API call completes
const callsData = computed(() => {
  // Return default/loading state while API is pending
  if (dialerAllCountStatus.value === 'pending') {
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
      number: dialerAllCountData.value?.data?.data?.totalManualCalls || 0,
    },
    {
      text: 'Total Number Of Outbound Calls via Dialer',
      icon: 'material-symbols:dialpad',
      number: dialerAllCountData.value?.data?.data?.totalDialerCalls || 0,
    },
    {
      text: 'Total Number Of Outbound Calls via C2C',
      icon: 'material-symbols:group',
      number: dialerAllCountData.value?.data?.data?.totalDialerC2CCalls || 0,
    },
    {
      text: 'Total Number Of Outbound Calls',
      icon: 'material-symbols:phone-forwarded',
      number: dialerAllCountData.value?.data?.data?.totalOutBoundCalls || 0,
    },
    {
      text: 'Inbound Calls',
      icon: 'material-symbols:phone-callback',
      number: dialerAllCountData.value?.data?.data?.totalInBoundCalls || 0,
    },
  ]
})

// todo need to integrate fax count
const reportData = computed(() => {
  if (dialerAllCountStatus.value === 'pending') {
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
      number: dialerAllCountData.value?.data?.data?.total_sms_send || 0,
    },
    {
      text: 'Total Number Of SMS Sent',
      icon: 'mdi:message-arrow-right',
      number: dialerAllCountData.value?.data?.data?.total_sms_receive || 0,
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
        <Button class="h-11" :disabled="dialerAllCountStatus === 'pending'" :loading="dialerAllCountStatus === 'pending'" @click="filterData">
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
      <ReportCountTagsList heading="Total Inbound/OutBound Calls" :data="callsData" :loading="dialerAllCountStatus === 'pending'" />
      <ReportCountTagsList heading="Total SMS/FAX Report Details" :data="reportData" :loading="dialerAllCountStatus === 'pending'" />
    </div>

    <!-- tables here -->
    <div>
      <ReportCountTableAgentWise :data="dialerAllCountData?.data?.data?.agent" :loading="dialerAllCountStatus === 'pending'" />
      <ReportCountTableDidWise :data="dialerAllCountData?.data?.data?.did" :loading="dialerAllCountStatus === 'pending'" />
      <ReportCountTableAreaWise :data="dialerAllCountData?.data?.data?.city_wise" :loading="dialerAllCountStatus === 'pending'" />
    </div>
  </div>
</template>

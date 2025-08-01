<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import {
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const startDate = ref<DateValue>()
const endDate = ref<DateValue>()

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
    start_date: formatDateForAPI(startDate.value),
    end_date: formatDateForAPI(endDate.value),
  }), {
  transform: res => res,
  immediate: false,
})

function filterData() {
  // Validate that both dates are selected
  if (!startDate.value || !endDate.value) {
    // You might want to show an error message here
    console.warn('Please select both start and end dates')
    return
  }

  // Validate that start date is before end date
  if (startDate.value.compare(endDate.value) > 0) {
    console.warn('Start date must be before end date')
    return
  }

  agentWiseDialerCallStatisticsRefresh()
}

const callsData = [
  {
    text: 'Total Number Of Outbound Calls Made Manually',
    icon: 'material-symbols:touch-app',
    number: 120,
  },
  {
    text: 'Total Number Of Outbound Calls via Dialer',
    icon: 'material-symbols:dialpad',
    number: 120,
  },
  {
    text: 'Total Number Of Outbound Calls via C2C',
    icon: 'material-symbols:group',
    number: 120,
  },
  {
    text: 'Total Number Of Outbound Calls',
    icon: 'material-symbols:phone-forwarded',
    number: 120,
  },
  {
    text: 'Inbound Calls',
    icon: 'material-symbols:phone-callback',
    number: 120,
  },
]
const reportData = [
  {
    text: 'Total Number Of SMS Received',
    icon: 'mdi:message-arrow-left',
    number: 120,
  },
  {
    text: 'Total Number Of SMS Sent',
    icon: 'mdi:message-arrow-right',
    number: 120,
  },
  {
    text: 'FAX Received',
    icon: 'material-symbols:fax',
    number: 120,
  },
  {
    text: 'FAX Sent',
    icon: 'material-symbols:fax',
    number: 120,
  },
]
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Transfer">
      <template #actions>
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              :class="cn(
                'justify-between text-left font-normal mr-2 min-w-[150px]',
                !startDate && 'text-muted-foreground',
              )"
            >
              {{ startDate ? df.format(startDate.toDate(getLocalTimeZone())) : "From:" }}
              <CalendarIcon class="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar v-model="startDate" initial-focus />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              :class="cn(
                'justify-between text-left font-normal mr-2 min-w-[150px]',
                !endDate && 'text-muted-foreground',
              )"
            >
              {{ endDate ? df.format(endDate.toDate(getLocalTimeZone())) : "To:" }}
              <CalendarIcon class=" h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto  p-0">
            <Calendar v-model="endDate" initial-focus />
          </PopoverContent>
        </Popover>
        <!-- Trigger Button -->
        <Button :disabled="agentWiseDialerCallStatisticsStatus === 'pending'" :loading="agentWiseDialerCallStatisticsStatus === 'pending'" @click="filterData">
          <Icon name="material-symbols:search" size="20" class="text-white" />
          Search
        </Button>
        <Button class="" variant="outline">
          <Icon name="lsicon:file-pdf-filled" class="text-xl text-red-600 border-primary" />
          Export PDF
        </Button>
      </template>
    </BaseHeader>

    <!-- tags here -->
    <div>
      <ReportCountTagsList heading="Total Inbound/OutBound Calls" :data="callsData" />
      <ReportCountTagsList heading="Total SMS/FAX Report Details" :data="reportData" />
    </div>

    <!-- tables here -->
    <div>
      <ReportCountTableAgeWise :agent-wise-dialer-call-data="agentWiseDialerCallStatistics?.data" />
      <ReportCountTableDidWise />
      <ReportCountTableAreaWise />
    </div>
  </div>
</template>

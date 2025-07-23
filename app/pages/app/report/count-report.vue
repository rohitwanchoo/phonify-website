<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const callsData = [
  {
    text: "Total Number Of Outbound Calls Made Manually",
    icon: "material-symbols:touch-app",
    number: 120,
  },
  {
    text: "Total Number Of Outbound Calls via Dialer",
    icon: "material-symbols:dialpad",
    number: 120,
  },
  {
    text: "Total Number Of Outbound Calls via C2C",
    icon: "material-symbols:group",
    number: 120,
  },
  {
    text: "Total Number Of Outbound Calls",
    icon: "material-symbols:phone-forwarded",
    number: 120,
  },
  {
    text: "Inbound Calls",
    icon: "material-symbols:phone-callback",
    number: 120,
  },
];
const reportData = [
  {
    text: "Total Number Of SMS Received",
    icon: "mdi:message-arrow-left",
    number: 120,
  },
  {
    text: "Total Number Of SMS Sent",
    icon: "mdi:message-arrow-right",
    number: 120,
  },
  {
    text: "FAX Received",
    icon: "material-symbols:fax",
    number: 120,
  },
  {
    text: "FAX Sent",
    icon: "material-symbols:fax",
    number: 120,
  }
];
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Transfer">
      <template #actions>
        <div class="relative">
          <Input placeholder="From:" />
          <Icon class="absolute top-[9px] right-2" name="lucide:calendar" />
        </div>
        <div class="relative">
          <Input placeholder="To:" />
          <Icon class="absolute top-[9px] right-2" name="lucide:calendar" />
        </div>

        <!-- Trigger Button -->
        <Button>
            <Icon name="material-symbols:search" class="text-xl text-white" />
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
    <ReportCountTagsList  heading="Total Inbound/OutBound Calls" 
  :data="callsData" />
    <ReportCountTagsList heading="Total SMS/FAX Report Details" :data="reportData"/>
    </div>
     <!-- tables here -->
    <div>
<ReportCountTableAgeWise/>
<ReportCountTableDidWise/>
<ReportCountTableAreaWise/>
    </div>
  </div>
</template>

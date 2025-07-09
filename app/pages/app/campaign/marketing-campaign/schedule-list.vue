<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '~/components/ui/input'

const breadcrumbs = [
  {
    label: 'Marketing Campaign',
    href: '/app/campaign/marketing-campaign',
  },
  {
    label: 'Schedule-List',
    href: '/app/campaign/marketing-campaign/schedule-list',
    active: true,
  },
]
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-110px)] overflow-auto">
    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Header row with title on left and search on right -->
      <div class="flex items-center justify-between  py-2 bg-white">
        <!-- Left: Title & breadcrumbs -->
        <BaseHeader title="" :breadcrumbs="breadcrumbs" />

        <!-- Right: Search input with icon -->
        <div class="relative w-full max-w-[240px] mt-4 md:mt-0">
          <Input v-model="searchQuery" placeholder="Search List" class="pl-3 pr-9 py-6" />
          <Icon class="absolute top-[17px] right-2 text-muted-foreground" name="lucide:search" />
        </div>
      </div>

      <CampaignMarketingCampaignTableScheduleListTable />
    </div>
  </div>
</template>

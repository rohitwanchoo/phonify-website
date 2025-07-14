<script setup lang="ts">
import moment from 'moment'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '~/components/ui/separator'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  campaign: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:open'])

function formatTime(time: string) {
  return moment(time, 'HH:mm:ss').format('h:mm A')
}
</script>

<template>
  <Sheet :open="open" @update:open="value => emit('update:open', value)">
    <SheetContent class="min-w-[483px]">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
          Campaign Details
        </SheetTitle>
      </SheetHeader>
      <div v-if="campaign" class="p-6 space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-gray-600">
            <Icon name="material-symbols:campaign-outline" size="20" />
            <span class="text-sm font-normal">Name</span>
          </div>
          <div class="text-[16px] font-medium">
            {{ campaign.title }}
          </div>
        </div>
        <Separator />

        <!-- Description Section -->
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-gray-600">
            <Icon name="lucide:file-text" />
            <span class="text-sm font-normal">Description</span>
          </div>
          <p class="text-gray-700">
            {{ campaign.description || 'No description available' }}
          </p>
        </div>
        <Separator />

        <!-- Grid Layout for Details -->
        <div class="grid grid-cols-2 gap-6">
          <!-- Dialing Mode -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="ic:outline-local-phone" />
              <span class="text-sm font-normal">Dialing Mode</span>
            </div>
            <p class="text-gray-700">
              Ringless Voicemail
            </p>
          </div>

          <!-- Status -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:zap" />
              <span class="text-sm font-normal">Status</span>
            </div>
            <p
              class="font-medium text-[16px]" :class="[
                campaign.status === 1 ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ campaign.status === 1 ? 'Active' : 'Inactive' }}
            </p>
          </div>

          <!-- Time based calling -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="material-symbols:clock-loader-60" />
              <span class="text-sm font-normal">Time Zone Rule</span>
            </div>
            <p
              class="font-medium text-[16px]" :class="[
                campaign.call_time_start ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ campaign.call_time_start ? 'Yes' : 'No' }}
            </p>
          </div>

          <!-- Call Time -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:clock-4" />
              <span class="text-sm font-normal">Call Time</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ formatTime(campaign.call_time_start) }} to {{ formatTime(campaign.call_time_end) }}
            </p>
          </div>

          <!-- Caller ID -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="clarity:user-line" />
              <span class="text-sm font-normal">Caller ID</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ campaign.caller_id || 'Not specified' }}
            </p>
          </div>

          <!-- Custom Caller ID -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:user-round-cog" />
              <span class="text-sm font-normal">Custom Caller ID</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ campaign.custom_caller_id || 'Not specified' }}
            </p>
          </div>

          <!-- Created Date -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:calendar-days" />
              <span class="text-sm font-normal">Created Date</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ moment(campaign.updated).format('MM/DD/YYYY hh:mm A') }}
            </p>
          </div>

          <!-- Total Leads -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="material-symbols:" />
              <span class="text-sm font-normal">Total Leads</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ campaign.max_lead_temp || 0 }}
            </p>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

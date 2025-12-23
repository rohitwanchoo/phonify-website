<script setup lang="ts">
import moment from 'moment'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface Campaign {
  title?: string
  description?: string
  dial_mode?: string
  status?: number
  time_based_calling?: number
  call_time_start?: string
  call_time_end?: string
  caller_id?: string
  custom_caller_id?: number
  country_code?: string
  rowList?: string
  send_crm?: string
  email?: string
  sms?: string
  hopper_count?: number
  send_report?: number
  total_leads: number
  dialed_leads: number
  created_date?: string
}

defineProps<{
  campaign?: Campaign // Accept the campaign details object as a prop
}>()
function formatTime(time: any) {
  return moment(time, 'HH:mm').format('h:mm A')
}

const callerIds = {
  area_code: 'Area Code',
  custom: 'Custom (Enabled for Custom CLI)',
  area_code_random: 'Area Code and Randomizer',
}
const open = defineModel<boolean>()
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="min-w-[483px]">
      <SheetHeader class="bg-[#162D3A] ">
        <SheetTitle class="text-white">
          Campaign Details
        </SheetTitle>
      </SheetHeader>
      <div>
        <div class="mx-auto p-6 space-y-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="material-symbols:campaign-outline" size="20" />
              <span class="text-sm font-normal">Name</span>
            </div>
            <div class="text-[16px] font-medium">
              {{ campaign?.title }}
            </div>
          </div>

          <!-- Description Section -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:file-text" />
              <span class="text-sm font-normal">Description</span>
            </div>
            <p class="text-gray-700">
              {{ campaign?.description }}
            </p>
          </div>

          <!-- Grid Layout for Details -->
          <div class="grid grid-cols-2 gap-6">
            <!-- Dialing Mode -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="ic:outline-local-phone" />
                <span class="text-sm font-normal">Dialing Mode</span>
              </div>
              <p class="text-gray-700 capitalize">
                {{ campaign?.dial_mode?.replace(/_/g, ' ') }}
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
                  campaign?.status === 1 ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ campaign?.status === 1 ? 'Active' : 'Inactive' }}
              </p>
            </div>

            <!-- Time based calling -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:clock-loader-60" />
                <span class="text-sm font-normal">Time based calling</span>
              </div>
              <p
                class="font-medium text-[16px]" :class="[
                  campaign?.time_based_calling === 1 ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ campaign?.time_based_calling === 1 ? 'Yes' : 'No' }}
              </p>
            </div>

            <!-- Call Time -->
            <div v-if="campaign?.time_based_calling === 1 && campaign?.call_time_start && campaign?.call_time_end" class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:clock-4" />
                <span class="text-sm font-normal">Call Time</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{ formatTime(campaign?.call_time_start) }} to {{ formatTime(campaign?.call_time_end) }}
              </p>
            </div>

            <!-- Caller ID -->
            <div v-if="campaign?.caller_id" class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="clarity:user-line" />
                <span class="text-sm font-normal">Caller ID</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{ callerIds[campaign?.caller_id as keyof typeof callerIds] }}
              </p>
            </div>

            <!-- Custom Caller ID -->
            <div v-if="campaign?.custom_caller_id && campaign?.caller_id === 'custom'" class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:user-round-cog" />
                <span class="text-sm font-normal">Custom Caller ID</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{ formatNumber(String(campaign?.custom_caller_id)) }}
              </p>
            </div>

            <!-- Country Code -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="lucide:flag" />
                <span class="text-sm font-normal">Country Code</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{ campaign?.country_code }}
              </p>
            </div>

            <!-- List Associated -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:list" />
                <span class="text-sm font-normal">List Associated</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{ campaign?.rowList }}
              </p>
            </div>

            <!-- Send to CRM -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:rocket" />
                <span class="text-sm font-normal">Send to CRM</span>
              </div>
              <p
                class="font-medium text-[16px]" :class="[
                  campaign?.send_crm === '1' ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ campaign?.send_crm === '1' ? 'Yes' : 'No' }}
              </p>
            </div>

            <!-- Dialed Leads/Total Leads -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="gravity-ui:nodes-down" />
                <span class="text-sm font-normal">Dialed Leads/Total Leads</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{ campaign?.dialed_leads }}/{{ campaign?.total_leads }}
              </p>
            </div>

            <!-- Send Email -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:mail" />
                <span class="text-sm font-normal">Send Email</span>
              </div>
              <p
                class="font-medium text-[16px]" :class="[
                  campaign?.email === '1' ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ campaign?.email === '1' ? 'With user email' : 'No' }}
              </p>
            </div>

            <!-- Send SMS -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:message-square-text" />

                <span class="text-sm font-normal">Send SMS</span>
              </div>
              <p
                class="font-medium text-[16px]" :class="[
                  campaign?.sms === '1' ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ campaign?.sms === '1' ? 'Yes' : 'No' }}
              </p>
            </div>

            <!-- Hopper Count -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="material-symbols-light:filter-alt-outline" />

                <span class="text-sm font-normal">Hopper Count</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{ campaign?.hopper_count }}
              </p>
            </div>

            <!-- Created Date -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:calendar-days" />
                <span class="text-sm font-normal">Created Date</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{ campaign?.created_date }}
              </p>
            </div>

            <!-- Send Report -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="icon-park-solid:notepad" />
                <span class="text-sm font-normal ">Send Report</span>
              </div>
              <p
                class="font-medium text-[16px]" :class="[
                  campaign?.send_report === 1 ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ campaign?.send_report === 1 ? 'Yes' : 'No' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

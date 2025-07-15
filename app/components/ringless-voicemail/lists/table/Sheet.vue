<script setup lang="ts">
import moment from 'moment'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '~/components/ui/separator'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  list: {
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
          List Details
        </SheetTitle>
      </SheetHeader>
      <div v-if="list" class="p-6 space-y-6">
        <!-- Grid Layout for Details -->
        <div class="grid grid-cols-2 gap-6">
          <!-- List name -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="material-symbols:list" />
              <span class="text-sm font-normal">List Name</span>
            </div>
            <p class="text-gray-700">
               {{list.title|| 'Not specified'}}
            </p>
          </div>

          <!-- Total leads -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="material-symbols:groups-outline" />
              <span class="text-sm font-normal">Total Leads</span>
            </div>
            <p class="text-gray-700">
               {{list.total_leads || 'Not specified'}}
            </p>
          </div>

          <!-- Camoaign Name -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="material-symbols:campaign-outline" />
              <span class="text-sm font-normal">Campaign Name</span>
            </div>
            <p class="text-gray-700">
               {{list.campaign_name || 'Not specified'}}
            </p>
          </div>

           <!-- Created Date -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:calendar-days" />
              <span class="text-sm font-normal">Created Date</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ moment(list.created_date).format('MM/DD/YYYY hh:mm A') }}
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
                list.status === 1 ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ list.status === 1 ? 'Active' : 'Inactive' }}
            </p>
          </div>

          <!-- Time based calling -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="material-symbols:dialpad" />
              <span class="text-sm font-normal">Is Dialling</span>
            </div>
            <p
              class="font-medium text-[16px]" :class="[
                list.scheduled ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ list.scheduled ? 'Yes' : 'No' }}
            </p>
          </div>
        </div>
        <Separator class="my-6" />
        <div class="w-full h-18 bg-[#00A0860D] rounded-lg flex items-center justify-between px-4">
            <div class="flex items-center gap-3">
                <Icon name="icons:excel" size="26" />
          <div class="flex flex-col ">
             <p class="text-sm font-normal text-primary">New Leads April</p>
            <p class="text-xs font-normal text-gray-400">Excel 2.3MB</p>
          </div>
          </div>
           <Icon name="material-symbols:download" size="22" class="text-primary" />
         

        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import moment from 'moment'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const props = defineProps<{
  schedule: {
    name?: string
    status?: string
    day?: string
    from_time?: string
    to_time?: string
  }
}>()

const open = defineModel<boolean>()
</script>

<template>
  <Sheet
    v-model:open="open"
  >
    <SheetContent class="min-w-[483px]">
      <SheetHeader class="bg-[#162D3A] ">
        <SheetTitle class="text-white">
          Call Time Details
        </SheetTitle>
      </SheetHeader>
      <div>
        <div class=" mx-auto p-6 space-y-6 ">
          <div class="grid grid-cols-2 gap-[50px] items-start">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="icons:calltime-name" class="w-10 h-10" />
                <span class="text-sm font-normal">Name</span>
              </div>
              <div class="text-[16px] font-medium">
                {{ schedule?.name }}
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-1 text-gray-600">
                <Icon name="icons:status" class="w-5 h-5" />
                <span class="text-sm font-normal">Status</span>
              </div>
              <div class="text-[16px] font-medium text-[#16A34A]">
                {{ schedule?.status || 'Inactive' }}
              </div>
            </div>
          </div>

          <div class="border-t border-[#F4F4F5] my-4" />
          <h1 class="mb-0 text-center text-xl">
            Call Times
          </h1>
          <div class="border-t border-[#F4F4F5] my-4" />

          <div v-if="schedule.day" class="flex justify-between items-center w-full mb-6">
            <div>
              <p class="text-xs">
                {{ schedule?.day }}
              </p>
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-9 border border-[#F4F4F5] p-[12px] rounded-[8px]">
                <div>
                  <h2 class="text-[#162D3A80] text-xs">
                    Start:
                  </h2>
                </div>
                <div class="text-sm">
                  {{ moment(schedule?.from_time, 'HH:mm:ss').format('h:mm A') }}
                </div>
              </div>
              <div class="flex items-center gap-9 border border-[#F4F4F5] p-[12px] rounded-[8px]">
                <div>
                  <h2 class="text-[#162D3A80] text-xs">
                    Stop:
                  </h2>
                </div>
                <div class="text-sm">
                  {{ moment(schedule?.to_time, 'HH:mm:ss').format('h:mm A') }}
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-[#F4F4F5] my-4" />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const open = defineModel<boolean>()

const schedule = [
  { day: 'Default', start: '10:00 AM', stop: '04:00 PM' },
  { day: 'Sunday', start: '09:00 AM', stop: '05:00 PM' },
  { day: 'Monday', start: '10:30 AM', stop: '04:30 PM' },
  { day: 'Tuesday', start: '11:00 AM', stop: '05:00 PM' },
  { day: 'Wednesday', start: '09:00 AM', stop: '03:00 PM' },
  { day: 'Thursday', start: '10:00 AM', stop: '04:00 PM' },
  { day: 'Friday', start: '09:30 AM', stop: '02:30 PM' },
  { day: 'Saturday', start: '11:00 AM', stop: '01:00 PM' },
]
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
                Call Time 1
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-1 text-gray-600">
                <Icon name="icons:status" class="w-5 h-5" />
                <span class="text-sm font-normal">Status</span>
              </div>
              <div class="text-[16px] font-medium text-[#16A34A]">
                Active
              </div>
            </div>
          </div>

          <div class="border-t border-[#F4F4F5] my-4" />
          <h1 class="mb-0 text-center text-xl">
            Call Times
          </h1>
          <div class="border-t border-[#F4F4F5] my-4" />

          <div v-for="entry in schedule" :key="entry.day" class="flex justify-between items-center w-full mb-6">
            <div>
              <p class="text-xs">
                {{ entry.day }}
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
                  {{ entry.start }}
                </div>
              </div>
              <div class="flex items-center gap-9 border border-[#F4F4F5] p-[12px] rounded-[8px]">
                <div>
                  <h2 class="text-[#162D3A80] text-xs">
                    Stop:
                  </h2>
                </div>
                <div class="text-sm">
                  {{ entry.stop }}
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

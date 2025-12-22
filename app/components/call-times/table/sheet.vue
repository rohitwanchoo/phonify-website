<script setup lang="ts">
import moment from 'moment'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const _props = defineProps<{
  callTime: {
    id: number
    title: string
    description: string
    week_plan: Partial<Record<string, { start: string, end: string }>>
    created_at: string // ISO timestamp
    updated_at: string // ISO timestamp
  }
}>()

const open = defineModel<boolean>()
// const departments = useNuxtData('department-list-call-times')
// const department = computed(() => {
//   return departments.data.value.find((item: any) => item.id === props.callTime?.department_id)
// })
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

      <div class="overflow-auto">
        <div class=" mx-auto p-6 space-y-6 ">
          <div class="grid grid-cols-2 gap-[50px] items-start">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="icons:calltime-name" class="w-10 h-10" />
                <span class="text-sm font-normal">Name</span>
              </div>
              <div class="text-[16px] font-medium">
                {{ callTime?.title }}
              </div>
            </div>
            <!-- <div>
              <span class="text-sm font-normal">Department</span>
              <div class="text-[16px] font-medium">
                {{ department?.name }}
              </div>
            </div> -->
          </div>
          <div>
            <span class="text-sm font-normal">Description</span>
            <div class="text-[16px] font-medium">
              {{ callTime?.description }}
            </div>
          </div>

          <div class="border-t border-[#F4F4F5] my-4" />
          <h1 class="mb-0 text-center text-xl">
            Call Times
          </h1>
          <div class="border-t border-[#F4F4F5] my-4" />

          <div
            v-for="(value, key) in Object.fromEntries(
              ['default', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
                .filter(day => callTime?.week_plan?.[day])
                .map(day => [day, callTime.week_plan[day]]),
            )" :key="key" class="flex justify-between items-center w-full mb-6"
          >
            <div>
              <p class="text-xs">
                {{ key }}
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
                  {{ moment(value?.start, 'HH:mm:ss').format('h:mm A') }}
                </div>
              </div>
              <div class="flex items-center gap-9 border border-[#F4F4F5] p-[12px] rounded-[8px]">
                <div>
                  <h2 class="text-[#162D3A80] text-xs">
                    Stop:
                  </h2>
                </div>
                <div class="text-sm">
                  {{ moment(value?.end, 'HH:mm:ss').format('h:mm A') }}
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

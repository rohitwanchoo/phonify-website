<script setup lang="ts">
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import moment from 'moment'
import { useVModel } from '@vueuse/core'
import { CalendarRoot, type CalendarRootEmits, type CalendarRootProps, useDateFormatter, useForwardPropsEmits, Separator } from 'reka-ui'
import { createDecade, createYear, toDate } from 'reka-ui/date'
import { computed, type HTMLAttributes, type Ref } from 'vue'
import { cn } from '@/lib/utils'
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarPrevButton, CalendarNextButton } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = withDefaults(defineProps<CalendarRootProps & { class?: HTMLAttributes['class'] }>(), {
  modelValue: undefined,
  placeholder() {
    return today(getLocalTimeZone())
  },
  weekdayFormat: 'short',
})
const emits = defineEmits<CalendarRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, placeholder: __, ...delegated } = props

  return delegated
})

const placeholder = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: today(getLocalTimeZone()),
}) as Ref<DateValue>

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const formatter = useDateFormatter('en')

function isSunday(weekDate: DateValue) {
  return moment(toDate(weekDate)).day() === 0 
  
}
</script>

<template>
  <CalendarRoot
    v-slot="{ date, grid, weekDays }"
    v-model:placeholder="placeholder"
    v-bind="forwarded"
    :class="cn('border rounded-lg p-3', props.class)"
  >
  <div class="flex justify-between items-center text-lg font-normal">
    <div>
      Scheduled Meeting
    </div>
    <CalendarHeader class="max-w-[150px]">
      <CalendarHeading class="text-[16px] font-normal" >
          {{ moment(toDate(date)).format('MMMM')  }}
      </CalendarHeading>
      <div class="flex items-center gap-1">
        <CalendarPrevButton class="border-none" />
        <CalendarNextButton class="border-none"/>
      </div>
    </CalendarHeader>
  </div>
    <Separator class="my-6  border-b"  />

    <div class="flex flex-col space-y-4  sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell
              v-for="day in weekDays" :key="day"
              class="text-[12px] leading-[18.43px] font-normal text-center mb-4 flex-1 uppercase"
              :class="day === 'Sun' ? 'text-red-500' : 'text-[#090F45]'"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody class="grid">
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <CalendarCell
             class="flex-1 !text-[12px] lg:w-[76px] h-[40px] lg:h-[53px] border-inherit overflow-hidden [&:has([data-selected])]:border-0.5" 
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <CalendarCellTrigger
              class="text-[14px] !md:text-[14px] leading-[18.43px] font-normal text-center text-[#090F45] w-full h-full hover:bg-blue-50  
                 data-[selected]:text-white data-[selected]:bg-[#162D3A] data-[selected]:focus:text-white data-[selected]:hover:text-white
                  data-[outside-view]:opacity-100"
                :class="isSunday(weekDate) ? 'text-red-500 data-[outside-view]:text-red-500/50' : 'text-[#090F45] data-[outside-view]:text-[#A8A8A8]'"
                :day="weekDate"
                :month="month.value"
            />
              
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
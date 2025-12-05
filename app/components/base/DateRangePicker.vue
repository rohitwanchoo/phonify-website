<script setup lang="ts">
import type { DateRange } from 'reka-ui'

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'

import { CalendarIcon } from 'lucide-vue-next'

import moment from 'moment'

import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { cn } from '@/lib/utils'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})
const value = defineModel<DateRange>({
  default: {
    start: null,
    end: null,
  },
})

function formatToCalendarDate(date: moment.Moment): CalendarDate {
  return new CalendarDate(date.year(), date.month(), date.date())
}

const items = [
  {
    id: 1,
    name: 'Today',
    onclick: () => {
      const start = moment().startOf('day')
      const end = moment().endOf('day')

      value.value = {
        start: formatToCalendarDate(start),
        end: formatToCalendarDate(end),
      }
    },
  },
  {
    id: 2,
    name: 'Yesterday',
    onclick: () => {
      const start = moment().subtract(1, 'day').startOf('day')
      const end = moment().subtract(1, 'day').endOf('day')

      value.value = {
        start: formatToCalendarDate(start),
        end: formatToCalendarDate(end),
      }
    },
  },
  {
    id: 3,
    name: 'Last 7 days',
    onclick: () => {
      const start = moment().subtract(1, 'week').startOf('day')
      const end = moment().subtract(1, 'week').endOf('week')

      value.value = {
        start: formatToCalendarDate(start),
        end: formatToCalendarDate(end),
      }
    },
  },
  {
    id: 4,
    name: 'Last 30 days',
    onclick: () => {
      const start = moment().subtract(1, 'month').startOf('day')
      const end = moment().subtract(1, 'month').endOf('month')

      value.value = {
        start: formatToCalendarDate(start),
        end: formatToCalendarDate(end),
      }
    },
  },
  {
    id: 5,
    name: 'This month',
    onclick: () => {
      const start = moment().startOf('month')
      const end = moment().endOf('month')

      value.value = {
        start: formatToCalendarDate(start),
        end: formatToCalendarDate(end),
      }
    },
  },
  {
    id: 6,
    name: 'Last month',
    onclick: () => {
      const start = moment().subtract(1, 'month').startOf('month')
      const end = moment().subtract(1, 'month').endOf('month')

      value.value = {
        start: formatToCalendarDate(start),
        end: formatToCalendarDate(end),
      }
    },
  },

]
const open = ref(false)
</script>

<template>
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child>
      <Button
        class="border-gray-200 h-11 "
        variant="ghost"
        :class="cn(
          'justify-start text-left font-normal hover:bg-transparent',
          !value && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <template v-if="value?.start">
          <template v-if="value?.end">
            {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{ df.format(value.end.toDate(getLocalTimeZone())) }}
          </template>

          <template v-else>
            {{ df.format(value?.start.toDate(getLocalTimeZone())) }}
          </template>
        </template>
        <template v-else>
          Pick a date
        </template>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[200px]">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem v-for="item in items" :key="item.id" @click="item.onclick">
          {{ item.name }}
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Custom
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent class="p-0">
            <Command>
              <CommandList class="max-h-[400px]">
                <CommandGroup>
                  <RangeCalendar v-model="value" initial-focus :number-of-months="2" @update:start-value="(startDate) => value.start = startDate" />
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

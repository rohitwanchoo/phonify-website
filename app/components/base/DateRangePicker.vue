<script setup lang="ts">
import type { DateRange } from 'reka-ui'
import type { Ref } from 'vue'

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'
import { CalendarIcon, XIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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


</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        class="border-gray-200"
        variant="ghost"
        :class="cn(
          'justify-start text-left font-normal hover:bg-transparent',
          !value && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <template v-if="value.start">
          <template v-if="value.end">
            {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{ df.format(value.end.toDate(getLocalTimeZone())) }}
          </template>

          <template v-else>
            {{ df.format(value.start.toDate(getLocalTimeZone())) }}
          </template>

        </template>
        <template v-else>
          Pick a date
        </template>
    
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar v-model="value" initial-focus :number-of-months="2" @update:start-value="(startDate) => value.start = startDate" />
    </PopoverContent>
  </Popover>
 
</template>

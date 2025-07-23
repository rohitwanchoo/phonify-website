<script setup lang="ts">
import moment from 'moment'

import { VueCal } from 'vue-cal'
import Button from '@/components/ui/button/Button.vue'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import 'vue-cal/style'

const emits = defineEmits(['edit'])

const activeView = defineModel<'month' | 'week' | 'day'>('activeView', {
  default: 'month',
})
const selectedDate = defineModel<string>('selectedDate', {
  default: String(new Date()),
})
const toggles = [
  {
    title: 'Month',
    value: 'month',
  },
  {
    title: 'Week',
    value: 'week',
  },
  {
    title: 'Day',
    value: 'day',
  },
]

const selectedDateFormatted = computed(() => {
  if (activeView.value === 'month')
    return moment(selectedDate.value).format('MMMM YYYY')
  else
    return moment(selectedDate.value).format('DD MMMM YYYY')
})

const events = [
  {
    start: new Date(new Date().setHours(10, 30, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    title: 'Marketing Lead',
    content: 'Lorem ipsum dolor sit amet consectetur. Diam velit faucibus sem justo. Eu sed vitae nunc pellentesque aliquet urna hendrerit eget. Amet lectus eleifend feugiat cum euismod eleifend sagittis ultricies amet.',
  },
  {
    start: new Date(new Date().setHours(9, 0) + (4 * 24 * 60 * 60 * 1000)), // Adding 4 days in milliseconds
    end: new Date(new Date().setHours(10, 0) + (4 * 24 * 60 * 60 * 1000)), // Adding 4 days in milliseconds
    title: 'Marketing Lead',
    content: 'Lorem ipsum dolor sit amet consectetur. Diam velit faucibus sem justo. Eu sed vitae nunc pellentesque aliquet urna hendrerit eget. Amet lectus eleifend feugiat cum euismod eleifend sagittis ultricies amet.',
  },
]
function onOnDateChange(val: any) {
  emits('onDateChange', val)
}
</script>

<template>
  <div class="border rounded-lg h-[calc(100vh-150px)]">
    <div class="p-5 border-b flex items-center justify-between">
      <div class="flex items-center justify-between w-1/2">
        <div class="text-[18px] font-medium">
          {{ selectedDateFormatted }}
        </div>
        <div class="flex items-center gap-x-6">
          <div class="flex items-center">
            <Button variant="ghost" size="icon" @click="$refs.vuecal.view.previous()">
              <Icon size="20" name="lucide:chevron-left" />
            </Button>
            <Button variant="ghost" size="icon" @click="$refs.vuecal.view.next()">
              <Icon size="20" name="lucide:chevron-right" />
            </Button>
          </div>
          <div>
            <Button size="sm" class="bg-[#00A086] hover:bg-[#00A086]/80  text-xs font-normal " @click="$refs.vuecal.view.switch('day', new Date())">
              Today
            </Button>
          </div>
        </div>
      </div>
      <div>
        <ToggleGroup v-model="activeView" required type="single" class="h-[32px] bg-gray-200 border">
          <ToggleGroupItem v-for="toggle in toggles" :key="toggle.value" class="h-[32px] rounded-lg data-[state=on]:bg-primary data-[state=on]:text-white text-xs font-normal px-[18px] py-2" :value="toggle.value" :aria-label="`Toggle ${toggle.title}`">
            {{ toggle.title }}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
    <VueCal
      ref="vuecal"
      v-model:selected-date="selectedDate"
      v-model:view="activeView"
      :time-step="60"
      class="h-full"
      :views-bar="false"
      :title-bar="false"
      :events="events"
      events-on-month-view
      @update:selected-date="onOnDateChange"
    >
      <template #weekday-heading="{ label, id, date }">
        <div class="uppercase text-sm text-primary font-medium" :class="[id, { 'text-red-500': id === 'sun' }]">
          {{ label.slice(0, 3) }} {{ date.getDate() }}
        </div>
      </template>

      <template #event="{ event }">
        <Popover>
          <PopoverTrigger as-child>
            <div class="flex flex-col text-xs gap-y-1">
              <div class="flex items-center gap-x-0.5">
                <Icon name="material-symbols:adjust-outline" />
                <div class="font-medium">
                  {{ event.title }}
                </div>
              </div>
              <div v-if="activeView === 'day'" class="">
                {{ event.content }}
              </div>
              <div class="flex items-center gap-x-0.5">
                <Icon name="material-symbols:schedule" />
                <div class="font-medium">
                  {{ moment(event.start).format("hh:mm A") }} -
                  {{ moment(event.end).format("hh:mm A") }}
                </div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent class="w-[380px] p-0 overflow-hidden rounded-2xl">
            <div class="text-[14px] font-semibold bg-secondary py-[16px] px-5">
              Marketing Lead
              <div class="text-xs font-normal">
                1-hr Meeting
              </div>
            </div>
            <div class="py-[16px] px-5 space-y-3">
              <div>
                <div class="text-sm text-[#00000099] flex items-center gap-x-0.5">
                  <Icon name="mdi:folder-text-outline" />
                  <div>
                    Title
                  </div>
                </div>
                <div class="text-[16px] font-medium">
                  Title Here
                </div>
              </div>
              <div>
                <div class="text-sm text-[#00000099] flex items-center gap-x-0.5">
                  <Icon name="lucide:file-text" />
                  <div>
                    Description
                  </div>
                </div>
                <div class="text-[16px] font-medium">
                  Lorem ipsum dolor sit amet consectetur. Sit augue posuere dolor condimentum pharetra.
                </div>
              </div>
              <div>
                <div class="text-sm text-[#00000099] flex items-center gap-x-0.5">
                  <Icon name="lucide:calendar" />
                  <div>
                    Date & Time
                  </div>
                </div>
                <div class="text-[16px] font-medium">
                  18 May 2025, 09:00 AM - 11:00 AM
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="px-5 flex pb-[16px] gap-x-3">
              <Button variant="outline" class="h-11 border-red-600 text-red-600 hover:text-red-600/80 w-1/2">
                <Icon name="material-symbols:delete" />
                Delete
              </Button>
              <Button variant="default" class="h-11 w-1/2" @click="emits('edit')">
                <Icon name="material-symbols:edit-square" />
                Edit
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </template>
    </VueCal>
  </div>
</template>

<style>
.vuecal__body-wrap {overflow: hidden;}
.vuecal__body {
  aspect-ratio: 13 / 9;
  overflow: auto;
}
.vuecal__cell {overflow: auto;}
.vuecal__event {padding: 0 2px;}
.vuecal__scrollable--month-view .vuecal__cell-date {
  font-size: 11px;
  margin: 1px;
  width: 1.7em;
}
@reference "@/assets/css/tailwind.css";

/* or, if you want to load a specific config: */
/* .vuecal {
  --vuecal-primary-color: #212d49;
} */
/* .vuecal__header {
    background: !important transparent;
} */
.vuecal{
  @apply h-[calc(100%-75px)]
}

 .vuecal__cell {
    background: white;
 }

.vuecal__cell-date{
  @apply !bg-white
}

.vuecal__cell--selected > .vuecal__cell-date {
  @apply !bg-primary rounded-full text-white
}

.vuecal__cell--selected {
  @apply bg-gray-100
}

.vuecal__weekday-date{
  @apply !bg-transparent
}

.vuecal__cell--today > .vuecal__cell-date {
    @apply !bg-red-500 rounded-full text-white
}

.vuecal__time-cell{
    @apply h-[82px]
}

.vuecal__event{
  @apply !bg-secondary border-none
}
.vuecal__event-details {
      @apply text-primary
}
</style>

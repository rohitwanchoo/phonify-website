<script setup lang="ts">
import americanExpress from '~/assets/svg/event/lead.svg'

const data = {
  'today': [
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
  ],
  'tomorrow': [
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
  ],
  '16 JUL 2025': [
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
  ],
  '25 JUL 2025 ': [
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
  ],
  '26 JUL 2025 ': [
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
  ],
  '28 JUL 2025 ': [
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
    {
      title: 'Marketing Lead',
      time: '09:00 AM - 10:30 AM',
    },
  ],
}
</script>

<template>
  <div class="border rounded-lg w-[280px] h-full overflow-x-hidden  ">
    <div class="bg-gray-100 flex items-center justify-center py-[13.5px] border-b overflow-hidden sticky top-0 gap-x-1 z-10 ">
      <Icon name="material-symbols:event-outline" />
      Event List
    </div>
    <div class="px-3 py-4 space-y-3">
      <div v-for="(item, key) in data" :key="key" class="space-y-3">
        <div class="text-xs font-medium mb-2">
          {{ key }}:
        </div>
        <div v-for="event in item" :key="event.title" class="border px-3 py-[12.5px] rounded-lg flex gap-x-3">
          <img :src="americanExpress" alt="">
          <div class="space-y-1">
            <div class="text-sm font-medium">
              Marketing Lead
            </div>
            <div class="text-xs flex items-center gap-x-1">
              <Icon name="material-symbols:schedule-outline" />
              <div>
                09:00 AM - 10:30 AM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

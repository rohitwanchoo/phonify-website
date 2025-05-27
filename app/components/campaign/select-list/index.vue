<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import ListTable from './table.vue'

const emit = defineEmits(['completed'])

const dummyData = ref([
  { listName: 'List 1', createdDate: '2024-05-10T10:00:00', totalLeads: 1200 },
  { listName: 'List 2', createdDate: '2024-04-22T14:30:00', totalLeads: 850 },
  { listName: 'List 3', createdDate: '2024-03-15T09:15:00', totalLeads: 420 },
  { listName: 'List 4', createdDate: '2024-02-28T16:45:00', totalLeads: 100 },
  { listName: 'List 5', createdDate: '2024-05-10T10:00:00', totalLeads: 1200 },
  { listName: 'List 6', createdDate: '2024-04-22T14:30:00', totalLeads: 850 },
  { listName: 'List 7', createdDate: '2024-03-15T09:15:00', totalLeads: 420 },
  { listName: 'List 8', createdDate: '2024-02-28T16:45:00', totalLeads: 100 },
])

const dialogRef = ref()

function openDialog() {
  dialogRef.value?.open()
}

function handleContinue() {
  emit('completed')
}
</script>

<template>
  <div class="px-4 py-6 h-[calc(100vh-255px)]">
    <div class="flex w-full flex-col sm:flex-row sm:justify-between items-center">
      <h2 class="text-xl text-primary">
        Lists
      </h2>
      <div class="flex items-center justify-between gap-5">
        <label for="Email" class="relative">
          <input
            id="Email"
            type="email"
            class="mt-0.5 w-[250px] rounded-md bg-white border-gray-300 px-3 h-10 shadow-sm sm:text-sm pr-10"
            placeholder="Search List"
          >
          <Icon name="lucide:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
        </label>
        <Button class="h-10 cursor-pointer" @click="openDialog">
          + Create List
        </Button>
      </div>
    </div>
    <ListTable :data="dummyData" />
  </div>

  <div class="sticky bg-white bottom-0 right-0 w-full shadow-2xl p-4">
    <Button class="w-full h-[52px] cursor-pointer" type="submit" @click="handleContinue">
      Continue
      <Icon name="lucide:arrow-right" size="20" />
    </Button>
  </div>

  <!-- Dialog component -->
  <CampaignSelectListDialog ref="dialogRef" />
</template>

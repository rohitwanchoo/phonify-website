<script setup lang="ts">
import { Button } from '~/components/ui/button'

const emit = defineEmits(['onEdit'])

const data = ref([
  { listName: 'List 1', createdDate: '2024-05-10T10:00:00', totalLeads: 1200 },
  { listName: 'List 2', createdDate: '2024-04-22T14:30:00', totalLeads: 850 },
  { listName: 'List 3', createdDate: '2024-03-15T09:15:00', totalLeads: 420 },
  { listName: 'List 4', createdDate: '2024-02-28T16:45:00', totalLeads: 100 },
  { listName: 'List 5', createdDate: '2024-05-10T10:00:00', totalLeads: 1200 },
  { listName: 'List 6', createdDate: '2024-04-22T14:30:00', totalLeads: 850 },
  { listName: 'List 7', createdDate: '2024-03-15T09:15:00', totalLeads: 420 },
  { listName: 'List 8', createdDate: '2024-02-28T16:45:00', totalLeads: 100 },
])
function onEdit() {
  emit('onEdit')
}
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class="border-b px-5 pt-5 pb-3 flex justify-between">
      <div class="text-[16px] font-medium text-primary/100">
        Send Details (temp.)
      </div>
      <div class="flex items-center gap-x-2">
        <Button variant="outline" size="sm" class="rounded" @click="onEdit()">
          <Icon name="icons:edit-box" /> Edit
        </Button>
      </div>
    </div>
    <div class="p-5">
      <CampaignSelectListTable :list="data" :enable-select="false" />
    </div>
  </div>
</template>

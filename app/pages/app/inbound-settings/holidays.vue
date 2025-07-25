<script setup lang="ts">
import { Icon, InboundSettingsHolidaysTable } from '#components'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const isDialogOpen = ref(false)

const { data: holidayList, status, refresh } = await useLazyAsyncData('did-get-all-holidays', () =>
  useApi().post('/get-all-holidays', {

  }), {
  transform: res => res.data,
})
const dummyData = ref([
  { id: 1, name: 'New Year', month: '01', day: '01' },
  { id: 2, name: 'Republic Day', month: '01', day: '26' },
  { id: 3, name: 'Holi', month: '03', day: '08' },
  { id: 4, name: 'Independence Day', month: '08', day: '15' },
  { id: 5, name: 'Christmas', month: '12', day: '25' },
])
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Holidays">
      <template #actions>
        <!-- Dialog Trigger Button -->
        <Button @click="isDialogOpen = true">
          <Icon class="!text-white" name="lucide:plus" />
          Add Holiday
        </Button>

        <!-- Dialog Component -->
        <InboundSettingsHolidaysDialog v-model:open="isDialogOpen" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <InboundSettingsHolidaysTable :list="holidayList" :loading="status === 'pending'" />
    </div>
  </div>
</template>

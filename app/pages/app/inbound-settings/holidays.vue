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
        <InboundSettingsHolidaysDialog v-model:open="isDialogOpen" @refresh="refresh" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <InboundSettingsHolidaysTable :list="holidayList" :loading="status === 'pending'" @refresh="refresh" />
    </div>
  </div>
</template>

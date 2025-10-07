<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'

const isDialogOpen = ref(false)

const { data: callTimingList, status: callTimingListStatus, refresh: refreshCallTimingList } = await useLazyAsyncData('call-timing-list', () =>
  useApi().post('/get-call-timings'), {
  transform: res => res,
})

async function handleAddCallTime(newCallTime: any) {
  try {
    const response = await useApi().post('/save-call-timings', { data: newCallTime })
    if (response?.message) {
      showToast({
        message: response?.message,
        type: 'success',
      })
      await refreshCallTimingList()
    }
    else {
      showToast({
        message: response?.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    showToast({
      message: error?.message,
      type: 'error',
    })
  }
  isDialogOpen.value = false
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Times">
      <template #actions>
        <!-- Trigger Button -->
        <Button @click="isDialogOpen = true">
          <Icon name="material-symbols:add" class="text-xl text-white" />
          Add Call Time
        </Button>

        <!-- Dialog Component -->
        <InboundSettingsCallTimesDialog
          v-model:open="isDialogOpen"
          @submit="handleAddCallTime"
        />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div v-if="callTimingListStatus === 'pending'" class="mt-5">
      <BaseSkelton v-for="i in 6" :key="i" class="h-14 w-full mb-2" rounded="rounded-sm" />
    </div>
    <div v-else>
      <InboundSettingsCallTimesList :list="callTimingList?.data" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'

const isDialogOpen = ref(false)

function handleAddCallTime(newCallTime: any) {
  console.log('New call time to be added:', newCallTime)
  isDialogOpen.value = false
}

// const { data: callTimingList, status, refresh } = await useLazyAsyncData('did-all-call-timing-list', () =>
//   useApi().post('/get-department-call-timings', {

//   }), {
//   transform: res => res,
// })
</script>

<template>
  <!-- {{ callTimingList }} -->
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
    <div>
      <InboundSettingsCallTimesList />
    </div>
  </div>
</template>

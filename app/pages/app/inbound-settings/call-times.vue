<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { ref } from 'vue'

const isDialogOpen = ref(false)


const handleAddCallTime = (newCallTime: any) => {
  console.log('New call time to be added:', newCallTime)
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
    <div>
      <InboundSettingsCallTimesList/>
    </div>
  </div>
</template>
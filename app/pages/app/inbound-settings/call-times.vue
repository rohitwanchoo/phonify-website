<script setup lang="ts">
import { Button } from '~/components/ui/button'

const isDialogOpen = ref(false)
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Times">
      <template #actions>
     

        <!-- Trigger Button -->
        <Button @click="isDialogOpen = true" >
          <Icon name="material-symbols:add" class="text-xl text-white" />
          Add Call Time
        </Button>
         <InboundSettingsCallTimesDialog v-model:open="isDialogOpen" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
     <InboundSettingsCallTimesList/>
    </div>
  </div>
</template>

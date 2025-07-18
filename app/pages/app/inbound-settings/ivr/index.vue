<script setup lang="ts">
import { InboundSettingsIvrTable } from '#components'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'

const showCreateIvr = ref(false)

const ivrItem = ref({
  id: 0,
  extension: '',
  audioUrl: '',
})

function handleSave(data: { extension: string, audioUrl: string }) {
  console.log('Saved Ringless:', data)
  // Optional: send to API or update state here
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="IVR-Interactive Voice Response">
      <template #actions>
        <!-- Trigger Button -->
        <Button @click="showCreateIvr = true">
          <Icon name="lucide:plus" class="mr-1" />
          Add IVR
        </Button>

        <!-- Dialog Component -->
        <InboundSettingsDialog
          v-model:open="showCreateIvr"
          heading="Create New Call Time"
          :item="ivrItem"
          @save="handleSave"
        />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <InboundSettingsIvrTable />
    </div>
  </div>
</template>

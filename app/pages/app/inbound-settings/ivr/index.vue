<script setup lang="ts">
import { ref } from 'vue'
import CreateRingless from '@/components/ringless-voicemail/voice-templates/CreateRinglessVoiceMail.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { InboundSettingsIvrTable } from '#components'

const showCreateRingless = ref(false)

const newRinglessItem = ref({
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
        <Button @click="showCreateRingless = true">
          <Icon name="lucide:plus" class="mr-1" />
          Add IVR
        </Button>

        <!-- Dialog Component -->
        <CreateRingless
          v-model:open="showCreateRingless"
          :item="newRinglessItem"
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

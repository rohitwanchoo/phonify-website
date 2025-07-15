<script setup lang="ts">
import { ref } from 'vue'
import CreateRingless from '@/components/ringless-voicemail/voice-templates/CreateRinglessVoiceMail.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

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
    <BaseHeader title="Ringless Voice Template">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>

        <!-- Trigger Button -->
        <Button @click="showCreateRingless = true">
          <Icon name="lucide:plus" class="mr-1" />
          Add Campaign
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
      <RinglessVoicemailVoiceTemplatesTable />
    </div>
  </div>
</template>

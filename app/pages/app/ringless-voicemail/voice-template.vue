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
        <BaseInputSearch class="w-[300px]" placeholder="Search List" />

        <!-- Trigger Button -->
        <Button class="h-11" @click="showCreateRingless = true">
          <Icon name="lucide:plus" size="20" />
          Add Voice Template
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

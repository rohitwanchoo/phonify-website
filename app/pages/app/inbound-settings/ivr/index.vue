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

const start = ref(0)
const limit = ref(10)

const { data: ivrList, status: ivrStatus, refresh: ivrRefresh } = useLazyAsyncData('get-ivr-list', () =>
  useApi().post('/ivr', {
    start: start.value,
    limit: limit.value,
  }), {
  transform: res => res?.data || [],
})

function handleSave(data: { extension: string, audioUrl: string }) {
  // console.log('Saved Ringless:', data)
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
          mode="create"
          @save="handleSave"
        />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <InboundSettingsIvrTable
        :list="ivrList || []"
        :loading="ivrStatus === 'pending'"
        @refresh="ivrRefresh"
      />
    </div>
  </div>
</template>

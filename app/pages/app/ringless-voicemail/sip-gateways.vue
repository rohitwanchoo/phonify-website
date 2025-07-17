<script setup lang="ts">
import { Icon } from '#components'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const isDialogOpen = ref(false)
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="SIP Gateways List">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>

        <!-- Dialog Trigger Button -->
        <Button @click="isDialogOpen = true">
          <Icon class="!text-white" name="lucide:plus" />
          Add SIP Gateways
        </Button>

        <!-- Dialog Component -->
        <RinglessVoicemailSipGatewaysDialog v-model:open="isDialogOpen" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <RinglessVoicemailSipGatewaysTable />
    </div>
  </div>
</template>

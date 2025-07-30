<script setup lang="ts">
import { Icon } from '#components'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const isDialogOpen = ref(false)

const { data: sipGateway, status: sipGatewayStatus, refresh: sipGatewayRefresh } = await useLazyAsyncData('sip-gateway-list', () =>
  useApi().get('/sip-gateways'), {
  immediate: true,
  transform: res => res,
})
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
        <RinglessVoicemailSipGatewaysDialog v-model:open="isDialogOpen" @refresh="sipGatewayRefresh" />
      </template>
    </BaseHeader>
    <!-- TABLE -->
    <div>
      <RinglessVoicemailSipGatewaysTable
        :list="sipGateway?.data || []"
        :loading="sipGatewayStatus === 'pending'"
        @refresh="sipGatewayRefresh"
      />
    </div>
  </div>
</template>

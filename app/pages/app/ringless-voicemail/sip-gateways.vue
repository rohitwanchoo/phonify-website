<script setup lang="ts">
import { Icon } from '#components'
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'

const isDialogOpen = ref(false)
const search = ref('')

// Pagination variables
const start = ref(0)
const limit = ref(10)

// Debounced search function

const { data: sipGateway, status: sipGatewayStatus, refresh: sipGatewayRefresh } = await useLazyAsyncData('sip-gateway-list', () =>
  useApi().get('/sip-gateways', {
    params: {
      start: start.value,
      limit: limit.value,
      search: search.value,
    },
  }), {
  immediate: true,
  transform: res => res.data,
})

const debouncedSearch = useDebounceFn(() => {
  start.value = 0 // Reset to first page on new search
  sipGatewayRefresh()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

// Pagination functions
function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return sipGatewayRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return sipGatewayRefresh()
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="SIP Gateways List">
      <template #actions>
        <BaseInputSearch
          v-model="search"
          class="w-[300px]"
          placeholder="search"
          @update:model-value="searchText"
        />

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
        :list="sipGateway?.data"
        :loading="sipGatewayStatus === 'pending'"
        :limit="limit"
        :total-rows="sipGateway?.total_rows || 0"
        :start="start"
        @refresh="sipGatewayRefresh"
        @page-navigation="changePage"
        @change-limit="changeLimit"
      />
    </div>
  </div>
</template>

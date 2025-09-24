<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const refreshInterval = ref(15)
let timer: NodeJS.Timeout | null = null

const { data: agentStatusList, status: agentStatusListStatus, refresh: refreshAgentStatusList } = await useLazyAsyncData('get-agent-status-list', () =>
  useApi().post('/extension_live', {
    start: start.value,
    limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

// Auto refresh agent status list every 15 seconds
onMounted(() => {
  refreshInterval.value = 15

  timer = setInterval(() => {
    refreshInterval.value--

    if (refreshInterval.value <= 0) {
      refreshAgentStatusList()
      refreshInterval.value = 15
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshAgentStatusList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshAgentStatusList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshAgentStatusList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Agent Status">
      <template #actions>
        <div class="flex items-center text-sm text-primary">
          <Icon name="material-symbols:autorenew" size="20" class="rotate-45" />
          refresh in {{ refreshInterval }} sec
        </div>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search Agent" @update:model-value="searchText" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <CampaignAgentStatusTable :limit="limit" :total-rows="agentStatusList?.total_rows" :start="start" :list="agentStatusList?.data || []" :loading="agentStatusListStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refreshAgentStatusList" />
    </div>
  </div>
</template>

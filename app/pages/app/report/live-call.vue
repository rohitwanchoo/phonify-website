<script setup lang="ts">
import { Button } from '~/components/ui/button'

const isDisabled = ref(false)
const countdown = ref(10)
let timer: NodeJS.Timeout | null = null
let autoRefreshTimer: NodeJS.Timeout | null = null

const start = ref(0)
const limit = ref(10)

const { data: liveCallData, status: liveCallDataStatus, refresh: liveCallDataRefresh } = await useLazyAsyncData('live-call', () =>
  useApi().post('/live-call', {
    start: start.value,
    limit: limit.value,
  }), {
  transform: res => res,
})

function handleRefresh() {
  // Disable the button
  isDisabled.value = true
  countdown.value = 15

  // Clear any existing timers
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (autoRefreshTimer) {
    clearTimeout(autoRefreshTimer)
    autoRefreshTimer = null
  }

  // Start countdown
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      isDisabled.value = false
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, 1000)

  // Actual refresh logic
  liveCallDataRefresh()

  // Set up next auto-refresh after 15 seconds
  autoRefreshTimer = setTimeout(() => {
    handleRefresh()
  }, 15000)
}

// Initialize auto-refresh on mount
onMounted(() => {
  handleRefresh()
})

// Clean up timers on unmount
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  if (autoRefreshTimer) {
    clearTimeout(autoRefreshTimer)
  }
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return liveCallDataRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return liveCallDataRefresh()
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Live Call List">
      <template #actions>
        <!-- Trigger Button -->
        <Button :disabled="isDisabled" class="h-11" @click="handleRefresh">
          <Icon name="material-symbols:autorenew" size="20" class="text-white" />
          Refresh {{ isDisabled ? `(in ${countdown})` : '' }}
        </Button>
      </template>
    </BaseHeader>
    <!-- TABLE -->
    <ReportLiveCallTable
      :limit="limit"
      :total-rows="liveCallData?.total_rows"
      :start="start"
      :list="liveCallData?.data || []"
      :loading="liveCallDataStatus === 'pending'"
      @page-navigation="changePage"
      @change-limit="changeLimit"
    />
  </div>
</template>

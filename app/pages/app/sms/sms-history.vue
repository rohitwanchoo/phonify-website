<script setup lang="ts">
import { Button } from '~/components/ui/button'

const start = ref(0)
const limit = ref(10)
const search = ref('')

// get sms history
const { data: smsHistory, refresh: refreshSmsHistory, status: smsHistoryStatus } = await useLazyAsyncData('sms-history', () =>
 useApi().get('/sms', {
  params: {
    start: start.value,
    limit: limit.value,
    search: search.value,
  }
 }),{
  transform: (res) => res.data,
 }
)
function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshSmsHistory()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshSmsHistory()
}


</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="SMS History">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
        <Button class="h-11">
          <Icon class="!text-white" name="lucide:upload" />
          Export
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <SmsHistoryTable :loading="smsHistoryStatus === 'pending'" :totalRows="smsHistory?.total || 0" :list="smsHistory?.data || []" :start="start" :limit="limit" @page-navigation="changePage" @limit-change="changeLimit"  />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '~/components/ui/input'

const searchQuery = ref('')

const start = ref(0)
const limit = ref(10)

const { data: leadList, status: statusLeadList, refresh: refreshLeadList } = await useLazyAsyncData('lead-management-list', () =>
  useApi().post('/list', { start: start.value, limit: limit.value }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshLeadList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshLeadList()
}
</script>

<template>
  <BaseHeader title="Lists">
    <template #actions>
      <div class="relative">
        <Input v-model="searchQuery" placeholder="Search List" class="pr-10" />
        <Icon class="absolute top-2 right-2" name="material-symbols:search" size="20" />
      </div>
      <LeadManagementListsCreate />
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <LeadManagementListsTable :loading="statusLeadList === 'pending'" :list="leadList?.data || []" :limit="limit" :total-rows="leadList?.total_rows" :start="start" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refreshLeadList" />
  </div>
</template>

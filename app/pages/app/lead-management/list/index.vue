<script setup lang="ts">
import { Input } from '~/components/ui/input'

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const { data: leadList, status, refresh } = await useLazyAsyncData('lead-management-list', () =>
  useApi().post('/list'), {
  transform: res => res,
})

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
}

const filteredList = computed(() => {
  if (!leadList.value?.data)
    return []
  const query = searchQuery.value.toLowerCase()
  return leadList.value.data.filter((item: any) => {
    return (
      item?.campaign?.toLowerCase().includes(query)
      || item?.list?.toLowerCase().includes(query)
      || item?.updated_at?.toLowerCase().includes(query)
    )
  })
})

// Then paginate the filtered data
const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return filteredList.value.slice(start, end)
})

// Watch search query and reset pagination
watch(searchQuery, () => {
  pageStart.value = 0
})
</script>

<template>
  <BaseHeader title="Lists">
    <template #actions>
      <div class="relative">
        <Input v-model="searchQuery" placeholder="Search List" class="pr-10" />
        <Icon class="absolute top-2 right-2" name="material-symbols:search" size="20" />
      </div>
      <LeadManagementListsDialog />
    </template>
  </BaseHeader>
  <!-- TABLE -->
  <div>
    <LeadManagementListsTable :loading="status === 'pending'" :limit="limit" :total-rows="filteredList.length" :start="pageStart" :list="paginatedList || []" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refresh" />
  </div>
</template>

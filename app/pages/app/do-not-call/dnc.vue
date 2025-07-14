<script setup lang="ts">
import { Input } from '@/components/ui/input'

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const showAddDialog = ref(false)

const { data: dncList, status: dncListStatus, refresh: refreshDncList } = await useLazyAsyncData('dnc-list', () =>
  useApi().post('/dnc', {
    lower_limit: pageStart.value,
    upper_limit: limit.value,
    search: searchQuery.value,
  }), {
  transform: res => res,
})

// Watch search query and reset pagination
watch(searchQuery, () => {
  refreshDncList()
  pageStart.value = 0
})

const selectedDnc = ref<null | {
  number: number
  extension: number
  comment: string
}>(null)

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
  return refreshDncList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshDncList()
}
</script>

<template>
  <BaseHeader title="DNC List">
    <template #actions>
      <div class="relative mt-4 md:mt-0">
        <Input v-model="searchQuery" placeholder="Search Number / Exten.." class="pr-10" />
        <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
      </div>
      <!-- Upload DNC Dialog -->
      <DoNotCallDncUpload />
      <!-- Add DNC Dialog -->
      <DoNotCallDncAdd v-model:open="showAddDialog" :initial-data="selectedDnc" />
    </template>
  </BaseHeader>
  <div>
    <DoNotCallDncTable :limit="limit" :total-rows="dncList?.record_count" :start="pageStart" :list="dncList?.data" :loading="dncListStatus === 'pending'" @page-navigation="changePage" @limit-change="changeLimit" @refresh="refreshDncList" />
  </div>
</template>

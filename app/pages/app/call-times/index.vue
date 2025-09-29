<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: callTimingList, status: callTimingListStatus, refresh: refreshCallTimingList } = await useLazyAsyncData('get-call-timings', () =>
  useApi().get('/call-timers', {
    query: {
      start: start.value,
      limit: limit.value,
      search: search.value,
    },
  }), {
  transform: res => res.data,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshCallTimingList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  start.value = 0
  return refreshCallTimingList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshCallTimingList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

const open = ref(false)
const editRowData = ref({})
function onEdit(original: any) {
  editRowData.value = original
  open.value = true
}
watch(() => open.value, (val) => {
  if (!val) {
    editRowData.value = {}
  }
})
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Call Times">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search List" @update:model-value="searchText" />
        <div>
          <CallTimesCreate
            v-model:open="open"
            :data="editRowData"
            @complete="refreshCallTimingList"
          />
        </div>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <CallTimesTable
        :limit="limit"
        :total-rows="callTimingList?.total_rows"
        :start="start"
        :list="callTimingList?.data || []"
        :loading="callTimingListStatus === 'pending'"
        @page-navigation="changePage"
        @change-limit="changeLimit"
        @edit="onEdit"
        @refresh="refreshCallTimingList"
      />
    </div>
  </div>
</template>

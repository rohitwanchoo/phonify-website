<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'

const start = ref(0)
const limit = ref(10)
const search = ref('')
const activeFilters = ref<Record<string, any>>({})
const showDialog = ref(false)
const selectedRinglessList = ref<any>(null)

const { data: ringlessLists, status: ringlessListStatus, refresh: refreshRinglessLists } = await useLazyAsyncData(
  'ringless-lists',
  () =>
    useApi().get('/ringless/lists', {
      params: {
        ...activeFilters.value,
        start: start.value,
        limit: limit.value,
        search: search.value,
      },
    }),
  {
    transform: res => res,
  },
)

function changePage(page: number) {
  start.value = (page - 1) * limit.value
  return refreshRinglessLists()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshRinglessLists()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshRinglessLists()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

function openEditDialog(item: any) {
  selectedRinglessList.value = item
  showDialog.value = true
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Ringless List">
      <template #actions>
        <BaseInputSearch
          v-model="search"
          class="w-[300px]"
          placeholder="search"
          @update:model-value="searchText"
        />
        <RinglessVoicemailListsAdd @refresh="refreshRinglessLists" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <RinglessVoicemailListsTable
      :limit="limit"
      :total-rows="ringlessLists?.total"
      :start="start"
      :list="ringlessLists?.data || []"
      :loading="ringlessListStatus === 'pending'"
      @page-navigation="changePage"
      @change-limit="changeLimit"
      @refresh="refreshRinglessLists"
      @edit="openEditDialog"
    />
  </div>
</template>

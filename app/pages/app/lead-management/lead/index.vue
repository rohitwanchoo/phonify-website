<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '~/components/ui/button'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: leadsList, refresh: refreshLead, status: leadsStatus } = await useLazyAsyncData('leads-list', () =>
  useApi().post('/leads', {
    lower_limit: start.value,
    upper_limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

// Search
function searchLeadListItems() {
  start.value = 0
  refreshLead()
}

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshLead()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshLead()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshLead()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Manage Leads">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" @update:model-value="searchText" />
        <Button class="h-11 mt-4 md:mt-0" @click="searchLeadListItems">
          Search
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <LeadManagementLeadTable :limit="limit" :total-rows="leadsList?.record_count" :start="start" :list="leadsList?.data" :loading="leadsStatus === 'pending'" @page-navigation="changePage" @limit-change="changeLimit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

const { data: leadsList, refresh: refreshLead, status: leadsStatus } = await useLazyAsyncData('leads-list', () =>
  useApi().post('/leads', {
    lower_limit: pageStart.value,
    upper_limit: limit.value,
    search: searchQuery.value,
  }), {
  transform: res => res,
})

// Search
function searchLeadListItems() {
  pageStart.value = 0
  refreshLead()
}

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
  return refreshLead()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshLead()
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Manage Leads">
      <template #actions>
        <div class="relative mt-4 md:mt-0">
          <Input v-model="searchQuery" placeholder="Search List" class="pr-10" />
          <Icon class="absolute top-[9px] right-2" name="material-symbols:search" size="20" />
        </div>
        <Button class="mt-4 md:mt-0" @click="searchLeadListItems">
          Search
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <LeadManagementLeadTable :limit="limit" :total-rows="leadsList?.record_count" :start="pageStart" :list="leadsList?.data" :loading="leadsStatus === 'pending'" @page-navigation="changePage" @limit-change="changeLimit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '~/components/ui/button/'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: customFieldList, status: customFieldStatus, refresh: customFieldRefresh } = await useLazyAsyncData('custom-field-list', async () =>
  useApi().get('/custom-field-labels-values', {
    lower_limit: start.value,
    upper_limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

// Dialog state management
const addDialogOpen = ref(false)

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return customFieldRefresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return customFieldRefresh()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  customFieldRefresh()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Custom Field Values">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
        <!-- Add Button triggering the dialog -->
        <Button class="h-11" @click="addDialogOpen = true">
          <Icon class="!text-white" size="20" name="material-symbols:add" />
          Add Custom Field Value
        </Button>
        <!-- ADD Custom Fieid Value -->
        <ConfigurationCustomFieldValuesAddOrEdit v-model:open="addDialogOpen" :initial-data="null" />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ConfigurationCustomFieldValuesTable :limit="limit" :total-rows="customFieldList?.data.length" :start="start" :list="customFieldList?.data || []" :loading="customFieldStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" />
    </div>
  </div>
</template>

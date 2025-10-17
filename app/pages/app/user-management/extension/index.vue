<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '~/components/ui/button'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: extensionData, status: extensionStatus, refresh: refreshExtensionList } = await useLazyAsyncData('extension-list', () =>
  useApi().get('extension', {
    params: {
      start: start.value,
      limit: limit.value,
      search: search.value,
    },
  }), {
  transform: (res) => {
    return res
  },
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshExtensionList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshExtensionList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshExtensionList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div>
    <BaseHeader title="Extension List">
      <template #actions>
        <div class="relative w-full md:w-auto ">
          <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
        </div>
        <!-- TO DO: Add Excel Download Button (API needed) -->
        <!-- <Button variant="outline" class="text-black h-11">
          <Icon class="!text-black text-xl" name="material-symbols:download" />
          Excel
        </Button> -->
        <NuxtLink to="/app/user-management/extension/create">
          <Button class="h-11">
            <Icon class="!text-white text-xl" name="material-symbols:add" />
            Add Extensions
          </Button>
        </NuxtLink>
      </template>
    </BaseHeader>

    <UserManagementExtensionTable :limit="limit" :total-rows="extensionData?.total_rows" :start="start" :list="extensionData?.data || []" :loading="extensionStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" @refresh="refreshExtensionList" />
  </div>
</template>

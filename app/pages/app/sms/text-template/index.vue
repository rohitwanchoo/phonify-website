<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '~/components/ui/button'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: smsTextTemplateList, status: smsTextTemplateListStatus, refresh: refreshSmsTextTemplateList } = await useLazyAsyncData('sms-text-template-list', () =>
  useApi().get('/sms-templete', {
    query: {
      start: start.value,
      limit: limit.value,
      search: search.value,
    },
  }), {
  transform: res => res.data,
  immediate: true,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshSmsTextTemplateList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshSmsTextTemplateList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshSmsTextTemplateList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="SMS Template List">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchText" />
        <NuxtLink to="/app/sms/text-template/create">
          <Button class="h-11">
            <Icon class="!text-white text-xl" name="material-symbols:add" />
            Add SMS Template
          </Button>
        </NuxtLink>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <SmsTextTemplateTable
        :limit="limit"
        :total-rows="smsTextTemplateList?.total || 0"
        :start="start"
        :list="smsTextTemplateList?.data || []"
        :loading="smsTextTemplateListStatus === 'pending'"
        @page-navigation="changePage"
        @change-limit="changeLimit"
      />
    </div>
  </div>
</template>

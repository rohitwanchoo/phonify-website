<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const { data: promptData, status: promptStatus, refresh: refreshPrompt } = await useLazyAsyncData('prompts-data', () =>
  useApi().get('/prompts', {
    start: start.value,
    limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshPrompt()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshPrompt()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshPrompt()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div>
    <BaseHeader title="Manage Prompts">
      <template #actions>
        <BaseInputSearch v-model="search" placeholder="Search Prompts" class="w-[300px]" @update:model-value="searchText" />
        <NuxtLink to="/app/configuration/ai-prompts/add">
          <Button class="h-11 bg-red-600 hover:bg-red-500">
            <Icon class="!text-white text-xl" name="material-symbols:add" />
            Add Prompts
          </Button>
        </NuxtLink>
      </template>
    </BaseHeader>
    <!-- Table -->
    <ConfigurationAiPromptsTable
      :loading="promptStatus === 'pending'"
      :list="promptData?.data || []"
      :limit="limit"
      :total-rows="promptData?.count"
      :start="start"
      @page-navigation="changePage"
      @change-limit="changeLimit"
      @refresh="refreshPrompt"
    />
  </div>
</template>

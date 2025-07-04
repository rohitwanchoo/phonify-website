<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const searchQuery = ref('')
//  API call for
const { data: apiList, status, refresh } = await useLazyAsyncData('api-list', async () => {
  const response = await useApi().post('api-data', {
    params: {},
  })
  return response
})

// Client-side filtering based on API data
const filteredList = computed(() => {
  if (!apiList.value?.data)
    return []
  const query = searchQuery.value.toLowerCase()
  return apiList.value.data.filter((item: any) =>
    item.title?.toLowerCase().includes(query)
    || item.campaign?.toLowerCase().includes(query)
    || item.method?.toLowerCase().includes(query),
  )
})
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="API">
      <template #actions>
        <div class="relative mt-4 md:mt-0">
          <Input v-model="searchQuery" placeholder="Search API" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <NuxtLink to="/app/configuration/api/create">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Add API
          </Button>
        </NuxtLink>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <ConfigurationApiTable
      :list="filteredList"
      :loading="status === 'pending'"
      :refresh="refresh"
    />
  </div>
</template>

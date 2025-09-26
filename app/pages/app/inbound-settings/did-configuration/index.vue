<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const start = ref(0)
const limit = ref(100)
const search = ref('')

const { data: didList, status: didListStatus, refresh: refreshDidList } = await useLazyAsyncData('did-configuration-list', () =>
  useApi().post('/did', {
    start: start.value,
    limit: limit.value,
    search: search.value,
  }), {
  transform: res => res,
})

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshDidList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshDidList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshDidList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

const actions = [
  {
    label: 'Upload Excel',
    link: '#',
  },
  {
    label: 'Buy number from DID for sale',
    link: '#',
  },
  {
    label: 'Buy number from Plivo',
    link: '#',
  },
  {
    label: 'Buy number from Telnyx',
    link: '#',
  },
  {
    label: 'Buy number from Twilio',
    link: '#',
  },
]
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="DID Configuration">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search..." @update:model-value="searchText" />

        <!-- Actions -->
        <DropdownMenu>
          <DropdownMenuTrigger class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 px-4 py-2 h-11 flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer">
            Action
            <Icon name="material-symbols:arrow-drop-down" class="text-xl text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem v-for="action in actions" :key="action.link">
              {{ action.label }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <InboundSettingsDidConfigurationTable :limit="limit" :total-rows="didList?.total_rows" :start="start" :list="didList?.data" :loading="didListStatus === 'pending'" @page-navigation="changePage" @change-limit="changeLimit" />
    </div>
  </div>
</template>

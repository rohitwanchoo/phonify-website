<script setup lang="ts">
import { FaxInboxTab } from '#components'
import { ref, watch } from 'vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FaxSentTab from '~/components/fax/SentTab.vue'
import { Input } from '~/components/ui/input'

definePageMeta({
  middleware: 'auth',
})

const currentTab = ref('sent')

const meta = ref({
  current_page: 1,
  per_page: 12,
  last_page: 3,
  total: 26,
})

function handlePageChange(page: number) {
  if (page < 1 || page > meta.value.last_page || page === meta.value.current_page)
    return
  meta.value.current_page = page
}

watch(() => meta.value.per_page, () => {
  meta.value.current_page = 1
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <BaseHeader title="Receive Fax">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <FaxFilterSheet v-model:form-values="filterValues" class="bg-black text-white" @apply-filter="applyFilter" />
        <FaxDialog />
      </template>
    </BaseHeader>

    <!-- Content + Tabs + Pagination -->
    <div class="flex-1 flex flex-col overflow-hidden mt-5 rounded-lg border">
      <Tabs v-model="currentTab" class="flex-1 flex overflow-hidden" orientation="vertical">
        <div class="flex flex-col lg:flex-row h-full overflow-hidden">
          <!-- Sidebar Tabs -->
          <div class="lg:w-[20%] bg-primary">
            <div class="px-6 pt-5">
              <h2 class="text-white/60 text-sm">
                FOLDERS
              </h2>
            </div>
            <TabsList
              class="lg:py-3 lg:px-4 p-0 flex justify-center items-center h-15 lg:h-full lg:justify-start lg:flex-col w-full
              rounded-bl-lg rounded-t-none rounded-br-none bg-primary"
            >
              <TabsTrigger
                value="sent"
                class="text-white whitespace-normal text-sm shadow-none
                data-[state=active]:text-primary max-h-10 lg:px-4 lg:w-full block lg:mb-2 rounded-[4px] hover:bg-secondary/10 cursor-pointer transition-all duration-200 "
              >
                <div class="flex justify-center lg:justify-start items-center gap-2">
                  <Icon name="material-symbols:send-outline" size="18" class="hidden sm:block" />
                  Sent
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="password"
                class="text-white whitespace-normal text-sm
                data-[state=active]:text-primary max-h-10 lg:px-4 lg:w-full block lg:mb-2 rounded-[4px] hover:bg-secondary/10 cursor-pointer transition-all duration-200 "
              >
                <div class="flex justify-center lg:justify-start items-center gap-2">
                  <Icon name="material-symbols:inbox" class="hidden sm:block" />
                  Inbox
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <!-- Tab Content Area -->
          <div class="lg:w-[80%] flex flex-col overflow-hidden">
            <div class="flex-1 overflow-auto">
              <TabsContent value="sent" class="h-full">
                <FaxSentTab />
              </TabsContent>
              <TabsContent value="password" class="h-full">
                <FaxInboxTab />
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>
    </div>

    <!-- Sticky Pagination -->
    <div v-if="meta?.current_page && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
      <div class="flex-1 text-xs text-primary">
        <div class="flex items-center gap-x-2 justify-center sm:justify-start">
          Showing {{ meta?.current_page }} to

          <span>
            <Select :default-value="10">
              <SelectTrigger class="w-fit gap-x-1 px-2">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="n in 15" :key="n" :value="n">
                  {{ n }}
                </SelectItem>
              </SelectContent>
            </Select>
          </span>

          of {{ meta?.total }} entries
        </div>
      </div>
      <div class="space-x-2">
        <!-- Pagination Controls -->
        <TableServerPagination
          :total-items="Number(meta?.total)" :current-page="Number(meta?.current_page)"
          :items-per-page="Number(meta?.per_page)" :last-page="Number(meta?.last_page)" @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

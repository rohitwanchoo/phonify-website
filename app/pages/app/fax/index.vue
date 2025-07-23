<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FaxSentTab from '~/components/fax/SentTab.vue'
import { Input } from '~/components/ui/input'
import { FaxInboxTab } from '#components'


// Auth and page setup
definePageMeta({
  middleware: 'auth',
})

// Tab state
const currentTab = ref('sent')

// Pagination data
const meta = ref({
  current_page: 1,
  per_page: 12,
  last_page: 3,
  total: 26,
})

function handlePageChange(page: number) {
  meta.value.current_page = page
  // Add your data fetching logic here
}

// Watch for page size changes
watch(() => meta.value.per_page, () => {
  meta.value.current_page = 1 // Reset to first page when page size changes
})

// API and other utilities
const api = useApi()
const loggingOut = ref(false)
const apiLoading = ref(false)
const apiResult = ref(null)
const apiError = ref('')

async function handleLogout() {
  loggingOut.value = true
  try {
    await logout()
    await navigateTo('/auth/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    loggingOut.value = false
  }
}

async function testApiCall() {
  apiLoading.value = true
  try {
    const result = await api.get('/user/profile')
    apiResult.value = result
  } catch (error: any) {
    apiError.value = error.statusMessage || 'API call failed'
  } finally {
    apiLoading.value = false
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleString()
}

useHead({
  title: 'Fax - Phonify',
})
</script>

<template>
  <div class="flex flex-col h-full">
    <BaseHeader title="Receive Fax">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <FaxFilterSheet class="bg-black text-white" v-model:form-values="filterValues" @apply-filter="applyFilter" />
        <FaxDialog/>
      </template>
    </BaseHeader>
    
    <div class="flex-1 lg:flex gap-2 mt-5">
      <div class="lg:h-full lg:w-[100%] mb-4 md:mb-0 rounded-lg border">
        <Tabs v-model="currentTab" class="h-full" orientation="vertical">
          <div class="flex flex-col lg:flex-row h-full ">
            <!-- Sidebar Tabs -->
            <div class="lg:w-[20%] ">
                         <!-- Moved the header above TabsList -->
                         <div class="px-6 pt-5 bg-primary rounded-tl-lg">
    <h2 class="text-white/60 text-sm">FOLDERS</h2>
  </div>
             
  <TabsList
  class="lg:py-3 lg:px-4 p-0 flex justify-center items-center h-15 lg:h-full lg:justify-start lg:flex-col w-full bg-primary 
   rounded-bl-lg rounded-t-none rounded-br-none"
>
                <TabsTrigger
                  value="sent"
                  class="text-white whitespace-normal h-full text-wrap lg:rounded-xl text-sm shadow-none rounded-bl-none rounded-r-none data-[state=active]:text-primary lg:max-h-14 lg:px-4 lg:w-full block lg:mb-2"
                >
                  <div class="flex justify-center lg:justify-start items-center gap-1">
                    <Icon name="material-symbols:send-outline" size="18" class="h-3 hidden sm:block" />
                    Sent
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  class="text-white whitespace-normal h-full text-wrap lg:rounded-xl text-sm shadow-none rounded-none data-[state=active]:text-primary lg:max-h-14 lg:px-4 lg:w-full block lg:mb-2"
                >
                  <div class="flex justify-center lg:justify-start items-center gap-1">
                    <Icon name="material-symbols:inbox" class="h-3 hidden sm:block" />
                    Inbox
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <!-- Tab Content Area -->
            <div class="lg:w-[80%] flex flex-col h-full">
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
    </div>

    <!-- Pagination Footer - Fixed at bottom -->
    <div 
      v-if="currentTab === 'sent'" 
      class="sticky bottom-0 bg-background border-t px-4 py-3"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Rows per page selector moved to left -->
        <div class="flex items-center gap-4">
          <div class="flex items-center space-x-2">
            <p class="text-sm font-medium">Rows per page</p>
            <Select v-model="meta.per_page">
              <SelectTrigger class="h-8 w-[70px]">
                <SelectValue :placeholder="meta.per_page.toString()" />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem 
                  v-for="pageSize in [10, 20, 30, 40, 50]"
                  :key="pageSize"
                  :value="pageSize"
                >
                  {{ pageSize }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="text-sm text-muted-foreground">
            Showing 
            {{ (meta.current_page - 1) * meta.per_page + 1 }} 
            to 
            {{ Math.min(meta.current_page * meta.per_page, meta.total) }} 
            of {{ meta.total }} entries
          </div>
        </div>

        <!-- Pagination controls on right -->
        <TableServerPagination
          :total-items="Number(meta.total)" 
          :current-page="Number(meta.current_page)"
          :items-per-page="Number(meta.per_page)" 
          :last-page="Number(meta.last_page)" 
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
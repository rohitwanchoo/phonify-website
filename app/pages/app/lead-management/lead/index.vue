<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const { user } = useAuth()

const start = ref(0)
const limit = ref(10)
const selectedLists = ref([])
const listHeaders = ref(null)
const selectedHeader = ref(null)
const headerValue = ref('')

// Multi-select list state
const listSearchTerm = ref('')
const listOpen = ref(false)

export interface listItem {
  list_id: number
  list: string
}

const { data: listData, status: listStatus } = await useLazyAsyncData('list', () =>
  useApi().post('/list'), {
  transform: res => res.data,
  immediate: true,
})

const { data: leadsList, refresh: refreshLead, status: leadsStatus } = await useLazyAsyncData('search-leads', () =>
  useApi().post('/search-leads', {
    list_data: selectedLists.value.map((item: listItem) => item.list_id),
    header_column: selectedHeader.value?.column_name,
    header_value: headerValue.value,
  }), {
  transform: res => res,
  immediate: false,
})

// Filter lists based on search term and exclude already selected
const filteredListData = computed(() => {
  if (!listData.value)
    return []

  return listData.value.filter((item: listItem) =>
    !selectedLists.value.some((selected: listItem) => selected.list_id === item.list_id)
    && item.list.toLowerCase().includes(listSearchTerm.value.toLowerCase()),
  )
})

// Check if lists are selected to show header dropdown
const hasSelectedLists = computed(() => {
  return selectedLists.value.length > 0
})

// Check if all required fields are filled to enable search
const canSearch = computed(() => {
  return hasSelectedLists.value && selectedHeader.value && headerValue.value.trim()
})

// Handle list selection
async function onListSelect(listItem: listItem) {
  if (!selectedLists.value.some((selected: listItem) => selected.list_id === listItem.list_id)) {
    selectedLists.value.push(listItem)
  }
  listSearchTerm.value = ''

  if (filteredListData.value.length === 0) {
    listOpen.value = false
  }

  // Update headers for selected lists
  await updateListHeaders()
}

// Remove list
async function removeList(listId: number) {
  // Remove the specific list item
  selectedLists.value = selectedLists.value.filter((item: listItem) => item.list_id !== listId)

  // Reset all selected data and hide table
  listHeaders.value = null
  selectedHeader.value = null
  headerValue.value = ''

  // Clear the leads data to hide the table
  leadsList.value = null

  // Update headers for remaining selected lists (if any)
  await updateListHeaders()
}

// Update list headers
async function updateListHeaders() {
  if (selectedLists.value.length === 0) {
    listHeaders.value = null
    return
  }

  try {
    const response = await useApi().post('/list-header', {
      id: user.value?.id,
      list_data: selectedLists.value.map((item: listItem) => item.list_id),
    })
    if (response.data) {
      listHeaders.value = response.data
    }
  }
  catch {
    listHeaders.value = null
  }
}

// Watch for changes in selected lists
watch(selectedLists, () => {
  start.value = 0
}, { deep: true })

// Watch for header selection changes
watch(selectedHeader, () => {
  // Reset header value when header changes
  headerValue.value = ''
  // Clear previous search results
  leadsList.value = null
})

// Watch for header value changes - ADDED THIS WATCHER
watch(headerValue, () => {
  // Clear previous search results when user types new value
  if (leadsList.value) {
    leadsList.value = null
  }
})

// Search function - only called when user clicks search button
function searchLeadWithHeaders() {
  if (!canSearch.value) {
    return
  }

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
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Manage Leads">
      <template #actions>
        <!-- Multi-Select List Combobox -->
        <Combobox v-model:open="listOpen" :ignore-filter="true">
          <ComboboxAnchor class="border rounded-lg bg-white w-full max-w-[90vw] md:max-w-[70vw] overflow-y-hidden overflow-x-auto h-11 px-2">
            <div class="relative w-full items-center">
              <!-- Selected Lists Display -->
              <div class="flex gap-2 items-center">
                <!-- Selected list tags -->
                <div
                  v-for="item in selectedLists"
                  :key="(item as listItem).list_id"
                  class="rounded-[6px] border border-[#00A086] bg-[#00A0861A] py-1 px-2 flex items-center justify-between gap-x-2 text-sm text-nowrap"
                >
                  <span>{{ (item as listItem).list }}</span>
                  <button
                    type="button"
                    class="hover:bg-red-100 rounded-full p-0.5"
                    @click="removeList((item as listItem).list_id)"
                  >
                    <X class="h-3 w-3" />
                  </button>
                </div>

                <!-- Input for searching -->
                <ComboboxInput
                  v-model="listSearchTerm"
                  class="border-none p-0 focus-visible:ring-0 h-auto min-w-[100px] flex-1"
                  placeholder="Select lists..."
                  @click="listOpen = true"
                />
              </div>
            </div>
          </ComboboxAnchor>

          <ComboboxList class="w-[--reka-popper-anchor-width]">
            <ComboboxEmpty class="px-2">
              No lists found.
            </ComboboxEmpty>

            <ComboboxGroup v-if="listStatus === 'pending'">
              <ComboboxItem class="text-center justify-center w-[180px]" :value="null" disabled>
                <Icon name="eos-icons:loading" />
              </ComboboxItem>
            </ComboboxGroup>

            <template v-else>
              <ComboboxGroup class="max-h-[70dvh] overflow-y-auto">
                <ComboboxItem
                  value="all"
                  @select.prevent="onListSelect({ list_id: 0, list: 'All' })"
                >
                  All
                </ComboboxItem>
                <ComboboxItem
                  v-for="item in filteredListData"
                  :key="item.list_id"
                  :value="item"
                  @select.prevent="onListSelect(item)"
                >
                  {{ item.list }}
                </ComboboxItem>
              </ComboboxGroup>
            </template>
          </ComboboxList>
        </Combobox>

        <!-- Select Header - Only show when lists are selected -->
        <Select
          v-if="hasSelectedLists"
          v-model="selectedHeader"
        >
          <SelectTrigger class="w-[180px] !h-11">
            <SelectValue placeholder="Select list header" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-if="listHeaders === null" value="null" disabled class="w-[180px] flex items-center justify-center">
                <Icon name="eos-icons:loading" />
              </SelectItem>
              <template v-else>
                <SelectItem v-for="(header, index) in listHeaders" :key="index" :value="header">
                  {{ header.title }}
                </SelectItem>
              </template>
            </SelectGroup>
          </SelectContent>
        </Select>

        <!-- Search Value Input - Only show when header is selected -->
        <Input
          v-if="hasSelectedLists && selectedHeader"
          v-model="headerValue"
          class="w-[180px] h-11"
          placeholder="Enter search value"
        />

        <!-- Search Button - Only show and enable when all fields are filled -->
        <Button
          v-if="hasSelectedLists"
          class="h-11"
          :disabled="!canSearch || leadsStatus === 'pending'"
          :loading="leadsStatus === 'pending'"
          @click="searchLeadWithHeaders"
        >
          Search
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <LeadManagementLeadTable
        v-if="leadsList?.data?.length"
        :limit="limit"
        :total-rows="leadsList?.record_count"
        :start="start"
        :list="leadsList?.data"
        :list-headers="listHeaders"
        :loading="leadsStatus === 'pending'"
        @page-navigation="changePage"
        @limit-change="changeLimit"
      />

      <!-- Show different messages based on user's progress -->
      <div v-else class="text-center text-sm font-normal mt-20">
        <!-- Step 1: No lists selected -->
        <p v-if="selectedLists.length === 0">
          Please select a list from the dropdown above to view and manage leads.
        </p>

        <!-- Step 2: Lists selected but no header selected -->
        <p v-else-if="!selectedHeader">
          Please select a list header to search by.
        </p>

        <!-- Step 3: Header selected but no search value -->
        <p v-else-if="!headerValue.trim()">
          Please enter a search value to find leads.
        </p>

        <!-- Step 4: All fields filled but no search performed yet -->
        <p v-else-if="!leadsList">
          Click the Search button to find leads.
        </p>

        <!-- Step 5: Search performed but no results found -->
        <p v-else-if="leadsList?.success === 'false'">
          {{ leadsList?.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
[data-slot="command-input-wrapper"] {
  border: none;
  padding: 4px;
  height: 44px;
}
</style>

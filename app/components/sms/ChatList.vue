<script setup lang="ts">
import { formatDate, useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Separator } from '~/components/ui/separator'

const props = defineProps({
  smsChatList: {
    type: Array,
    default: () => [],
  },
  limit: {
    type: Number,
    default: 10,
  },
  start: {
    type: Number,
    default: 0,
  },
  totalRows: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  refresh: {
    type: Function,
    default: () => {},
  },
  search: {
    type: String,
    default: '',
  },
  selectedContact: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['selectContact', 'searchText', 'update:search', 'changePage', 'changeLimit'])

const searchModel = computed({
  get: () => props.search,
  set: value => emit('update:search', value),
})

const isFilterOpen = ref(false)
const selectedTab = ref('')

const filterSelected = ref('last7')

const options = [
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'Last 30 Days', value: 'last30' },
  { label: 'Custom Date', value: 'custom' },
  { label: 'All Chats', value: 'all' },
]

// Generate unique tab ID from number and did
function getTabId(number: number, did: number) {
  return `${number}-${did}`
}

function handleTabSelect(groupNumber: number, groupDid: number) {
  selectedTab.value = getTabId(groupNumber, groupDid)
  const group = (props.smsChatList as Array<{ number: number, did: number, message?: string }>).find(
    g => (g as { number: number }).number === groupNumber && (g as { did: number }).did === groupDid,
  )
  if (group) {
    emit('selectContact', group)
  }
}

// Sync selected tab when parent sets selected contact
watch(() => props.selectedContact, (contact) => {
  if (contact && typeof (contact as any).number !== 'undefined' && typeof (contact as any).did !== 'undefined') {
    selectedTab.value = getTabId((contact as { number: number }).number, (contact as { did: number }).did)
  }
}, { immediate: true })

const sentinel = ref<HTMLElement | null>(null)

useIntersectionObserver(
  sentinel,
  (entries) => {
    const entry = entries[0]
    if (entry && entry.isIntersecting && !props.loading && props.smsChatList.length < props.totalRows) {
      emit('changePage', props.start + props.limit)
    }
  },
)
</script>

<template>
  <div class="bg-primary p-[18px] h-[calc(100vh-160px)] flex flex-col">
    <div class="flex items-center gap-3 mb-4">
      <BaseInputSearch v-model="searchModel" class="w-full" classes="bg-white rounded-lg" placeholder="Search" @update:model-value="emit('searchText')" />

      <DropdownMenu v-model:open="isFilterOpen">
        <DropdownMenuTrigger as-child>
          <Button
            variant="outline"
            size="icon"
            class="h-11 w-11 border transition-all duration-200"
            :class="isFilterOpen
              ? 'bg-white text-black border-white hover:bg-white hover:text-black'
              : 'bg-[#1717170d] text-white border-white hover:bg-[#605f5f64] hover:text-white'"
          >
            <Icon
              :name="isFilterOpen ? 'material-symbols:menu' : 'material-symbols:sort'"
              size="23"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56 p-2 bg-white rounded-lg shadow-md">
          <div class="space-y-3">
            <p class="text-sm font-medium text-gray-500 px-2 pt-1">
              Filter Options
            </p>

            <DropdownMenuGroup>
              <DropdownMenuItem
                v-for="option in options"
                :key="option.value"
                class="cursor-pointer px-2 py-1.5 rounded hover:bg-gray-50"
                @select.prevent
              >
                <div class="flex items-center space-x-2 w-full">
                  <input
                    :id="option.value"
                    v-model="filterSelected"
                    type="radio"
                    :value="option.value"
                    class="appearance-none w-3 h-3 border border-[#1C2B36] rounded-full checked:bg-[#00A086] checked:border-[#00A086] focus:ring-1 transition-colors duration-200"
                  >
                  <label :for="option.value" class="text-sm text-[#1C2B36] cursor-pointer w-full">
                    {{ option.label }}
                  </label>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <Separator class="my-2 bg-[#FFFFFF1A]" />

    <div v-if="loading && smsChatList.length === 0">
      <BaseSkelton v-for="i in 8" :key="i" class="h-[84px] p-4 w-full border border-[#FFFFFF1A] bg-[#ffffff92] mb-2" rounded="rounded-sm" />
    </div>
    <ScrollArea v-else class="h-[calc(100vh-210px)] overflow-y-auto overflow-x-hidden flex-1">
      <Tabs v-model="selectedTab" orientation="vertical" class="space-y-2 h-full">
        <TabsList class="flex flex-col h-full gap-y-2 bg-transparent w-full pl-1 mt-1 overflow-y-auto overflow-x-hidden">
          <TabsTrigger
            v-for="(group, index) in smsChatList"
            :key="index"
            :value="getTabId((group as { number: number }).number, (group as { did: number }).did)"
            class="h-[84px] p-4 flex-shrink-0 w-full border border-[#FFFFFF1A] bg-[#FFFFFF0D] text-white data-[state=active]:bg-[#00A086] mr-2 rounded-[8px] flex items-center justify-between px-[16px] !text-sm !font-normal cursor-pointer hover:bg-[#FFFFFF0D]/80 relative data-[state=inactive]:after:hidden after:absolute after:-right-[16px] after:border-8 after:border-transparent after:border-l-[#00A086]"
            @click="handleTabSelect((group as { number: number }).number, (group as { did: number }).did)"
          >
            <div class="flex items-center gap-x-3 truncate">
              <div class="w-10 h-10 min-h-10 min-w-10 rounded-full bg-[#FFFFFF66] text-white flex items-center justify-center text-sm font-semibold uppercase">
                <Icon name="material-symbols:account-circle" size="24" />
              </div>
              <div class="leading-tight text-left truncate">
                <div class="truncate">
                  {{ formatNumber(String((group as { number: number }).number) || '') }}
                </div>
                <div class="text-xs text-white opacity-70 truncate">
                  {{ (group as { message?: string }).message || 'Unknown user' }}
                </div>
              </div>
            </div>
            <div class="text-xs text-white opacity-70 whitespace-nowrap">
              {{ formatDate(new Date((group as { date: string }).date), 'h:mm A') }}
            </div>
          </TabsTrigger>
          <div ref="sentinel" class="w-full mr-2 flex justify-center items-center">
            <div v-if="loading && smsChatList.length > 0" class="w-full">
              <BaseSkelton class="h-[54px] p-4 w-full border border-[#FFFFFF1A] bg-[#ffffff92] mb-2" rounded="rounded-sm" />
            </div>
          </div>
        </TabsList>
      </Tabs>
    </ScrollArea>
  </div>
</template>

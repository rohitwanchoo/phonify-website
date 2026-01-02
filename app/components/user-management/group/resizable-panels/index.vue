<script setup lang="ts">
import type { Extension } from '@/types/extension'
import { useConfirmDialog, useDebounceFn } from '@vueuse/core'

import { useRouteQuery } from '@vueuse/router'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'

// ==================== TYPES ====================
interface Group {
  id: number
  title: string
  count: number
}

export interface Extension {
  siNo?: number
  extension: string
  name: string
  email: string
  phoneNumber: string
  webPhone: string
  actions?: string
}

// ==================== EMITS ====================
const emits = defineEmits(['refresh', 'onRename'])

// ==================== COMPOSABLES ====================
const route = useRoute()
const router = useRouter()
const groupIdQuery = useRouteQuery('id')

// ==================== STATE ====================
// Search and Pagination
const searchField = ref('')
const limit = ref(10)
const start = ref(0)

// UI State
const addExtensionSheet = ref(false)
const toggledGroup = ref<{ id: string, title: string, count: number, status: number }>()
const selectedGroup = ref({})
const selectedExtensions = ref<Extension[]>()

// ==================== DATA FETCHING ====================
const {
  data: extensionGroup,
  status: extensionGroupStatus,
  refresh: refreshExtensionGroup,
} = await useLazyAsyncData('extension-group-list', () =>
  useApi().get('extension-group', {
    params: {
      search: searchField.value,
      limit: limit.value,
      start: start.value,
    },
  }), {
  transform: res => res,
})

const {
  data: extensionDataByGroupId,
  status: extensionDataStatus,
  refresh: refreshExtensionDataByGroupId,
} = await useLazyAsyncData(`extension-list-by-group-${groupIdQuery.value}`, () => {
  const group_id = groupIdQuery.value
  return useApi().get(`/extension-group-map`, {
    params: {
      group_id,
    },
  })
}, {
  transform: res => res.data,
  immediate: false,
  server: false,
  watch: [groupIdQuery],
})

// ==================== COMPUTED ====================
const total = computed(() => extensionGroup.value?.total || 0)
const current_page = computed(() => Math.floor(start.value / limit.value) + 1)
const per_page = computed(() => limit.value)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

// ==================== CONFIRM DIALOG ====================
const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

// ==================== PAGINATION METHODS ====================
function handlePageChange(page: number) {
  start.value = Number((page - 1) * limit.value)
  refreshExtensionGroup()
}

function changeLimit(val: number | null) {
  if (val !== null) {
    limit.value = Number(val)
    refreshExtensionGroup()
  }
}

// ==================== SEARCH METHODS ====================
const debouncedSearch = useDebounceFn(() => {
  refreshExtensionGroup()
}, 1000, { maxWait: 5000 })

function searchGroup() {
  debouncedSearch()
}

// ==================== GROUP METHODS ====================
function onSelectGroup(val: Group) {
  console.log(val)
  // refreshExtensionDataByGroupId().then(() => {
  // selectedExtensions.value = extensionDataByGroupId.value.map((item: any) => ({
  //   first_name: item.first_name,
  //   last_name: item.last_name,
  //   extension: item.extension,
  // }))
  // })
}

async function deleteGroup(group: Group) {
  selectedGroup.value = group
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled) {
    return false
  }
  try {
    const response = await useApi().delete('extension-group-delete', {
      params: {
        group_id: group.id
      }
    })
    showToast({ message: response.message })
    refreshExtensionGroup()
  }
  catch (error) {
    handleError(error as any)
  }
}

function renameGroup(val: any) {
  emits('onRename', val)
}

// ==================== EXTENSION METHODS ====================
function addExtension() {
  useApi().patch('/extension-group-update', {
    group_id: toggledGroup.value?.id,
    title: toggledGroup.value?.title,
    status: !!toggledGroup.value?.status,
    extensions: selectedExtensions.value?.map((item: Extension) => item.extension),
  }).then((res: any) => {
    showToast({
      type: 'success',
      message: res.message,
    })
    addExtensionSheet.value = false
    refreshExtensionDataByGroupId()
    // refreshNuxtData(`extension-list-by-group-${toggledGroup.value?.id}`)
  }).catch(({ data }) => {
    showToast({
      type: 'error',
      message: data.message,
    })
  })
}

// ==================== WATCHERS ====================
watch(() => extensionGroupStatus.value, async (newStatus) => {
  if (newStatus === 'success' && extensionGroup.value?.total) {
    const firstExtensionGroup = extensionGroup.value.data[0]
    toggledGroup.value = firstExtensionGroup

    await navigateTo({
      query: {
        ...route.query,
        id: firstExtensionGroup.id,
      },
    })
    // await until(groupIdQuery).toBe(String(firstExtensionGroup.id))

    await refreshExtensionDataByGroupId()
    // console.log(route.query?.id)

    selectedExtensions.value = extensionDataByGroupId?.value?.map((item: any) => ({
      first_name: item.first_name,
      last_name: item.last_name,
      extension: item.extension,
    })) as Extension[]
  }
})

watch(() => extensionDataStatus.value, (newStatus) => {
  if (newStatus === 'success') {
    selectedExtensions.value = extensionDataByGroupId?.value?.map((item: any) => ({
      first_name: item.first_name,
      last_name: item.last_name,
      extension: item.extension,
    })) as Extension[]
  }
})
</script>

<template>
  <ResizablePanelGroup
    id="handle-demo-group-1"
    direction="horizontal"
    class="h-full max-h-[calc(100vh-225px)] rounded-lg border mt-4"
  >
    <!-- LEFT PANEL: Groups List -->
    <ResizablePanel
      id="handle-demo-panel-1"
      class="bg-primary p-[18px]"
      :default-size="25"
      :min-size="16"
    >
      <div class="relative">
        <Input
          v-model="searchField"
          class="bg-white h-11"
          placeholder="Search Groups"
          @update:model-value="searchGroup"
        />
        <Icon
          class="absolute text-gray-900 top-1/2 right-3 -translate-y-1/2 text-xl"
          name="material-symbols:search"
        />
      </div>

      <Separator class="my-2 bg-[#FFFFFF1A]" />

      <ScrollArea class="h-[calc(100vh-200px)] pb-[110px]">
        <UserManagementGroupResizablePanelsGroupTabs
          v-model="toggledGroup"
          :loading="extensionGroupStatus === 'pending'"
          :extension-group="extensionGroup?.data"
          @update:model-value="onSelectGroup"
          @on-delete="deleteGroup"
          @on-rename="renameGroup"
        />
      </ScrollArea>
    </ResizablePanel>

    <ResizableHandle id="handle-demo-handle-1" with-handle />

    <!-- RIGHT PANEL: Extensions List -->
    <ResizablePanel
      id="handle-demo-panel-2"
      :default-size="75"
      :min-size="50"
    >
      <div class="px-[12px] py-[14px] flex justify-between items-center">
        <div class="font-medium text-[16px]">
          {{ toggledGroup?.title }}
        </div>

        <div class="flex gap-x-2">
          <!-- TODO:need to add search functionality when API(extension-group-map) is ready -->
          <!-- <BaseInputSearch v-model="search" class="w-full mt-1" placeholder="Search" @update:model-value="searchText" /> -->

          <UserManagementGroupAddExtension
            v-model="addExtensionSheet"
            v-model:selected-extensions="selectedExtensions"

            @submit="addExtension"
          />
        </div>
      </div>

      <div class="max-h-[calc(100vh-200px)] pb-[72px] h-full overflow-y-auto">
        <UserManagementGroupTable
          :list="extensionDataByGroupId"
          :loading="extensionDataStatus === 'pending' || extensionGroupStatus === 'pending'"
          @refresh="refreshExtensionDataByGroupId"
        />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>

  <!-- PAGINATION -->
  <div class="flex items-center justify-end space-x-2 pt-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ start + 1 }} to

        <span>
          <Select
            :default-value="10"
            :model-value="limit"
            @update:model-value="(val) => changeLimit(Number(val))"
          >
            <SelectTrigger class="w-fit gap-x-1 px-2">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in [5, 10, 20, 30, 40, 50]" :key="n" :value="n">
                {{ n }}
              </SelectItem>
            </SelectContent>
          </Select>
        </span>

        of {{ total }} entries
      </div>
    </div>

    <div class="space-x-2">
      <TableServerPagination
        :total-items="Number(total)"
        :current-page="Number(current_page)"
        :items-per-page="Number(per_page)"
        :last-page="Number(last_page)"
        @page-change="handlePageChange"
      />
    </div>
  </div>

  <!-- CONFIRM DELETE DIALOG -->
  <ConfirmAction
    v-model="showDeleteConfirm"
    :confirm="deleteConfirm"
    :cancel="deleteCancel"
    title="Delete Extension Group"
    description="You are about to delete extension group. Do you wish to proceed?"
  />
</template>

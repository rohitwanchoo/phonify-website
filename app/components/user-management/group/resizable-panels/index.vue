<script setup lang="ts">
import { useConfirmDialog, useDebounceFn } from '@vueuse/core'
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

// ==================== STATE ====================
// Search and Pagination
const searchField = ref('')
const limit = ref(10)
const start = ref(0)

// UI State
const addExtensionSheet = ref(false)
const toggledGroup = ref<{ id: string, title: string, count: number, status: number }>()
const selectedGroup = ref({})
const selectedExtensions = ref<any>([])

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
} = await useLazyAsyncData('extension-list-by-group-id', () =>
  useApi().get(`/extension-group-map?group_id=${toggledGroup.value?.id}`, {}), {
  transform: res => res.data,
  immediate: false,
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
function onSelectGroup() {
  refreshExtensionDataByGroupId()
}

async function deleteGroup(group: Group) {
  selectedGroup.value = group
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled) {
    return false
  }
  try {
    const response = await useApi().delete(`extension-group/${group.id}`)
    showToast({ message: response.message })
    refreshExtensionGroup()
  }
  catch (error) {
    showToast({
      message: (error as any)?.message || 'Failed to delete extension group',
      type: 'error',
    })
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
    extensions: selectedExtensions.value.map((item: any) => item.extension),
  }).then((res: any) => {
    showToast({
      type: 'success',
      message: res.message,
    })
    addExtensionSheet.value = false
    refreshNuxtData('extension-list-by-group-id')
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

    const id = route.query.id
    if (!id) {
      await navigateTo({
        query: {
          ...route.query,
          id: firstExtensionGroup.id,
        },
      })
    }
    else {
      await router.push({
        query: { id },
      })
    }

    await refreshNuxtData('extension-list-by-group-id')
    const { data: extensions } = useNuxtData('extension-list-by-group-id')
    selectedExtensions.value = extensions.value.map((item: any) => ({
      first_name: item.first_name,
      last_name: item.last_name,
      extension: item.extension,
    }))
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
          <!-- TO DO: need to add search functionality when API(extension-group-map) is ready -->
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
              <SelectItem v-for="n in [5,10,20,30,40,50]" :key="n" :value="n">
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

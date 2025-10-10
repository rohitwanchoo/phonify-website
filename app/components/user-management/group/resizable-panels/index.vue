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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import { Button } from '~/components/ui/button'

import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import Actions from '../Actions.vue'

interface Group {
  id: number
  title: string
  count: number
}

// const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits(['refresh', 'onRename'])

const route = useRoute()
const router = useRouter()
const searchField = ref('')

const { data: extensionGroup, status: extensionGroupStatus, refresh: refreshExtensionGroup } = await useLazyAsyncData('extension-group-list', () =>
  useApi().get('extension-group', {
    params: {
      search: searchField.value,
    }
  }), {
  transform: (res) => {
    return res.data
  },
})

// watch extensionGroup status
watch(() => extensionGroupStatus.value, async (newStatus) => {
  if (newStatus === 'success' && extensionGroup.value?.length) {
    const firstExtensionGroup = extensionGroup.value[0]
    toggledGroup.value = firstExtensionGroup
    // add route query as the first element id
    const id = route.query.id 
    if (!id) {
     await navigateTo({
        query: {
          ...route.query,
          id: firstExtensionGroup.id,
        },
      })
    }else{
     await router.push({
        query: {
          id: id,
        },
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
export interface Extension {
  siNo?: number
  extension: string
  name: string
  email: string
  phoneNumber: string
  webPhone: string
  actions?: string

}
const addExtensionSheet = ref(false)
const selectedExtensions = ref<any>([])

interface Meta {
  current_page: number
  per_page: number
  last_page: number
  total: number
}
const meta: Meta = {
  current_page: 1,
  per_page: 20,
  last_page: 1,
  total: 20,
}

const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const toggledGroup = ref<{ id: string, title: string, count: number, status: number }>()
const selectedGroup = ref({})

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

// const route = useRoute()
// const id = route.params.id

// TODO: need to integrate extension list by group id

const { data: extensionByGroupId, status, refresh } = await useLazyAsyncData('extension-list-by-group-id', () =>
  useApi().get(`/extension-group-map?group_id=${route.query.id}`, {
  }), {
  transform: (res) => {
    return res.data
  },
  immediate: false,
})

// watch(() => route.query.id, (id) => {
//   refresh()
// })

function onSelectGroup() {
  refresh()
}


const debouncedSearch = useDebounceFn(() => {
refreshExtensionGroup()
}, 1000, { maxWait: 5000 })


function searchGroup() {
  debouncedSearch()
}

function addExtension(){
  useApi().patch('/extension-group-update', {
    group_id: toggledGroup.value?.id,
    title:toggledGroup.value?.title,
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

function renameGroup(val: any){
 emits('onRename', val)
}
</script>

<template>
  <ResizablePanelGroup
    id="handle-demo-group-1"
    direction="horizontal"
    class="h-full rounded-lg border mt-4"
  >
    <ResizablePanel id="handle-demo-panel-1" class="bg-primary p-[18px] " :default-size="25" :min-size="16">
      <div class="relative">
        <Input class="bg-white h-11" v-model="searchField" @update:model-value="searchGroup" placeholder="Search Groups" />
        <Icon name="lucide:search" class="absolute text-gray-900 top-1/2 right-3 -translate-y-1/2" />
      </div>
      <Separator class="my-2 bg-[#FFFFFF1A]" />
      <ScrollArea class="h-[calc(100vh-280px)]">
        <UserManagementGroupResizablePanelsGroupTabs v-model="toggledGroup" @update:model-value="onSelectGroup" :loading="extensionGroupStatus === 'pending'" :extension-group="extensionGroup" @on-delete="deleteGroup" @on-rename="renameGroup" />
      </ScrollArea>
    </ResizablePanel>
    <ResizableHandle id="handle-demo-handle-1" with-handle />
    <ResizablePanel id="handle-demo-panel-2" :default-size="75" :min-size="50">
      <div class="px-[12px] py-[14px] flex justify-between items-center">
        <div class="font-medium text-[16px]">
          {{ toggledGroup?.title }}
        </div>
        <div class="flex gap-x-2">
          <div class="relative">
            <Input placeholder="Search List" class="h-11 w-[250px]" />
            <Icon name="lucide:search" class="absolute text-gray-900 top-1/2 right-3 -translate-y-1/2" />
          </div>
          <UserManagementGroupAddExtension
            v-model="addExtensionSheet"
            v-model:selected-extensions="selectedExtensions"
            @submit="addExtension"
          />
        </div>
      </div>
      <div class="max-h-[calc(100vh-280px)] h-full overflow-y-auto">
        <UserManagementGroupTable :list="extensionByGroupId" :loading="status === 'pending' || extensionGroupStatus === 'pending'" :meta="meta" />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>

  <div class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
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
      <TableServerPagination
        :total-items="Number(meta?.total)" :current-page="Number(meta?.current_page)"
        :items-per-page="Number(meta?.per_page)" :last-page="Number(meta?.last_page)"
      />
    </div>
  </div>

  <!-- CONFIRM DELETE -->
  <ConfirmAction v-model="showDeleteConfirm" :confirm="deleteConfirm" :cancel="deleteCancel" title="Delete Extension Group" description="You are about to delete extension group. Do you wish to proceed?" />
</template>

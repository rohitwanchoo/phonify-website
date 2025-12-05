<script setup lang="ts">
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { ConfigurationAiPromptsActions, Icon } from '#components'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { useConfirmDialog } from '@vueuse/core'

import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { valueUpdater } from '@/components/ui/table/utils'

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})

// Computed pagination variables
const emits = defineEmits(['pageNavigation', 'refresh', 'changeLimit', 'onEdit'])

const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

const router = useRouter()

const openSheet = ref(false)
const selectedPromptData = ref()

// Interface for each row in the list
export interface promptList {
  title: string
  voice_name: string
  description: string
  id: number
}

// Confirmation dialog for deleting
const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const selectedListForDelete = ref<any | null>(null)

// Function to handle deleting a list
async function handleDelete() {
  if (!selectedListForDelete.value?.id)
    return

  try {
    const res = await useApi().post(`/prompts/delete/${selectedListForDelete.value?.id}`, {
      title: selectedListForDelete.value?.title,
      description: selectedListForDelete.value?.description,
      initial_greeting: selectedListForDelete.value?.initial_greeting,
      voice_name: selectedListForDelete.value?.voice_name,
    })

    if (res?.success === true) {
      showToast({
        message: res.message,
        type: 'success',
      })
      emits('refresh')
    }
    else {
      showToast({
        message: res.message,
        type: 'error',
      })
    }
  }
  catch (err: any) {
    showToast({
      message: `${err.message}`,
      type: 'error',
    })
  }
  finally {
    selectedListForDelete.value = null
  }
}

function viewPromptDetails(sheet: boolean, data: any) {
  openSheet.value = sheet
  selectedPromptData.value = data
}

// Pagination handlers
function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number | null) {
  if (val !== null) {
    emits('changeLimit', val)
  }
}

// Deletes list after confirming
function deleteConfirmHandler() {
  deleteConfirm() // close dialog
  handleDelete() // now delete safely
}

// Define table columns using Tanstack's column helper
const columnHelper = createColumnHelper<promptList>()
const columns = [
  // Serial number column
  columnHelper.display({
    id: 'slNo',
    header: () => h('div', { class: 'text-center w-full' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, props.start + row.index + 1),
  }),
  // Title column with sorting
  columnHelper.accessor('title', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Title', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.title || '-'),
  }),
  // Voice name
  columnHelper.accessor('voice_name', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Voice', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.voice_name || '-'),
  }),
  // Description
  columnHelper.accessor('description', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Description', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full max-w-[580px] truncate' }, row.original.description || '-'),
  }),
  // Actions: View, Edit, Download, Delete
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center w-full' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-center pr-3 w-full' }, [
      h(Button, {
        size: 'sm',
        variant: 'outline',
        color: 'primary',
        class: 'cursor-pointer flex items-center gap-x-1 border border-primary',
        onClick: () => {
          viewPromptDetails(true, row.original)
        },
      }, [
        h(Icon, { name: 'material-symbols:visibility', color: 'primary' }),
        'View',
      ]),
      h(ConfigurationAiPromptsActions, {
        onEdit: () => {
          router.push({
            path: `/app/configuration/ai-prompts/edit`,
            query: { id: row.original.id },
          })
        },
        onDelete: () => {
          selectedListForDelete.value = row.original
          revealDeleteConfirm()
        },
      }),
    ]),
  }),
]
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

// Initialize table with manual pagination
const table = useVueTable({
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  manualPagination: true,
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})
</script>

<template>
  <div class="border rounded-lg my-6 overflow-x-auto max-h-[calc(100vh-270px)] overflow-y-auto">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="bg-gray-50"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell :colspan="columns?.length" class="h-12 text-center px-2 bg-white">
            <BaseSkelton v-for="i in 9" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
          </TableCell>
        </TableRow>
        <template v-else-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="p-[12px]"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell
            :colspan="columns.length"
            class="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div v-if="totalRows && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing

        <span>
          <Select :default-value="10" :model-value="limit" @update:model-value="(val) => changeLimit(Number(val))">
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

        of {{ totalRows }} entries
      </div>
    </div>
    <div class="space-x-2">
      <!-- Pagination Controls -->
      <TableServerPagination
        :total-items="Number(total)" :current-page="Number(current_page)"
        :items-per-page="Number(per_page)" :last-page="Number(last_page)" @page-change="handlePageChange"
      />
    </div>
  </div>

  <!-- Details Sheet -->
  <ConfigurationAiPromptsDetails v-model:open="openSheet" :data="selectedPromptData" />

  <!-- CONFIRM DELETE -->
  <ConfirmAction
    v-model="showDeleteConfirm"
    :confirm="deleteConfirmHandler"
    :cancel="deleteCancel"
    title="Delete AI Prompt"
    description="You are about to delete this AI Prompt. Do you wish to proceed?"
  />
</template>

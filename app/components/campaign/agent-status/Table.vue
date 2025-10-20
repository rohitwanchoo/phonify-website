<script setup lang="ts">
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { Icon } from '#components'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})
const emits = defineEmits(['pageNavigation', 'refresh', 'changeLimit', 'edit'])
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const selectedExtensionForDelete = ref<number | null>(null)

async function handleDelete() {
  if (!selectedExtensionForDelete.value)
    return

  try {
    const res = await useApi().post('/delete-ext-live', {
      extension: selectedExtensionForDelete.value,
    })

    if (res?.success === 'true') {
      showToast({
        type: 'success',
        message: res.message,
      })
      emits('refresh') // properly emit refresh
    }
    else {
      showToast({
        type: 'error',
        message: res.message,
      })
    }
  }
  catch (err: any) {
    showToast({
      type: 'error',
      message: `${err.message}`,
    })
  }
  finally {
    selectedExtensionForDelete.value = null
  }
}

export interface agentStatusList {
  index: number
  full_name: string
  extension: number
  title: string
  lead_id: number
  status: number
  actions?: string
}

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number | null) {
  if (val !== null) {
    emits('changeLimit', val)
  }
}

function deleteConfirmHandler() {
  deleteConfirm() // close dialog
  handleDelete() // now delete safely
}

const columnHelper = createColumnHelper<agentStatusList>()
const columns = [
  columnHelper.accessor('index', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, props.start + row.index + 1)
    },
  }),

  columnHelper.accessor('full_name', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, { class: 'text-center text-sm font-normal', variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('full_name'))
    },
  }),
  columnHelper.accessor('extension', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Extension', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('extension'))
    },
  }),

  columnHelper.accessor('title', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Campaign', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('title'))
    },
  }),

  columnHelper.accessor('lead_id', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Lead Id', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('lead_id'))
    },
  }),

  // Status
  columnHelper.accessor('status', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),

    cell: ({ row }) => {
      const statusMap: Record<number, string> = {
        0: 'Ready For Calls',
        1: 'In Call',
        2: 'Hangup',
        3: 'Pause',
      }

      const statusText = statusMap[row.original.status]

      return h('div', { class: 'flex justify-center' }, h('span', { class: 'text-sm font-normal text-center' }, statusText),
      )
    },
  }),

  columnHelper.accessor('actions', {
    header: () => h('div', { class: 'text-center ml-auto w-fit' }, 'Actions'),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-center' }, [
        // Delete button with tooltip
        h(TooltipProvider, { delayDuration: 1000 }, () =>
          h(Tooltip, null, {
            default: () => [
              h(TooltipTrigger, { asChild: true }, h(Button, {
                size: 'icon',
                variant: 'outline',
                class: 'cursor-pointer border-red-600 text-red-600 hover:text-red-600/80',
                onClick: () => {
                  selectedExtensionForDelete.value = row.original.extension
                  revealDeleteConfirm()
                },
              }, h(Icon, { name: 'material-symbols:delete' }))),
              h(TooltipContent, { side: 'top' }, 'Delete Extension'),
            ],
          })),
      ]),
  }),

]
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

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
  initialState: { pagination: { pageSize: props.limit } },
  manualPagination: true,
  pageCount: last_page.value,
  rowCount: total.value,
  state: {
    pagination: {
      pageIndex: current_page.value,
      pageSize: per_page.value,
    },
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})
</script>

<template>
  <div class="border rounded-lg my-6 overflow-x-auto">
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
              <SelectItem v-for="n in [5,10,20,30,40,50]" :key="n" :value="n">
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

  <!-- CONFIRM DELETE -->
  <ConfirmAction
    v-model="showDeleteConfirm"
    :confirm="deleteConfirmHandler"
    :cancel="deleteCancel"
    title="Delete Agent Status"
    description="You are about to delete this agent status. Do you wish to proceed?"
  />
</template>

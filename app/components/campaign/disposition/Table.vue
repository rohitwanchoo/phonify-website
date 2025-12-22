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
import { Switch } from '@/components/ui/switch'
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

function dispositionType(type: string) {
  switch (type) {
    case '1':
      return 'Status'
    case '2':
      return 'Do Not Call'
    case '3':
      return 'Callback'
    default:
      return ''
  }
}

const selectedDispositionForDelete = ref<number | null>(null)

async function handleDelete() {
  if (!selectedDispositionForDelete.value)
    return

  try {
    const res = await useApi().post('/edit-disposition', {
      disposition_id: selectedDispositionForDelete.value,
      is_deleted: 1,
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
    selectedDispositionForDelete.value = null
  }
}

export interface dispositionList {
  id: number
  title: string
  d_type: string
  status: number
  enable_sms: number
  actions?: string
}

const updateStatusLoading = ref(false)
const selectedRowId = ref<number | null>(null)

async function updateStatus(id: number, status: number) {
  try {
    selectedRowId.value = id
    updateStatusLoading.value = true
    const res = await useApi().post('/status-update-disposition', {
      listId: id,
      status,
    })

    if (res.success === 'true') {
      showToast({
        message: res.message,
        type: 'success',
      })
      refreshNuxtData('get-disposition-list')
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
    updateStatusLoading.value = false
    selectedRowId.value = null
  }
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

const columnHelper = createColumnHelper<dispositionList>()
const columns = [
  columnHelper.accessor('id', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, props.start + row.index + 1)
    },
  }),

  columnHelper.accessor('title', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, { class: 'text-center text-sm font-normal', variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('title') || '-')
    },
  }),
  columnHelper.accessor('d_type', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Type', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, dispositionType(row.getValue('d_type')) || '-')
    },
  }),

  columnHelper.accessor('enable_sms', {
    header: () =>
      h('div', { class: 'text-center text-sm font-normal' }, 'Enable SMS'),
    cell: ({ row }) => {
      const enable_sms = row.original.enable_sms === 1 ? 'Yes' : 'No'
      return h('div', { class: `text-center font-normal text-sm py-0.5 ${enable_sms === 'Yes' ? 'text-green-600 bg-green-600 text-white w-[80px] mx-auto px-2 rounded-full' : 'text-red-600 bg-red-600 text-white w-[80px] mx-auto px-2 rounded-full'}` }, enable_sms || '-')
    },
  }),

  columnHelper.accessor('status', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal leading-[9px] text-sm w-full' }, h(Switch, {
        'class': 'data-[state=checked]:bg-green-600 cursor-pointer',
        'modelValue': row.original.status === 1,
        'disabled': updateStatusLoading.value && selectedRowId.value === row.original.id,
        'onUpdate:modelValue': (val: boolean) => {
          updateStatus(row.original.id, val ? 1 : 0)
        },
      })),
  }),

  columnHelper.accessor('actions', {
    header: () => h('div', { class: 'text-center ml-auto w-fit mr-8' }, 'Actions'),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [

        // Edit button with tooltip
        h(TooltipProvider, { delayDuration: 1000 }, () =>
          h(Tooltip, null, {
            default: () => [
              h(TooltipTrigger, { asChild: true }, h(Button, {
                size: 'icon',
                variant: 'outline',
                class: 'cursor-pointer',
                onClick: () => emits('edit', row.original),
              }, h(Icon, { name: 'material-symbols:edit-square' }))),
              h(TooltipContent, { side: 'top' }, 'Edit Disposition'),
            ],
          })),

        // Delete button with tooltip
        h(TooltipProvider, { delayDuration: 1000 }, () =>
          h(Tooltip, null, {
            default: () => [
              h(TooltipTrigger, { asChild: true }, h(Button, {
                size: 'icon',
                variant: 'outline',
                class: 'cursor-pointer border-red-600 text-red-600 hover:text-red-600/80',
                onClick: () => {
                  selectedDispositionForDelete.value = row.original.id
                  revealDeleteConfirm()
                },
              }, h(Icon, { name: 'material-symbols:delete' }))),
              h(TooltipContent, { side: 'top' }, 'Delete Disposition'),
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

  <!-- CONFIRM DELETE -->
  <ConfirmAction
    v-model="showDeleteConfirm"
    :confirm="deleteConfirmHandler"
    :cancel="deleteCancel"
    title="Delete Disposition"
    description="You are about to delete this disposition. Do you wish to proceed?"
  />
</template>

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

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})

const emits = defineEmits(['pageNavigation', 'changeLimit', 'edit'])
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

async function handleDelete(id: number) {
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled) {
    return false
  }
  try {
    const res = await useApi().post('/delete-ring-group', {
      ring_id: id,
    })

    if (res.success === 'true') {
      showToast({
        message: res.message,
        type: 'success',
      })
      refreshNuxtData('ring-group-list')
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
}

interface GroupList {
  id: number
  title: string
  description: string
  number_of_extension: string
  emails: string
  actions: string
  extension_count: number
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

function deleteConfirmHandler() {
  deleteConfirm() // close dialog
  handleDelete() // now delete safely
}

const columnHelper = createColumnHelper<GroupList>()

const columns = [
  columnHelper.accessor('#', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('title', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.title),
  }),

  columnHelper.accessor('description', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Description'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center justify-center gap-2 text-sm font-normal' }, row.original.description),
  }),

  columnHelper.accessor('extension_count', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['No. of Extension', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center gap-1 text-sm font-normal' }, [
      row.original.extension_count,
      h(Icon, { name: 'material-symbols:visibility-outline', class: 'h-5 w-5 cursor-pointer' }),
    ]),
  }),

  columnHelper.accessor('emails', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Email'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.emails),
  }),

  columnHelper.accessor('actions', {
    header: () => h('div', { class: 'text-center ml-auto w-fit mr-8' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
      h(Button, { size: 'icon', variant: 'outline', class: 'cursor-pointer', onClick: () => emits('edit', row.original) }, h(Icon, { name: 'material-symbols:edit-square' })),
      h(Button, { size: 'icon', variant: 'outline', class: 'cursor-pointer border-red-600 text-red-600 hover:text-red-600/80', onClick: () => handleDelete(row.original.id) }, h(Icon, { name: 'material-symbols:delete' })),

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
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers" :key="header.id"
            class="bg-gray-50"
          >
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
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
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <TableRow :data-state="row.getIsSelected() && 'selected'">
              <TableCell
                v-for="cell in row.getVisibleCells()" :key="cell.id"
                class="p-[12px]"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
            <TableRow v-if="row.getIsExpanded()">
              <TableCell :colspan="row.getAllCells().length">
                {{ JSON.stringify(row.original) }}
              </TableCell>
            </TableRow>
          </template>
        </template>

        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div v-if="totalRows && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ current_page }} to
        <span>
          <Select :default-value="10" :model-value="limit" @update:model-value="(val) => changeLimit(Number(val))">
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
  <ConfirmAction v-model="showDeleteConfirm" :confirm="deleteConfirm" :cancel="deleteCancel" title="Delete Group List" description="You are about to delete group list. Do you wish to proceed?" />
</template>

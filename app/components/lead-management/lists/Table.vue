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

// import { useConfirmDialog } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'

import moment from 'moment'
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
import { cn } from '@/lib/utils'
import LeadManagementListsActionsDropdown from './ActionsDropdown.vue'

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})

const emits = defineEmits(['pageNavigation', 'refresh', 'changeLimit'])
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

export interface leadList {
  campaign: string
  list: string
  list_id: string
  updated_at: string
  is_active: number
  rowListData: number
}

const columnHelper = createColumnHelper<leadList>()

const columns = [
  columnHelper.display({
    id: 'slNo',
    header: () => h('div', { class: 'text-center w-full' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, props.start + row.index + 1),
  }),
  columnHelper.accessor('list', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['List Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.list),
  }),
  columnHelper.accessor('campaign', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Campaign Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.campaign),
  }),
  columnHelper.accessor('rowListData', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Total Leads', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.rowListData),
  }),
  columnHelper.accessor('updated_at', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Created Date', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      const date = row.original.updated_at
      return h('div', { class: 'text-center font-normal text-sm w-full' }, date ? moment(date).format('DD/MM/YYYY hh:mm A') : '')
    },
  }),
  columnHelper.accessor('is_active', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal leading-[9px] text-sm w-full' }, h(Switch, {
        'class': 'data-[state=checked]:bg-green-600 cursor-pointer',
        'modelValue': row.original.is_active === 1,
        'onUpdate:modelValue': (val: boolean) => {
          row.original.is_active = val ? 1 : 0
        },
      })),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center w-full' }, 'Actions'),
    cell: () => h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-center pr-3 w-full' }, [
      h(Button, {
        size: 'sm',
        variant: 'outline',
        color: 'primary',
        class: 'cursor-pointer flex items-center gap-x-1 border border-primary',
        onClick: () => {
          navigateTo('/app/lead-management/list/leads')
        },
      }, [
        h(Icon, { name: 'material-symbols:visibility', color: 'primary' }),
        'View Leads',
      ]),
      h(LeadManagementListsActionsDropdown, {
        // Pass the row context if needed for actions
        onEdit: () => { console.log('Edit', row.original) },
        onDownload: () => { console.log('Download', row.original) },
        onDelete: () => { console.log('Delete', row.original) },
      }),
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
    columnPinning: {
      left: ['status'],
    },
  },
})

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number | null) {
  if (val !== null) {
    emits('changeLimit', val)
  }
}
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
</template>

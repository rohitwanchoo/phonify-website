<script setup lang="ts">
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronsUpDown, Download } from 'lucide-vue-next'
import moment from 'moment'
import { computed, h, ref } from 'vue'
import { Button } from '@/components/ui/button'
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

// Initialize dummyData with empty array first
const dummyData = ref<any[]>([])

// Then populate it with your data
dummyData.value = [
  { id: 'FAX-00345', sender: 'FAX-002', inboundFax: '(333) 111-2222', date: '2023-04-22'},
  { id: 'FAX-004', sender: '(333) 333-4444', inboundFax: '(555) 234-5678', date: '2023-04-22'},
  { id: 'FAX-006', sender: '(333) 555-6666', inboundFax: '(555) 343-6789', date: '2023-05-30' },
  { id: 'FAX-008', sender: '(333) 777-8888', inboundFax: '(555) 012-3456', date: '2023-06-14'},
  { id: 'FAX-0062', sender: '(333) 999-0000', inboundFax: '(555) 466-7890', date: '2023-07-19'},
]

const columnHelper = createColumnHelper<any>()
    const columns = [
  columnHelper.display({
    id: 'siNo',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['#', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('sender', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Sender', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.sender),
  }),

  columnHelper.accessor('inboundFax', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Inbound Fax No', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.inboundFax),
  }),

  columnHelper.accessor('date', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Date', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, moment(row.original.date).format('MMMM D, YYYY')),
  }),

  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Action'),
    cell: () => h('div', { class: 'flex justify-center' },
      h(Button, { variant: 'ghost', class: 'p-2' }, () => h(Download, { class: 'h-4 w-4' }))
    ),
  }),
]


const columnCount = computed(() => columns.length)
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return dummyData.value || [] }, // Fallback to empty array
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
  },
})
</script>

<template>
  <div class="border-0 rounded-lg my-0 overflow-hidden">
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
        <TableRow v-if="!dummyData.length">
          <TableCell :colspan="columnCount" class="text-center">No data available.</TableCell>
        </TableRow>
        <template v-else>
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-3">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
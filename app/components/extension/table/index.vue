<script setup lang="ts">
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { Icon } from '#components'
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

import { ChevronsUpDown, Copy } from 'lucide-vue-next'

import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

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

export interface Extension {
  siNo?: number
  extension: number
  secret: string
  name: string
  email: string
  phoneNumber: number
  actions?: string
}

const sheet = ref(false)

const data = ref<Extension[]>([
  {
    extension: 123456,
    secret: '********',
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: 1234567890,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
])

const columnHelper = createColumnHelper<Extension>()

const columns = [
  columnHelper.accessor('siNo', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('extension', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Extension', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.getValue('extension')),
  }),

  columnHelper.accessor('secret', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Secret'),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'flex items-center justify-center gap-2 text-sm font-normal' },
        [
          h('span', row.getValue('secret')),
          h(Copy, { class: 'w-4 h-4 text-gray-500 cursor-pointer' }), // Copy icon
        ],
      ),
  }),

  columnHelper.accessor('name', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Name'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.getValue('name')),
  }),

  columnHelper.accessor('email', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Email'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.getValue('email')),
  }),

  columnHelper.accessor('phoneNumber', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Phone Number'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.getValue('phoneNumber')),
  }),

  columnHelper.accessor('actions', {
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
      h(Button, { size: 'icon', class: 'cursor-pointer', onClick: () => sheet.value = true }, h(Icon, { name: 'lucide:eye' })),
      h(Button, { size: 'icon', variant: 'ghost', class: 'cursor-pointer' }, h(Icon, { name: 'lucide:ellipsis-vertical', size: '20' })),
    ]),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
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
        <template v-if="table.getRowModel().rows?.length">
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

  <CampaignTableSheet v-model:open="sheet" />
</template>

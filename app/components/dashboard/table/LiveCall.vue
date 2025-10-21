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
import { ChevronsUpDown } from 'lucide-vue-next'

import { h, ref } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

const props = defineProps<Props>()

const StatusClass = (status: string) => status === 'Active' ? 'bg-green-600' : 'bg-red-600'

export interface LiveCall {
  extension: string
  type: string
}

interface Props {
  list: LiveCall[]
  loading?: boolean
}

// const data: Payment[] = [
//   {
//     name: 'John Doe',
//     phone: '(319) 555-0115',
//     userStatus: 'Active',
//     email: 'ken99@yahoo.com',
//   },
//   {
//     name: 'Jane Doe',
//     phone: '(212) 555-0176',
//     userStatus: 'Inactive',
//     email: 'Abe45@gmail.com',
//   },
//   {
//     name: 'wade wilson',
//     phone: '(212) 555-0176',
//     userStatus: 'Active',
//     email: 'Monserrat44@gmail.com',
//   },
//   {
//     name: 'Bobby Brown',
//     phone: '(212) 555-0176',
//     userStatus: 'Active',
//     email: 'Silas22@gmail.com',
//   },
//   {
//     name: 'Mason Miller',
//     phone: '(212) 555-0176',
//     userStatus: 'Active',
//     email: 'carmella@hotmail.com',
//   },
// ]

const columnHelper = createColumnHelper<LiveCall>()

const columns = [

  columnHelper.accessor('extension', {
    header: () => h('div', { class: 'text-center' }, 'Phone'),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal' }, formatNumber(String(row.original.extension)) || '-')
    },
  }),

  columnHelper.accessor('type', {
    header: ({ column }) => {
      return h('div', { class: 'text-right' }, h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Call Type', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center capitalize' }, row.original.type || '-')
      // return h('div', { class: 'text-right font-normal mr-2 text-sm' }, h('div', { class: `rounded-full w-[83px] ml-auto h-[30px] text-white text-[14px] flex items-center justify-center  ${StatusClass(row.original.userStatus)}` }, row.getValue('userStatus'),
      // ))
    },
  }),

]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return props.list || [] },
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
    columnPinning: {
      left: ['status'],
    },
  },
})
</script>

<template>
  <div class="border p-6 rounded-lg lg:h-full">
    <div class="text-[#121E3D] font-normal flex justify-between mb-2">
      <div class="text-[18px]">
        Live Call
      </div>
      <div class="text-sm">
        Total Live Call : {{ table.getRowModel().rows?.length || 0 }}
      </div>
    </div>
    <div class="w-full">
      <div class="">
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
                <BaseSkelton v-for="i in 6" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
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
    </div>
  </div>
</template>

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

import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import moment from 'moment'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

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

const props = defineProps({
  list: Array, // Raw list of campaigns from the API response
  meta: Object, // Pagination metadata
  loading: Boolean, // Loading state
})

const emits = defineEmits(['pageNavigation', 'refresh'])

const sheet = ref(false)

const columnHelper = createColumnHelper()

const columns = [
  columnHelper.accessor('id', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('id'))
    },
  }),
  columnHelper.accessor('title', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, { class: 'text-center text-sm font-normal', variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('title'))
    },
  }),
  columnHelper.accessor('call_time_start', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Call Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      const start = row.original.call_time_start
      const end = row.original.call_time_end
      return h('div', { class: 'lowercase text-center text-sm' }, start && end ? `${moment(start, 'HH:mm:ss').format('hh:mm A')} - ${moment(end, 'HH:mm:ss').format('hh:mm A')}` : 'No Data')
    },
  }),
  columnHelper.accessor('group_id', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'List'),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('group_id'))
    },
  }),
  columnHelper.accessor('min_lead_temp', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Dialed/Total leads', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      const min = row.original.min_lead_temp // Access the raw data directly
      const max = row.original.max_lead_temp // Access the raw data directly
      return h('div', { class: 'text-center font-normal text-center text-sm' }, min !== null && max !== null ? `${min}/${max}` : 'No Data')
    },
  }),
  columnHelper.accessor('updated', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Date', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      const updated = row.original.updated
      const date = moment(updated, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
      const time = moment(updated, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A')
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, [
        h('div', date),
        h('br'),
        h('div', { class: 'text-xs' }, time),
      ])
    },
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => {
      return h('div', { class: 'text-center ' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, h(Switch, { 'class': 'data-[state=checked]:bg-green-600 cursor-pointer', 'modelValue': row.getValue('status') === 1, 'onUpdate:modelValue': (val: boolean) => {
        props.list[row.index].status = val ? 1 : 0
      } }))
    },
  }),
  columnHelper.accessor('actions', {
    header: () => {
      return h('div', { class: 'text-center' }, 'Actions')
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
        h(Button, { size: 'icon', class: 'cursor-pointer', onClick: () => sheet.value = true }, h(Icon, { name: 'lucide:eye' })),
        h(Button, { size: 'icon', variant: 'ghost', class: 'cursor-pointer' }, h(Icon, { name: 'lucide:ellipsis-vertical', size: '20' })),
      ])
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
    // columnPinning: {
    //   left: ['status'],
    // },
  },
})

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table v-if="loading">
      <TableBody>
        <TableRow>
          <TableCell :colspan="columns?.length" class="h-12 text-center px-2 bg-white">
            <BaseSkelton v-for="i in 9" :key="i" class="h-10 w-full mb-2 rounded-sm animate-pulse" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Table v-else-if="list?.length">
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers" :key="header.id" :data-pinned="header.column.getIsPinned()"
            class="bg-gray-50"
            :class="cn(
              { 'sticky bg-background/95': header.column.getIsPinned() },
              header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
            )"
          >
            <FlexRender v-if="!header.isPlaceholder" class="" :render="header.column.columnDef.header" :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-for="row in table.getRowModel().rows" :key="row.id">
          <TableRow :data-state="row.getIsSelected() && 'selected'">
            <TableCell
              v-for="cell in row.getVisibleCells()" :key="cell.id" :data-pinned="cell.column.getIsPinned()"
              class="p-[12px]"
              :class="cn(
                { 'sticky bg-background/95': cell.column.getIsPinned() },
                cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
              )"
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
      </TableBody>
    </Table>

    <div v-else class="text-center py-4">
      No results.
    </div>
  </div>

  <div v-if="list?.length && !loading" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ table.getState().pagination.pageIndex + 1 }} to

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

        of {{ list.length }} entries
      </div>
    </div>
    <div class="space-x-2">
      <TableServerPagination
        :total-items="list.length" :current-page="table.getState().pagination.pageIndex + 1"
        :items-per-page="table.getState().pagination.pageSize" :last-page="Math.ceil(list.length / table.getState().pagination.pageSize)" @page-change="handlePageChange"
      />
    </div>
  </div>

  <CampaignTableSheet v-model:open="sheet" />
</template>

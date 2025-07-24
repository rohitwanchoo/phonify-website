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
import { ChevronsUpDown, MoreVertical } from 'lucide-vue-next'
import moment from 'moment'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { valueUpdater } from '@/components/ui/table/utils'
import { cn } from '@/lib/utils'

const loading = ref(false)

interface CallRecord {
  id: number
  agent: string
  extension: string
  number: string
  route: string
  campaign: string
  callType: 'Inbound' | 'Outbound' | 'Missed' | 'Voicemail'
  startTime: string
  duration: number
}

const dummyData = ref<CallRecord[]>([
  {
    id: 1,
    agent: 'John Doe',
    extension: '101',
    number: '+15551234567',
    route: 'Main Queue',
    campaign: 'Summer Sale',
    callType: 'Inbound',
    startTime: '2023-06-15T09:30:00Z',
    duration: 145,
  },
  {
    id: 2,
    agent: 'Jane Smith',
    extension: '102',
    number: '+15559876543',
    route: 'Support Line',
    campaign: 'Tech Support',
    callType: 'Outbound',
    startTime: '2023-06-15T10:15:00Z',
    duration: 327,
  },
  {
    id: 3,
    agent: 'Robert Johnson',
    extension: '103',
    number: '+15555555555',
    route: 'Sales Direct',
    campaign: 'New Leads',
    callType: 'Missed',
    startTime: '2023-06-15T11:05:00Z',
    duration: 0,
  },
  {
    id: 4,
    agent: 'Emily Davis',
    extension: '104',
    number: '+15556667777',
    route: 'Customer Service',
    campaign: 'Account Management',
    callType: 'Voicemail',
    startTime: '2023-06-15T13:22:00Z',
    duration: 42,
  },
  {
    id: 5,
    agent: 'Michael Wilson',
    extension: '105',
    number: '+15558889999',
    route: 'Billing Dept',
    campaign: 'Payment Reminders',
    callType: 'Inbound',
    startTime: '2023-06-15T14:10:00Z',
    duration: 218,
  },
])

const meta = ref({
  current_page: 1,
  per_page: 5,
  last_page: 3,
  total: 26,
})

const columnHelper = createColumnHelper<CallRecord>()

function formatDuration(seconds: number) {
  return moment.utc(seconds * 1000).format('HH:mm:ss')
}

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),
  columnHelper.accessor(row => `${row.agent} (${row.extension})`, {
    id: 'agent',
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Agent Name (Extension)', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm ' }, `${row.original.agent} (${row.original.extension})`),
  }),
  columnHelper.accessor('number', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Number', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, formatNumber(row.original.number),
    ),
  }),
  columnHelper.accessor('route', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Route', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.route),
  }),
  columnHelper.accessor('campaign', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Campaign Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.campaign),
  }),
  columnHelper.accessor('callType', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Call Type', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.callType),
  }),
  columnHelper.accessor('startTime', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Start Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, moment(row.original.startTime).format('MMM D, YYYY h:mm A'),
    ),
  }),
  columnHelper.accessor('duration', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Duration', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.duration > 0 ? formatDuration(row.original.duration) : '--:--:--',
    ),
  }),
  columnHelper.display({
    id: 'action',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Action'),
    cell: () =>
      h('div', { class: 'flex justify-center' }, h(Button, {
        variant: 'ghost',
        size: 'sm',
        class: 'h-8 w-8 p-0',
      }, () => h(MoreVertical, { class: 'h-4 w-4' }))),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return dummyData.value },
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

function handlePageChange(page: number) {
  meta.value.current_page = page
}
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
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
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
            class="hover:bg-gray-50/50"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :data-pinned="cell.column.getIsPinned()"
              class="p-[12px] align-middle text-center"
              :class="cn(
                { 'sticky bg-background/95': cell.column.getIsPinned() },
                cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
              )"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>

        <TableRow v-else>
          <TableCell
            :colspan="columns.length"
            class="h-24 text-center align-middle"
          >
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div v-if="meta?.current_page && !loading" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
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
      <!-- Pagination Controls -->
      <TableServerPagination
        :total-items="Number(meta?.total)"
        :current-page="Number(meta?.current_page)"
        :items-per-page="Number(meta?.per_page)"
        :last-page="Number(meta?.last_page)"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

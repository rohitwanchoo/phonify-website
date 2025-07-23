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
const router = useRouter()

const dummyData = ref([
  {
    userName: 'John Doe',
    ip: '122.122.122.122',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    loggedIn: '2025-07-14T04:39:15Z',
  },
  {
    userName: 'Jane Smith',
    ip: '98.76.54.32',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0 Safari/537.36',
    loggedIn: '2025-07-13T12:22:45Z',
  },
  {
    userName: 'Ali Khan',
    ip: '10.0.0.5',
    userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) Chrome/108.0.0.0 Mobile Safari/537.36',
    loggedIn: '2025-07-12T18:15:00Z',
  },
  {
    userName: 'Meera Thomas',
    ip: '172.16.254.1',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1',
    loggedIn: '2025-07-11T08:30:10Z',
  },
  {
    userName: 'Chris Evans',
    ip: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Firefox/127.0',
    loggedIn: '2025-07-10T21:45:32Z',
  },
  {
    userName: 'Fatima Noor',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) Chrome/118.0.0.0 Safari/537.36',
    loggedIn: '2025-07-09T14:12:18Z',
  },
])

const meta = ref({
  current_page: 1,
  per_page: 5,
  last_page: 3,
  total: 26,
})

const columnHelper = createColumnHelper<CallRecord>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['#', h(ChevronsUpDown, { class: 'ml-1 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-md' }, row.index + 1),
  }),
  columnHelper.accessor('userName', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['User Name', h(ChevronsUpDown, { class: 'ml-1 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-md' }, row.original.userName),
  }),
  columnHelper.accessor('ip', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['IP', h(ChevronsUpDown, { class: 'ml-1 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-md' }, row.original.ip),
  }),
  columnHelper.accessor('userAgent', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['User Agent', h(ChevronsUpDown, { class: 'ml-1 h-4 w-4' })]),
    cell: ({ row }) => h('div', { class: 'text-center text-md break-words' }, row.original.userAgent),
  }),
  columnHelper.accessor('loggedIn', {
    header: ({ column }) =>
      h(Button, {
        class: 'text-sm font-normal justify-center w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Logged In', h(ChevronsUpDown, { class: 'ml-1 h-4 w-4' })]),
    cell: ({ row }) =>
      h('div', {
        class: 'flex justify-center text-sm w-full',
      }, moment(row.original.loggedIn).format('YYYY-MM-DD HH:mm:ss')),

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
            class="hover:bg-gray-50/50 "
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

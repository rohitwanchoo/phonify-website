<script setup lang="ts">
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import TableServerPagination from '@/components/table/ServerPagination.vue'
import { Icon } from '#components'
import { valueUpdater } from '@/components/ui/table/utils'
import EditRecycleRuleDialog from './EditRecycleRuleDialog.vue'
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

const dummyData = [
  { campaignName: 'Campaign 1', listName: 'List #1', day: 'Monday', time: '09:00:00', callTime: 1, recycleStatus: 0 },
  { campaignName: 'Campaign 2', listName: 'List #2', day: 'Tuesday', time: '10:00:00', callTime: 2, recycleStatus: 1 },
  { campaignName: 'Campaign 3', listName: 'List #3', day: 'Wednesday', time: '11:00:00', callTime: 3, recycleStatus: 0 },
  { campaignName: 'Campaign 4', listName: 'List #4', day: 'Thursday', time: '12:00:00', callTime: 4, recycleStatus: 1 },
  { campaignName: 'Campaign 5', listName: 'List #5', day: 'Friday', time: '13:00:00', callTime: 5, recycleStatus: 0 },
  { campaignName: 'Campaign 6', listName: 'List #6', day: 'Saturday', time: '14:00:00', callTime: 6, recycleStatus: 1 },
  { campaignName: 'Campaign 7', listName: 'List #7', day: 'Sunday', time: '15:00:00', callTime: 7, recycleStatus: 0 },
  { campaignName: 'Campaign 8', listName: 'List #8', day: 'Monday', time: '16:00:00', callTime: 8, recycleStatus: 1 },
  { campaignName: 'Campaign 9', listName: 'List #9', day: 'Tuesday', time: '17:00:00', callTime: 9, recycleStatus: 0 },
  { campaignName: 'Campaign 10', listName: 'List #10', day: 'Wednesday', time: '18:00:00', callTime: 10, recycleStatus: 1 },
  { campaignName: 'Campaign 11', listName: 'List #11', day: 'Thursday', time: '19:00:00', callTime: 11, recycleStatus: 0 },
  { campaignName: 'Campaign 12', listName: 'List #12', day: 'Friday', time: '20:00:00', callTime: 12, recycleStatus: 1 },
]

const columnHelper = createColumnHelper<any>()
const columns = [
  columnHelper.display({
    id: 'slNo',
    header: () => h('div', { class: 'text-center w-full' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.index + 1),
  }),
  columnHelper.accessor('campaignName', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Campaign Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.campaignName),
  }),
  columnHelper.accessor('listName', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['List Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.listName),
  }),
  columnHelper.accessor('day', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Day', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.day),
  }),
  columnHelper.accessor('time', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.time),
  }),
  columnHelper.accessor('callTime', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Call Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.callTime),
  }),
  columnHelper.accessor('recycleStatus', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Recycle Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal te xt-sm w-full' }, row.original.recycleStatus),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center w-full' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-center' }, [
      h(Button, {
        size: 'icon',
        variant: 'outline',
        class: 'text-primary h-7 w-7 min-w-0',
        title: 'Edit',
        onClick: () => {
          selectedRow.value = row.original
          editDialogOpen.value = true
        }
      }, h(Icon, { name: 'material-symbols:edit-square', size: 14 })),
      h(Button, { size: 'icon', variant: 'outline', class: 'text-primary h-7 w-7 min-w-0', title: 'Recycle', onClick: () => console.log('Recycle', row.original) }, h(Icon, { name: 'material-symbols:autorenew', size: 15 })),
      h(Button, { size: 'icon', variant: 'outline', class: 'text-red-600 border-red-600 hover:text-red-600 hover:bg-red-50 h-7 w-7 min-w-0', title: 'Delete', onClick: () => console.log('Delete', row.original) }, h(Icon, { name: 'material-symbols:delete', size: 14 })),
    ]),
  }),
]
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 2,
  total: 12,
}
const loading = false
function handlePageChange(_page: number) {
  // Dummy handler for pagination
}

const table = useVueTable({
  get data() { return dummyData },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
  },
})

const editDialogOpen = ref(false)
const selectedRow = ref<any>(null)
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
        <template v-if="table.getRowModel().rows?.length">
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

  <div v-if="meta?.current_page && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ meta?.current_page }} to
        <span>{{ meta?.per_page }}</span>
        of {{ meta?.total }} entries
      </div>
    </div>
    <div class="space-x-2">
      <!-- Pagination Controls -->
      <TableServerPagination
        :total-items="Number(meta?.total)" :current-page="Number(meta?.current_page)"
        :items-per-page="Number(meta?.per_page)" :last-page="Number(meta?.last_page)" @page-change="handlePageChange"
      />
    </div>
  </div>

  <EditRecycleRuleDialog v-model:open="editDialogOpen" />
</template>  
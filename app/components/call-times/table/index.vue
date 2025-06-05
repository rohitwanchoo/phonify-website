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
import moment from 'moment'

const props = withDefaults(defineProps<Props>(), {

})

const emits = defineEmits(['pageNavigation', 'refresh'])

interface Meta {
  current_page: number
  per_page: number
  last_page: number
  total: number
}
interface Props {
  list: { [key: string]: any }[]
  loading?: boolean
  meta?: Meta
}

const StatusClass = (status: string) => status === 'Active' ? 'bg-green-600' : 'bg-red-600'

export interface CallTiming {
  id: number
  day: string
  from_time: string
  to_time: string
  department_id: number
  name: string
  description: string
  calltimeStatus: boolean
  actions?: string
}

const sheet = ref(false)

const columnHelper = createColumnHelper<CallTiming>()

const columns = [

  columnHelper.accessor('id', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.index + 1)
    },
  }),

  columnHelper.accessor('name', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, { class: 'text-center text-sm font-normal', variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('name'))
    },
  }),

  columnHelper.accessor('from_time', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Default Call Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => h('div', { class: 'lowercase text-center text-sm' }, `${moment(row.original.from_time, 'HH:mm:ss').format('h:mm A')} to ${moment(row.original.to_time, 'HH:mm:ss').format('h:mm A')}`),
  }),

  columnHelper.accessor('department_id', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['No. Used Campaigns', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('department_id'))
    },
  }),
  columnHelper.accessor('day', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Created Date', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, [
        h('div', { class: 'text-xs' }, `${row.original.day} ${moment(row.original.from_time, 'HH:mm:ss').format('h:mm A')}`),
      ])
    },
  }),

  columnHelper.accessor('calltimeStatus', {
    header: ({ column }) => {
      return h('div', { class: 'text-center ' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, h(Switch, { 'class': 'data-[state=checked]:bg-green-600 cursor-pointer', 'modelValue': row.original.calltimeStatus, 'onUpdate:modelValue': (val: boolean) => {
        data.value[row.index].calltimeStatus = val
      } }))
    },
    sortingFn: (rowA, rowB, columnId) => {
      const valueA = rowA.getValue(columnId)
      const valueB = rowB.getValue(columnId)
      if (valueA === valueB) {
        return 0
      }
      if (valueA === true && valueB === false) {
        return -1
      }
      if (valueA === false && valueB === true) {
        return 1
      }
      return 0
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
    columnPinning: {
      left: ['status'],
    },
  },
})
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
            <FlexRender v-if="!header.isPlaceholder" class="" :render="header.column.columnDef.header" :props="header.getContext()" />
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
        :total-items="Number(meta?.total)" :current-page="Number(meta?.current_page)"
        :items-per-page="Number(meta?.per_page)" :last-page="Number(meta?.last_page)" @page-change="handlePageChange"
      />
    </div>
  </div>

  <Call-timesTableSheet v-model:open="sheet" />
</template>

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

const StatusClass = (status: string) => status === 'Active' ? 'bg-green-600' : 'bg-red-600'

export interface Campaign {
  siNo?: number
  name: string
  callTime: string
  usedCampaigns: number
  dialed: string
  hoppers: number
  dialingMode: string
  dateTime: {
    date: string
    time: string
  }
  calltimeStatus: boolean
  actions?: string

}
const sheet = ref(false)

const data = ref<Campaign[]>([
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: true,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: true,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: true,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: true,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
  {
    name: 'Call Time 1',
    callTime: '9:00 AM to 6:00 PM',
    usedCampaigns: 1,
    dialed: '200/500',
    hoppers: 0,
    dialingMode: 'Super Power Dial',
    dateTime: {
      date: '10/10/2023',
      time: '10:00 AM',
    },
    calltimeStatus: false,
  },
])

const columnHelper = createColumnHelper<Campaign>()

const columns = [

  columnHelper.accessor('siNo', {
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

  columnHelper.accessor('callTime', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Default Call Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => h('div', { class: 'lowercase text-center text-sm' }, row.getValue('callTime')),
  }),


columnHelper.accessor('usedCampaigns', {
  header: ({ column }) => {
    return h('div', { class: 'text-center' }, h(Button, {
      class: 'text-sm font-normal',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['No. Used Campaigns', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
  },
  cell: ({ row }) => {
    return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('usedCampaigns'))
  },
}),

//   columnHelper.accessor('dialed', {
//     header: ({ column }) => {
//       return h('div', { class: 'text-center' }, h(Button, {
//         class: 'text-sm font-normal',
//         variant: 'ghost',
//         onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
//       }, () => ['Dialed/Total leads', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
//     },
//     cell: ({ row }) => {
//       return h('div', { class: 'text-center font-normal text-center text-sm' }, row.getValue('dialed'))
//     },
//   }),
  columnHelper.accessor('dateTime', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Created Date', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, [
        h('div', row.original.dateTime.date),
        h('br'),
        h('div', { class: 'text-xs' }, row.original.dateTime.time),
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
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, h(Switch, { 'class': 'data-[state=checked]:bg-green-600 cursor-pointer', 'modelValue': row.original.calltimeStatus , 'onUpdate:modelValue': (val: boolean) => {
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
        <template v-if="table.getRowModel().rows?.length">
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

  <Call-timesTableSheet v-model:open="sheet" />
</template>

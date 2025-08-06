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
  useVueTable,
} from '@tanstack/vue-table'
import { computed, h, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { valueUpdater } from '@/components/ui/table/utils'

// Dummy data with time in seconds
const data = ref([
  {
    didNumber: '15168686507',
    inboundCalls: 5,
    totalCallTime: 1525, // in seconds (25 minutes 25 seconds)
    avgHandleTime: 61, // in seconds (1 minute 1 second)
    smsSent: 100,
    smsReceived: 100,
  },
  {
    didNumber: '15168686507',
    inboundCalls: 5,
    totalCallTime: 1525,
    avgHandleTime: 61,
    smsSent: 100,
    smsReceived: 100,
  },
  {
    didNumber: '15168686507',
    inboundCalls: 5,
    totalCallTime: 1525,
    avgHandleTime: 61,
    smsSent: 100,
    smsReceived: 100,
  },
])

// Format seconds to HH:MM:SS
function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':')
}

// Simplified column config without sorting
const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('didNumber', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'DID Number'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm font-normal text-center' }, row.original.didNumber),
  }),
  columnHelper.accessor('inboundCalls', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Inbound Calls'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatWithCommas(row.original.inboundCalls)),
  }),
  columnHelper.accessor('totalCallTime', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Total Call Time'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatTime(row.original.totalCallTime)),
  }),
  columnHelper.accessor('avgHandleTime', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Average Handle time'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatTime(row.original.avgHandleTime)),
  }),
  columnHelper.accessor('smsSent', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'SMS Sent'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatWithCommas(row.original.smsSent)),
  }),
  columnHelper.accessor('smsReceived', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'SMS Received'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatWithCommas(row.original.smsReceived)),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return data.value },
  columns,
  getCoreRowModel: getCoreRowModel(),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
  },
  onSortingChange: updater => valueUpdater(updater, sorting),
  onColumnFiltersChange: updater => valueUpdater(updater, columnFilters),
  onColumnVisibilityChange: updater => valueUpdater(updater, columnVisibility),
  onRowSelectionChange: updater => valueUpdater(updater, rowSelection),
  onExpandedChange: updater => valueUpdater(updater, expanded),
})

// Totals calculation
const total = computed(() => {
  const totalSeconds = data.value.reduce((sum, r) => sum + r.totalCallTime, 0)
  const avgSeconds = data.value.reduce((sum, r) => sum + r.avgHandleTime, 0) / data.value.length

  return {
    calls: data.value.reduce((sum, r) => sum + r.inboundCalls, 0),
    smsSent: data.value.reduce((sum, r) => sum + r.smsSent, 0),
    smsReceived: data.value.reduce((sum, r) => sum + r.smsReceived, 0),
    totalCallTime: formatTime(totalSeconds),
    avgHandleTime: formatTime(Math.round(avgSeconds)),
  }
})
</script>

<template>
  <div class="w-full my-6 border border-gray-100 rounded-lg overflow-hidden">
    <div class="border-b border-gray-100 w-full">
      <h3 class="text-lg m-4">
        Inbound DID Wise Call Report
      </h3>
    </div>

    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="bg-gray-50 text-sm font-normal text-center"
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
        <TableRow
          v-for="row in table.getRowModel().rows"
          :key="row.id"
        >
          <TableCell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="text-center p-3 text-sm"
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>

        <TableRow class="bg-slate-900 hover:bg-slate-900 text-white font-medium text-sm">
          <TableCell class="text-center">
            Total
          </TableCell>
          <TableCell class="text-center">
            {{ formatWithCommas(total.calls) }}
          </TableCell>
          <TableCell class="text-center">
            {{ total.totalCallTime }}
          </TableCell>
          <TableCell class="text-center">
            {{ total.avgHandleTime }}
          </TableCell>
          <TableCell class="text-center">
            {{ formatWithCommas(total.smsSent) }}
          </TableCell>
          <TableCell class="text-center">
            {{ formatWithCommas(total.smsReceived) }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

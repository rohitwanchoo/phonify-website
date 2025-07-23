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
import { h, ref, computed } from 'vue'
import { cn } from '@/lib/utils'
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

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':')
}

const data = ref(
  Array.from({ length: 12 }).map(() => ({
    agent: 'John Doe',
    extension: '123456',
    totalCalls: 25,
    outboundCalls: 20,
    c2cCalls: 15,
    inboundCalls: 5,
    totalCallTime: 1525, // 00:25:25
    avgHandleTime: 61,   // 00:01:01
    smsSent: 100,
    smsReceived: 50,
  }))
)

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('agent', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Agent Name'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.agent),
  }),
  columnHelper.accessor('extension', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Extension'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.extension),
  }),
  columnHelper.accessor('totalCalls', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Total Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.totalCalls),
  }),
  columnHelper.accessor('outboundCalls', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Outbound Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.outboundCalls),
  }),
  columnHelper.accessor('c2cCalls', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'C2C Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.c2cCalls),
  }),
  columnHelper.accessor('inboundCalls', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Inbound Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.inboundCalls),
  }),
  columnHelper.accessor('totalCallTime', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Total Call Time'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, formatTime(row.original.totalCallTime)),
  }),
  columnHelper.accessor('avgHandleTime', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Average Handle time'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, formatTime(row.original.avgHandleTime)),
  }),
  columnHelper.accessor('smsSent', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'SMS Sent'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.smsSent),
  }),
  columnHelper.accessor('smsReceived', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'SMS Received'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.smsReceived),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get expanded() {
      return expanded.value
    },
  },
  onSortingChange: updater => valueUpdater(updater, sorting),
  onColumnFiltersChange: updater => valueUpdater(updater, columnFilters),
  onColumnVisibilityChange: updater => valueUpdater(updater, columnVisibility),
  onRowSelectionChange: updater => valueUpdater(updater, rowSelection),
  onExpandedChange: updater => valueUpdater(updater, expanded),
})

const total = computed(() => {
  const totalSeconds = data.value.reduce((sum, r) => sum + r.totalCallTime, 0)
  const avgSeconds = data.value.reduce((sum, r) => sum + r.avgHandleTime, 0) / data.value.length

  return {
    totalCalls: data.value.reduce((sum, r) => sum + r.totalCalls, 0),
    outbound: data.value.reduce((sum, r) => sum + r.outboundCalls, 0),
    c2c: data.value.reduce((sum, r) => sum + r.c2cCalls, 0),
    inbound: data.value.reduce((sum, r) => sum + r.inboundCalls, 0),
    totalCallTime: formatTime(totalSeconds),
    avgHandleTime: formatTime(Math.round(avgSeconds)),
    smsSent: data.value.reduce((sum, r) => sum + r.smsSent, 0),
    smsReceived: data.value.reduce((sum, r) => sum + r.smsReceived, 0),
  }
})
</script>

<template>
  <div class="w-full my-6 border border-gray-100 rounded-lg overflow-hidden">
    <div class="border-b border-gray-100 w-full">
      <h3 class="text-lg m-4">Agent Wise Summary</h3>
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
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
          <TableCell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="text-center p-3 text-sm"
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>

        <TableRow class="bg-slate-900 hover:bg-slate-900 text-white font-medium text-sm">
          <TableCell class="text-center">Total</TableCell>
          <TableCell />
          <TableCell class="text-center">{{ total.totalCalls }}</TableCell>
          <TableCell class="text-center">{{ total.outbound }}</TableCell>
          <TableCell class="text-center">{{ total.c2c }}</TableCell>
          <TableCell class="text-center">{{ total.inbound }}</TableCell>
          <TableCell class="text-center">{{ total.totalCallTime }}</TableCell>
          <TableCell class="text-center">{{ total.avgHandleTime }}</TableCell>
          <TableCell class="text-center">{{ total.smsSent }}</TableCell>
          <TableCell class="text-center">{{ total.smsReceived }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

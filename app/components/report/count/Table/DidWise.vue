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

const props = defineProps({
  data: {
    type: Array as PropType<inboundDidWiseData[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

export interface inboundDidWiseData {
  cli: string
  inbound: number
  duration: number
  aht: number
  outgoing: number
  incoming: number
}

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
  columnHelper.accessor('cli', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'DID Number'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm font-normal text-center' }, formatNumber(row.original.cli) || '-'),
  }),
  columnHelper.accessor('inbound', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Inbound Calls'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatWithCommas(row.original.inbound) || '-'),
  }),
  columnHelper.accessor('duration', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Total Call Time'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatTime(row.original.duration) || '-'),
  }),
  columnHelper.accessor('aht', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Average Handle time'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatTime(row.original.aht) || '-'),
  }),
  columnHelper.accessor('outgoing', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'SMS Sent'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatWithCommas(row.original.outgoing) || '-'),
  }),
  columnHelper.accessor('incoming', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'SMS Received'),
    cell: ({ row }) =>
      h('div', { class: 'text-center text-sm' }, formatWithCommas(row.original.incoming) || '-'),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return props.data },
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
  return {
    calls: props.data.reduce((sum, r) => sum + r.inbound, 0),
    smsSent: props.data.reduce((sum, r) => sum + r.outgoing, 0),
    smsReceived: props.data.reduce((sum, r) => sum + r.incoming, 0),
    totalCallTime: formatTime(props.data.reduce((sum, r) => sum + (r.duration ?? 0), 0)),
    avgHandleTime: formatTime(props.data.reduce((sum, r) => sum + (r.aht ?? 0), 0)),
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

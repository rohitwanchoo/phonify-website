<script setup lang="ts">
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import type { PropType } from 'vue'
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
    type: Array as PropType<agentWiseDialerCallList[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

export interface agentWiseDialerCallList {
  agentName: string
  extension: string
  totalcalls: number
  outbound: number
  c2c: number
  inbound: number
  duration: number
  aht: number
  outgoing_sms: string
  incoming_sms: string
}

// Format seconds to HH:MM:SS
function formatTime(seconds: number): string {
  if (!seconds || seconds < 0 || Number.isNaN(seconds))
    return '00:00:00'

  const roundedSeconds = Math.round(seconds) // Round to nearest whole number
  const hours = Math.floor(roundedSeconds / 3600)
  const minutes = Math.floor((roundedSeconds % 3600) / 60)
  const secs = roundedSeconds % 60

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':')
}

const columnHelper = createColumnHelper<agentWiseDialerCallList>()
const columns = [
  columnHelper.accessor('agentName', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Agent Name'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.agentName || '-'),
  }),
  columnHelper.accessor('extension', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Extension'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.extension || '-'),
  }),
  columnHelper.accessor('totalcalls', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Total Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, formatWithCommas(row.original.totalcalls) || '-'),
  }),
  columnHelper.accessor('outbound', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Outbound Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, formatWithCommas(row.original.outbound) || '-'),
  }),
  columnHelper.accessor('c2c', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'C2C Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, formatWithCommas(row.original.c2c) || '-'),
  }),
  columnHelper.accessor('inbound', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Inbound Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, formatWithCommas(row.original.inbound) || '-'),
  }),
  columnHelper.accessor('duration', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Total Call Time'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, formatTime(row.original.duration) || '-'),
  }),
  columnHelper.accessor('aht', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Average Handle Time'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, formatTime(row.original.aht) || '-'),
  }),
  columnHelper.accessor('outgoing_sms', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'SMS Sent'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, formatWithCommas(row.original.outgoing_sms) || '-'),
  }),
  columnHelper.accessor('incoming_sms', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'SMS Received'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, formatWithCommas(row.original.incoming_sms) || '-'),
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

// Calculate totals with proper handling of missing fields
const total = computed(() => {
  if (!props.data.length) {
    return {
      grandTotalCalls: 0,
      grandOutbound: 0,
      grandC2C: 0,
      grandInbound: 0,
      grandTotalCallTime: formatTime(0),
      grandAvgHandleTime: formatTime(0),
      grandSmsSent: 0,
      grandSmsReceived: 0,
    }
  }
  return {
    grandTotalCalls: props.data.reduce((sum, r) => sum + (r.totalcalls ?? 0), 0),
    grandOutbound: props.data.reduce((sum, r) => sum + (r.outbound ?? 0), 0),
    grandC2C: props.data.reduce((sum, r) => sum + (r.c2c ?? 0), 0),
    grandInbound: props.data.reduce((sum, r) => sum + (r.inbound ?? 0), 0),
    grandTotalCallTime: formatTime(props.data.reduce((sum, r) => sum + (r.duration ?? 0), 0)),
    grandAvgHandleTime: formatTime(
      Math.floor(props.data.reduce((sum, r) => sum + (r.aht ?? 0), 0) / props.data.length),
    ),
    grandSmsSent: props.data.reduce((sum, r) => sum + (Number(r.outgoing_sms) ?? 0), 0),
    grandSmsReceived: props.data.reduce((sum, r) => sum + (Number(r.incoming_sms) ?? 0), 0),
  }
})
</script>

<template>
  <div class="w-full my-6 border border-gray-100 rounded-lg overflow-hidden">
    <div class="border-b border-gray-100 w-full">
      <h3 class="text-lg m-4">
        Agent Wise Summary
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
        <TableRow v-if="loading">
          <TableCell :colspan="columns?.length" class="h-12 text-center px-2 bg-white">
            <BaseSkelton v-for="i in 5" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
          </TableCell>
        </TableRow>
        <template v-else-if="table.getRowModel().rows.length">
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
            <TableCell class="text-center">
              Total
            </TableCell>
            <TableCell />
            <TableCell class="text-center">
              {{ formatWithCommas(total.grandTotalCalls) }}
            </TableCell>
            <TableCell class="text-center">
              {{ formatWithCommas(total.grandOutbound) }}
            </TableCell>
            <TableCell class="text-center">
              {{ formatWithCommas(total.grandC2C) }}
            </TableCell>
            <TableCell class="text-center">
              {{ formatWithCommas(total.grandInbound) }}
            </TableCell>
            <TableCell class="text-center">
              {{ total.grandTotalCallTime }}
            </TableCell>
            <TableCell class="text-center">
              {{ total.grandAvgHandleTime }}
            </TableCell>
            <TableCell class="text-center">
              {{ formatWithCommas(total.grandSmsSent) }}
            </TableCell>
            <TableCell class="text-center">
              {{ formatWithCommas(total.grandSmsReceived) }}
            </TableCell>
          </TableRow>
        </template>

        <TableRow v-else>
          <TableCell :colspan="columns.length" class="text-center py-8 text-gray-500">
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

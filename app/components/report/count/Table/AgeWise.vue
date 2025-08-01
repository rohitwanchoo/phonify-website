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
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
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
  agentWiseDialerCallData: {
    type: Array as PropType<agentWiseDialerCallList[]>,
    default: () => [],
  },
})

export interface agentWiseDialerCallList {
  agentName: string
  extension: string
  totalcalls: number
  dialer_call: number
  c2c_call: number
  desktop_call: number
  dialer_call_time_spent_in_second: number
  c2c_call_time_spent_in_second: number
  desktop_call_time_spent_in_second: number
  avgHandleTime?: number // Make optional since it's not in API response
  sms_sent?: number // Make optional since it's not in API response
  sms_received?: number // Make optional since it's not in API response
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':')
}

// Calculate average handle time from total call time and total calls
function calculateAvgHandleTime(row: agentWiseDialerCallList): number {
  const totalTime = row.dialer_call_time_spent_in_second
    + row.c2c_call_time_spent_in_second
    + row.desktop_call_time_spent_in_second
  return row.totalcalls > 0 ? Math.round(totalTime / row.totalcalls) : 0
}

const columnHelper = createColumnHelper<agentWiseDialerCallList>()
const columns = [
  columnHelper.accessor('agentName', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Agent Name'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.agentName),
  }),
  columnHelper.accessor('extension', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Extension'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.extension),
  }),
  columnHelper.accessor('totalcalls', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Total Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.totalcalls),
  }),
  columnHelper.accessor('dialer_call', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Outbound Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.dialer_call),
  }),
  columnHelper.accessor('c2c_call', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'C2C Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.c2c_call),
  }),
  columnHelper.accessor('desktop_call', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Inbound Calls'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.desktop_call),
  }),
  columnHelper.display({
    id: 'totalCallTime',
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Total Call Time'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, formatTime(
        row.original.dialer_call_time_spent_in_second
        + row.original.c2c_call_time_spent_in_second
        + row.original.desktop_call_time_spent_in_second,
      )),
  }),
  columnHelper.display({
    id: 'avgHandleTime',
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Average Handle Time'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, formatTime(row.original.avgHandleTime ?? calculateAvgHandleTime(row.original)),
      ),
  }),
  columnHelper.display({
    id: 'sms_sent',
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'SMS Sent'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.sms_sent ?? 0),
  }),
  columnHelper.display({
    id: 'sms_received',
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'SMS Received'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.sms_received ?? 0),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

// Use computed for reactive data
const data = computed(() => Array.isArray(props.agentWiseDialerCallData) ? props.agentWiseDialerCallData : [])

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
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
})

// Calculate totals with proper handling of missing fields
const total = computed(() => {
  if (!data.value.length) {
    return {
      totalCalls: 0,
      outbound: 0,
      c2c: 0,
      inbound: 0,
      totalCallTime: formatTime(0),
      avgHandleTime: formatTime(0),
      smsSent: 0,
      smsReceived: 0,
    }
  }

  const totalSeconds = data.value.reduce((sum, r) =>
    sum + r.dialer_call_time_spent_in_second + r.c2c_call_time_spent_in_second + r.desktop_call_time_spent_in_second, 0)

  const totalCalls = data.value.reduce((sum, r) => sum + r.totalcalls, 0)
  const avgSeconds = totalCalls > 0 ? Math.round(totalSeconds / totalCalls) : 0

  return {
    totalCalls,
    outbound: data.value.reduce((sum, r) => sum + r.dialer_call, 0),
    c2c: data.value.reduce((sum, r) => sum + r.c2c_call, 0),
    inbound: data.value.reduce((sum, r) => sum + r.desktop_call, 0),
    totalCallTime: formatTime(totalSeconds),
    avgHandleTime: formatTime(avgSeconds),
    smsSent: data.value.reduce((sum, r) => sum + (r.sms_sent ?? 0), 0),
    smsReceived: data.value.reduce((sum, r) => sum + (r.sms_received ?? 0), 0),
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
        <template v-if="table.getRowModel().rows.length">
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
              {{ total.totalCalls }}
            </TableCell>
            <TableCell class="text-center">
              {{ total.outbound }}
            </TableCell>
            <TableCell class="text-center">
              {{ total.c2c }}
            </TableCell>
            <TableCell class="text-center">
              {{ total.inbound }}
            </TableCell>
            <TableCell class="text-center">
              {{ total.totalCallTime }}
            </TableCell>
            <TableCell class="text-center">
              {{ total.avgHandleTime }}
            </TableCell>
            <TableCell class="text-center">
              {{ total.smsSent }}
            </TableCell>
            <TableCell class="text-center">
              {{ total.smsReceived }}
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

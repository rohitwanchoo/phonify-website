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

// New dummy data from the screenshot
const data = ref([
  {
    state: 'New York',
    city: 'Hempstead',
    did: '15168686507',
    cnam: 'LOREM',
    areacode: '999',
    totalCalls: 5,
  },
  {
    state: 'New York',
    city: 'Hempstead',
    did: '15168686507',
    cnam: 'UNAVAILABLE',
    areacode: '999',
    totalCalls: 5,
  },
  {
    state: 'New York',
    city: 'Hempstead',
    did: '15168686507',
    cnam: 'LOREM',
    areacode: '999',
    totalCalls: 5,
  },
])

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('state', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'State'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.state),
  }),
  columnHelper.accessor('city', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'City'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.city),
  }),
  columnHelper.accessor('did', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'DID'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.did),
  }),
  columnHelper.accessor('cnam', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'CNAM'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.cnam),
  }),
  columnHelper.accessor('areacode', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Areacode'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.areacode),
  }),
  columnHelper.accessor('totalCalls', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Total Calls'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.totalCalls),
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

// Totals calculation (based on screenshot, only totalCalls matters)
const total = computed(() => {
  return {
    totalCalls: data.value.reduce((sum, r) => sum + r.totalCalls, 0),
  }
})
</script>

<template>
  <div class="w-full my-6 border border-gray-100 rounded-lg overflow-hidden">
    <div class="border-b border-gray-100 w-full">
      <h3 class="text-lg m-4">
        State / City / Area code Wise Summary
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
          <TableCell class="text-center" />
          <TableCell class="text-center" />
          <TableCell class="text-center" />
          <TableCell class="text-center" />
          <TableCell class="text-center">
            {{ total.totalCalls }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

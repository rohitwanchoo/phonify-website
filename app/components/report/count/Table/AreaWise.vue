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

const props = defineProps<{
  data: any[]
  loading: boolean
}>()

export interface stateWiseSummary {
  state: string
  city: string
  did: string
  cnam: string
  total: number
  area_code: string
  state_code: string
  country_code: string
}

const columnHelper = createColumnHelper<stateWiseSummary>()

const columns = [
  columnHelper.accessor('state', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'State'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.state || '-'),
  }),
  columnHelper.accessor('city', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'City'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.city || '-'),
  }),
  columnHelper.accessor('did', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'DID'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.did || '-'),
  }),
  columnHelper.accessor('cnam', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'CNAM'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.cnam || '-'),
  }),
  columnHelper.accessor('area_code', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Areacode'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, row.original.area_code || '-'),
  }),
  columnHelper.accessor('total', {
    header: () =>
      h('div', { class: 'text-sm font-normal text-center' }, 'Total Calls'),
    cell: ({ row }) =>
      h('div', { class: 'text-sm text-center' }, formatWithCommas(row.original.total) || '-'),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return props.data || [] },
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
const total = computed(() => ({
  totalCalls: (props.data ?? []).reduce((sum, r) => sum + (r.total || 0), 0),
}))
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
        <TableRow v-if="loading">
          <TableCell :colspan="columns?.length" class="h-12 text-center px-2 bg-white">
            <BaseSkelton v-for="i in 5" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
          </TableCell>
        </TableRow>
        <template v-else-if="table.getRowModel().rows?.length">
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <TableRow
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="text-center p-3 text-sm"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="text-center py-8 text-gray-500">
            No data available
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
            {{ formatWithCommas(total.totalCalls) }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

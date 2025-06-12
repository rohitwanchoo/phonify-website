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
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

// import { ChevronsUpDown } from 'lucide-vue-next'
import moment from 'moment'
import { h, ref } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

// const props = withDefaults(defineProps<Props>(), {
//   list: () => [],
// })

const emits = defineEmits(['pageNavigation', 'refresh'])

// interface Meta {
//   current_page: number
//   per_page: number
//   last_page: number
//   total: number
// }
// interface Props {
//   list: { [key: string]: any }[]
//   loading?: boolean
//   meta?: Meta
// }

// const sheet = ref(false)
// const selectedCampaign = ref(null) // Store the campaign details
// const campaignLoadingId = ref<number | null>(null) // Track loading campaign id

// async function openSheet(id: number) {
//   campaignLoadingId.value = id
//   try {
//     const res = await useApi().post('campaign-by-id', { campaign_id: id })
//     selectedCampaign.value = res[0]
//     sheet.value = true
//   }
//   catch (error) {
//     showToast({
//       type: 'error',
//       message: error?.message || 'An error occurred while fetching campaign details.',
//     })
//   }
//   finally {
//     campaignLoadingId.value = null
//   }
// }

const staticData = ref([
  { title: 'Marketing Group', created: '2025-05-26 12:00:00', status: true },
  { title: 'Sales Team', created: '2025-05-26 12:00:00', status: true },
  { title: 'Product Development', created: '2025-05-26 12:00:00', status: true },
  { title: 'Customer Support', created: '2025-05-26 12:00:00', status: true },
  { title: 'Finance Department', created: '2025-05-26 12:00:00', status: true },
  { title: 'IT Support', created: '2025-05-26 12:00:00', status: false },
  { title: 'Research Team', created: '2025-05-26 12:00:00', status: false },
  { title: 'Legal Affairs', created: '2025-05-26 12:00:00', status: false },
  { title: 'Corporate Compliance', created: '2025-05-26 12:00:00', status: false },
  { title: 'Regulatory Affairs', created: '2025-05-26 12:00:00', status: false },
  { title: 'Contract Management', created: '2025-05-26 12:00:00', status: false },
  { title: 'Intellectual Property', created: '2025-05-26 12:00:00', status: false },
])

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'index',
    header: () => '#',
    cell: ({ row }) => row.index + 1,
  }),
  columnHelper.accessor('title', {
    header: 'Group Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('created', {
    header: 'Created Date',
    cell: info => moment(info.getValue()).format('DD MMM YYYY hh:mm A'),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center' }, [
        h('input', {
          type: 'checkbox',
          checked: row.original.status,
          class: 'toggle',
          onChange: () => {
            row.original.status = !row.original.status
          },
        }),
      ]),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Action',
    cell: () =>
      h('div', { class: 'flex gap-2 justify-center' }, [
        h('button', { class: 'p-1 border rounded' }, '✏️'),
        h('button', { class: 'p-1 border rounded text-red-500' }, '🗑️'),
      ]),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return staticData.value },
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

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}
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
</template>

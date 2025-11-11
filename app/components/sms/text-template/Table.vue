<script setup lang="ts">
import { Icon } from '#components'
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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

interface SmsTemplate {
  templete_id: number
  templete_name: string
  templete_desc: string
  is_deleted: string // '0' for active, '1' for deleted
}


const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: SmsTemplate[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})


// Computed pagination variables
const emits = defineEmits(['pageNavigation', 'limitChange'])
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

const columnHelper = createColumnHelper<SmsTemplate>()


// Pagination handlers
function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number | null) {
  if (val !== null) {
    emits('limitChange', val)
  }
}



const columns = [
  columnHelper.display({
    id: 'index',
    header: () => h('div', { class: 'text-sm font-normal text-center' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('templete_name', {
    header: ({ column }) => h('div', { class: 'flex justify-center' }, [
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Template Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    ]),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.templete_name || '-'),
  }),
  columnHelper.accessor('templete_desc', {
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Message'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis' }, row.original.templete_desc || '-'),
    enableSorting: false,
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => h('div', { class: 'flex justify-center' }, [
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    ]),
    cell: ({ row }) => h('div', { class: 'flex justify-center' }, [
      h(Switch, {
        modelValue: row.original.status,
        class: 'data-[state=checked]:bg-green-600',
      }),
    ]),
    sortingFn: (rowA, rowB) => Number(rowB.original.status) - Number(rowA.original.status),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Action'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center gap-2' }, [
        h(Button, {
          size: 'icon',
          variant: 'outline',
        }, () =>
          h(Icon, { name: 'material-symbols:edit-square' })),
        h(Button, {
          size: 'icon',
          variant: 'outline',
          class: 'border-red-500',
        }, () =>
          h(Icon, { name: 'material-symbols:delete', class: 'text-red-500' })),
      ]),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  initialState: { pagination: { pageSize: props.limit } },
  manualPagination: true,
  pageCount: last_page.value,
  rowCount: total.value,
  state: {
    pagination: {
      pageIndex: current_page.value,
      pageSize: per_page.value,
    },
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="header in table.getFlatHeaders()"
            :key="header.id"
            class="bg-gray-50 text-center"
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
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
            class="[&>td]:align-middle"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="p-3"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div v-if="totalRows && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ current_page }} to
        <span>
          <Select :default-value="10" :model-value="limit" @update:model-value="(val) => changeLimit(Number(val))">
            <SelectTrigger class="w-fit gap-x-1 px-2">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in [5, 10, 20, 30, 40, 50]" :key="n" :value="n">
                {{ n }}
              </SelectItem>
            </SelectContent>
          </Select>
        </span>
        of {{ totalRows }} entries
      </div>
    </div>
    <div class="space-x-2">
      <!-- Pagination Controls -->
      <TableServerPagination
        :total-items="Number(total)" :current-page="Number(current_page)"
        :items-per-page="Number(per_page)" :last-page="Number(last_page)" @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { Icon } from '#components'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
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

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
  listHeaders: any[] | null
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
  listHeaders: null,
})

const emits = defineEmits(['pageNavigation', 'limitChange'])
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

interface Lead {
  id: number
  list_id: number
  [key: string]: any // For dynamic option_* fields
}

interface ListHeader {
  column_name: string
  title: string
}

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number) {
  emits('limitChange', val)
}

// Function to format phone numbers
function formatNumber(phoneNumber: string): string {
  if (!phoneNumber)
    return ''
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '')
  // Format as (XXX) XXX-XXXX if it's a 10-digit US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phoneNumber
}

// Create dynamic columns based on listHeaders
const columns = computed(() => {
  const columnHelper = createColumnHelper<Lead>()
  const dynamicColumns = []

  // Serial Number column
  dynamicColumns.push(
    columnHelper.display({
      id: 'siNo',
      header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
      cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, props.start + row.index + 1),
    }),
  )

  // Lead ID column (always static)
  dynamicColumns.push(
    columnHelper.accessor('id', {
      header: ({ column }) =>
        h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
          'Lead ID',
          h(Button, {
            class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
          }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
        ]),
      cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.id),
    }),
  )

  // All other columns are dynamic based on listHeaders
  if (props.listHeaders && props.listHeaders.length > 0) {
    // Group headers by column_name to handle duplicates and get unique columns
    const uniqueHeaders = new Map<string, ListHeader>()

    props.listHeaders.forEach((header) => {
      if (!uniqueHeaders.has(header.column_name)) {
        uniqueHeaders.set(header.column_name, header)
      }
    })

    // Create columns for unique headers
    uniqueHeaders.forEach((header) => {
      dynamicColumns.push(
        columnHelper.accessor(header.column_name as any, {
          header: ({ column }) =>
            h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
              header.title,
              h(Button, {
                class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
              }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
            ]),
          cell: ({ row }) => {
            const value = row.original[header.column_name]
            let displayValue = value || '-'

            // Special formatting for specific column types
            if (header.title.toLowerCase().includes('mobile') || header.title.toLowerCase().includes('phone')) {
              displayValue = formatNumber(value) || '-'
            }
            else if (value) {
              displayValue = String(value).trim() || '-'
            }

            return h('div', { class: 'text-center font-normal text-sm' }, displayValue)
          },
        }),
      )
    })
  }

  // Actions column (always static)
  dynamicColumns.push(
    columnHelper.display({
      id: 'actions',
      header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Actions'),
      cell: ({ row }) => h('div', { class: 'flex gap-2 justify-center' }, [
        h(Button, {
          size: 'sm',
          class: 'bg-white text-black border border-[#162D3A] flex items-center gap-2 hover:bg-transparent hover:text-inherit',
          onClick: () => {
            navigateTo(`/app/lead-management/lead/${row.original.id}?list_id=${row.original.list_id}`)
          },
        }, [
          h(Icon, { name: 'material-symbols:person', filled: true, class: 'text-base text-black' }),
          'View Activity',
        ]),
        h(Button, {
          size: 'sm',
          class: 'bg-[#162D3A] text-white flex items-center gap-2 hover:bg-[#162D3A] hover:text-white',
        }, [
          h(Icon, { name: 'material-symbols:call-log-outline', filled: true, class: 'text-base text-white' }),
          'Call Record',
        ]),
      ]),
    }),
  )

  return dynamicColumns
})

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  get data() { return props.list || [] },
  get columns() { return columns.value },
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
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="bg-gray-50"
          >
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
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
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-3 text-center">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="text-center h-24">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div v-if="totalRows && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing

        <span>
          <Select :model-value="limit" @update:model-value="val => changeLimit(Number(val))">
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

<script setup lang="ts">
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { Check, ChevronsUpDown, Eye } from 'lucide-vue-next'

import moment from 'moment'
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
import { cn } from '@/lib/utils'

// Define props with defaults
interface List {
  id: number
  list: string
  title: string
  createdDate: string
  totalLeads: number
  rowLeadReport: number
  l_title: string
  updated_at: any
  list_id: number
  rowListData: string

}

const props = withDefaults(defineProps<{
  isPreview?: boolean
  enableSelect?: boolean
  loading?: boolean
  isEdit?: boolean
  list?: List[]
  start: number // pagination start
  limit?: number // pagination limit
  totalRows: number
  classes?: string
}>(), {
  limit: 10,
  enableSelect: true,
  isPreview: false,
  data: () => [],
})

const emits = defineEmits(['pageNavigation', 'refresh', 'changeLimit'])

const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

// Track selected rows
const selectedRows = defineModel<number[]>('selectedRows', { default: [] })

function toggleSelected(id: number) {
  const index = selectedRows.value.indexOf(id)
  if (index === -1) {
    selectedRows.value.push(id)
  }
  else {
    selectedRows.value.splice(index, 1)
  }
}

// Create column helpers
const columnHelper = createColumnHelper<List>()

const columns = [
  // No. column (not sortable)
  columnHelper.display({
    id: 'no',
    header: () => h('div', { class: 'text-sm font-medium text-center' }, 'No.'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.index + 1),
  }),

  // List Name column (sortable)
  columnHelper.accessor('list', {
    header: ({ column }) =>
      h(Button, {
        type: 'button',
        variant: 'ghost',
        class: 'text-sm font-medium mx-auto',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => [
        'List Name',
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ]),
    cell: ({ row }) => h('div', { class: 'text-sm font-normal text-center' }, row.original.list || row.original.l_title || '-'),
  }),

  // Created Date column (sortable)
  columnHelper.accessor('createdDate', {
    header: ({ column }) =>
      h(Button, {
        variant: 'ghost',
        type: 'button',
        class: 'text-sm font-medium mx-auto',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => [
        'Created Date',
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ]),
    cell: ({ row }) => {
      const date = new Date(row.original.updated_at)
      return h('div', { class: 'text-sm text-center' }, moment(date).format('DD/MM/YYYY h:mmA') || '-')
    },
  }),

  // Total Leads column (sortable)
  columnHelper.accessor('totalLeads', {
    header: ({ column }) =>
      h(Button, {
        type: 'button',
        variant: 'ghost',
        class: 'text-sm font-medium mx-auto',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => [
        'Total Leads',
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ]),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.rowListData || '-'),
  }),

  // Action column
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-sm font-medium text-center' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-center' }, [
      h(Button, {
        type: 'button',
        variant: 'outline',
        size: 'icon',
        class: 'h-10 w-10 text-white bg-primary',
        onClick: () => {
          navigateTo(`/app/lead-management/list/${row.original.id || row.original.list_id}?name=${row.original.list || row.original.l_title}`, {
            open: { target: '_blank' },
          })
        },
      }, h(Eye, { class: 'h-6 w-6' })),
      props.enableSelect && h(Button, {
        variant: selectedRows.value.includes(row.original.list_id) ? 'default' : 'outline',
        size: 'sm',
        type: 'button',
        class: cn('h-10 w-28 flex items-center justify-center gap-1', {
          'bg-green-600 text-white hover:bg-green-700 cursor-pointer hover:text-white': selectedRows.value.includes(row.original.id || row.original.list_id),
          'text-primary border-primary cursor-pointer': !selectedRows.value.includes(row.original.id || row.original.list_id),
        }),
        onClick: () => toggleSelected(row.original.id || row.original.list_id),
      }, () => [
        h(Check, {
          class: cn('h-4 w-4', {
            'text-white': selectedRows.value.includes(row.original.id || row.original.list_id),
            'text-primary': !selectedRows.value.includes(row.original.id || row.original.list_id),
          }),
        }),
        selectedRows.value.includes(row.original.id || row.original.list_id) ? 'Selected' : 'Select',
      ]),

    ]),
  }),
]

// Create TanStack table instance
const table = useVueTable({
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number | null) {
  if (val !== null) {
    emits('changeLimit', val)
  }
}
</script>

<template>
  <div :class="classes" class="border rounded-lg  mt-5 max-h-[85%] overflow-auto">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
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

      <TableBody class="bg-white">
        <TableRow v-if="loading">
          <TableCell :colspan="columns?.length" class="h-12 text-center px-2 bg-white">
            <BaseSkelton v-for="i in 9" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
          </TableCell>
        </TableRow>
        <template v-else-if="table.getRowModel().rows?.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-gray-50">
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="p-3 text-center"
            >
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
  <div v-if="totalRows && !loading" class=" flex items-center justify-end space-x-2 py-4 px-3 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing
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

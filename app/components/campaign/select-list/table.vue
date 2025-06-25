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
import { h, popScopeId, ref } from 'vue'
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
const props = withDefaults(defineProps<{
  enableSelect?: boolean
  loading?: boolean
  meta?: Meta
  list?: {
    list: string
    createdDate: string
    totalLeads: number
  }[]
}>(), {
  enableSelect: true,
  data: () => [],
})

const emits = defineEmits(['pageNavigation', 'refresh'])

interface Meta {
  current_page: number
  per_page: number
  last_page: number
  total: number
}

// Track selected rows
const selectedRows = ref<Record<number, boolean>>({})

function toggleSelected(rowIndex: number) {
  selectedRows.value = {
    ...selectedRows.value,
    [rowIndex]: !selectedRows.value[rowIndex],
  }
}

// Create column helpers
const columnHelper = createColumnHelper<any>()

const columns = [
  // No. column (not sortable)
  columnHelper.display({
    id: 'no',
    header: () => h('div', { class: 'text-sm font-medium text-center' }, 'No.'),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.index + 1),
  }),

  // List Name column (sortable)
  columnHelper.accessor('listName', {
    header: ({ column }) =>
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-medium mx-auto',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => [
        'List Name',
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ]),
    cell: ({ row }) => h('div', { class: 'text-sm font-normal text-center' }, row.original.list),
  }),

  // Created Date column (sortable)
  columnHelper.accessor('createdDate', {
    header: ({ column }) =>
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-medium mx-auto',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => [
        'Created Date',
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ]),
    cell: ({ row }) => {
      const date = new Date(row.original.updated_at)
      return h('div', { class: 'text-sm text-center' }, moment(date).format('DD/MM/YYYY h:mmA'))
    },
  }),

  // Total Leads column (sortable)
  columnHelper.accessor('totalLeads', {
    header: ({ column }) =>
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-medium mx-auto',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => [
        'Total Leads',
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ]),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.getValue('totalLeads')),
  }),

  // Action column
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-sm font-medium text-center' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-center' }, [
      h(Button, {
        variant: 'outline',
        size: 'icon',
        class: 'h-10 w-10 text-white bg-primary',
      }, h(Eye, { class: 'h-6 w-6' })),
      props.enableSelect && h(Button, {
        variant: selectedRows.value[row.index] ? 'default' : 'outline',
        size: 'sm',
        class: cn('h-10 w-28 flex items-center justify-center gap-1', {
          'bg-green-600 text-white hover:bg-green-700 cursor-pointer': selectedRows.value[row.index],
          'text-primary border-primary cursor-pointer': !selectedRows.value[row.index],
        }),
        onClick: () => toggleSelected(row.index),
      }, () => [
        h(Check, {
          class: cn('h-4 w-4', {
            'text-white': selectedRows.value[row.index],
            'text-primary': !selectedRows.value[row.index],
          }),
        }),
        selectedRows.value[row.index] ? 'Selected' : 'Select',
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
</script>

<template>
  <div class="border rounded-lg  mt-5 max-h-[85%] overflow-auto">
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

<script setup lang="ts">
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { ArrowRight, Check, ChevronsUpDown, Eye, Search } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Define props
const props = defineProps<{
  data: {
    listName: string
    createdDate: string
    totalLeads: number
  }[]
}>()

// Track selected rows
const selectedRows = ref<Record<number, boolean>>({})

function toggleSelected(rowIndex: number) {
  selectedRows.value = {
    ...selectedRows.value,
    [rowIndex]: !selectedRows.value[rowIndex],
  }
}

// Create column helpers
const columnHelper = createColumnHelper<typeof props.data[0]>()

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
    cell: ({ row }) => h('div', { class: 'text-sm font-normal text-center' }, row.getValue('listName')),
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
      const date = new Date(row.getValue('createdDate'))
      return h('div', { class: 'text-sm text-center' }, `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}${date.getHours() >= 12 ? 'PM' : 'AM'}`,
      )
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
      h(Button, {
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
  data: props.data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
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

      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
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
</template>
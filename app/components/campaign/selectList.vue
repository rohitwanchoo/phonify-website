<script setup lang="ts">
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { ArrowRight, Check, ChevronsUpDown, Eye, Search } from 'lucide-vue-next' // Added Search icon
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

const emit = defineEmits(['completed'])


// 1. Define interface for row data
interface ListData {
  listName: string
  createdDate: string
  totalLeads: number
}

// 2. Dummy data
const dummyData = ref<ListData[]>([
  { listName: 'List 1', createdDate: '2024-05-10T10:00:00', totalLeads: 1200 },
  { listName: 'List 2', createdDate: '2024-04-22T14:30:00', totalLeads: 850 },
  { listName: 'List 3', createdDate: '2024-03-15T09:15:00', totalLeads: 420 },
  { listName: 'List 4', createdDate: '2024-02-28T16:45:00', totalLeads: 100 },
  { listName: 'List 5', createdDate: '2024-05-10T10:00:00', totalLeads: 1200 },
  { listName: 'List 6', createdDate: '2024-04-22T14:30:00', totalLeads: 850 },
  { listName: 'List 7', createdDate: '2024-03-15T09:15:00', totalLeads: 420 },
  { listName: 'List 8', createdDate: '2024-02-28T16:45:00', totalLeads: 100 },
])

// Track selected rows
const selectedRows = ref<Record<number, boolean>>({})

function toggleSelected(rowIndex: number) {
  selectedRows.value = {
    ...selectedRows.value,
    [rowIndex]: !selectedRows.value[rowIndex],
  }
}

// 3. Create column helpers
const columnHelper = createColumnHelper<ListData>()

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
        class: 'h-10 w-10 text-white bg-primary', // Added text-primary class
      }, h(Eye, { class: 'h-6 w-6' })), // Eye icon button with primary color
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

// 4. Create TanStack table instance
const table = useVueTable({
  data: dummyData,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

const handleContinue = () => {
  emit('completed') // Just emit the event
}
</script>

<template>
  <div class="flex w-full flex-col sm:flex-row sm:justify-between items-center">
    <h2 class="text-xl text-primary ">
      Lists
    </h2>
    <div class="flex items-center justify-between gap-5">
      <label for="Email" class="relative">
        <input
          id="Email"
          type="email"
          class="mt-0.5 w-[250px] rounded-md rounded bg-white border-gray-300 px-3 h-10 shadow-sm sm:text-sm pr-10"
          placeholder="Search List"
        >
        <Search class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" /> <!-- Search icon -->
      </label>
      <button class="text-white text-sm bg-primary px-3 h-10 rounded-md cursor-pointer">
        + Create List
      </button>
    </div>
  </div>
  <div class="border rounded-lg overflow-hidden mt-5">
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

  <button class="w-full bg-primary text-white p-2 rounded-md text-sm  my-4 cursor-pointer justify-center items-center gap-2 flex" @click="handleContinue">
    Continue <ArrowRight class="w-5" />
  </button>
</template>

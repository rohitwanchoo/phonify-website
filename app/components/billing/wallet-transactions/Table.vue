<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown, MoreVertical } from 'lucide-vue-next'
import moment from 'moment'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import EditVoipConfigurationDialog from '~/components/configuration/voip-configuration/EditVoipConfigurationDialog.vue'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

const mockData = [
  {
    id: 89742598,
    amount: 1000.00,
    transaction_type: 'Credit',
    description: 'Salary credited for July.',
    time: '2024-07-10T21:00:00',
  },
  {
    id: 89742599,
    amount: 500.00,
    transaction_type: 'Debit',
    description: 'Payment for invoice #1234.',
    time: '2024-07-11T09:30:00',
  },
  {
    id: 89742600,
    amount: 250.50,
    transaction_type: 'Credit',
    description: 'Refund processed.',
    time: '2024-07-12T15:45:00',
  },
  {
    id: 89742601,
    amount: 120.00,
    transaction_type: 'Debit',
    description: 'Subscription renewal.',
    time: '2024-07-13T20:00:00',
  },
  {
    id: 89742602,
    amount: 300.00,
    transaction_type: 'Credit',
    description: 'Bonus payout.',
    time: '2024-07-14T18:15:00',
  },
  {
    id: 89742603,
    amount: 75.25,
    transaction_type: 'Debit',
    description: 'Utility bill payment.',
    time: '2024-07-15T08:00:00',
  },
  {
    id: 89742604,
    amount: 200.00,
    transaction_type: 'Credit',
    description: 'Cashback reward.',
    time: '2024-07-16T13:20:00',
  },
  {
    id: 89742605,
    amount: 50.00,
    transaction_type: 'Debit',
    description: 'ATM withdrawal.',
    time: '2024-07-17T22:10:00',
  },
  {
    id: 89742606,
    amount: 400.00,
    transaction_type: 'Credit',
    description: 'Project milestone payment.',
    time: '2024-07-18T19:30:00',
  },
  {
    id: 89742607,
    amount: 60.00,
    transaction_type: 'Debit',
    description: 'Online shopping.',
    time: '2024-07-19T11:45:00',
  },
  // --- Additional 6 dummy data ---
  {
    id: 89742608,
    amount: 150.00,
    transaction_type: 'Credit',
    description: 'Gift received.',
    time: '2024-07-20T17:00:00',
  },
  {
    id: 89742609,
    amount: 80.00,
    transaction_type: 'Debit',
    description: 'Restaurant bill.',
    time: '2024-07-21T21:30:00',
  },
  {
    id: 89742610,
    amount: 220.00,
    transaction_type: 'Credit',
    description: 'Freelance project payment.',
    time: '2024-07-22T14:10:00',
  },
  {
    id: 89742611,
    amount: 95.00,
    transaction_type: 'Debit',
    description: 'Grocery shopping.',
    time: '2024-07-23T10:25:00',
  },
  {
    id: 89742612,
    amount: 175.00,
    transaction_type: 'Credit',
    description: 'Interest earned.',
    time: '2024-07-24T16:40:00',
  },

]

const router = useRouter()
const columnHelper = createColumnHelper<any>()

const editDialogOpen = ref(false)
const editRow = ref<any>(null)
const dropdownOpen = ref<number | null>(null)
const loading = ref(false)
const sorting = ref([])

// Mock pagination meta data
const meta = ref({
  current_page: 1,
  per_page: 10,
  total: 120,
  last_page: 12,
})

function openEditDialog(row: any) {
  editRow.value = row.original
  editDialogOpen.value = true
}

function openDropdown(rowIdx: number) {
  dropdownOpen.value = rowIdx
}

function closeDropdown() {
  dropdownOpen.value = null
}

function handleDelete(row: any) {
  // Placeholder for delete logic
  closeDropdown()
}

function handlePageChange(page: number) {
  // For now, just update the mock meta
  meta.value.current_page = page
  // You can set loading.value = true and simulate data fetching if needed
}

const columns = [
  // 1. # (sl.no)
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
    sortingFn: 'alphanumeric',
  }),
  // 2. ID
  columnHelper.accessor('id', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'ID',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.id),
    sortingFn: 'alphanumeric',
  }),
  // 3. Amount
  columnHelper.accessor('amount', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Amount',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.amount.toFixed(2)),
    sortingFn: 'alphanumeric',
  }),
  // 4. Transaction Type
  columnHelper.accessor('transaction_type', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Transaction Type',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.transaction_type),
    sortingFn: 'alphanumeric',
  }),
  // 5. Description
  columnHelper.accessor('description', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Description',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.description),
    sortingFn: 'alphanumeric',
  }),
  // 6. Time
  columnHelper.accessor('time', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Time',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal text-sm' }, moment(row.original.time).format('hh:mm A')),
    sortingFn: 'alphanumeric',
  }),
  // ...actions column if needed...
]

const table = useVueTable({
  get data() { return mockData },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => {
    if (typeof updaterOrValue === 'function') {
      sorting.value = updaterOrValue(sorting.value)
    }
    else {
      sorting.value = updaterOrValue
    }
  },
  state: {
    get sorting() { return sorting.value },
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
        <template v-if="table.getRowModel().rows?.length">
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
    <EditVoipConfigurationDialog v-model:open="editDialogOpen" :row="editRow" />
  </div>
  <div v-if="meta?.current_page && !loading" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ meta?.current_page }} to
        <span>
          <Select :default-value="meta.per_page">
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
      <TableServerPagination
        :total-items="Number(meta?.total)"
        :current-page="Number(meta?.current_page)"
        :items-per-page="Number(meta?.per_page)"
        :last-page="Number(meta?.last_page)"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

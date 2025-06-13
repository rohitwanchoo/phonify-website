<script setup lang="ts">
import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table'
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
import { valueUpdater } from '@/components/ui/table/utils'

function formatDollar(val: number) {
  return val.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

const dummyData = [
  {
    mobile: '+1 (938) 738 8387',
    ownerName: 'Mattie Legros',
    businessName: 'Legros LLC',
    email: 'Pat96@yahoo.com',
    address: '90100 Zboncak Fork, Bednarstead 89423-0281',
    city: 'Bednarstead',
    state: 'NY',
    zip: '49608',
    monthlyDeposit: 1000000,
    yearsInBusiness: 3,
    monthlyDeposit2: 100000,
  },
  {
    mobile: '+1 (555) 123 4567',
    ownerName: 'John Doe',
    businessName: 'Doe Inc',
    email: 'john.doe@example.com',
    address: '123 Main St, New York, NY 10001',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    monthlyDeposit: 500000,
    yearsInBusiness: 5,
    monthlyDeposit2: 50000,
  },
  {
    mobile: '+1 (222) 987 6543',
    ownerName: 'Jane Smith',
    businessName: 'Smith & Co',
    email: 'jane.smith@example.com',
    address: '456 Elm St, Los Angeles, CA 90001',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    monthlyDeposit: 250000,
    yearsInBusiness: 2,
    monthlyDeposit2: 25000,
  },
  {
    mobile: '+1 (800) 555 0000',
    ownerName: 'Alice Johnson',
    businessName: 'Johnson Consulting',
    email: 'alice.johnson@consult.com',
    address: '789 Oak Ave, Springfield, IL 62704',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
    monthlyDeposit: 750000,
    yearsInBusiness: 7,
    monthlyDeposit2: 75000,
  },
  {
    mobile: '+1 (321) 654 9870',
    ownerName: 'Bob Williams',
    businessName: 'Williams & Partners',
    email: 'bob.williams@partners.com',
    address: '321 Pine St, Austin, TX 73301',
    city: 'Austin',
    state: 'TX',
    zip: '73301',
    monthlyDeposit: 1200000,
    yearsInBusiness: 10,
    monthlyDeposit2: 120000,
  },
  {
    mobile: '+1 (999) 888 7777',
    ownerName: 'Carol King',
    businessName: 'King Enterprises',
    email: 'carol.king@kingent.com',
    address: '654 Maple Rd, Miami, FL 33101',
    city: 'Miami',
    state: 'FL',
    zip: '33101',
    monthlyDeposit: 300000,
    yearsInBusiness: 1,
    monthlyDeposit2: 30000,
  },
  {
    mobile: '+1 (444) 333 2222',
    ownerName: 'David Brown',
    businessName: 'Brown Solutions',
    email: 'david.brown@solutions.com',
    address: '987 Cedar Blvd, Seattle, WA 98101',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    monthlyDeposit: 950000,
    yearsInBusiness: 8,
    monthlyDeposit2: 95000,
  },
  {
    mobile: '+1 (777) 666 5555',
    ownerName: 'Eva Green',
    businessName: 'Green Farms',
    email: 'eva.green@farms.com',
    address: '222 Willow Ln, Denver, CO 80201',
    city: 'Denver',
    state: 'CO',
    zip: '80201',
    monthlyDeposit: 400000,
    yearsInBusiness: 4,
    monthlyDeposit2: 40000,
  },
  {
    mobile: '+1 (123) 456 7890',
    ownerName: 'Frank Harris',
    businessName: 'Harris Tech',
    email: 'frank.harris@harristech.com',
    address: '555 Birch St, Boston, MA 02101',
    city: 'Boston',
    state: 'MA',
    zip: '02101',
    monthlyDeposit: 600000,
    yearsInBusiness: 6,
    monthlyDeposit2: 60000,
  },
  {
    mobile: '+1 (888) 111 2222',
    ownerName: 'Grace Lee',
    businessName: 'Lee Marketing',
    email: 'grace.lee@leemarketing.com',
    address: '888 Spruce Dr, San Diego, CA 92101',
    city: 'San Diego',
    state: 'CA',
    zip: '92101',
    monthlyDeposit: 850000,
    yearsInBusiness: 9,
    monthlyDeposit2: 85000,
  },
]
const columnHelper = createColumnHelper<any>()
const columns = [
  columnHelper.display({
    id: 'slNo',
    header: () => h('div', { class: 'text-center w-full' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.index + 1),
  }),
  columnHelper.accessor('mobile', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Mobile', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.mobile),
  }),
  columnHelper.accessor('ownerName', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Owner Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.ownerName),
  }),
  columnHelper.accessor('businessName', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Business Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.businessName),
  }),
  columnHelper.accessor('email', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Email', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.email),
  }),
  columnHelper.accessor('address', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Address', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.address),
  }),
  columnHelper.accessor('city', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['City', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.city),
  }),
  columnHelper.accessor('state', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['State', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.state),
  }),
  columnHelper.accessor('zip', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Zip', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.zip),
  }),
  columnHelper.accessor('monthlyDeposit', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Monthly Deposit', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, formatDollar(row.original.monthlyDeposit)),
  }),
  columnHelper.accessor('yearsInBusiness', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Years in Business', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, `${row.original.yearsInBusiness}yr`),
  }),
  columnHelper.accessor('monthlyDeposit2', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Monthly Deposit', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, formatDollar(row.original.monthlyDeposit2)),
  }),
]
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: 3,
}
const loading = false
function handlePageChange(_page: number) {
  // Dummy handler for pagination
}

const table = useVueTable({
  get data() { return dummyData },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
  },
})
</script>

<template>
  <div class="border rounded-lg my-6 overflow-x-auto">
    <Table class="min-w-[1200px]">
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="bg-gray-50"
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
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="p-[12px]"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
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
        <span>{{ meta?.per_page }}</span>
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

<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { computed, h, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
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
    id: 1,
    ip: '49.36.189.247',
    user: 'John Doe',
    server: '3.234.106.186',
    time: '06/09/2025 10:00 AM',
    location: 'California, USA',
    fromWeb: 'YES',
  },
  {
    id: 2,
    ip: '49.36.189.248',
    user: 'Jane Smith',
    server: '3.234.106.187',
    time: '06/10/2025 11:00 AM',
    location: 'Texas, USA',
    fromWeb: 'NO',
  },
  {
    id: 3,
    ip: '49.36.189.249',
    user: 'Alice Johnson',
    server: '3.234.106.188',
    time: '06/11/2025 09:30 AM',
    location: 'New York, USA',
    fromWeb: 'YES',
  },
  {
    id: 4,
    ip: '49.36.189.250',
    user: 'Bob Lee',
    server: '3.234.106.189',
    time: '06/12/2025 08:45 AM',
    location: 'Florida, USA',
    fromWeb: 'NO',
  },
  {
    id: 5,
    ip: '49.36.189.251',
    user: 'Charlie Kim',
    server: '3.234.106.190',
    time: '06/13/2025 12:00 PM',
    location: 'Nevada, USA',
    fromWeb: 'YES',
  },
  {
    id: 6,
    ip: '49.36.189.252',
    user: 'Diana Ross',
    server: '3.234.106.191',
    time: '06/14/2025 01:15 PM',
    location: 'Washington, USA',
    fromWeb: 'NO',
  },
  {
    id: 7,
    ip: '49.36.189.253',
    user: 'Ethan Hunt',
    server: '3.234.106.192',
    time: '06/15/2025 02:30 PM',
    location: 'Oregon, USA',
    fromWeb: 'YES',
  },
  {
    id: 8,
    ip: '49.36.189.254',
    user: 'Fiona Gallagher',
    server: '3.234.106.193',
    time: '06/16/2025 03:45 PM',
    location: 'Illinois, USA',
    fromWeb: 'NO',
  },
  {
    id: 9,
    ip: '49.36.189.255',
    user: 'George Martin',
    server: '3.234.106.194',
    time: '06/17/2025 04:00 PM',
    location: 'Georgia, USA',
    fromWeb: 'YES',
  },
  {
    id: 10,
    ip: '49.36.189.256',
    user: 'Hannah Brown',
    server: '3.234.106.195',
    time: '06/18/2025 05:15 PM',
    location: 'Ohio, USA',
    fromWeb: 'NO',
  },
  {
    id: 11,
    ip: '49.36.189.257',
    user: 'Ian Wright',
    server: '3.234.106.196',
    time: '06/19/2025 06:30 PM',
    location: 'Michigan, USA',
    fromWeb: 'YES',
  },
  {
    id: 12,
    ip: '49.36.189.258',
    user: 'Julia Roberts',
    server: '3.234.106.197',
    time: '06/20/2025 07:45 PM',
    location: 'Arizona, USA',
    fromWeb: 'NO',
  },
]

const columnHelper = createColumnHelper<any>()

const selectedRows = ref<number[]>([])

const allSelected = computed({
  get() {
    return mockData.length > 0 && selectedRows.value.length === mockData.length
  },
  set(val: boolean) {
    if (val) {
      selectedRows.value = mockData.map(row => row.id)
    }
    else {
      selectedRows.value = []
    }
  },
})

function toggleRowSelection(id: number) {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(rowId => rowId !== id)
  }
  else {
    selectedRows.value.push(id)
  }
}

const sorting = ref([])

const columns = [
  columnHelper.display({
    id: 'select',
    header: () =>
      h(Checkbox, {
        'checked': allSelected.value,
        'onUpdate:checked': (val: boolean) => { allSelected.value = val },
        'class': 'mx-auto  border-primary rounded-none',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        'checked': selectedRows.value.includes(row.original.id),
        'onUpdate:checked': () => toggleRowSelection(row.original.id),
        'class': 'mx-auto border-primary rounded-none',
      }),
    size: 40,
  }),
  columnHelper.accessor('ip', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'IP Address',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.ip),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('user', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'User',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.user),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('server', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Server',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.server),
    sortingFn: 'alphanumeric',
  }),
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
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.time),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('location', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Location',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.location),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('fromWeb', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'From Web',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.fromWeb),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2 justify-center' }, [
      h(Button, {
        size: 'sm',
        variant: 'outline',
        class: 'flex items-center gap-1 border-green-600 bg-green-50 text-green-600',
        onClick: () => { /* Approve logic */ },
      }, [
        h(Icon, { name: 'material-symbols:check', class: 'text-green-600' }),
        'Approve',
      ]),
      h(Button, {
        size: 'sm',
        variant: 'outline',
        class: 'flex items-center gap-2 border-red-600 bg-red-50 text-red-600',
        onClick: () => { /* Decline logic */ },
      }, [
        h(Icon, { name: 'material-symbols:close', class: 'text-red-600' }),
        'Decline',
      ]),
    ]),
  }),
]

const table = useVueTable({
  get data() { return mockData },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: {
    get sorting() { return sorting.value },
  },
  onSortingChange: (updaterOrValue) => {
    if (typeof updaterOrValue === 'function') {
      sorting.value = updaterOrValue(sorting.value)
    }
    else {
      sorting.value = updaterOrValue
    }
  },
})

// Mock pagination meta data
const meta = ref({
  current_page: 1,
  per_page: 10,
  total: 120,
  last_page: 12,
})
const loading = ref(false)

function handlePageChange(page: number) {
  // For now, just update the mock meta
  meta.value.current_page = page
  // You can set loading.value = true and simulate data fetching if needed
}
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

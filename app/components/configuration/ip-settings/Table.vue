<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { computed, h, ref, watch } from 'vue'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import moment from 'moment'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

 interface IpList {
  approval_status: number;
  approvedBy: string;
  client_id: number;
  created_at: string; // ISO 8601 format
  from_web: number;
  ip_location: string | null;
  last_login_at: string; // "YYYY-MM-DD HH:mm:ss" format
  last_login_user: number;
  server_ip: string;
  updated_at: string; // ISO 8601 format
  updated_by: number | null;
  user: string;
  whitelist_ip: string;
  

 }

interface Props {
  list: IpList[]
  loading?: boolean
}

const props = defineProps<Props>()

const columnHelper = createColumnHelper<IpList>()

const selectedRows = ref<number[]>([])
const approveDialogOpen = ref(false)
const declineDialogOpen = ref(false)
const selectedRowData = ref<any>(null)


// Keep selectedRows in sync with mockData (e.g., if data changes)
// watch(
//   () => mockData.map(row => row.id),
//   (ids) => {
//     selectedRows.value = selectedRows.value.filter(id => ids.includes(id))
//   },
// )

// const allSelected = computed({
//   get() {
//     return mockData.length > 0 && selectedRows.value.length === mockData.length
//   },
//   set(val: boolean) {
//     if (val) {
//       selectedRows.value = mockData.map(row => row.id)
//     }
//     else {
//       selectedRows.value = []
//     }
//   },
// })

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
  // columnHelper.display({
  //   id: 'select',
  //   header: () =>
  //     h(Checkbox, {
  //       'modelValue': allSelected.value,
  //       'indeterminate': selectedRows.value.length > 0 && selectedRows.value.length < mockData.length,
  //       'onUpdate:modelValue': (val: boolean | 'indeterminate') => {
  //         if (typeof val === 'boolean')
  //           allSelected.value = val
  //       },
  //       'class': 'mx-auto border-primary rounded-none',
  //     }),
  //   cell: ({ row }) =>
  //     h(Checkbox, {
  //       'modelValue': selectedRows.value.includes(row.original.created_at),
  //       'onUpdate:modelValue': (val: boolean | 'indeterminate') => {
  //         if (typeof val === 'boolean')
  //           toggleRowSelection(row.original.created_at)
  //       },
  //       'class': 'mx-auto border-primary rounded-none',
  //     }),
  //   size: 40,
  // }),
  columnHelper.accessor('whitelist_ip', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'IP Address',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.whitelist_ip),
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
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.user || '-'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('server_ip', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Server',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.server_ip),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Time',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
      // 06/09/2025 10:00 AM
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, moment(row.original.created_at).format('MM/DD/YYYY HH:mm A')),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('ip_location', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Location',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.ip_location || '-'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('from_web', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'From Web',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.from_web ? 'YES' : 'NO'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.display({
  id: 'actions',
  header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Action'),
  cell: ({ row }) => h('div', { class: 'flex items-center gap-2 justify-center' }, [
    h(Button, {
      size: 'sm',
      variant: 'outline',
      class: 'flex items-center gap-1 border-green-600 bg-green-50 text-green-600 hover:text-green-600',
      onClick: () => {
        selectedRowData.value = row.original // Set the row data
        approveDialogOpen.value = true
      },
    }, [
      h(Icon, { name: 'material-symbols:check', class: 'text-green-600' }),
      'Approve',
    ]),
    h(Button, {
      size: 'sm',
      variant: 'outline',
      class: 'flex items-center gap-2 border-red-600 bg-red-50 text-red-600 hover:text-red-600',
      onClick: () => {
        selectedRowData.value = row.original // Set the row data
        declineDialogOpen.value = true
      },
    }, [
      h(Icon, { name: 'material-symbols:close', class: 'text-red-600' }),
      'Decline',
    ]),
  ]),
}),
]

const table = useVueTable({
  get data() { return props.list || [] },
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
            class="bg-gray-50 text-center"
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
   <ConfigurationIpSettingsApproveDialog 
  v-model:open="approveDialogOpen" 
  :row-data="selectedRowData"
/>
<ConfigurationIpSettingsDeclineDialog 
  v-model:open="declineDialogOpen" 
  :row-data="selectedRowData"
/>
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

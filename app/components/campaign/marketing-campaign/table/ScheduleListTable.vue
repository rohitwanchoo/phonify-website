<script setup lang="ts">
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h } from 'vue'
import { useRouter } from 'vue-router'
import ConfigurationSmtpSettingsActionDropdown from '@/components/configuration/smtp-settings/ActionDropDown.vue'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
  list?: any[]
  loading?: boolean
}>(), {
  list: () => [],
  loading: false,
})

const emits = defineEmits(['duplicateRow', 'deleteRow', 'updateStatus'])

const mockData = [
  {
    id: 1,
    list: 'List A',
    template: 'Welcome',
    account: 'Account 1',
    type: 'Email',
    scheduled_time: '2024-06-01 10:00',
    complete_time: '2024-06-01 10:05',
    status: 'success',
    total: 100,
    sent: 98,
    failed: 2,
  },
  {
    id: 2,
    list: 'List B',
    template: 'Promo',
    account: 'Account 2',
    type: 'SMS',
    scheduled_time: '2024-06-02 14:00',
    complete_time: '2024-06-02 14:10',
    status: 'failed',
    total: 50,
    sent: 30,
    failed: 20,
  },
  {
    id: 3,
    list: 'List C',
    template: 'Reminder',
    account: 'Account 3',
    type: 'Email',
    scheduled_time: '2024-06-03 09:00',
    complete_time: '2024-05-02 24:10',
    status: 'planned',
    total: 200,
    sent: 0,
    failed: 0,
  },
]

const router = useRouter()

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        '#',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('list', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        'List',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.list),
  }),
  columnHelper.accessor('template', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        'Template',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.template),
  }),
  columnHelper.accessor('account', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        'Account',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.account),
  }),
  columnHelper.accessor('type', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        'Type',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.type),
  }),
  columnHelper.accessor('scheduled_time', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        'Scheduled Time',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.scheduled_time),
  }),
  columnHelper.accessor('complete_time', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        'Complete Time',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.complete_time),
  }),
  columnHelper.accessor('status', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Status',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => {
      let color = ''
      let label = ''
      if (row.original.status === 'success') {
        color = 'bg-green-600'
        label = 'Success'
      }
      else if (row.original.status === 'failed') {
        color = 'bg-red-600'
        label = 'Failed'
      }
      else {
        color = 'bg-violet-700'
        label = 'Planned'
      }
      return h('div', {
        class: `inline-flex items-center w-22 justify-center rounded-full px-3 py-1 text-sm text-white ${color}`,
      }, label)
    },
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('total', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        'Total',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.total),
  }),
  columnHelper.accessor('sent', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        'Sent',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.sent),
  }),
  columnHelper.accessor('failed', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center' }, [
        'Failed',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.failed),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) =>
      h('div', {
        class: 'flex items-center justify-center gap-2 sticky right-0 z-10',
      }, [
        h(Button, {
          size: 'icon',
          variant: 'outline',
          class: 'text-primary h-8 w-15 min-w-0 flex items-center gap-1 px-2',
          title: 'Edit',
          onClick: () => {
            router.push(`/app/configuration/smtp-settings/add-smtp?mode=edit&id=${row.original.id}`)
          },
        }, [
          h(Icon, { name: 'material-symbols:edit-square', size: 14 }),
          h('span', { class: 'text-xs font-medium' }, 'Edit'),
        ]),
        h(ConfigurationSmtpSettingsActionDropdown, {
          onDuplicate: () => emits('duplicateRow', row.original),
          onDelete: () => emits('deleteRow', row.original),
        }),
      ]),
    meta: { sticky: 'right' },
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  get data() { return mockData },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  manualPagination: true,
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})
</script>

<template>
  <div class="border rounded-lg my-6 overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="bg-gray-50"
            :class="header.column.id === 'actions' ? 'sticky right-0 z-10 !bg-white' : ''"
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
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="cell.column.id === 'actions' ? 'sticky right-0 z-10 bg-white' : 'p-3 text-center'"
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

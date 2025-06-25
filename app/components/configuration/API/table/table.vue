<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = withDefaults(defineProps<{
  list: any[]
  loading?: boolean
}>(), {
  list: () => [],
  loading: false,
})

const emits = defineEmits(['view-activity'])

const router = useRouter()

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      '#',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('api_name', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'API Name',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.api_name),
  }),
  columnHelper.accessor('campaign_name', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Campaign Name',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.campaign_name),
  }),
  columnHelper.accessor('url', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'URL',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.url),
  }),
  columnHelper.accessor('method', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Method',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.method),
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Status',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) =>
      h('span', {
        class: `inline-flex items-center justify-center px-0 py-1 w-[80px] rounded-full text-xs font-semibold ${
          row.original.status === 'Active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`,
      }, row.original.status),
  }),
  columnHelper.accessor('api_template', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'API Template',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) =>
      h('span', {
        class: `text-sm font-medium ${
          row.original.api_template === 'Yes' ? 'text-green-600' : 'text-red-600'
        }`,
      }, row.original.api_template),
  }),
  columnHelper.accessor('date_created', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Date Created',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.date_created),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center gap-2' }, [
      h(Button, {
        size: 'icon',
        variant: 'outline',
        class: 'text-primary h-8 w-[60px] min-w-0 flex items-center gap-1 px-2',
        title: 'Edit',
        onClick: () => {
          emits('edit-row', row.original)
        },
      }, [
        h(Icon, { name: 'material-symbols:edit-square', size: 18 }),
        h('span', { class: 'text-xs font-medium' }, 'Edit'),
      ]),
      h(Button, {
        size: 'icon',
        variant: 'ghost',
        class: 'p-1 hover:bg-gray-100',
        onClick: () => {
          emits('row-menu', row.original)
        },
      }, [
        h(Icon, { name: 'lucide:more-vertical', class: 'w-4 h-4 text-gray-600' }),
      ]),
    ]),
  }),
]

const table = useVueTable({
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
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
            Loading...
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
</template>

<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import ConfigurationApiActionDropdown from '@/components/configuration/api/ActionDropdown.vue'
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

const emits = defineEmits(['view-activity', 'edit-row', 'duplicate-row', 'delete-row'])
const router = useRouter()

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'inline-flex items-center justify-center w-full' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('title', { // Changed from api_name to title to match data
    id: 'api_name',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'API Name',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.title),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('campaign', { // Changed from campaign_name to campaign to match data
    id: 'campaign_name',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Campaign Name',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.campaign),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('url', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'URL',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.url),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('method', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Method',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.method),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('is_deleted', { // Changed from status to is_deleted to match data
    id: 'status',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Status',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) =>
      h('span', {
        class: `inline-flex items-center justify-center px-0 py-1 h-6 w-[80px] rounded-full text-xs ${
          row.original.is_deleted !== '0' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`,
      }, row.original.is_deleted === '0' ? 'Inactive' : 'Active'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('is_default', { // Changed from api_template to is_default to match data
    id: 'api_template',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'API Template',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) =>
      h('span', {
        class: `text-sm font-medium ${
          row.original.is_default === '1' ? 'text-green-600' : 'text-red-600'
        }`,
      }, row.original.is_default === '1' ? 'Yes' : 'No'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('updated_at', { // Changed from date_created to updated_at to match data
    id: 'date_created',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Date Created',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.updated_at),
    sortingFn: 'datetime',
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center gap-2' }, [
      h(Button, {
        size: 'icon',
        variant: 'outline',
        class: 'text-primary h-8 w-15 min-w-0 flex items-center gap-1 px-2',
        title: 'Edit',
        onClick: () => {
          emits('edit-row', row.original)
        },
      }, [
        h(Icon, { name: 'material-symbols:edit-square', size: 14 }),
        h('span', { class: 'text-xs font-medium' }, 'Edit'),
      ]),
      h(ConfigurationApiActionDropdown, {
        onDuplicate: () => emits('duplicate-row', row.original),
        onDelete: () => emits('delete-row', row.original),
      }),
    ]),
  }),
]

const table = useVueTable({
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
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
        <TableRow v-if="props.loading">
          <TableCell :colspan="columns.length" class="px-3 py-4">
            <div class="space-y-2">
              <BaseSkelton
                v-for="i in 10"
                :key="i"
                class="h-8 w-full"
                rounded="rounded-md"
              />
            </div>
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

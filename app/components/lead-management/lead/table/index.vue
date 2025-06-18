<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
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
import { useRouter } from 'vue-router'

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
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('name', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Lead ID',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.name),
  }),
  columnHelper.accessor('day', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'First Name',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.day),
  }),
  columnHelper.accessor('from_time', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Last Name',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.from_time),
  }),
  columnHelper.accessor('to_time', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Mobile',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.to_time),
  }),
  columnHelper.accessor('description', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Email',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.description),
  }),
  columnHelper.accessor('description', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'State',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.description),
  }),
  columnHelper.accessor('description', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Legal Company Name',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.description),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-center' }, [
      h(Button, {
        size: 'sm',
        class: 'bg-white text-black border border-[#162D3A] flex items-center gap-2 hover:bg-transparent hover:text-inherit',
        onClick: () => {
          router.push('/app/lead-management/lead/lead-activity')
        },
      }, [
        h(Icon, { name: 'material-symbols:person', filled: true, class: 'text-base text-black' }),
        'View Activity',
      ]),
      h(Button, {
        size: 'sm',
        class: 'bg-[#162D3A] text-white flex items-center gap-2 hover:bg-[#162D3A] hover:text-white',
      }, [
        h(Icon, { name: 'material-symbols:call-log', filled: true, class: 'text-base text-white' }),
        'Call Record',
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

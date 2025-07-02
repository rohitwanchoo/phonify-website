<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
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

const props = withDefaults(defineProps<{
  list: any[]
  loading?: boolean
}>(), {
  list: () => [],
  loading: false,
})

const emits = defineEmits(['view-activity', 'edit-row', 'duplicate-row', 'delete-row', 'update-status'])
const router = useRouter()

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('type', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Type',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.type),
  }),
  columnHelper.accessor('sender', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Sender',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.sender),
  }),
  columnHelper.accessor('mail_driver', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Mail Driver',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.mail_driver),
  }),
  columnHelper.accessor('host', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Host',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.host),
  }),
  columnHelper.accessor('port', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Port',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.port),
  }),
  columnHelper.accessor('username', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Username',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.username),
  }),
  columnHelper.accessor('encryption', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Encryption',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.encryption),
  }),
  columnHelper.accessor('status', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, h(Switch, {
        'class': 'data-[state=checked]:bg-green-600 cursor-pointer',
        'modelValue': row.original.status === true || row.original.status === 1,
        'onUpdate:modelValue': (val: boolean) => {
          emits('update-status', { row: row.original, value: val })
        },
      })),
    sortingFn: (rowA, rowB, columnId) => {
      const valueA = rowA.original.status === 1 || rowA.original.status === true
      const valueB = rowB.original.status === 1 || rowB.original.status === true
      if (valueA === valueB)
        return 0
      if (valueA && !valueB)
        return -1
      if (!valueA && valueB)
        return 1
      return 0
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) =>
      h('div', {
        class: 'flex items-center justify-center gap-2 sticky right-0 bg-white z-10',
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
          onDuplicate: () => emits('duplicate-row', row.original),
          onDelete: () => emits('delete-row', row.original),
        }),
      ]),
    meta: { sticky: 'right' },
  }),
]

const table = useVueTable({
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
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
            :class="header.column.id === 'actions' ? 'sticky right-0 z-10 bg-white' : ''"
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

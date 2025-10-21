<script setup lang="ts">
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { useConfirmDialog } from '@vueuse/core'
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

const emits = defineEmits(['updateStatus', 'refresh'])
const router = useRouter()

const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

async function deleteMethod(id: number) {
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled) {
    return false
  }
  useApi().delete(`smtp/${id}`).then((response) => {
    showToast({
      message: response.message,
    })
    emits('refresh')
  }).catch((err) => {
    showToast({
      type: 'error',
      message: err.message,
    })
  })
}

function duplicate(id: number) {
  useApi().post('/copy-smtp', {
    id,
  }).then((response) => {
    showToast({
      message: response.message,
    })
    emits('refresh')
  }).catch((err) => {
    showToast({
      type: 'error',
      message: err.message,
    })
  })
}

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('sender_type', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Type',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.sender_type || '-'),
  }),

  columnHelper.accessor('from_name', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Sender',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.from_name || '-'),
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
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.mail_driver || '-'),
  }),

  columnHelper.accessor('mail_host', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Host',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.mail_host || '-'),
  }),

  columnHelper.accessor('mail_port', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Port',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.mail_port || '-'),
  }),

  columnHelper.accessor('mail_username', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Username',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.mail_username || '-'),
  }),

  columnHelper.accessor('mail_encryption', {
    header: ({ column }) => h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
      'Encryption',
      h(Button, {
        class: 'p-0 bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.mail_encryption || '-'),
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
        'modelValue': row.original.status === 1,
        'onUpdate:modelValue': (val: boolean) => {
          emits('updateStatus', { row: row.original, value: val })
        },
      })),

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
          onDuplicate: () => duplicate(row.original.id),
          onDelete: () => deleteMethod(row.original.id),
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
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  // initialState: { pagination: { pageSize: props.limit } },
  manualPagination: true,
  // pageCount: last_page.value,
  // rowCount: total.value,
  state: {
    // pagination: {
    //   // pageIndex: current_page.value,
    //   // pageSize: per_page.value,
    // },
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

  <ConfirmAction v-model="showDeleteConfirm" :confirm="deleteConfirm" :cancel="deleteCancel" title="Delete Extension" description="You are about to delete extension. Do you wish to proceed?" />
</template>

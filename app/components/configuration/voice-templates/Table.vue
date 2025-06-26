<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown, MoreVertical } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import EditVoipConfigurationDialog from '~/components/configuration/voip-configuration/EditVoipConfigurationDialog.vue'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
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
    templateName: 'Template #1',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: true,
  },
  {
    templateName: 'Template #2',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: false,
  },
  {
    templateName: 'Template #3',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: true,
  },
  {
    templateName: 'Template #4',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: false,
  },
  {
    templateName: 'Template #5',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: true,
  },
  {
    templateName: 'Template #6',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: false,
  },
  {
    templateName: 'Template #7',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: true,
  },
  {
    templateName: 'Template #8',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: false,
  },
  {
    templateName: 'Template #9',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: true,
  },
  {
    templateName: 'Template #10',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: false,
  },
  {
    templateName: 'Template #11',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: true,
  },
  {
    templateName: 'Template #12',
    message: 'Hello {First Name} , According to our records, your business is in fact eligible for $50000 Capital at this time. For more information please press 1 now. If you think we have reached out in error, or simply not interested, please press 2 now. and you will be removed from our client list. Thank you and have a great day.',
    status: false,
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
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('templateName', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Template Name',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.templateName),
  }),
  columnHelper.accessor('message', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Message',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm truncate max-w-[54vw]' }, row.original.message),
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
          row.original.status = val ? 1 : 0
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
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2 justify-center' }, [
      h(Button, {
        size: 'sm',
        variant: 'outline',
        class: 'flex items-center gap-2 border-primary text-primary',
        onClick: () => {
          // Listen action placeholder
        },
      }, [
        h(Icon, { name: 'material-symbols:volume-up', filled: true, class: 'text-base text-primary' }),
        'Listen',
      ]),
      h(DropdownMenu, {
        'open': dropdownOpen.value === row.index,
        'onUpdate:open': (val: boolean) => {
          if (val)
            openDropdown(row.index)
          else closeDropdown()
        },
      }, {
        default: () => [
          h(DropdownMenuTrigger, { as: 'span', class: 'flex items-center justify-center h-full cursor-pointer' }, [
            h(MoreVertical, { class: 'h-5 w-5' }),
          ]),
          h(DropdownMenuContent, { align: 'end', class: 'min-w-[120px]' }, [
            h(DropdownMenuItem, {
              class: 'cursor-pointer flex items-center gap-2',
              onClick: () => {
                openEditDialog(row)
                closeDropdown()
              },
            }, [
              h(Icon, { name: 'material-symbols:edit-square-outline', class: 'text-base' }),
              'Edit',
            ]),
            h(DropdownMenuItem, {
              class: 'text-red-600 cursor-pointer flex items-center gap-2',
              onClick: () => handleDelete(row),
            }, [
              h(Icon, { name: 'material-symbols:delete-outline', class: 'text-base' }),
              'Delete',
            ]),
          ]),
        ],
      }),
    ]),
  }),
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
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" class="align-middle">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="bg-gray-50 align-middle"
          >
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id" class="align-middle">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-3 text-center align-middle">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="text-center h-24 align-middle">
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

<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown, MoreVertical } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import EditVoipConfigurationDialog from '~/components/configuration/voip-configuration/EditVoipConfigurationDialog.vue'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
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
    name: 'VoIP Config. #1',
    host: '178.025.074.100',
    username: 'user_name_123',
    password: 'kj967HBViu92$*&jh',
  },
  {
    name: 'VoIP Config. #2',
    host: '178.025.074.101',
    username: 'user_name_456',
    password: 'aB1234!@#xyz',
  },
  {
    name: 'VoIP Config. #3',
    host: '178.025.074.102',
    username: 'user_name_789',
    password: 'passWORD!@#321',
  },
  {
    name: 'VoIP Config. #4',
    host: '178.025.074.103',
    username: 'user_name_abc',
    password: 'Zxcvbnm123$%',
  },
  {
    name: 'VoIP Config. #5',
    host: '178.025.074.104',
    username: 'user_name_def',
    password: 'Qwerty!@#456',
  },
  {
    name: 'VoIP Config. #6',
    host: '178.025.074.105',
    username: 'user_name_ghi',
    password: 'Asdfgh789*&^',
  },
  {
    name: 'VoIP Config. #7',
    host: '178.025.074.106',
    username: 'user_name_jkl',
    password: 'Poiuyt0987^%',
  },
  {
    name: 'VoIP Config. #8',
    host: '178.025.074.107',
    username: 'user_name_mno',
    password: 'Lkjhgf654!@',
  },
  {
    name: 'VoIP Config. #9',
    host: '178.025.074.108',
    username: 'user_name_pqr',
    password: 'Mnbvcxz321$%',
  },
  {
    name: 'VoIP Config. #10',
    host: '178.025.074.109',
    username: 'user_name_stu',
    password: 'Trewq0987!@#',
  },
  {
    name: 'VoIP Config. #11',
    host: '178.025.074.110',
    username: 'user_name_vwx',
    password: 'Yuiop1234^&*',
  },
  {
    name: 'VoIP Config. #12',
    host: '178.025.074.111',
    username: 'user_name_yza',
    password: 'Plmokn987!@#',
  },
]

const router = useRouter()
const columnHelper = createColumnHelper<any>()

const editDialogOpen = ref(false)
const editRow = ref<any>(null)
const dropdownOpen = ref<number | null>(null)
const loading = ref(false)

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
  columnHelper.accessor('name', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Name',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.name),
  }),
  columnHelper.accessor('host', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Host',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.host),
  }),
  columnHelper.accessor('username', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Username',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.username),
  }),
  columnHelper.accessor('password', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Password'),
    cell: ({ row }) => h('div', { class: 'text-center font-mono text-sm' }, row.original.password),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2 justify-center' }, [
      h(Button, {
        size: 'sm',
        variant: 'outline',
        class: 'flex items-center gap-2 border-primary text-primary',
        onClick: () => openEditDialog(row),
      }, [
        h(Icon, { name: 'material-symbols:edit-square-outline', filled: true, class: 'text-primary' }),
        'Edit',
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

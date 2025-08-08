<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { useConfirmDialog } from '@vueuse/core'
import { ChevronsUpDown, MoreVertical } from 'lucide-vue-next'
import { h, ref } from 'vue'

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

const props = defineProps<Props>()

const emits = defineEmits(['refresh'])

interface VoiceTemplate {
  templete_id: number
  templete_name: string
  templete_desc: string
  status: boolean
}

interface Props {
  list: VoiceTemplate[]
  loading?: boolean
}

const columnHelper = createColumnHelper<VoiceTemplate>()

const dropdownOpen = ref<number | null>(null)
const sorting = ref([])

// Mock pagination meta data
const meta = ref({
  current_page: 1,
  per_page: 10,
  total: 20,
  last_page: 12,
})

function openDropdown(rowIdx: number) {
  dropdownOpen.value = rowIdx
}

function closeDropdown() {
  dropdownOpen.value = null
}
const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const selectedRowForDelete = ref<VoiceTemplate>()

function handleDeleteConfirm() {
  useApi().delete(`/voice-template/${selectedRowForDelete.value?.templete_id}`).then((response) => {
    showToast({ message: response.message })
    emits('refresh')
  }).catch((error) => {
    showToast({
      type: 'error',
      message: error.message,
    })
  })
}

async function handleDelete(row: any) {
  selectedRowForDelete.value = row.original
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled)
    return

  handleDeleteConfirm()
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
  columnHelper.accessor('templete_name', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Template Name',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.templete_name),
  }),
  columnHelper.accessor('templete_desc', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Message',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-xs truncate max-w-[30vw] xl:max-w-[40vw] mx-auto' }, row.original.templete_desc),
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
                navigateTo({ path: '/app/configuration/voice-templates/add', query: { id: row.original.templete_id } })
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
  get data() { return props.list || [] },
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
        <TableRow v-if="loading">
          <TableCell :colspan="columns?.length" class="h-12 text-center px-2 bg-white">
            <BaseSkelton v-for="i in 9" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
          </TableCell>
        </TableRow>
        <template v-else-if="table.getRowModel().rows?.length">
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
  </div>
  <div v-if="meta?.current_page && !loading" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing
        <span>
          <Select :default-value="meta.per_page">
            <SelectTrigger class="w-fit gap-x-1 px-2">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in [10, 25, 50, 100]" :key="n" :value="n">
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
  <ConfirmAction
    v-model="showDeleteConfirm"
    :confirm="deleteConfirm"
    :cancel="deleteCancel"
    title="Delete Voice Template"
    description="You are about to delete this Voice Template. Do you wish to proceed?"
  />
</template>

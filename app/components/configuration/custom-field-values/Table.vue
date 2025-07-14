<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { useConfirmDialog } from '@vueuse/core'
import { ChevronsUpDown, MoreVertical } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

const props = defineProps<{
  list?: any
  loading?: boolean
  refresh: () => void
}>()

const columnHelper = createColumnHelper<any>()
const editDialogOpen = ref(false)
const editRow = ref<any>(null)
const dropdownOpen = ref<number | null>(null)
const selectedRowForDelete = ref<any>(null)

// Integrated confirm dialog logic from reference code
const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

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

async function handleDelete(row: any) {
  selectedRowForDelete.value = row.original
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled) {
    selectedRowForDelete.value = null
    return
  }
  await handleDeleteConfirm()
}

const sorting = ref([])

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Sl. No'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('title_match', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Title',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.title_match),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('title_links', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Title Links',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.title_links),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('is_deleted', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Status',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', {
      class: `inline-flex items-center w-22 justify-center rounded-full px-3 py-1 text-sm flex justify-center items-center text-white ${
        row.original.is_deleted === 0 ? 'bg-green-600' : 'bg-red-600'
      }`,
    }, row.original.is_deleted === 0 ? 'Active' : 'Inactive'),
    sortingFn: 'alphanumeric',
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
        h(Icon, { name: 'material-symbols:edit-square-outline', class: 'text-primary' }),
        'Edit',
      ]),
      h(DropdownMenu, {
        'open': dropdownOpen.value === row.index,
        'onUpdate:open': (val: boolean) => {
          if (val) {
            openDropdown(row.index)
          }
          else {
            closeDropdown()
          }
        },
      }, () => [
        h(DropdownMenuTrigger, { asChild: true }, [
          h(Button, {
            variant: 'ghost',
            size: 'sm',
            class: 'border-none hover:bg-transparent shadow-none',
          }, [
            h(MoreVertical, { class: 'h-4 w-4' }),
          ]),
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
      ]),
    ]),
  }),
]

const table = useVueTable({
  get data() { return props.list },
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
const loading = ref(false)

function handlePageChange(page: number) {
  meta.value.current_page = page
}

async function handleDeleteConfirm() {
  if (!selectedRowForDelete.value)
    return
  const id = selectedRowForDelete.value.id
  useApi().get(`/delete-custom-field-value/${id}`).then((response) => {
    showToast({
      message: response.message,
      type: response.success ? 'success' : 'error',
    })

    if (response.success) {
      if (typeof props.refresh === 'function') {
        props.refresh()
      }
    }
  }).catch((error) => {
    console.error('Error deleting custom field value:', error)
    showToast({
      message: 'Failed to delete custom field value.',
      type: 'error',
    })
  })
  selectedRowForDelete.value = null
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
      <!-- Replaced with the new combined dialog component -->
      <ConfigurationCustomFieldValuesDialog
        :open="editDialogOpen"
        :row-data="editRow"
        :refresh="props.refresh"
        @update:open="val => editDialogOpen = val"
      />
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
    title="Delete Custom Field Value"
    description="You are about to delete this custom field value. Do you wish to proceed?"
  />
</template>

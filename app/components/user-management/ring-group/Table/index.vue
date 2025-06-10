<script setup lang="ts">
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

import { Icon } from '#components'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { useConfirmDialog } from '@vueuse/core'
import { ChevronsUpDown, CircleCheck, Copy } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { valueUpdater } from '@/components/ui/table/utils'

import { cn } from '@/lib/utils'
import resetImage from '~/assets/svg/reset.svg'
import Action from './Action.vue'

const props = defineProps<{
  loading: boolean
  // meta: Meta
  list: any[]
}>()

const emits = defineEmits(['pageNavigation', 'refresh'])

interface Meta {
  current_page: number
  per_page: number
  last_page: number
  total: number
}

const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const {
  isRevealed: showResetConfirm,
  reveal: revealResetConfirm,
  confirm: resetConfirm,
  cancel: resetCancel,
} = useConfirmDialog()

async function deleteMethod() {
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled) {
    return false
  }
  // console.log(row)
  // TODO: API CALL HERE

  showToast({
    type: 'success',
    message: 'Ring Group deleted successfully',
  })
}







interface GroupList {
  id: number
  title: string
  description: string
  number_of_extension: string
  emails: string
  actions: string
  extension_count: number
}

const columnHelper = createColumnHelper<GroupList>()

const columns = [
  columnHelper.accessor('#', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('title', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.title),
  }),

  columnHelper.accessor('description', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Description'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center justify-center gap-2 text-sm font-normal' }, row.original.description),
  }),

  columnHelper.accessor('extension_count', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['No. of Extension', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center gap-1 text-sm font-normal' }, [
      row.original.extension_count,
      h(Icon, { name:'material-symbols:visibility-outline', class:'h-5 w-5 cursor-pointer' }),
      ]),
  }),

  columnHelper.accessor('emails', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Email'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.emails),
  }),

  columnHelper.accessor('actions', {
    header: () => h('div', { class: 'text-center ml-auto w-fit mr-8' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
      h(Button, { size: 'icon', variant: 'outline', class: 'cursor-pointer' }, h(Icon, { name: 'material-symbols:edit-square' })),
      h(Button, { size: 'icon', variant: 'outline', class: 'cursor-pointer border-red-600 text-red-600 hover:text-red-600/80', onClick:() => deleteMethod() }, h(Icon, { name: 'material-symbols:delete' })),

    ]),
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
  initialState: { pagination: { pageSize: 10 } },
  manualPagination: true,
  pageCount: props.meta?.last_page,
  rowCount: props.meta?.total,
  state: {
    pagination: {
      pageIndex: props.meta?.current_page,
      pageSize: props.meta?.per_page,
    },
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function savePassword() {
  changePasswordModel.value = false
  showToast({
    type: 'success',
    message: 'Password changed successfully',
  })
}
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers" :key="header.id"
            class="bg-gray-50"
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
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <TableRow :data-state="row.getIsSelected() && 'selected'">
              <TableCell
                v-for="cell in row.getVisibleCells()" :key="cell.id"
                class="p-[12px]"
              >
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
            <TableRow v-if="row.getIsExpanded()">
              <TableCell :colspan="row.getAllCells().length">
                {{ JSON.stringify(row.original) }}
              </TableCell>
            </TableRow>
          </template>
        </template>

        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div v-if="meta?.current_page && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ meta?.current_page }} to

        <span>
          <Select :default-value="10">
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
      <!-- Pagination Controls -->
      <TableServerPagination
        :total-items="Number(meta?.total)" :current-page="Number(meta?.current_page)"
        :items-per-page="Number(meta?.per_page)" :last-page="Number(meta?.last_page)" @page-change="handlePageChange"
      />
    </div>
  </div>

  <!-- CONFIRM DELETE -->
  <ConfirmAction v-model="showDeleteConfirm" :confirm="deleteConfirm" :cancel="deleteCancel" title="Delete Group List" description="You are about to delete group list. Do you wish to proceed?" />
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>

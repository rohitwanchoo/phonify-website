<script setup lang="ts">
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { Icon } from '#components'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

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
import { valueUpdater } from '@/components/ui/table/utils'
import { cn } from '@/lib/utils'
import Actions from './Actions.vue'

const props = withDefaults(defineProps<Props>(), {

})
const emits = defineEmits(['pageNavigation', 'toggleChange', 'deleteUser', 'goToProfile'])
interface Meta {
  current_page: number
  per_page: number
  last_page: number
}
interface Props {
  list: { [key: string]: any }[]
  loading?: boolean
  meta?: Meta
}

export interface Extension {
  siNo?: number
  user_id: number
  extension: string
  first_name: string
  last_name: string
  email: string
  phoneNumber: string
  webPhone: string
  actions: string

}
const sheet = ref(false)


const columnHelper = createColumnHelper<Extension>()

const extensionLoadingId = ref(0)

const extensionById = ref<Extension>()
function getExtensionByID(id: number) {
  extensionLoadingId.value = id

  useApi().post('extension', {
    extension_id: id,
  }).then((res: any) => {
    extensionById.value = res.data
    sheet.value = true
  }).catch(({ data }) => {
    showToast({
      type: 'error',
      message: data.message,
    })
  }).finally(() => {
    extensionLoadingId.value = 0
  })
}

const columns = [

  columnHelper.accessor('siNo', {
    header: () => h('div', { class: 'text-center text-sm font-normal pl-4' }, '#'),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm pl-4' }, row.index + 1)
    },
  }),

  columnHelper.accessor('extension', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, { class: 'text-center text-sm font-normal', variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') }, () => ['Extension', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('extension') || '-')
    },
  }),

  columnHelper.accessor(row => `${row.first_name} ${row.last_name}`, {
    id: 'name',
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => h('div', { class: 'lowercase text-center text-sm' }, `${row.original.first_name} ${row.original.last_name}` || '-'),
  }),

  columnHelper.accessor('actions', {
    header: () => {
      return h('div', { class: 'text-center' }, 'Actions')
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
         h(Button, { size: 'icon', class: 'cursor-pointer', onClick: () => getExtensionByID(row.original?.user_id) }, h(Icon, { name: extensionLoadingId.value === row.original?.user_id ? 'eos-icons:bubble-loading' : 'lucide:eye' })),
        h(Actions),
        // h(Button, { size: 'icon', variant: 'ghost', class: 'cursor-pointer' }, h(Icon, { name: 'lucide:ellipsis-vertical', size: '20' })),
      ])
    },
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
</script>

<template>
  <div class="w-full overflow-hidden">
    <Table>
      <TableHeader v-if="table.getRowModel().rows?.length && !loading" class="bg-gray-200 h-[54px]">
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" class="">
          <TableHead
            v-for="header in headerGroup.headers" :key="header.id" :data-pinned="header.column.getIsPinned()"
            class=""
            :class="cn(
              { 'sticky bg-red-500': header.column.getIsPinned() },
              header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
            )"
          >
            <FlexRender
              v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody class="bg-white">
        <TableRow v-if="loading">
          <TableCell :colspan="columns?.length" class="h-20 text-center">
            <BaseSkelton v-for="i in 10" :key="i" class="h-11 w-full mb-4" />
          </TableCell>
        </TableRow>
        <template v-else-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="(row) in table.getRowModel().rows"
            :key="row.id" class="text-xs sm:text-sm"
            :data-state="row.getIsSelected() && 'selected'"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-2 text"
              :data-pinned="cell.column.getIsPinned()" :class="cn(
                { 'sticky bg-background/95 ': cell.column.getIsPinned() },
                cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
              )"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>

        <TableRow v-else>
          <TableCell :colspan="columns?.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>

 <!-- DETAILS -->
  <UserManagementDetails v-model:open="sheet" :data="extensionById as Extension"  />
</template>

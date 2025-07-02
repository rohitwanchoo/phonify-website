<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { useDraggable, useWindowSize } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'
import moment from 'moment'
import { computed, h, ref, watch } from 'vue'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Separator } from '~/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { valueUpdater } from '~/components/ui/table/utils'

const props = defineProps<Props>()

const el = useTemplateRef<HTMLElement>('el')

const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
})

interface IpList {
  approval_status: number
  approvedBy: string
  client_id: number
  created_at: string // ISO 8601 format
  from_web: number
  ip_location: string | null
  last_login_at: string // "YYYY-MM-DD HH:mm:ss" format
  last_login_user: number
  server_ip: string
  updated_at: string // ISO 8601 format
  updated_by: number | null
  user: string
  whitelist_ip: string

}

interface Props {
  list: IpList[]
  loading?: boolean
}

const columnHelper = createColumnHelper<IpList>()

const approveDialogOpen = ref(false)
const declineDialogOpen = ref(false)
const selectedRowData = ref<IpList[]>()

const columns = [

  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': value => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
    }),
    enableSorting: false,
    enableHiding: false,
  },

  columnHelper.accessor('whitelist_ip', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'IP Address',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.whitelist_ip),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('user', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'User',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.user || '-'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('server_ip', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Server',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.server_ip),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Time',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    // 06/09/2025 10:00 AM
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, moment(row.original.created_at).format('MM/DD/YYYY HH:mm A')),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('ip_location', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'Location',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.ip_location || '-'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('from_web', {
    header: ({ column }) =>
      h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
        'From Web',
        h(Button, {
          class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
      ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.from_web ? 'YES' : 'NO'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2 justify-center' }, [
      h(Button, {
        size: 'sm',
        variant: 'outline',
        class: 'flex items-center gap-1 border-green-600 bg-green-50 text-green-600 hover:text-green-600',
        onClick: () => {
          selectedRowData.value = [row.original]// Set the row data
          approveDialogOpen.value = true
        },
      }, [
        h(Icon, { name: 'material-symbols:check', class: 'text-green-600' }),
        'Approve',
      ]),
      h(Button, {
        size: 'sm',
        variant: 'outline',
        class: 'flex items-center gap-2 border-red-600 bg-red-50 text-red-600 hover:text-red-600',
        onClick: () => {
          selectedRowData.value = [row.original] // Set the row data
          declineDialogOpen.value = true
        },
      }, [
        h(Icon, { name: 'material-symbols:close', class: 'text-red-600' }),
        'Decline',
      ]),
    ]),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
  },
})

const selectedIps = ref<any>([])

watch(rowSelection, (newVal: Record<string, boolean>) => {
  selectedIps.value = Object.keys(newVal) // Get the selected keys
    .filter(key => newVal[key]) // Filter keys with a true value
    .map(key => props.list[key]) // Map keys to items in props.list
}, { deep: true })

// Mock pagination meta data
const meta = ref({
  current_page: 1,
  per_page: 10,
  total: 120,
  last_page: 12,
})

function handlePageChange(page: number) {
  // For now, just update the mock meta
  meta.value.current_page = page
  // You can set loading.value = true and simulate data fetching if needed
}

function onClickBulkApprove() {
  selectedRowData.value = selectedIps.value
  approveDialogOpen.value = true
}

function onClickBulkDecline() {
  selectedRowData.value = selectedIps.value
  declineDialogOpen.value = true
}

function clearSelected() {
  rowSelection.value = {}
  selectedIps.value = []
}
onMounted(() => {
  x.value = useWindowSize().width.value / 3
  y.value = useWindowSize().height.value - 230
})
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden relative">
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
        <TableRow v-if="loading">
          <TableCell :colspan="columns?.length" class="h-12 text-center px-2 bg-white">
            <BaseSkelton v-for="i in 9" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
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
    <ConfigurationIpSettingsApproveDialog
      v-model:open="approveDialogOpen"
      :row-data="selectedRowData"
    />
    <ConfigurationIpSettingsDeclineDialog
      v-model:open="declineDialogOpen"
      :row-data="selectedRowData"
    />
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
    <!-- Drag select -->
  </div>
  <div v-if="selectedIps.length" ref="el" :style="style" class=" z-10 fixed flex items-center center gap-x-3 bg-white border px-3 py-4 rounded-xl shadow-2xs">
    <div class="flex items-center gap-x-3">
      <Icon name="lucide:grip-vertical" class="cursor-grab" />
      <div class="font-semibold">
        {{ selectedIps.length }} <span class="text-[#162D3A99] font-normal">Selected</span>
      </div>
    </div>
    <Separator orientation="vertical" />
    <div class="flex items-center center gap-x-3">
      <Button variant="outline" class="border-green-300 text-green-600 bg-green-50 hover:bg-green-50 hover:text-green-400" @click="onClickBulkApprove()">
        <Icon name="lucide:check" />
        Approve
      </Button>
      <Button variant="outline" class="border-red-300 text-red-600 bg-red-50 hover:bg-red-50 hover:text-red-500 " @click="onClickBulkDecline()">
        <Icon name="lucide:x" />
        Decline
      </Button>
      <Button variant="outline" size="icon" @click="clearSelected()">
        <Icon name="lucide:x" size="20" />
      </Button>
    </div>
  </div>
</template>

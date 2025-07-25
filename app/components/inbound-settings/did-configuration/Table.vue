<script setup lang="ts">
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronsUpDown, Edit, MoreVertical, Trash2 } from 'lucide-vue-next'

import { h, ref } from 'vue'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: DidConfiguration
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})
const emits = defineEmits(['pageNavigation', 'changeLimit', 'refresh'])
const router = useRouter()

const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

const destinationTypes = {
  0: 'IVR',
  1: 'Extension',
  2: 'Voicemail',
  3: 'DNC',
  4: 'DID',
  5: 'Conferencing',
  6: 'Fax',
  8: 'Ring-Group',
}

interface DidConfiguration {
  cli: string
  voice: string
  status: string
  default_did: string
  conf_id: string
  cnam: string
  dest_type: string
  forward_number: string
  sms: string
  set_exclusive_for_user: string
}

// Dummy meta data
const meta = ref({
  current_page: 1,
  per_page: 10,
  last_page: 5,
  total: 50,
})

const columnHelper = createColumnHelper<DidConfiguration>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('cli', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, 'Phone Number'),
    cell: ({ row }) => {
      const voice = row.original.voice
      const default_did = row.original.default_did
      const conf_id = row.original.conf_id
      return h('div', { class: 'flex items-center justify-center gap-2 ' }, [
        // Phone number
        h('div', formatNumber(row.original.cli)),

        // Three status tags
        h('div', { class: 'flex gap-1' }, [
          default_did
          && h('div', {
            class: 'bg-blue-50 border border-blue-600 text-primary text-xs px-2 py-0.5 rounded-sm',
          }, 'Default'),

          voice
          && h('div', {
            class: 'bg-green-50 border border-green-600 text-primary text-xs px-2 py-0.5 rounded-sm',
          }, 'Voice'),

          conf_id
          && h('div', {
            class: 'bg-purple-50 border border-purple-600 text-primary text-xs px-2 py-0.5 rounded-sm',
          }, 'Configured'),
        ]),
      ])
    },
  }),

  columnHelper.accessor('cnam', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['C Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.original.cnam || '-')
    },
  }),

  columnHelper.accessor('dest_type', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Destination Type', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, destinationTypes[Number(row.original.dest_type) as keyof typeof destinationTypes] || '-')
    },
  }),

  columnHelper.accessor('extension', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Destination', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      // TODO: Need to add bind extension here currently is not available from API
      return h('div', { class: 'text-center font-normal text-sm' }, '-')
    },
  }),

  columnHelper.accessor('sms', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['SMS', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      const isSMS = row.original.sms
      return h('div', {
        class: cn(
          'text-center font-normal text-sm py-1 px-3 inline-flex items-center justify-center w-full',
          isSMS ? 'text-green-600' : 'text-red-600',
        ),
      }, isSMS ? 'Yes' : 'No')
    },
  }),
  columnHelper.accessor('status', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.original.status || '-')
    },
  }),

  columnHelper.accessor('set_exclusive_for_user', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Exclusive User', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      const isExclusive = row.original.set_exclusive_for_user
      return h('div', {
        class: cn(
          'text-center font-normal text-sm py-1 px-3 inline-flex items-center justify-center w-full',
          isExclusive === '1' ? 'text-green-600' : 'text-red-600',
        ),
      }, isExclusive === '1' ? 'Yes' : 'No')
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
      h(DropdownMenu, () => [
        h(DropdownMenuTrigger, { asChild: true }, () =>
          h(Button, {
            variant: 'ghost',
            class: 'h-8 w-8 p-0',
          }, () => h(MoreVertical, { class: 'h-4 w-4' }))),
        h(DropdownMenuContent, { align: 'end' }, () => [
          h(DropdownMenuItem, {
            onClick: () => router.push({ path: '/app/inbound-settings/did-configuration/edit', query: { id: row.original.id } }),
            class: 'flex items-center gap-2',
          }, [
            h(Edit, { class: 'h-4 w-4 text-primary' }),
            'Edit',
          ]),
          h(DropdownMenuItem, {
            onClick: () => console.log('Delete', row.original.id),
            class: 'flex items-center gap-2 text-red-600',
          }, [
            h(Trash2, { class: 'h-4 w-4 text-red-500' }),
            'Delete',
          ]),
        ]),
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

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}
function changeLimit(val: number) {
  emits('changeLimit', val)
}
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers" :key="header.id" :data-pinned="header.column.getIsPinned()"
            class="bg-gray-50"
            :class="cn(
              { 'sticky bg-background/95': header.column.getIsPinned() },
              header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
            )"
          >
            <FlexRender v-if="!header.isPlaceholder" class="" :render="header.column.columnDef.header" :props="header.getContext()" />
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
                v-for="cell in row.getVisibleCells()" :key="cell.id" :data-pinned="cell.column.getIsPinned()"
                class="p-[12px]"
                :class="cn(
                  { 'sticky bg-background/95': cell.column.getIsPinned() },
                  cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                )"
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
          <TableCell
            :colspan="columns.length"
            class="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <div v-if="totalRows && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ current_page }} to

        <span>
          <Select :default-value="10" :model-value="limit" @update:model-value="changeLimit">
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

        of {{ totalRows }} entries
      </div>
    </div>
    <div class="space-x-2">
      <!-- Pagination Controls -->
      <TableServerPagination
        :total-items="Number(total)" :current-page="Number(current_page)"
        :items-per-page="Number(per_page)" :last-page="Number(last_page)" @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

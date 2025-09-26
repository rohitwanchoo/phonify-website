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

import { useConfirmDialog } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'

import moment from 'moment'
import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { cn } from '@/lib/utils'
import Action from './Action.vue'

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})
const emits = defineEmits(['pageNavigation', 'refresh', 'changeLimit', 'edit'])
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

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

  useApi().delete(`/call-timers/${id}`).then((response) => {
    showToast({
      message: response.message,
    })
    emits('refresh')
  }).catch((error) => {
    showToast({ type: 'error', message: error.message })
  })
}

export interface callTimingList {
  id: number
  title: string
  description: string
  week_plan: Partial<Record<string, { start: string, end: string }>>
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

const sheet = ref(false)

const selectedRowData = ref<callTimingList | null>(null)

const editRowData = ref<callTimingList | null>(null)

function editMethod(original: callTimingList) {
  editRowData.value = original
  // edit.value = true\
  emits('edit', original)
}

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number | null) {
  if (val !== null) {
    emits('changeLimit', val)
  }
}

const columnHelper = createColumnHelper<callTimingList>()
const columns = [
  columnHelper.accessor('id', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, props.start + row.index + 1)
    },
  }),

  columnHelper.accessor('title', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, { class: 'text-center text-sm font-normal', variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.getValue('title'))
    },
  }),

  columnHelper.accessor('week_plan', {
    header: () => {
      return h('div', { class: 'text-center text-sm font-normal' }, 'Default Call Time')
    },
    cell: ({ row }) => h('div', { class: 'lowercase text-center text-sm' }, row.original.week_plan?.default ? `${moment(row.original.week_plan.default?.start, 'HH:mm:ss').format('h:mm A')} to ${moment(row.original.week_plan.default?.end, 'HH:mm:ss').format('h:mm A')}` : '-'),
  }),

  // columnHelper.accessor('department_id', {
  //   header: ({ column }) => {
  //     return h('div', { class: 'text-center' }, h(Button, {
  //       class: 'text-sm font-normal',
  //       variant: 'ghost',
  //       onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
  //     }, () => ['No. Used Campaigns', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
  //   },
  //   cell: ({ row }) => {
  //     return h('div', { class: 'text-center font-normal text-sm' }, '-')
  //   },
  // }),
  columnHelper.accessor('created_at', {
    header: ({ column }) => {
      return h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Created Date', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, [
        h('div', { class: 'text-xs' }, moment(row.original.created_at).format('DD/MM/YYYY hh:mm A')),
      ])
    },
  }),

  // columnHelper.accessor('calltimeStatus', {
  //   header: ({ column }) => {
  //     return h('div', { class: 'text-center ' }, h(Button, {
  //       class: 'text-sm font-normal',
  //       variant: 'ghost',
  //       onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
  //     }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]))
  //   },
  //   cell: ({ row }) => {
  //     return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, h(Switch, { 'class': 'data-[state=checked]:bg-green-600 cursor-pointer', 'modelValue': row.original.calltimeStatus, 'onUpdate:modelValue': (val: boolean) => {
  //       row.original.calltimeStatus = val
  //     } }))
  //   },
  // }),

  columnHelper.accessor('actions', {
    header: () => {
      return h('div', { class: 'text-center' }, 'Actions')
    },
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
        h(Button, {
          size: 'icon',
          class: 'cursor-pointer',
          onClick: () => {
            selectedRowData.value = row.original
            sheet.value = true
          },
        }, h(Icon, { name: 'lucide:eye' })),
        h(Button, { size: 'icon', variant: 'ghost', class: 'cursor-pointer' }, h(Action, {
          onEdit: () => {
            editMethod(row?.original)
          },
          onDelete: () => {
            deleteMethod(row?.original.id)
          },
        })),
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
  initialState: { pagination: { pageSize: props.limit } },
  manualPagination: true,
  pageCount: last_page.value,
  rowCount: total.value,
  state: {
    pagination: {
      pageIndex: current_page.value,
      pageSize: per_page.value,
    },
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})
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
          <TableCell :colspan="columns.length" class="h-24 text-center">
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
          <Select :default-value="10" :model-value="limit" @update:model-value="(val) => changeLimit(Number(val))">
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

  <!---->
  <CallTimesTableSheet v-model:open="sheet" :call-time="selectedRowData as callTimingList" />

  <!-- CONFIRM DELETE -->
  <ConfirmAction v-model="showDeleteConfirm" :confirm="deleteConfirm" :cancel="deleteCancel" title="Delete Call Times" description="You are about to delete call time. Do you wish to proceed?" />
</template>

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
import TableServerPagination from '@/components/table/ServerPagination.vue'
import { Button } from '@/components/ui/button'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})

// Computed pagination variables
const emits = defineEmits(['pageNavigation', 'changeLimit', 'edit'])
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

// Interface for each row in the list
export interface recycleRulesList {
  id: number
  campaign_id: number
  campaign_name: string
  list_id: number
  dispositions: string
  days: string[]
  time: string
  call_times: number[]
  is_deleted: 0
  updated_at: string
  campaign: string
  list: string
}

// Confirmation dialog for deleting
const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const selectedRecycleRuleForDelete = ref()

async function handleDelete() {
  if (!selectedRecycleRuleForDelete.value)
    return

  try {
    const res = await useApi().post('/edit-recycle-rule', {
      recycle_rule_id: selectedRecycleRuleForDelete.value,
      is_deleted: 1,
    })

    if (res.success === 'true') {
      showToast({
        message: res.message,
        type: 'success',
      })
    }
    else {
      showToast({
        message: res.message,
        type: 'error',
      })
    }
    refreshNuxtData('recycle-rule')
  }
  catch (err) {
    showToast({
      message: `${err}`,
      type: 'error',
    })
  }
  finally {
    selectedRecycleRuleForDelete.value = null
  }
}

// Pagination handlers
function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number | null) {
  if (val !== null) {
    emits('changeLimit', val)
  }
}

function deleteConfirmHandler() {
  deleteConfirm() // close dialog
  handleDelete() // now delete safely
}

const columnHelper = createColumnHelper<recycleRulesList>()
const columns = [
  columnHelper.display({
    id: 'slNo',
    header: () => h('div', { class: 'text-center w-full' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, props.start + row.index + 1),
  }),
  columnHelper.accessor('campaign', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Campaign Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.campaign || '-'),
  }),
  columnHelper.accessor('list', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['List Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.list || '-'),
  }),
  columnHelper.accessor('dispositions', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Dispositions', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.dispositions || '—'),
  }),
  columnHelper.accessor('days', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Days', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full capitalize' }, row.original.days.join(', ') || '-'),
  }),
  columnHelper.accessor('time', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.time || '-'),
  }),
  columnHelper.accessor('call_times', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Call Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.call_times.join(', ') || '-'),
  }),
  columnHelper.accessor('is_deleted', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Recycle Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal te xt-sm w-full' }, row.original.is_deleted),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center w-full' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-center' }, [

      // Edit Button Tooltip
      h(TooltipProvider, { delayDuration: 1000 }, () =>
        h(Tooltip, null, {
          default: () => [
            h(TooltipTrigger, { asChild: true }, h(Button, {
              size: 'icon',
              variant: 'outline',
              class: 'text-primary h-7 w-7 min-w-0',
              onClick: () => emits('edit', row.original),
            }, h(Icon, { name: 'material-symbols:edit-square', size: 14 }))),
            h(TooltipContent, { side: 'top' }, () => 'Edit'),
          ],
        })),

      // Recycle Button Tooltip
      h(TooltipProvider, { delayDuration: 1000 }, () =>
        h(Tooltip, null, {
          default: () => [
            h(TooltipTrigger, { asChild: true }, h(Button, {
              size: 'icon',
              variant: 'outline',
              class: 'text-primary h-7 w-7 min-w-0',
              onClick: () => refreshNuxtData('recycle-rule'),
            }, h(Icon, { name: 'material-symbols:autorenew', size: 15 }))),
            h(TooltipContent, { side: 'top' }, () => 'Recycle'),
          ],
        })),

      // Delete Button Tooltip
      h(TooltipProvider, { delayDuration: 1000 }, () =>
        h(Tooltip, null, {
          default: () => [
            h(TooltipTrigger, { asChild: true }, h(Button, {
              size: 'icon',
              variant: 'outline',
              class: 'h-7 w-7 min-w-0 border-red-600 text-red-600 hover:text-red-600/80',
              onClick: () => {
                selectedRecycleRuleForDelete.value = row.original.id
                revealDeleteConfirm()
              },
            }, h(Icon, { name: 'material-symbols:delete', size: 14 }))),
            h(TooltipContent, { side: 'top' }, () => 'Delete'),
          ],
        })),
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
  <div class="border rounded-lg my-6 overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="bg-gray-50"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
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
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="p-[12px]"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
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
        Showing
        <span>
          <Select :default-value="10" :model-value="limit" @update:model-value="(val) => changeLimit(Number(val))">
            <SelectTrigger class="w-fit gap-x-1 px-2">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in [5, 10, 20, 30, 40, 50]" :key="n" :value="n">
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

  <!-- CONFIRM DELETE -->
  <ConfirmAction
    v-model="showDeleteConfirm"
    :confirm="deleteConfirmHandler"
    :cancel="deleteCancel"
    title="Delete Recycle Rule"
    description="You are about to delete this recycle rule. Do you wish to proceed?"
  />
</template>

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
import { ChevronsUpDown } from 'lucide-vue-next'
import moment from 'moment'
import { computed, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import Action from '@/components/ringless-voicemail/campaign/table/Action.vue'
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

const props = withDefaults(defineProps<{
  list: any[]
  loading: boolean
  totalRows: number
  start: number
  limit?: number
}>(), {
  limit: 10,
})

const emits = defineEmits(['refresh', 'pageNavigation', 'changeLimit'])

// Pagination calculations
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

const sheet = ref(false)
const selectedCampaign = ref<any>(null)
const campaignLoadingId = ref<number | null>(null)
const statusChangeLoadingId = ref<number | null>(null)
const router = useRouter()

// Confirmation dialog for deleting
const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const selectedCampaignForDelete = ref<number | null>(null)
const selectedCampaignForDuplicate = ref<number | null>(null)

function openSheet(id: number) {
  campaignLoadingId.value = id
  try {
    selectedCampaign.value = props.list.find(item => item.id === id)
    sheet.value = true
  }
  catch (error) {
    console.error('Error fetching campaign details:', error)
  }
  finally {
    campaignLoadingId.value = null
  }
}

async function handleDelete() {
  if (!selectedCampaignForDelete.value)
    return

  try {
    const res = await useApi().post('/ringless/campaign/delete', {
      campaign_id: selectedCampaignForDelete.value,
    })

    if (res.success) {
      showToast({
        message: res.message,
        type: 'success',
      })
    }
    else {
      showToast({
        message: res.message || 'Failed to delete campaign',
        type: 'error',
      })
    }
    emits('refresh')
  }
  catch (err) {
    showToast({
      message: `${err}`,
      type: 'error',
    })
  }
  finally {
    selectedCampaignForDelete.value = null
  }
}

function deleteConfirmHandler() {
  deleteConfirm()
  handleDelete()
}

async function handleDuplicate() {
  if (!selectedCampaignForDuplicate.value)
    return
  try {
    const res = await useApi().post('/ringless/campaign/copy', {
      c_id: selectedCampaignForDuplicate.value,
    })

    if (res.success) {
      showToast({
        message: res.message,
        type: 'success',
      })
    }
    else {
      showToast({
        message: res.message || 'Failed to duplicate campaign',
        type: 'error',
      })
    }
    emits('refresh')
  }
  catch (err) {
    showToast({
      message: `${err}`,
      type: 'error',
    })
  }
  finally {
    selectedCampaignForDuplicate.value = null
  }
}

async function handleStatusChange(row: any) {
  statusChangeLoadingId.value = row.original.id
  try {
    const res = await useApi().post('/ringless/campaign/update-status', {
      listId: row.original.id,
      status: row.original.status == 0 ? '1' : '0',
    })

    if (!res.success) {
      throw new Error(res.message || 'Failed to update status')
    }

    showToast({
      message: 'Status updated successfully',
      type: 'success',
    })
    emits('refresh')
  }
  catch (err) {
    showToast({
      message: err.message || 'Failed to update status',
      type: 'error',
    })
    throw err
  }
  finally {
    statusChangeLoadingId.value = null
  }
}

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number) {
  emits('changeLimit', val)
}

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, props.start + row.index + 1),
  }),

  columnHelper.accessor('title', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-center text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.title),
  }),

  columnHelper.display({
    id: 'totalLists',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Total Lists', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.original.ringless_list?.length || 0)
    },
  }),

  columnHelper.display({
    id: 'dialedLeads',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Dialed/Total leads', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      const dialed = row.original.ringless_lead_report_count || 0
      const total = row.original.ringless_list?.reduce((sum: number, list: any) => sum + (list.total_leads || 0), 0) || 0
      return h('div', { class: 'text-center font-normal text-center text-sm' }, `${dialed}/${total}`)
    },
  }),

  columnHelper.display({
    id: 'hoppers',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Hoppers', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-center text-sm' }, 0),
  }),

  columnHelper.display({
    id: 'scheduleTime',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Schedule Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      const start = row.original.call_time_start
      const end = row.original.call_time_end
      return h('div', { class: 'uppercase text-center text-sm' }, start && end
        ? `${moment(start, 'HH:mm:ss').format('hh:mm A')} - ${moment(end, 'HH:mm:ss').format('hh:mm A')}`
        : 'N/A')
    },
  }),

  columnHelper.display({
    id: 'createdDate',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Created Date', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      const created = row.original.created_at
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, [
        h('div', created ? moment(created).format('YYYY-MM-DD') : ''),
        h('br'),
        h('div', { class: 'text-xs' }, created ? moment(created).format('hh:mm A') : ''),
      ])
    },
  }),

  columnHelper.display({
    id: 'campaignStatus',
    header: ({ column }) =>
      h('div', { class: 'text-center ' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, h(Switch, {
        class: cn(
          'data-[state=checked]:bg-green-600',
          statusChangeLoadingId.value === row.original.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ),
        modelValue: row.original.status === '1',
        disabled: statusChangeLoadingId.value === row.original.id,
        onClick: () => {
          if (statusChangeLoadingId.value !== row.original.id) {
            handleStatusChange(row)
          }
        },
      })),
    sortingFn: (rowA, rowB) => {
      const valueA = rowA.original.status === '1'
      const valueB = rowB.original.status === '1'
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
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
      h(
        Button,
        {
          size: 'icon',
          class: `cursor-pointer ${campaignLoadingId.value === row.original.id ? 'loading-state' : ''}`,
          onClick: () => openSheet(row.original.id),
        },
        h(
          Icon,
          {
            name: campaignLoadingId.value === row.original.id
              ? 'eos-icons:bubble-loading'
              : 'lucide:eye',
          },
        ),
      ),
      h(Action, {
        onEdit: () => {
          router.push({
            path: `/app/ringless-voicemail/campaign/new-campaign`,
            query: { id: row.original.id },
          })
        },
        onDelete: () => {
          selectedCampaignForDelete.value = row.original.id
          revealDeleteConfirm()
        },
        onDuplicate: () => {
          selectedCampaignForDuplicate.value = row.original.id
          handleDuplicate()
        },
      }),
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
  getPaginationRowModel: getPaginationRowModel(),
  manualPagination: true,
  pageCount: last_page.value,
  rowCount: total.value,
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    pagination: {
      pageIndex: current_page.value - 1,
      pageSize: per_page.value,
    },
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
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

  <div v-if="totalRows && !loading" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ current_page }} to
        <span>
          <Select :model-value="per_page" @update:model-value="changeLimit">
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
        of {{ totalRows }} entries
      </div>
    </div>
    <div class="space-x-2">
      <TableServerPagination
        :total-items="Number(total)"
        :current-page="Number(current_page)"
        :items-per-page="Number(per_page)"
        :last-page="Number(last_page)"
        @page-change="handlePageChange"
      />
    </div>
  </div>

  <ConfirmAction
    v-model="showDeleteConfirm"
    :confirm="deleteConfirmHandler"
    :cancel="deleteCancel"
    title="Delete Campaign"
    description="You are about to delete this campaign. This action cannot be undone. Do you wish to proceed?"
  />

  <RinglessVoicemailCampaignTableSheet
    v-model:open="sheet"
    :campaign="selectedCampaign"
  />
</template>

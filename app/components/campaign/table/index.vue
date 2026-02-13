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
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { useConfirmDialog } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'
import moment from 'moment'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

// Helper to format dial mode
function formatDialMode(mode: string) {
  const modes: Record<string, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    super_power_dial: { label: 'Super Power', variant: 'default' },
    predictive_dial: { label: 'Predictive', variant: 'secondary' },
    outbound_ai: { label: 'Outbound AI', variant: 'outline' },
  }
  return modes[mode] || { label: mode?.replace(/_/g, ' ') || 'Unknown', variant: 'outline' as const }
}

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})

// Track the row ID for the Action menu

const emits = defineEmits(['pageNavigation', 'refresh', 'changeLimit'])

const { user } = useAuth()

const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

const sheet = ref(false)
const selectedCampaign = ref<any>() // Store the campaign details
const campaignLoadingId = ref<number | null>(null) // Track loading campaign id

const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

async function deleteMethod(row: { id: number }) {
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled) {
    return false
  }
  useApi().post('/delete-campaign', {
    campaign_id: row.id,
  }).then((response) => {
    showToast({
      message: response.message,
    })
    emits('refresh')
  }).catch((err) => {
    showToast({
      type: 'error',
      message: err.message,
    })
  })
}

async function openSheet(id: number) {
  campaignLoadingId.value = id
  try {
    const res = await useApi().post('campaign-by-id', { campaign_id: id })
    selectedCampaign.value = res
    sheet.value = true
  }
  catch (error: any) {
    showToast({
      type: 'error',
      message: error?.message,
    })
  }
  finally {
    campaignLoadingId.value = null
  }
}

async function updateStatus(id: number, status: number) {
  try {
    const res = await useApi().post('/status-update-campaign', {
      campaign_id: id,
      status,
    })

    // Handle different response structures
    const success = res?.original?.success === 'true' || res?.success === true || res?.success === 'true'
    const message = res?.original?.message || res?.message || 'Status updated successfully'

    if (success) {
      showToast({
        message,
        type: 'success',
      })
      refreshNuxtData('campaigns-list')
    }
    else {
      showToast({
        message: message || 'Failed to update status',
        type: 'error',
      })
    }
  }
  catch (err: any) {
    showToast({
      message: err?.original?.message || err?.message || 'Failed to update status',
      type: 'error',
    })
  }
}

function resetCampaign(campaign_id: number) {
  useApi().get('/add-lead-temp', {
    params: {
      campaign_id,
      id: user.value?.parent_id,
    },
  }).then((response) => {
    showToast({
      message: response.message || 'Campaign reset successfully',
    })
    // emits('refresh')
  }).catch((err) => {
    showToast({
      type: 'error',
      message: err.message || 'Campaign reset failed',
    })
  })
}

// TO DO: Update hopper status
// async function updateHopperStatus(id: number, status: number) {
//   try {
//     const res = await useApi().post('/status-update-hopper', {
//       listId: id,
//       status : [status],
//     })

//     if (res.success === 'true') {
//       showToast({
//         message: res.message,
//         type: 'success',
//       })
//       refreshNuxtData('campaigns-list')
//     }
//     else {
//       showToast({
//         message: res.message,
//         type: 'error',
//       })
//     }
//   }
//   catch (err: any) {
//     showToast({
//       message: `${err.message}`,
//       type: 'error',
//     })
//   }
// }
async function copyCampaign(c_id: number) {
  try {
    const res = await useApi().post('/copy-campaign', {
      c_id,
    })

    if (res.success === 'true') {
      showToast({
        message: res.message,
        type: 'success',
      })
      emits('refresh')
    }
    else {
      showToast({
        message: res.message,
        type: 'error',
      })
    }
  }
  catch (err: any) {
    showToast({
      message: `${err.message}`,
      type: 'error',
    })
  }
}

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-medium text-gray-600' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm text-gray-500' }, props.start + row.index + 1),
  }),

  columnHelper.accessor('title', {
    header: ({ column }) =>
      h('div', { class: 'text-left' }, h(Button, {
        class: 'text-left text-sm font-medium text-gray-600 px-0 hover:bg-transparent',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Campaign', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-left' }, [
      h('div', { class: 'font-medium text-sm text-gray-900' }, row.original.title || '-'),
      h('div', { class: 'text-xs text-gray-500 mt-0.5' },
        row.original.description?.substring(0, 40) + (row.original.description?.length > 40 ? '...' : '') || 'No description',
      ),
    ]),
  }),

  columnHelper.display({
    id: 'dialMode',
    header: () => h('div', { class: 'text-center text-sm font-medium text-gray-600' }, 'Dial Mode'),
    cell: ({ row }) => {
      const mode = formatDialMode(row.original.dial_mode)
      return h('div', { class: 'text-center' },
        h(Badge, { variant: mode.variant, class: 'text-xs capitalize' }, () => mode.label),
      )
    },
  }),

  columnHelper.accessor('lists', {
    header: () => h('div', { class: 'text-center text-sm font-medium text-gray-600' }, 'Lists'),
    cell: ({ row }) => h('div', { class: 'text-center' },
      h('span', { class: 'inline-flex items-center gap-1 text-sm font-medium text-gray-700' }, [
        h(Icon, { name: 'lucide:list', class: 'h-3.5 w-3.5 text-gray-400' }),
        formatWithCommas(row.original.lists_associated),
      ]),
    ),
  }),

  columnHelper.display({
    id: 'dialed',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-medium text-gray-600 px-0 hover:bg-transparent',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Progress', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      const dialed = row.original.dialed_leads || 0
      const total = row.original.total_leads || 0
      const percentage = total > 0 ? Math.round((dialed / total) * 100) : 0
      return h('div', { class: 'min-w-[120px] px-2' }, [
        h('div', { class: 'flex justify-between text-xs mb-1' }, [
          h('span', { class: 'text-gray-600' }, `${formatWithCommas(dialed)}/${formatWithCommas(total)}`),
          h('span', { class: 'font-medium text-gray-900' }, `${percentage}%`),
        ]),
        h(Progress, {
          modelValue: percentage,
          class: 'h-2',
        }),
      ])
    },
  }),

  columnHelper.display({
    id: 'hoppers',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-medium text-gray-600 px-0 hover:bg-transparent',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Hoppers', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center' },
      h('span', {
        class: cn(
          'inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-full text-xs font-medium',
          row.original.hopper_count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500',
        ),
      }, row.original.hopper_count || 0),
    ),
  }),

  columnHelper.display({
    id: 'dateTime',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-medium text-gray-600 px-0 hover:bg-transparent',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Created', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      const updated = row.original.created_at
      return h('div', { class: 'text-center' }, [
        h('div', { class: 'text-sm text-gray-900' }, updated ? moment(updated, 'YYYY-MM-DD HH:mm:ss').format('MMM DD, YYYY') : '-'),
        h('div', { class: 'text-xs text-gray-500' }, updated ? moment(updated, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A') : '-'),
      ])
    },
  }),

  columnHelper.accessor('status', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-medium text-gray-600 px-0 hover:bg-transparent',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center justify-center gap-2' }, [
        h(Switch, {
          'class': 'data-[state=checked]:bg-green-600 cursor-pointer',
          'modelValue': row.original.status === 1,
          'onUpdate:modelValue': (val: boolean) => {
            updateStatus(row.original.id, val ? 1 : 0)
          },
        }),
        h('span', {
          class: cn(
            'text-xs font-medium',
            row.original.status === 1 ? 'text-green-600' : 'text-gray-400',
          ),
        }, row.original.status === 1 ? 'Active' : 'Inactive'),
      ]),
  }),

  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center text-sm font-medium text-gray-600' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center gap-1 justify-center' }, [
      h(TooltipProvider, () =>
        h(Tooltip, () => [
          h(TooltipTrigger, { asChild: true }, () =>
            h(
              Button,
              {
                size: 'icon',
                variant: 'ghost',
                class: `cursor-pointer h-8 w-8 ${campaignLoadingId.value === row.original.id ? 'loading-state' : ''}`,
                onClick: () => openSheet(row.original.id),
              },
              () => h(
                Icon,
                {
                  name: campaignLoadingId.value === row.original.id
                    ? 'eos-icons:bubble-loading'
                    : 'lucide:eye',
                  class: 'h-4 w-4',
                },
              ),
            ),
          ),
          h(TooltipContent, () => 'View Details'),
        ]),
      ),
      h(TooltipProvider, () =>
        h(Tooltip, () => [
          h(TooltipTrigger, { asChild: true }, () =>
            h(
              Button,
              {
                size: 'icon',
                variant: 'ghost',
                class: 'cursor-pointer h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50',
                onClick: () => navigateTo({ path: '/app/campaign/new-campaign', query: { id: row.original.id } }),
              },
              () => h(Icon, { name: 'lucide:pencil', class: 'h-4 w-4' }),
            ),
          ),
          h(TooltipContent, () => 'Edit Campaign'),
        ]),
      ),
      h(Action, {
        onEdit: () => {
          navigateTo({ path: '/app/campaign/new-campaign', query: { id: row.original.id } })
        },
        onDelete: () => { deleteMethod(row?.original) },
        onCopy: () => { copyCampaign(row.original.id) },
        onReset: () => { resetCampaign(row.original.id) },
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
  // getPaginationRowModel: getPaginationRowModel(),
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
  <div class="border rounded-lg overflow-hidden bg-white shadow-sm">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" class="border-b bg-gray-50/80">
          <TableHead
            v-for="header in headerGroup.headers" :key="header.id" :data-pinned="header.column.getIsPinned()"
            class="bg-gray-50/80 py-3"
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
            <BaseSkelton v-for="i in 9" :key="i" class="h-12 w-full mb-2" rounded="rounded-md" />
          </TableCell>
        </TableRow>
        <template v-else-if="table.getRowModel().rows?.length">
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <TableRow
              :data-state="row.getIsSelected() && 'selected'"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()" :key="cell.id" :data-pinned="cell.column.getIsPinned()"
                class="py-3 px-4"
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
            class="h-64"
          >
            <div class="flex flex-col items-center justify-center py-10">
              <div class="p-4 bg-gray-100 rounded-full mb-4">
                <Icon name="material-symbols:campaign-outline" class="h-12 w-12 text-gray-400" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-1">No campaigns found</h3>
              <p class="text-sm text-gray-500 mb-4">Get started by creating your first campaign</p>
              <NuxtLink to="/app/campaign/new-campaign">
                <Button>
                  <Icon name="material-symbols:add" class="mr-2" />
                  Create Campaign
                </Button>
              </NuxtLink>
            </div>
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
          <Select :default-value="10" :model-value="limit" @update:model-value="(v) => changeLimit(Number(v))">
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

  <CampaignTableSheet v-model:open="sheet" :campaign="selectedCampaign" />
  <ConfirmAction v-model="showDeleteConfirm" :confirm="deleteConfirm" :cancel="deleteCancel" title="Delete Campaign" description="You are about to delete a campaign. Do you wish to proceed?" />
</template>

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
const emits = defineEmits(['pageNavigation', 'changeLimit'])

const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))

const router = useRouter()

// Confirmation dialog for deleting
const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const selectedTemplateForDelete = ref<number | null>(null)

// Function to handle deleting a list
async function handleDelete() {
  if (!selectedTemplateForDelete.value)
    return

  try {
    const res = await useApi().post('delete-sms-templete', {
      templete_id: selectedTemplateForDelete.value,
      is_deleted: true,
    })

    if (res?.success === 'true') {
      showToast({
        message: res.message,
        type: 'success',
      })
      refreshNuxtData('sms-template')
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

// Updates status of a list
async function updateStatus(id: number, status: string) {
  try {
    const res = await useApi().post('/update-sms-templete-status', {
      templete_id: id,
      status,
    })

    showToast({
      message: res.message,
      type: 'success',
    })
    refreshNuxtData('sms-text-template-list')
  }
  catch (err: any) {
    showToast({
      message: `${err.message}`,
      type: 'error',
    })
  }
}

// Deletes list after confirming
function deleteConfirmHandler() {
  deleteConfirm() // close dialog
  handleDelete() // now delete safely
}

function onEdit(row: any) {
  router.push({
    path: `/app/sms/text-template/create`,
    query: { id: row.templete_id },
  })
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

const columnHelper = createColumnHelper<any>()
const columns = [
  columnHelper.display({
    id: 'index',
    header: () => h('div', { class: 'text-sm font-normal text-center' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, props.start + row.index + 1),
  }),
  columnHelper.accessor('templete_name', {
    header: ({ column }) => h('div', { class: 'flex justify-center' }, [
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Template Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    ]),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.templete_name || '-'),
  }),
  columnHelper.accessor('templete_desc', {
    header: ({ column }) => h('div', { class: 'flex justify-center' }, [
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Message', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    ]),
    cell: ({ row }) => h('div', { class: 'text-sm text-center max-w-[360px] truncate' }, row.original.templete_desc || '-'),
  }),
  columnHelper.accessor('status', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-full' }, h(Button, {
        class: 'text-center text-sm font-normal w-full',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal leading-[9px] text-sm w-full' }, h(Switch, {
        'class': 'data-[state=checked]:bg-green-600 cursor-pointer',
        'modelValue': row.original.status === '1',
        'onUpdate:modelValue': (val: boolean) => {
          updateStatus(row.original.templete_id, val ? '1' : '0')
        },
      })),
  }),
  columnHelper.accessor('actions', {
    header: () => h('div', { class: 'text-center ml-auto w-fit mr-8' }, 'Actions'),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [

        // Edit button with tooltip
        h(TooltipProvider, { delayDuration: 1000 }, () =>
          h(Tooltip, null, {
            default: () => [
              h(TooltipTrigger, { asChild: true }, h(Button, {
                size: 'icon',
                variant: 'outline',
                class: 'cursor-pointer',
                onClick: () => onEdit(row.original),
              }, h(Icon, { name: 'material-symbols:edit-square' }))),
              h(TooltipContent, { side: 'top' }, 'Edit Template'),
            ],
          })),

        // Delete button with tooltip
        h(TooltipProvider, { delayDuration: 1000 }, () =>
          h(Tooltip, null, {
            default: () => [
              h(TooltipTrigger, { asChild: true }, h(Button, {
                size: 'icon',
                variant: 'outline',
                class: 'cursor-pointer border-red-600 text-red-600 hover:text-red-600/80',
                onClick: () => {
                  selectedTemplateForDelete.value = row.original?.templete_id || null
                  revealDeleteConfirm()
                },
              }, h(Icon, { name: 'material-symbols:delete' }))),
              h(TooltipContent, { side: 'top' }, 'Delete Template'),
            ],
          })),
      ]),
  }),
]
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

// Initialize table with manual pagination
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
  manualPagination: true,
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})
</script>

<template>
  <div class="border rounded-lg my-6 overflow-x-auto max-h-[calc(100vh-240px)] overflow-y-auto">
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
  <div v-if="totalRows && !loading" class=" flex items-center justify-end space-x-2 flex-wrap">
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
    title="Delete SMS Template"
    description="You are about to delete this SMS Template. Do you wish to proceed?"
  />
</template>

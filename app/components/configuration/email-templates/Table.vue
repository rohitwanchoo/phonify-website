<script setup lang="ts">
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { ConfigurationEmailTemplatesAction, Icon } from '#components'
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
import TableServerPagination from '@/components/table/ServerPagination.vue'
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

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})
const emits = defineEmits(['pageNavigation', 'refresh', 'changeLimit'])

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

const selectedEmailTemplateForDelete = ref<{
  id: number | null
}>({
  id: null,
})

// stores the row to edit
const selectedRowData = ref<emailTemplateList | null>(null)

export interface emailTemplateList {
  id: number
  template_name: string
  template_html: string
  subject: string
  lead_status: string
  status: string
  send_bcc: string
  created_at: string
  updated_at: string
  actions?: string
}

const sheet = ref(false)

async function updateStatus(id: number, status: string) {
  try {
    const res = await useApi().post('/status-update-email-template', {
      listId: id,
      status,
    })

    if (res.success === 'true') {
      showToast({
        message: res.message,
        type: 'success',
      })
      refreshNuxtData('email-templates')
    }
    else {
      showToast({
        message: res.message,
        type: 'error',
      })
    }
  }
  catch (err) {
    showToast({
      message: `${err}`,
      type: 'error',
    })
  }
}

function onEdit(row: emailTemplateList) {
  selectedRowData.value = row
  // Navigate to the add page with the row ID as a query parameter
  navigateTo({
    path: '/app/configuration/email-templates/add',
    query: {
      id: row.id,
      mode: 'edit',
    },
  })
}

async function handleDelete() {
  if (!selectedEmailTemplateForDelete.value.id)
    return

  try {
    const res = await useApi().delete(`/email-template/${selectedEmailTemplateForDelete.value.id}`, {
      id: selectedEmailTemplateForDelete.value.id,
    })

    if (res.success === true) {
      showToast({
        message: res.message,
        type: 'success',
      })
      refreshNuxtData('email-templates')
    }
    else {
      showToast({
        message: res.message,
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
    selectedEmailTemplateForDelete.value = {
      id: null,
    }
  }
}

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

const columnHelper = createColumnHelper<emailTemplateList>()
const columns = [
  columnHelper.display({
    id: 'slNo',
    header: () => h('div', { class: 'text-center w-full' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, props.start + row.index + 1),
  }),
  columnHelper.accessor('template_name', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Template Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-full' }, row.original.template_name),
  }),
  columnHelper.accessor('template_html', {
    header: ({ column }) => h('div', { class: 'text-center w-full' }, h(Button, {
      class: 'text-center text-sm font-normal w-full',
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Template HTML', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm w-[40vw] m-auto  truncate' }, row.original.template_html),
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
          updateStatus(row.original.id, val ? '1' : '0')
        },
      })),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
        h(Button, {
          variant: 'outline',
          class: 'px-2',
          onClick: () => {
            selectedRowData.value = row.original
            sheet.value = true
          },
        }, [
          h(Icon, { name: 'material-symbols:visibility', size: '16' }),
          h('span', { class: 'text-xs font-normal' }, 'View'),
        ]),
        h(Button, { size: 'icon', variant: 'ghost', class: 'cursor-pointer' }, h(ConfigurationEmailTemplatesAction, {
          onEdit: () => {
            onEdit(row?.original)
          },
          onDelete: () => {
            selectedEmailTemplateForDelete.value.id = row?.original.id
            revealDeleteConfirm()
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
    columnPinning: {
      left: ['slNo', 'template_name', 'template_html', 'status'],
    },
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

  <ConfigurationEmailTemplatesView v-model:open="sheet" :template-html="selectedRowData?.template_html || ''" />

  <!-- CONFIRM DELETE -->
  <ConfirmAction
    v-model="showDeleteConfirm"
    :confirm="deleteConfirmHandler"
    :cancel="deleteCancel"
    title="Delete Email Template"
    description="You are about to delete this email template. Do you wish to proceed?"
  />
</template>

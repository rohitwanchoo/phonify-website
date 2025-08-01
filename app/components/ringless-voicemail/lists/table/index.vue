<script setup lang="ts">
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

import { ChevronsUpDown } from 'lucide-vue-next'
import moment from 'moment'
import { computed, h, ref } from 'vue'
import TableServerPagination from '@/components/table/ServerPagination.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApi } from '@/composables/useApi'
import { cn } from '@/lib/utils'

const props = defineProps<{
  list: any[]
  limit: number
  start: number
  totalRows: number
  loading: boolean
}>()

const emits = defineEmits(['pageNavigation', 'refresh', 'changeLimit', 'edit'])

const tableData = computed(() => props.list || [])
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))
const statusChangeLoadingId = ref<number | null>(null)
// Dialog State
const sheet = ref(false)
const selectedList = ref<any>(null)

const optionsOpen = ref(false)
const editTitle = ref('')
const editCampaign = ref('')
const editListId = ref<number | null>(null)

const campaignLoadingId = ref<number | null>(null)

function updateStatus(val: { status: boolean, id: number }) {
  statusChangeLoadingId.value = val.id // Set loading state
  useApi().post('/ringless/list/update-status', {
    listId: val.id,
    status: val.status ? 1 : 0,
  }).then((response) => {
    showToast({ message: response.message })
    emits('refresh')
  }).catch((error) => {
    showToast({ type: 'error', message: error.message })
    // Optional: Revert the toggle if the API fails
  }).finally(() => {
    statusChangeLoadingId.value = null // Clear loading state
  })
}
function deleteList(id: number) {
  useApi().get(`/ringless/list/delete/${id}`).then(() => {
    showToast({ message: 'List deleted successfully' })
    emits('refresh')
  }).catch(() => {
    showToast({ type: 'error', message: 'Failed to delete list' })
  })
}

// Table Columns
const columnHelper = createColumnHelper<any>()
const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('title', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['List', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.title),
  }),
  columnHelper.accessor('campaign_name', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Campaign Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.campaign_name),
  }),
  columnHelper.display({
    id: 'dialed',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Dialed/Total leads', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, `${row.original.ringless_lead_report_count || 0}/${row.original.total_leads || 0}`),
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
      return h('div', { class: 'text-center font-normal text-sm' }, [
        h('div', created ? moment(created).format('YYYY-MM-DD') : ''),
        h('div', { class: 'text-xs' }, created ? moment(created).format('hh:mm A') : ''),
      ])
    },
  }),
  columnHelper.display({
    id: 'scheduled',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Schedule Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      const isScheduled = row.original.is_dialing
      return h('div', {
        class: cn('text-center font-normal text-sm', isScheduled === '1' ? 'text-green-600' : 'text-red-600'),
      }, isScheduled === '1' ? 'Yes' : 'No')
    },
  }),
  columnHelper.display({
    id: 'campaignStatus',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'text-center' }, h(Switch, {
        'class': cn(
          'data-[state=checked]:bg-green-600',
          statusChangeLoadingId.value === row.original.id
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer',
        ),
        'modelValue': row.original.status === '1',
        'disabled': statusChangeLoadingId.value === row.original.id,
        'onUpdate:modelValue': (val: boolean) => {
          if (statusChangeLoadingId.value !== row.original.id) {
            updateStatus({ status: val, id: row.original.id })
          }
        },
      })),
    // Add sorting function here
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
    cell: ({ row }) => {
      const item = row.original
      return h('div', { class: 'flex justify-end pr-3 gap-x-1' }, [
        h(Button, {
          size: 'icon',
          variant: 'ghost',
          class: 'h-8 w-8 bg-[#162D3A] text-white hover:bg-[#162D3A]',
          onClick: () => {
            selectedList.value = item
            sheet.value = true
          },
        }, h(Icon, {
          name: campaignLoadingId.value === item.id ? 'eos-icons:bubble-loading' : 'lucide:eye',
          size: 16,
        })),

        h(DropdownMenu, {}, {
          default: () => [
            h(DropdownMenuTrigger, {}, () =>
              h(Button, { variant: 'ghost', size: 'icon', class: 'h-7 w-7' }, h(Icon, { name: 'lucide:more-vertical', size: 16 }),
              )),

            h(DropdownMenuContent, { align: 'end' }, () => [
              h(DropdownMenuItem, {
                class: 'cursor-pointer',
                onClick: () => {
                  const fileUrl = `/storage/ringless-lists/${item.file_name}`
                  const a = document.createElement('a')
                  a.href = fileUrl
                  a.download = item.file_name
                  a.click()
                },
              }, [h(Icon, { name: 'material-symbols:download', size: 16 }), h('span', 'Download')]),

              h(DropdownMenuItem, {
                class: 'cursor-pointer',
                onClick: () => {
                  editTitle.value = item.title
                  editCampaign.value = item.campaign_id
                  editListId.value = item.id
                  optionsOpen.value = true
                },
              }, [h(Icon, { name: 'material-symbols:edit-square-outline', size: 16 }), h('span', 'Edit')]),

              h(DropdownMenuItem, {
                class: 'text-red-600 cursor-pointer hover:!text-red-500',
                onClick: () => deleteList(item.id),
              }, [h(Icon, { name: 'mdi:trash-can-outline', size: 16 }), h('span', 'Delete')]),
            ]),
          ],
        }),
      ])
    },
  }),
]

const table = useVueTable({
  get data() { return tableData.value },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}
function changeLimit(val: number | null) {
  if (val !== null)
    emits('changeLimit', val)
}
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-if="props.loading">
          <TableCell :colspan="columns.length" class="text-center h-6">
            <BaseSkelton v-for="i in 9" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
          </TableCell>
        </TableRow>

        <template v-else-if="table.getRowModel().rows.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-3 text-sm leading-tight">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>

        <TableRow v-else>
          <TableCell :colspan="columns.length" class="text-center">
            No results found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>

  <!-- Pagination and Limit -->
  <div v-if="!loading" class="flex items-center justify-end space-x-2 py-1 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ current_page }} to
        <span>
          <Select :default-value="10" :model-value="limit" @update:model-value="val => changeLimit(Number(val))">
            <SelectTrigger class="w-fit gap-x-1 px-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in 15" :key="n" :value="n">{{ n }}</SelectItem>
            </SelectContent>
          </Select>
        </span>
        of {{ totalRows }} entries
      </div>
    </div>

    <div class="space-x-2">
      <TableServerPagination
        :total-items="total"
        :current-page="current_page"
        :items-per-page="per_page"
        :last-page="last_page"
        @page-change="handlePageChange"
      />
    </div>
  </div>

  <!-- Dialogs -->
  <RinglessVoicemailListsConfigureDialog
    v-model:open="optionsOpen"
    :title="editTitle"
    :campaign="editCampaign"
    :list-id="editListId"
  />

  <RinglessVoicemailListsTableSheet
    v-model:open="sheet"
    :list="selectedList"
  />
</template>

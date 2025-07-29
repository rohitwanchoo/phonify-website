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
import Action from '@/components/ringless-voicemail/campaign/table/Action.vue'
import RinglessVoicemailListsConfigureDialog from '@/components/ringless-voicemail/lists/ConfigureDialog.vue'
import TableServerPagination from '@/components/table/ServerPagination.vue'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'

const props = defineProps<{
  list: any[]
  limit: number
  start: number
  totalRows: number
  loading: boolean
}>()

const emits = defineEmits(['pageNavigation', 'refresh', 'changeLimit', 'edit'])
function updateStatus(val: { status: boolean, id: number }) {
  useApi().post('/ringless/list/update-status', {
    listId: val.id,
    status: val.status ? 1 : 0,
  }).then((response) => {
    showToast({ message: response.message })
    emits('refresh')
  }).catch((error) => {
    showToast({ type: 'error', message: error.message })
  })
}
const tableData = computed(() => props.list || [])
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))
const sheet = ref(false)
const selectedList = ref<any>(null)
const campaignLoadingId = ref<number | null>(null)
const editTitle = ref('')
const editCampaign = ref('')
const optionsOpen = ref(false)

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
        class: 'text-center text-sm font-normal',
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
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, [
        h('div', created ? moment(created).format('YYYY-MM-DD') : ''),
        h('br'),
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
        class: cn(
          'text-center font-normal text-sm py-1 px-3 inline-flex items-center justify-center w-full',
          isScheduled === '1' ? ' text-green-600' : ' text-red-600',
        ),
      }, isScheduled === '1' ? 'Yes' : 'No')
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
        'class': 'data-[state=checked]:bg-green-600 cursor-pointer',
        'modelValue': row.original.status === '1',
        'onUpdate:modelValue': (val: boolean) => {
          updateStatus({ status: val, id: row.original.id })
        },
      })),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
        h(Button, {
          size: 'icon',
          class: `cursor-pointer ${campaignLoadingId.value === row.original.id ? 'loading-state' : ''}`,
          onClick: () => {
            selectedList.value = row.original
            sheet.value = true
          },
        }, h(Icon, {
          name: campaignLoadingId.value === row.original.id
            ? 'eos-icons:bubble-loading'
            : 'lucide:eye',
        })),
        h(Action, {
          onEdit: () => emit('edit', row.original),
        }),
      ]),
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
  if (val !== null) {
    emits('changeLimit', val)
  }
}
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
          >
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-if="props.loading">
          <TableCell :colspan="columns.length" class="text-center">
            Loading...
          </TableCell>
        </TableRow>

        <template v-else-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="p-3"
            >
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

  <div v-if="!loading" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
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

  <RinglessVoicemailListsConfigureDialog
    v-model:open="optionsOpen"
    :title="editTitle"
    :campaign="editCampaign"
  />

  <RinglessVoicemailListsTableSheet
    v-model:open="sheet"
    :list="selectedList"
  />
</template>

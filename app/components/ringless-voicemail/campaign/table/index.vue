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
import { ChevronsUpDown } from 'lucide-vue-next'

import moment from 'moment'
import { computed, h, ref, watch } from 'vue'
import Action from '@/components/ringless-voicemail/campaign/table/Action.vue'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

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
import { Separator } from '~/components/ui/separator'

const sheet = ref(false)
const selectedCampaign = ref<any>(null) // Store the campaign details
const campaignLoadingId = ref<number | null>(null) // Track loading campaign id
const actionRowId = ref<number | null>(null) // Track the row ID for the Action menu
const loading = ref(false)

// Dummy data with additional fields for the new sheet
const dummyData = ref([
  {
    id: 1,
    title: 'Marketing Campaign Q3',
    description: 'Quarterly marketing campaign targeting existing customers',
    call_time_start: '09:00:00',
    call_time_end: '17:00:00',
    group_id: 'Customer List A',
    min_lead_temp: 150,
    max_lead_temp: 500,
    updated: '2023-07-15 14:30:00',
    status: 1,
    caller_id: '+1 (555) 123-4567',
    custom_caller_id: 'Marketing Dept',
    country_code: 'US (+1)',
    send_crm: 1,
    email: 1,
    sms: 1,
    send_report: 1,
  },
  {
    id: 2,
    title: 'Sales Outreach',
    description: 'Outreach to potential new clients',
    call_time_start: '10:00:00',
    call_time_end: '18:00:00',
    group_id: 'Prospect List B',
    min_lead_temp: 75,
    max_lead_temp: 200,
    updated: '2023-07-16 09:15:00',
    status: 0,
    caller_id: '+1 (555) 987-6543',
    custom_caller_id: 'Sales Team',
    country_code: 'US (+1)',
    send_crm: 0,
    email: 0,
    sms: 1,
    send_report: 0,
  },
  {
    id: 3,
    title: 'Product Feedback',
    description: 'Gathering feedback on new product features',
    call_time_start: '11:00:00',
    call_time_end: '15:00:00',
    group_id: 'User List C',
    min_lead_temp: 40,
    max_lead_temp: 100,
    updated: '2023-07-14 16:45:00',
    status: 1,
    caller_id: '+1 (555) 456-7890',
    custom_caller_id: 'Product Team',
    country_code: 'US (+1)',
    send_crm: 1,
    email: 1,
    sms: 0,
    send_report: 1,
  },
  {
    id: 4,
    title: 'Customer Retention',
    description: 'Campaign to retain high-value customers',
    call_time_start: '08:30:00',
    call_time_end: '16:30:00',
    group_id: 'VIP Clients',
    min_lead_temp: 200,
    max_lead_temp: 300,
    updated: '2023-07-13 11:20:00',
    status: 1,
    caller_id: '+1 (555) 789-0123',
    custom_caller_id: 'VIP Support',
    country_code: 'US (+1)',
    send_crm: 1,
    email: 1,
    sms: 1,
    send_report: 1,
  },
  {
    id: 5,
    title: 'New Product Launch',
    description: 'Announcing our latest product release',
    call_time_start: '12:00:00',
    call_time_end: '20:00:00',
    group_id: 'All Contacts',
    min_lead_temp: 300,
    max_lead_temp: 1000,
    updated: '2023-07-12 13:10:00',
    status: 0,
    caller_id: '+1 (555) 234-5678',
    custom_caller_id: 'Product Launch',
    country_code: 'US (+1)',
    send_crm: 0,
    email: 0,
    sms: 0,
    send_report: 0,
  },
])

// Dummy meta data
const meta = ref({
  current_page: 1,
  per_page: 10,
  last_page: 5,
  total: 50,
})

function formatTime(time: string) {
  return moment(time, 'HH:mm:ss').format('h:mm A')
}

async function openSheet(id: number) {
  campaignLoadingId.value = id
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    selectedCampaign.value = dummyData.value.find(item => item.id === id)
    sheet.value = true
  }
  catch (error) {
    console.error('Error fetching campaign details:', error)
  }
  finally {
    campaignLoadingId.value = null
  }
}

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
      }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.title),
  }),

  columnHelper.accessor('group_id', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Total Lists', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => {
      return h('div', { class: 'text-center font-normal text-sm' }, row.original.group_id)
    },
  }),

  columnHelper.display({
    id: 'dialed',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Dialed/Total leads', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-center text-sm' }, `${row.original.min_lead_temp || 0}/${row.original.max_lead_temp || 0}`),
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
      const updated = row.original.updated
      return h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, [
        h('div', updated ? moment(updated, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') : ''),
        h('br'),
        h('div', { class: 'text-xs' }, updated ? moment(updated, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A') : ''),
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
        class: 'data-[state=checked]:bg-green-600 cursor-pointer',
        modelValue: row.original.status === 1,

      })),
    sortingFn: (rowA, rowB, columnId) => {
      const valueA = rowA.original.status === 1
      const valueB = rowB.original.status === 1
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
          console.log('Edit campaign:', row.original.id)
        },
        onDelete: () => {
          console.log('Delete campaign:', row.original.id)
        },
        onDuplicate: () => {
          console.log('Duplicate campaign:', row.original.id)
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
  get data() { return dummyData.value || [] },
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
    columnPinning: {
      left: ['status'],
    },
  },
})

function handlePageChange(page: number) {
  console.log('Page changed to:', page)
  meta.value.current_page = page
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
  <div v-if="meta?.current_page && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ meta?.current_page }} to

        <span>
          <Select :default-value="10">
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
      <!-- Pagination Controls -->
      <TableServerPagination
        :total-items="Number(meta?.total)" :current-page="Number(meta?.current_page)"
        :items-per-page="Number(meta?.per_page)" :last-page="Number(meta?.last_page)" @page-change="handlePageChange"
      />
    </div>
  </div>

  <Sheet v-model:open="sheet">
    <SheetContent class="min-w-[483px]">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
          Campaign Details
        </SheetTitle>
      </SheetHeader>
      <div v-if="selectedCampaign" class="p-6 space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-gray-600">
            <Icon name="material-symbols:campaign-outline" size="20" />
            <span class="text-sm font-normal">Name</span>
          </div>
          <div class="text-[16px] font-medium">
            {{ selectedCampaign.title }}
          </div>
        </div>
        <Separator />

        <!-- Description Section -->
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-gray-600">
            <Icon name="lucide:file-text" />
            <span class="text-sm font-normal">Description</span>
          </div>
          <p class="text-gray-700">
            {{ selectedCampaign.description || 'No description available' }}
          </p>
        </div>
        <Separator />

        <!-- Grid Layout for Details -->
        <div class="grid grid-cols-2 gap-6">
          <!-- Dialing Mode -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="ic:outline-local-phone" />
              <span class="text-sm font-normal">Dialing Mode</span>
            </div>
            <p class="text-gray-700">
              Ringless Voicemail
            </p>
          </div>

          <!-- Status -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:zap" />
              <span class="text-sm font-normal">Status</span>
            </div>
            <p
              class="font-medium text-[16px]" :class="[
                selectedCampaign.status === 1 ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ selectedCampaign.status === 1 ? 'Active' : 'Inactive' }}
            </p>
          </div>

          <!-- Time based calling -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="material-symbols:clock-loader-60" />
              <span class="text-sm font-normal">Time Zone Rule</span>
            </div>
            <p
              class="font-medium text-[16px]" :class="[
                selectedCampaign.call_time_start ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ selectedCampaign.call_time_start ? 'Yes' : 'No' }}
            </p>
          </div>

          <!-- Call Time -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:clock-4" />
              <span class="text-sm font-normal">Call Time</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ formatTime(selectedCampaign.call_time_start) }} to {{ formatTime(selectedCampaign.call_time_end) }}
            </p>
          </div>

          <!-- Caller ID -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="clarity:user-line" />
              <span class="text-sm font-normal">Caller ID</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ selectedCampaign.caller_id || 'Not specified' }}
            </p>
          </div>

          <!-- Custom Caller ID -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:user-round-cog" />
              <span class="text-sm font-normal">Custom Caller ID</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ selectedCampaign.custom_caller_id || 'Not specified' }}
            </p>
          </div>

          <!-- Created Date -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:calendar-days" />
              <span class="text-sm font-normal">Created Date</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ moment(selectedCampaign.updated).format('MM/DD/YYYY hh:mm A') }}
            </p>
          </div>

          <!-- Total Leads -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="material-symbols:" />
              <span class="text-sm font-normal">Total Leads</span>
            </div>
            <p class="text-gray-700 text-[16px] font-normal">
              {{ selectedCampaign.max_lead_temp || 0 }}
            </p>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

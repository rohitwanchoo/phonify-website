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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ChevronsUpDown } from 'lucide-vue-next'
import moment from 'moment'

import { computed, h, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Action from '@/components/ringless-voicemail/campaign/table/Action.vue'

import { Button } from '@/components/ui/button'
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

const optionsOpen = ref(false)
const editTitle = ref('')
const editCampaign = ref('')

export interface SmsLog {
  charge: string;            
  client_package_id: number | null;
  currency_code: string;        
  date: string;                
  did: number;                 
  extension: number;           
  id: number;                  
  isFree: number;              
  message: string;             
  mms_url: string | null;
  number: number;               
  operator: string;            
  sms_type: string;            
  status: string;              
  type: string;                
  user_id: number;       
}



const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: SmsLog[]
  start: number // pagination start
  limit?: number // pagination limit
}>(), {
  limit: 10, // Set default limit to 10
})

// Computed pagination variables
const emits = defineEmits(['pageNavigation', 'limitChange'])
const total = computed(() => props.totalRows)
const current_page = computed(() => Math.floor(props.start / props.limit) + 1)
const per_page = computed(() => props.limit)
const last_page = computed(() => Math.ceil(total.value / per_page.value))


const columnHelper = createColumnHelper<SmsLog>()
const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
    enableSorting: true,
  }),
  columnHelper.accessor('extension', {
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'w-full justify-center',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        h('div', { class: 'text-sm font-normal' }, 'Contact Name'),
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ])
    },
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' },'-'),
    enableSorting: true,
  }),
  columnHelper.accessor('number', {
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'w-full justify-center',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        h('div', { class: 'text-sm font-normal' }, 'Receiver'),
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ])
    },
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, formatNumber(String(row.original.number || ''))),
    enableSorting: true,
  }),
  columnHelper.accessor('did', {
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'w-full justify-center',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        h('div', { class: 'text-sm font-normal' }, 'Sender'),
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ])
    },
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, formatNumber(String(row.original.did || ''))),
    enableSorting: true,
  }),
  columnHelper.accessor('message', {
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'w-full justify-center',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        h('div', { class: 'text-sm font-normal' }, 'Message'),
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ])
    },
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis' }, row.original.message || '-'),
    enableSorting: true,
  }),
  columnHelper.accessor('date', {
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        class: 'w-full justify-center',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, [
        h('div', { class: 'text-sm font-normal' }, 'Date'),
        h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' }),
      ])
    },
    cell: ({ row }) => {
      const formattedDate = moment(row.original.date).format('DD/MM/YYYY')
      const formattedTime = moment(row.original.date).format('hh:mm A')
      return h('div', { class: 'text-center font-normal text-sm leading-tight' }, [
        h('div', formattedDate || '-'),
        h('div', formattedTime || '-'),
      ])
    },
    enableSorting: true,
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center w-full' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center gap-x-1' }, [
      h(
        Button,
        {
          variant: 'outline',
          class: 'inline-flex items-center justify-center gap-x-2 rounded-md p-2 text-primary transition hover:bg-accent ',
          onClick: () => {
            console.log('View chat:', row.original.id)
          },
        },
        [
          h(Icon, { name: 'material-symbols:visibility', class: 'h-4 w-4 text-primary' }),
          h('span', 'View Chat'),
        ],
      ),
      h(Action, {
        onEdit: () => {
          editTitle.value = row.original.contact_name
          editCampaign.value = row.original.message
          optionsOpen.value = true
        },
        onDelete: () => {
          console.log('Delete chat:', row.original.id)
        },
        onDuplicate: () => {
          console.log('Duplicate chat:', row.original.id)
        },
      }),

    ]),
    enableSorting: false,
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return props.list },
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

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}

function changeLimit(val: number | null) {
  if (val !== null) {
    emits('limitChange', val)
  }
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
</template>

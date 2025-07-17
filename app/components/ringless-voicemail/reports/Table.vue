<script setup lang="ts">
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useVueTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type ExpandedState,
} from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import moment from 'moment'
import { ref, h, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import TableServerPagination from '@/components/table/ServerPagination.vue'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { valueUpdater } from '@/components/ui/table/utils' // Add this import

const dummyData = ref(
  Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    campaign: `Campaign ${i + 1}`,
    cli: '+ (123) 456 7890',
    type: 'Lorem Ipsum',
    number: '+1 (555) 123 4567',
    stateCity: 'TX / Houston',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    recording: `audio_${i + 1}.mp3`,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  }))
)

const meta = ref({
  current_page: 1,
  per_page: 10,
  last_page: 2,
  total: 10,
})
const paginatedData = computed(() => {
  const start = (meta.value.current_page - 1) * meta.value.per_page
  const end = start + meta.value.per_page
  return dummyData.value.slice(start, end)
})

function handlePageChange(page: number) {
  meta.value.current_page = page
}

watch(() => meta.value.per_page, () => {
  handlePageChange(1)
})

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['#', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('campaign', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Campaign', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.campaign),
  }),

  columnHelper.accessor('cli', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['CLI', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.cli),
  }),

  columnHelper.accessor('type', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Type', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.type),
  }),

  columnHelper.accessor('number', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Number', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.number),
  }),

  columnHelper.accessor('stateCity', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['State/City', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.stateCity),
  }),

  columnHelper.accessor('startTime', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Start Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.startTime),
  }),

  columnHelper.accessor('endTime', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['End Time', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.original.endTime),
  }),

  columnHelper.accessor('recording', {
    header: ({ column }) =>
      h('div', { class: 'text-center min-w-[220px]' }, h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Recording', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center min-w-[220px]' }, [
        h('audio', {
          controls: true,
          class: 'w-full font-light',
        }, [
          h('source', {
            src: row.original.audioUrl,
            type: 'audio/mpeg',
          }),
          'Browser not supported',
        ]),
      ]),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() {
    return paginatedData.value 
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
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
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead 
            v-for="header in headerGroup.headers" 
            :key="header.id"
            :class="cn(
              'text-center',
              header.column.id === 'recording' ? 'min-w-[220px]' : '',
              header.column.id === 'campaign' ? 'min-w-[150px]' : '',
            )"
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
        <template v-if="table.getRowModel().rows.length">
          <TableRow 
            v-for="row in table.getRowModel().rows" 
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
          >
            <TableCell 
              v-for="cell in row.getVisibleCells()" 
              :key="cell.id"
              :class="cn(
                'text-center text-sm',
                cell.column.id === 'recording' ? 'min-w-[220px]' : '',
                cell.column.id === 'campaign' ? 'min-w-[150px]' : '',
              )"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="text-center py-6">
            No data available.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>

  <!-- PAGINATION -->
  <div
    v-if="meta?.current_page"
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4 py-4"
  >
    <div class="text-xs text-muted-foreground flex items-center flex-wrap gap-x-2">
      <span>
        Showing
        {{ meta.per_page * (meta.current_page - 1) + 1 }}
        to
        {{ Math.min(meta.current_page * meta.per_page, meta.total) }}
        of {{ meta.total }} entries
      </span>

      <span class="flex items-center gap-2">
        |
        <Select v-model="meta.per_page" @update:modelValue="handlePageChange(1)">
          <SelectTrigger class="w-fit h-7 gap-x-1 px-2 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="size in [10, 25, 50, 100]" :key="size" :value="size">
              {{ size }}
            </SelectItem>
          </SelectContent>
        </Select>
        per page
      </span>
    </div>

    <div>
      <TableServerPagination
        :total-items="meta.total"
        :current-page="meta.current_page"
        :items-per-page="meta.per_page"
        :last-page="meta.last_page"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>
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
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import Separator from '~/components/ui/separator/Separator.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])

function closeDialog() {
  emit('update:open', false)
}

const dialingColumnValue = ref('1') // Default to first row

const configureList = ref([
  {
    header: 'Number',
    dialingColumn: true,
    label: [
      { value: 1, label: 'label-1' },
      { value: 2, label: 'label-2' },
      { value: 3, label: 'label-3' },
    ],
    selectedLabel: '',
  },
  {
    header: 'Extension',
    dialingColumn: false,
    label: [
      { value: 1, label: 'label-1' },
      { value: 2, label: 'label-2' },
      { value: 3, label: 'label-3' },
    ],
    selectedLabel: '',
  },
  {
    header: 'Comment',
    dialingColumn: false,
    label: [
      { value: 1, label: 'label-1' },
      { value: 2, label: 'label-2' },
      { value: 3, label: 'label-3' },
    ],
    selectedLabel: '',
  },
])

interface ConfigureListItem {
  header: string
  dialingColumn: boolean
  label: Array<{ value: number, label: string }>
  selectedLabel: string
}

const columnHelper = createColumnHelper<ConfigureListItem>()
const columns = [
  // # Column
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),

  // File Header Column
  columnHelper.accessor('header', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'File Header'),
    cell: ({ getValue }) =>
      h('div', { class: 'text-center font-normal text-sm' }, getValue()),
  }),

  // Dialing Column (Radio Button)
  columnHelper.display({
    id: 'dialingColumn',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Dialing Column'),
    cell: ({ row }) =>
      h(RadioGroup, {
        'modelValue': dialingColumnValue.value,
        'onUpdate:modelValue': (val: string) => {
          dialingColumnValue.value = val
        },
        'class': 'flex justify-center',
      }, {
        default: () => h(RadioGroupItem, {
          value: (row.index + 1).toString(),
          class: [
            'h-4.5 w-4.5 mx-auto border-1 border-primary text-primary',
            'data-[state=checked]:border-[#16A34A] border-2', // Green border when checked
            '[&_[data-slot=radio-group-indicator]>svg]:!fill-[#16A34A]', // Targets the inner circle
          ].join(' '),
          checked: dialingColumnValue.value === (row.index + 1).toString(),
        }),
      }),
  }),

  // Label Column (Select)
  columnHelper.accessor('selectedLabel', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Label'),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'flex justify-center' },
        h(Select, {
          value: row.original.selectedLabel,
          onValueChange: (value: string) => {
            if (configureList.value[row.index]) {
              configureList.value[row.index]!.selectedLabel = value
            }
          },
        }, {
          default: () => [
            h(SelectTrigger, { class: 'w-full bg-[#F0F9F8] border-white' }, {
              default: () => h(SelectValue, { placeholder: 'Select label' }),
            }),
            h(SelectContent, {class: 'bg-[#F0F9F8]'}, {
              default: () => row.original.label.map(item =>
                h(SelectItem, {
                  key: item.value,
                  value: item.label,
                }, {
                  default: () => item.label,
                }),
              ),
            }),
          ],
        }),
      ),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  get data() { return configureList.value || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    columnPinning: {
      left: ['status'],
    },
  },
})
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-[90vw] w-[90vw] sm:min-w-[300px] md:min-w-[600px] lg:min-w-[900px] overflow-x-auto max-h-[70vh] lg:max-h-[95vh] text-primary">
      <DialogHeader>
        <DialogTitle class="text-primary">
          Configure List
        </DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <div class="border rounded-lg my-6 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead
                v-for="header in headerGroup.headers"
                :key="header.id"
                :data-pinned="header.column.getIsPinned()"
                class="bg-gray-50"
                :class="cn(
                  { 'sticky bg-background/95': header.column.getIsPinned() },
                  header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                )"
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  class=""
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() && 'selected'"
                class="hover:bg-gray-50"
              >
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :data-pinned="cell.column.getIsPinned()"
                  :class="cn(
                    { 'sticky bg-background/95': cell.column.getIsPinned() },
                    cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                  )"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell
                  :col-span="columns.length"
                  class="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>
      <div class="flex justify-between items-center mt-6">
        <Button
          type="button"
          variant="outline"
          class="w-[49%] border-red-500 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600"
          @click="closeDialog"
        >
          <Icon name="lucide:x" class="w-4 h-4 mr-1" />
          Discard
        </Button>
        <Button
          type="button"
          class="w-[49%] bg-primary text-white border-primary hover:bg-primary/90 hover:text-white"
          @click="closeDialog"
        >
          <Icon name="lucide:save" class="w-4 h-4 mr-1 text-white" />
          Save
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

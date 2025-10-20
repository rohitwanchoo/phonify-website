<script setup lang="ts">
import { Icon } from '#components'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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

const sorting = ref([])
const columnHelper = createColumnHelper<any>()

const meta = ref({
  current_page: 1,
  per_page: 10,
  last_page: 5,
  total: 50,
})

const data = ref([
  {
    id: 1,
    template: 'Engaging Email Outreach',
    message: 'Lorem ipsum dolor sit amet consectetur. Nibh in lobortis mauris velit.',
    status: true,
  },
  {
    id: 2,
    template: 'New Year – Sparkling Promotions',
    message: 'Lorem ipsum dolor sit amet consectetur. Sodales et libero.',
    status: false,
  },
  {
    id: 3,
    template: 'Billing Boost Campaign',
    message: 'Lorem ipsum dolor sit amet consectetur. Nulla tellus et morbi.',
    status: true,
  },
  {
    id: 4,
    template: 'Spring Awakening Offers',
    message: 'Lorem ipsum dolor sit amet consectetur. Id integer.',
    status: false,
  },
  {
    id: 5,
    template: 'Summer Vibes Sale',
    message: 'Lorem ipsum dolor sit amet consectetur. Eu.',
    status: false,
  },
  {
    id: 6,
    template: 'Autumn Abundance Specials',
    message: 'Lorem ipsum dolor sit amet consectetur. Sapien eget.',
    status: true,
  },
  {
    id: 7,
    template: 'Winter Festivity Deals',
    message: 'Lorem ipsum dolor sit amet consectetur. At eget arcu accumsan ut.',
    status: true,
  },
  {
    id: 8,
    template: 'Joyful Holiday Campaign',
    message: 'Lorem ipsum dolor sit amet consectetur. Nisl et dolor diam.',
    status: true,
  },
  {
    id: 9,
    template: 'Season of Giving Promotions',
    message: 'Lorem ipsum dolor sit amet consectetur. Iaculis nunc.',
    status: false,
  },

])

const columns = [
  columnHelper.display({
    id: 'index',
    header: () => h('div', { class: 'text-sm font-normal text-center' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('template', {
    header: ({ column }) => h('div', { class: 'flex justify-center' }, [
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Template Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    ]),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.template),
  }),
  columnHelper.accessor('message', {
    header: ({ column }) => h('div', { class: 'flex justify-center' }, [
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Message', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    ]),
    cell: ({ row }) => h('div', { class: 'text-sm text-center' }, row.original.message),
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => h('div', { class: 'flex justify-center' }, [
      h(Button, {
        variant: 'ghost',
        class: 'text-sm font-normal',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    ]),
    cell: ({ row }) => h('div', { class: 'flex justify-center' }, [
      h(Switch, {
        modelValue: row.original.status,
        class: 'data-[state=checked]:bg-green-600',
      }),
    ]),
    sortingFn: (rowA, rowB) => Number(rowB.original.status) - Number(rowA.original.status),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-sm font-normal text-center' }, 'Action'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center gap-2' }, [
        h(Button, {
          size: 'icon',
          variant: 'outline',
        }, () =>
          h(Icon, { name: 'material-symbols:edit-square' })),
        h(Button, {
          size: 'icon',
          variant: 'outline',
          class: 'border-red-500',
        }, () =>
          h(Icon, { name: 'material-symbols:delete', class: 'text-red-500' })),
      ]),
  }),
]

const table = useVueTable({
  data: data.value,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: updater => valueUpdater(updater, sorting),
  state: {
    get sorting() { return sorting.value },
  },
})
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="header in table.getFlatHeaders()"
            :key="header.id"
            class="bg-gray-50 text-center"
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
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
            class="[&>td]:align-middle"
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
          <TableCell :colspan="columns.length" class="h-24 text-center">
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
              <SelectItem v-for="n in [5,10,20,30,40,50]" :key="n" :value="n">
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
</template>

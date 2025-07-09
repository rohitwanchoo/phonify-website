<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '~/components/ui/switch'
import Action from '../ActionDropdown.vue'
import EditCampaign from '../EditCampaign.vue'

const props = withDefaults(defineProps<{
  list: any[]
  loading?: boolean
}>(), {
  list: () => [],
  loading: false,
})

const emits = defineEmits([
  'delete',
  'edit',
  'addTextSchedule',
  'addEmailSchedule',
])

const router = useRouter()

function handleView(row: any) {
  router.push({ path: '/app/campaign/marketing-campaign/schedule-list', query: { id: row.original.id } })
}

const editDialogOpen = ref(false)
const editRowData = ref<any>(null)

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('campaign_name', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-center text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Campaign Name', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.campaign_name),
  }),

  columnHelper.accessor('description', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-center text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Description', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.description),
  }),

  columnHelper.accessor('status', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Status', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) =>
      h('div', { class: 'text-center font-normal leading-[9px] text-sm' }, h(Switch, {
        'class': 'data-[state=checked]:bg-green-600 cursor-pointer',
        'modelValue': row.original.status === true || row.original.status === 1,
        'onUpdate:modelValue': (val: boolean) => {
          row.original.status = val ? 1 : 0
        },
      })),
    sortingFn: (rowA, rowB, columnId) => {
      const valueA = rowA.original.status === 1 || rowA.original.status === true
      const valueB = rowB.original.status === 1 || rowB.original.status === true
      return valueA === valueB ? 0 : valueA ? -1 : 1
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center gap-2' }, [
      h(Button, {
        variant: 'outline',
        class: 'px-2',
        onClick: () => {
          handleView(row)
        },
      }, [
        h(Icon, { name: 'material-symbols:visibility', size: 16 }),
        h('span', { class: 'text-xs font-normal' }, 'View'),
      ]),
      h(Action, {
        onEdit: () => {
          editRowData.value = row.original
          editDialogOpen.value = true
        },
        onAddTextSchedule: () => emits('addTextSchedule', row.original),
        onAddEmailSchedule: () => emits('addEmailSchedule', row.original),
        onDelete: () => emits('delete', row.original),
      }),
    ]),
  }),
]

const table = useVueTable({
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
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
            class="bg-gray-50"
          >
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell :colspan="columns?.length" class="h-12 text-center px-2 bg-white">
            Loading...
          </TableCell>
        </TableRow>
        <template v-else-if="table.getRowModel().rows?.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-3 text-center">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="text-center h-24">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <EditCampaign v-model:open="editDialogOpen" :row-data="editRowData" />
</template>

<script setup lang="ts">
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

import { Icon } from '#components'

import { createColumnHelper, FlexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
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

import Button from '~/components/ui/button/Button.vue'

interface AudioMessage {
  id: number
  ivr_desc: string
  speech_text: string
  audio_url: string
}

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: AudioMessage[]
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

// const dummyData = ref<AudioMessage[]>([
//   { id: 1, extension: 'Lorem ipsum dolor sit amet consectetur. Est id facilisis in sit id nibh neque neque.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
//   { id: 2, extension: 'Libero nunc semper mauris duis sapien malesuada.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
//   { id: 3, extension: 'Tempus vel sed ac et quis ipsum et.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
//   { id: 4, extension: 'Bibendum id mi etiam amet est facilisis vitae.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
// ])

const showCreateRingless = ref(false)
const currentEditItem = ref<AudioMessage | null>(null)

function handleSave(data: { extension: string, audioUrl: string }) {
  if (!currentEditItem.value)
    return

  // Update the item in dummyData
  const index = dummyData.value.findIndex(item => item.id === currentEditItem.value?.id)
  if (index !== -1) {
    dummyData.value[index] = {
      ...dummyData.value[index],
      ...data,
    }
  }

  showCreateRingless.value = false
  currentEditItem.value = null
}

const columnHelper = createColumnHelper<AudioMessage>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('ivr_desc', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-center text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Description', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.ivr_desc || '-'),
  }),

  columnHelper.accessor('audio_url', {
    header: ({ column }) =>
      h('div', { class: 'text-center w-[100px] mx-auto' }, 'File'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center w-full' }, [
        h('audio', {
          controls: true,
          class: 'w-full max-w-xl',
        }, [
          h('source', {
            src: row.original.audioUrl,
            type: 'audio/mpeg',
          }),
          'Browser not supported',
        ]),
      ]),
  }),

  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center space-x-2' }, [
        h(Button, {
          class: 'bg-white text-black border border-black px-2.5 hover:bg-white',
          onClick: () => {
            currentEditItem.value = row.original
            showCreateRingless.value = true
          },
        }, [
          h(Icon, { name: 'material-symbols:edit-square', size: 16 }),
        ]),
      ]),
    meta: { className: 'w-[100px] text-center' },
  }),

]
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  get data() { return props.list || [] },
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

  },
})

function handlePageChange(page: number) {
  emits('pageNavigation', page)
}
function changeLimit(val: number) {
  emits('changeLimit', val)
}
</script>

<template>
  <div class="w-full overflow-x-auto border rounded-xl bg-white mt-8">
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

    <div v-if="totalRows && !loading" class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
      <div class="flex-1 text-xs text-primary">
        <div class="flex items-center gap-x-2 justify-center sm:justify-start">
          Showing {{ current_page }} to

          <span>
            <Select :default-value="10" :model-value="limit" @update:model-value="changeLimit">
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

    <!-- CreateRingless Dialog -->
    <InboundSettingsDialog
      v-if="currentEditItem"
      v-model:open="showCreateRingless"
      :item="currentEditItem"
      heading="Create New Call Time"
      @save="handleSave"
    />
  </div>
</template>

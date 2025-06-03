<script setup lang="ts">
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { SquarePen, Trash2 } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'

// Dummy data with playable audio
const dummyData = ref([
  { id: 1, extension: '123456', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, extension: '234567', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, extension: '345678', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, extension: '456789', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
])

const isEditDialogOpen = ref(false)
const currentEditItem = ref<typeof dummyData.value[0] | null>(null)

const columnHelper = createColumnHelper<typeof dummyData.value[0]>()

const columns = [
  columnHelper.display({
    id: 'serial',
    header: () => h('span', { class: 'pl-3'}, '#'),
    cell: ({ row }) => h('span', { class: 'text-xs font-light pl-3' }, row.index + 1),
    meta: { className: 'w-[50px] text-center' },
  }),

  columnHelper.accessor('extension', {
    header: 'Extension',
    cell: ({ row }) => h('span', { class: 'text-xs font-light' }, row.original.extension),
    meta: { className: 'w-[120px] text-center' },
  }),

  columnHelper.accessor('fileName', {
    header: 'File Name',
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center' }, [
        h('audio', {
          controls: true,
          class: ' w-[95%] max-w-xs font-light',
        }, [
          h('source', {
            src: row.original.audioUrl,
            type: 'audio/mpeg',
          }),
          'Browser not supported',
        ]),
      ]),
    meta: { className: 'w-full text-center' },
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex justify-center space-x-2' }, [
        h(Button, {
          class: 'p-0 border border-primary rounded-md text-primary',
          variant: 'outline',
          size: 'icon',
          onClick: () => handleEdit(row.original),
        }, h(SquarePen, { class: 'h-3 w-3 ' })),

        h(Button, {
          class: 'p-0 rounded-md border border-red-500 text-red-500  hover:text-red-500',
          variant: 'outline',
          size: 'icon',
          onClick: () => handleDelete(row.original.id),
        }, h(Trash2, { class: 'h-3 w-3 ' })),
      ])
    },
    meta: { className: 'w-[120px] text-center' },
  }),
]

const table = useVueTable({
  data: dummyData.value,
  columns,
  getCoreRowModel: getCoreRowModel(),
})

function handleEdit(file: typeof dummyData.value[0]) {
  currentEditItem.value = file
  isEditDialogOpen.value = true
}

function handleDelete(id: number) {
  dummyData.value = dummyData.value.filter(item => item.id !== id)
}
</script>

<template>
  <div class="w-full overflow-x-auto">
    <table class="table-fixed">
      <thead class="bg-gray-50">
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="px-2 py-2 text-xs font-normal text-gray-500 h-11" :class="[header.column.columnDef.meta?.className]"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          class="hover:bg-gray-50"
        >
          <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="px-2 py-3" :class="[cell.column.columnDef.meta?.className]"
          >
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <ProfileVoiceAiEditDialog
      v-if="currentEditItem"
      v-model:open="isEditDialogOpen"
      :item="currentEditItem"
    />
  </div>
</template>

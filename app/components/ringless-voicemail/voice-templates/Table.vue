<script setup lang="ts">
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown, SquarePen, Trash2 } from 'lucide-vue-next'
import { h, ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'

const dummyData = ref([
  { id: 1, extension: 'Lorem ipsum dolor sit amet consectetur. Est id facilisis in sit id nibh neque neque.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, extension: 'Libero nunc semper mauris duis sapien malesuada.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, extension: 'Tempus vel sed ac et quis ipsum et.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, extension: 'Bibendum id mi etiam amet est facilisis vitae.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
])

const isEditDialogOpen = ref(false)
const currentEditItem = ref<typeof dummyData.value[0] | null>(null)

const columnHelper = createColumnHelper<typeof dummyData.value[0]>()

const columns = [
  columnHelper.display({
    id: 'serial',
    header: () => h('div', { class: 'inline-flex items-center justify-center gap-1 w-full' }, [
      '#',
    ]),
    cell: ({ row }) => h('span', { class: 'text-xs font-light' }, row.index + 1),
    meta: { className: 'w-[40px] text-center' },
  }),

  columnHelper.accessor('extension', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center  gap-1 w-full' }, [
      'Description',
      h(Button, {
        class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-sm font-light text-left' }, row.original.extension),
    sortingFn: 'alphanumeric',
    meta: { className: 'w-[40%]' },
  }),

  columnHelper.accessor('audioUrl', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-1 w-full' }, [
      'File',
      h(Button, {
        class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
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
    sortingFn: 'alphanumeric',
    meta: { className: 'w-[40%] text-center' },
  }),

  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center space-x-2' }, [
        h(Button, {
          class: 'p-0 border border-primary rounded-md text-primary',
          variant: 'outline',
          size: 'icon',
          onClick: () => handleEdit(row.original),
        }, h(SquarePen, { class: 'h-3 w-3' })),

        h(Button, {
          class: 'p-0 rounded-md border border-red-500 text-red-500 hover:text-red-500',
          variant: 'outline',
          size: 'icon',
          onClick: () => handleDelete(row.original.id),
        }, h(Trash2, { class: 'h-3 w-3' })),
      ]),
    meta: { className: 'w-[100px] text-center' },
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
  <div class="w-full overflow-x-auto border rounded-xl bg-white mt-8">
    <!-- Header -->
    <div class="px-4 py-3 border-b text-sm font-semibold text-gray-800">
      Call Timing #
    </div>

    <!-- Table -->
    <table class="table-fixed w-full">
      <thead class="bg-gray-50">
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="px-3 py-4 text-sm font-medium text-gray-500 text-center align-middle"
            :class="[header.column.columnDef.meta?.className]"
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
            class="px-3 py-3 align-middle text-center"
            :class="[cell.column.columnDef.meta?.className]"
          >
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Dialog -->
    <ProfileVoiceAiEditDialog
      v-if="currentEditItem"
      v-model:open="isEditDialogOpen"
      :item="currentEditItem"
    />
  </div>
</template>

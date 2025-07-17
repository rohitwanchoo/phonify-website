<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'

interface AudioMessage {
  id: number
  extension: string
  audioUrl: string
}

const dummyData = ref<AudioMessage[]>([
  { id: 1, extension: 'Lorem ipsum dolor sit amet consectetur. Est id facilisis in sit id nibh neque neque.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, extension: 'Libero nunc semper mauris duis sapien malesuada.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, extension: 'Tempus vel sed ac et quis ipsum et.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, extension: 'Bibendum id mi etiam amet est facilisis vitae.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
])

const showCreateRingless = ref(false)
const currentEditItem = ref<AudioMessage | null>(null)

const handleSave = (data: { extension: string; audioUrl: string }) => {
  if (!currentEditItem.value) return
  
  // Update the item in dummyData
  const index = dummyData.value.findIndex(item => item.id === currentEditItem.value?.id)
  if (index !== -1) {
    dummyData.value[index] = {
      ...dummyData.value[index],
      ...data
    }
  }
  
  showCreateRingless.value = false
  currentEditItem.value = null
}

const columnHelper = createColumnHelper<AudioMessage>()

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

const table = useVueTable({
  data: dummyData.value,
  columns,
  getCoreRowModel: getCoreRowModel(),
})
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

    <!-- CreateRingless Dialog -->
    <InboundSettingsAudioMessagesEditDialog
      v-if="currentEditItem"
      v-model:open="showCreateRingless"
      :item="currentEditItem"
      @save="handleSave"
    />
  </div>
</template>
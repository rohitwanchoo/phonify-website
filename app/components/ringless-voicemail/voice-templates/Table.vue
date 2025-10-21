<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import { h, ref } from 'vue'
import CreateRingless from '@/components/ringless-voicemail/voice-templates/CreateRinglessVoiceMail.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Button from '~/components/ui/button/Button.vue'

const dummyData = ref([
  { id: 1, description: 'Lorem ipsum dolor sit amet consectetur. Est id facilisis in sit id nibh neque neque.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, description: 'Libero nunc semper mauris duis sapien malesuada.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, description: 'Tempus vel sed ac et quis ipsum et.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, description: 'Bibendum id mi etiam amet est facilisis vitae.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
])

const showCreateRingless = ref(false)
const currentEditItem = ref<typeof dummyData.value[0] | null>(null)
const ringlessDialogMode = ref<'create' | 'edit'>('create')

const emptyRinglessItem = {
  id: 0,
  description: '',
  audioUrl: '',
}

const columnHelper = createColumnHelper<typeof dummyData.value[0]>()

const columns = [
  columnHelper.display({
    id: 'serial',
    header: () => h('div', { class: 'text-center' }, '#'),
    cell: ({ row }) => h('span', { class: 'text-sm font-light' }, row.index + 1),
    meta: { className: 'w-[40px] text-center' },
  }),

  columnHelper.accessor('description', {
    header: ({ column }) => h('div', { class: 'text-center w-full inline-flex items-center justify-center gap-1' }, [
      'Description',
      h(Button, {
        class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-sm font-light text-left' }, row.original.description || '-'),
    sortingFn: 'alphanumeric',
    meta: { className: 'w-[50%]' },
  }),

  columnHelper.accessor('audioUrl', {
    header: ({ column }) => h('div', { class: 'text-center w-full inline-flex items-center justify-center gap-1' }, [
      'File',
      h(Button, {
        class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'flex justify-center w-full' }, [
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
    meta: { className: 'w-[50%] text-center' },
  }),

  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex justify-center space-x-2' }, [
    // Edit Button with Tooltip
      h(TooltipProvider, { delayDuration: 1000 }, [
        h(Tooltip, {}, [
          h(TooltipTrigger, { as: 'div' }, [
            h(Button, {
              class: 'bg-white text-black border border-black px-2.5 hover:bg-white',
              onClick: () => handleEdit(row.original),
            }, [
              h(Icon, { name: 'material-symbols:edit-square', size: 16 }),
            ]),
          ]),
          h(TooltipContent, {}, 'Edit'),
        ]),
      ]),

      // Delete Button with Tooltip
      h(TooltipProvider, { delayDuration: 1000 }, [
        h(Tooltip, {}, [
          h(TooltipTrigger, { as: 'div' }, [
            h(Button, {
              class: 'p-0 rounded-md border border-red-500 text-red-500 hover:text-red-500',
              variant: 'outline',
              size: 'icon',
              onClick: () => handleDelete(row.original.id),
            }, h(Icon, { name: 'material-symbols:delete', size: 17 })),
          ]),
          h(TooltipContent, {}, 'Delete'),
        ]),
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

function handleEdit(item: typeof dummyData.value[0]) {
  currentEditItem.value = { ...item }
  ringlessDialogMode.value = 'edit'
  showCreateRingless.value = true
}

function handleDelete(id: number) {
  dummyData.value = dummyData.value.filter(item => item.id !== id)
  console.log(`Deleted item with id: ${id}`)
}

function handleSave(data: { description: string, audioUrl: string }) {
  if (currentEditItem.value?.id) {
    const index = dummyData.value.findIndex(item => item.id === currentEditItem.value?.id)
    if (index !== -1) {
      dummyData.value[index] = { ...currentEditItem.value, ...data }
    }
  }
  else {
    const newId = Math.max(...dummyData.value.map(item => item.id), 0) + 1
    dummyData.value.push({ id: newId, ...data })
  }

  showCreateRingless.value = false
  currentEditItem.value = null
}
</script>

<template>
  <div class="w-full overflow-x-auto border rounded-xl bg-white mt-8">
    <!-- Header -->
    <div class="px-4 py-3 border-b text-sm font-semibold text-gray-800">
      Call Timing #
    </div>

    <!-- Table -->
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="text-center px-4   py-4 text-sm font-medium text-gray-500 bg-gray-50 align-middle"
            :class="header.column.columnDef.meta?.className"
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
        <TableRow
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          class="hover:bg-[#FAFAFA]"
        >
          <TableCell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="text-center px-8 py-3 align-middle"
            :class="cell.column.columnDef.meta?.className"
          >
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Edit Dialog -->
    <CreateRingless
      v-model:open="showCreateRingless"
      :item="currentEditItem || emptyRinglessItem"
      :mode="ringlessDialogMode"
      @save="handleSave"
    />
  </div>
</template>

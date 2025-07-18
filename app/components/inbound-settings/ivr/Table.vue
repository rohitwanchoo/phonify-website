<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown, Eye, Pencil, Trash2 } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import CreateRingless from '@/components/ringless-voicemail/voice-templates/CreateRinglessVoiceMail.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Button from '~/components/ui/button/Button.vue'

const dummyData = ref([
  { id: 1, extension: 'Lorem ipsum dolor sit amet consectetur. Est id facilisis in sit id nibh neque neque.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, extension: 'Libero nunc semper mauris duis sapien malesuada.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, extension: 'Tempus vel sed ac et quis ipsum et.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, extension: 'Bibendum id mi etiam amet est facilisis vitae.', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
])

const showCreateIvr = ref(false)
const currentEditItem = ref<typeof dummyData.value[0] | null>(null)
const ringlessDialogMode = ref<'create' | 'edit'>('create')
const campaignLoadingId = ref<number | null>(null)
const router = useRouter()

const emptyRinglessItem = {
  id: 0,
  extension: '',
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

  columnHelper.accessor('extension', {
    header: ({ column }) => h('div', { class: 'text-center w-full inline-flex items-center justify-center gap-1' }, [
      'Description',
      h(Button, {
        class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-sm font-light text-left' }, row.original.extension),
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
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-center' }, [
      h(Button, {
        class: 'font-light',
        onClick: () => router.push('/app/inbound-settings/ivr/view-ivr'),
      }, [
        h(Icon, {
          name: 'material-symbols:visibility-outline',
          class: 'text-white text-base',
        }),
        'View More',
      ]),

      h(Button, {
        size: 'icon',
        variant: 'outline',
        class: 'border-primary',
        onClick: () => handleEdit(row.original),
      }, [
        h(Icon, {
          name: 'material-symbols:edit-square',
          class: 'text-base text-primary',
        }),
      ]),

      h(Button, {
        size: 'icon',
        variant: 'outline',
        class: ' text-red-600 border-red-600 hover:text-red-700',
        onClick: () => handleDelete(row.original.id),
      }, [
        h(Icon, {
          name: 'material-symbols:delete',
          class: 'text-base text-red-600',
        }),
      ]),
    ]),
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
  showCreateIvr.value = true
}

function handleDelete(id: number) {
  dummyData.value = dummyData.value.filter(item => item.id !== id)
}

function handleSave(data: { extension: string, audioUrl: string }) {
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

  showCreateIvr.value = false
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
            class="text-center px-4 py-4 text-sm font-medium text-gray-500 bg-gray-50 align-middle"
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
    <InboundSettingsDialog
      v-model:open="showCreateIvr"
      :item="currentEditItem || emptyRinglessItem"
      :mode="ringlessDialogMode"
      heading="Create New Call Time"
      @save="handleSave"
    />
  </div>
</template>

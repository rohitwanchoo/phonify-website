<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { useConfirmDialog } from '@vueuse/core'
import { ChevronsUpDown, Eye, Pencil, Trash2 } from 'lucide-vue-next'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Button from '~/components/ui/button/Button.vue'

const props = withDefaults(defineProps<{
  list: any[]
  loading: boolean
  totalRows: number
  start: number
  limit?: number
}>(), {
  limit: 10,
})

const emits = defineEmits(['refresh'])
const showCreateIvr = ref(false)
const currentEditItem = ref<typeof props.list[0] | null>(null)
const ringlessDialogMode = ref<'create' | 'edit'>('create')
const router = useRouter()

// Delete confirmation setup
const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const selectedItemForDelete = ref<number | null>(null)

const emptyRinglessItem = {
  id: 0,
  extension: '',
  audioUrl: '',
}

async function handleDelete(id: number) {
  selectedItemForDelete.value = id
  revealDeleteConfirm()
}

async function deleteConfirmHandler() {
  if (!selectedItemForDelete.value)
    return

  try {
    // Replace with your actual API endpoint
    const res = await useApi().post('/delete-ivr', {
      auto_id: selectedItemForDelete.value,
    })

    if (res.success) {
      showToast({
        message: res.message || 'Item deleted successfully',
        type: 'success',
      })
    }
    else {
      showToast({
        message: res.message || 'Failed to delete item',
        type: 'error',
      })
    }
    emits('refresh')
  }
  catch (err) {
    showToast({
      message: `${err}`,
      type: 'error',
    })
  }
  finally {
    selectedItemForDelete.value = null
    deleteConfirm()
  }
}

// Rest of your existing code remains the same...
const columnHelper = createColumnHelper<typeof props.list[0]>()

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
    cell: ({ row }) => h('div', { class: 'text-sm font-light text-center' }, row.original.ivr_desc),
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
          src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
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
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
})

function handleEdit(item: typeof props.list[0]) {
  currentEditItem.value = { ...item }
  ringlessDialogMode.value = 'edit'
  showCreateIvr.value = true
}

function handleSave(data: { extension: string, audioUrl: string }) {
  console.log('save initiated')
  emits('refresh')
}
</script>

<template>
  <div class="w-full overflow-x-auto border rounded-xl bg-white mt-8 max-h-[85vh]">
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
        <TableRow v-if="loading">
          <TableCell :colspan="columns?.length" class="h-12 text-center px-2 bg-white">
            <BaseSkelton v-for="i in 9" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
          </TableCell>
        </TableRow>
        <template v-else-if="table.getRowModel().rows?.length">
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

    <!-- Edit Dialog -->
    <InboundSettingsDialog
      v-model:open="showCreateIvr"
      :item="currentEditItem || emptyRinglessItem"
      :mode="ringlessDialogMode"
      heading="Create New Call Time"
      @save="handleSave"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmAction
      v-model="showDeleteConfirm"
      :confirm="deleteConfirmHandler"
      :cancel="deleteCancel"
      title="Delete Item"
      description="You are about to delete this item. This action cannot be undone. Do you wish to proceed?"
    />
  </div>
</template>

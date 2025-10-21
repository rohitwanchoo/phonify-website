<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { useConfirmDialog } from '@vueuse/core'
import { ChevronsUpDown, MoreVertical } from 'lucide-vue-next'
import { h, ref } from 'vue'
import EditVoipConfigurationDialog from '~/components/configuration/voip-configuration/EditVoipConfigurationDialog.vue'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

const props = defineProps<{ list: any[], loading?: boolean }>()

const columnHelper = createColumnHelper<any>()
const editDialogOpen = ref(false)
const editRow = ref<any>(null)
const dropdownOpen = ref<number | null>(null)
const loading = ref(false)
const sorting = ref([])

// Pagination variables
const pageStart = ref(0)
const limit = ref(10)
const searchQuery = ref('')

// Computed property for paginated data
const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return props.list.slice(start, end)
})

// Meta data for pagination
const meta = computed(() => ({
  current_page: Math.floor(pageStart.value / limit.value) + 1,
  per_page: limit.value,
  total: props.list.length,
  last_page: Math.ceil(props.list.length / limit.value),
}))

const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const selectedIdForDelete = ref<number | null>(null)

function openEditDialog(row: any) {
  editRow.value = row.original
  editDialogOpen.value = true
}

function openDropdown(rowIdx: number) {
  dropdownOpen.value = rowIdx
}

function closeDropdown() {
  dropdownOpen.value = null
}

async function handleDeleteConfirm() {
  if (!selectedIdForDelete.value)
    return

  try {
    const res = await useApi().get(`/delete-voip-configuration/${selectedIdForDelete.value}`)

    if (res.success === true) {
      showToast({ message: res.message, type: 'success' })
    }
    else {
      showToast({ message: res.message || 'Deletion failed', type: 'error' })
    }

    refreshNuxtData('voip-configurations')
  }
  catch (err) {
    showToast({ message: `${err}`, type: 'error' })
  }
  finally {
    selectedIdForDelete.value = null
    deleteConfirm()
  }
}

// Pagination functions
function handlePageChange(page: number) {
  pageStart.value = (page - 1) * limit.value
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
}

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1 + pageStart.value),
  }),
  columnHelper.accessor('name', {
    header: ({ column }) => h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
      'Name',
      h(Button, {
        class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.name || '-'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('host', {
    header: ({ column }) => h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
      'Host',
      h(Button, {
        class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.host || '-'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('username', {
    header: ({ column }) => h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
      'Username',
      h(Button, {
        class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.username || '-'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('secret', {
    header: ({ column }) => h('div', { class: 'flex items-center justify-center gap-1 text-center text-sm font-normal' }, [
      'Password',
      h(Button, {
        class: 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-mono text-sm' }, row.original.secret || '-'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex items-center gap-2 justify-center' }, [
      h(Button, {
        size: 'sm',
        variant: 'outline',
        class: 'flex items-center gap-2 border-primary text-primary',
        onClick: () => openEditDialog(row),
      }, [h(Icon, { name: 'material-symbols:edit-square', filled: true, class: 'text-primary' }), 'Edit']),
      h(DropdownMenu, {
        'open': dropdownOpen.value === row.index,
        'onUpdate:open': (val: boolean) => val ? openDropdown(row.index) : closeDropdown(),
      }, {
        default: () => [
          h(DropdownMenuTrigger, { as: 'span', class: 'flex items-center justify-center h-full cursor-pointer' }, [
            h(MoreVertical, { class: 'h-5 w-5' }),
          ]),
          h(DropdownMenuContent, { align: 'end', class: 'min-w-[120px]' }, [
            h(DropdownMenuItem, {
              class: 'text-red-600 cursor-pointer flex items-center gap-2',
              onClick: () => {
                selectedIdForDelete.value = row.original.id
                revealDeleteConfirm()
              },
            }, [h(Icon, { name: 'material-symbols:delete-outline', class: 'text-base' }), 'Delete']),
          ]),
        ],
      }),
    ]),
  }),
]

const table = useVueTable({
  get data() {
    return paginatedList.value || []
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  state: { get sorting() { return sorting.value } },
})
</script>

<template>
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id" class="bg-gray-50">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="props.loading">
          <TableRow>
            <TableCell :colspan="columns.length" class="px-3 py-4">
              <div class="space-y-2">
                <BaseSkelton
                  v-for="i in 10"
                  :key="i"
                  class="h-8 w-full"
                  rounded="rounded-md"
                />
              </div>
            </TableCell>
          </TableRow>
        </template>

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
    <EditVoipConfigurationDialog v-model:open="editDialogOpen" :row="editRow" />
  </div>
  <ConfirmAction
    v-model="showDeleteConfirm"
    :confirm="handleDeleteConfirm"
    :cancel="deleteCancel"
    title="Delete VoIP Configuration"
    description="You are about to delete this configuration. Do you wish to proceed?"
  />

  <div v-if="meta?.current_page && !loading" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing
        <span>
          <Select :default-value="10" :model-value="limit" @update:model-value="(val) => changeLimit(Number(val))">
            <SelectTrigger class="w-fit gap-x-1 px-2">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in [10, 25, 50, 100]" :key="n" :value="n">
                {{ n }}
              </SelectItem>
            </SelectContent>
          </Select>
        </span>
        of {{ meta.total }} entries
      </div>
    </div>
    <div class="space-x-2">
      <!-- Pagination Controls -->
      <TableServerPagination
        :total-items="Number(meta.total)"
        :current-page="Number(meta.current_page)"
        :items-per-page="Number(meta.per_page)"
        :last-page="Number(meta.last_page)"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

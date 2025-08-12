<script setup lang="ts">
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'
import { ChevronsUpDown } from 'lucide-vue-next'
import moment from 'moment'
import { computed, h, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ConfigurationApiActionDropdown from '@/components/configuration/api/ActionDropdown.vue'
import ConfirmAction from '@/components/ConfirmAction.vue'
import TableServerPagination from '@/components/table/ServerPagination.vue'
import { Button } from '@/components/ui/button'
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

const props = withDefaults(defineProps<{
  list: any[]
  loading?: boolean
  refresh: () => void
}>(), {
  list: () => [],
  loading: false,
  refresh: () => {},
})

const router = useRouter()
const showDeleteConfirm = ref(false)
const selectedApiIdForDelete = ref<number | null>(null)
const selectedApiIdForDuplicate = ref<number | null>(null)

// Pagination state
const pageStart = ref(0)
const limit = ref(10)

// Paginated list
const paginatedList = computed(() => {
  const start = pageStart.value
  const end = start + limit.value
  return props.list.slice(start, end)
})

// Pagination metadata
const totalRows = computed(() => props.list.length)
const currentPage = computed(() => Math.floor(pageStart.value / limit.value) + 1)
const lastPage = computed(() => Math.ceil(totalRows.value / limit.value))

function changePage(page: number) {
  pageStart.value = Number((page - 1) * limit.value)
}

function changeLimit(val: number) {
  limit.value = Number(val)
  pageStart.value = 0
}

watch(() => props.list, () => {
  pageStart.value = 0
})

// Action handlers
function handleEditClick(row: any) {
  router.push({ path: '/app/configuration/api/create', query: { id: row.id } })
}

function handleDuplicateClick(row: any) {
  selectedApiIdForDuplicate.value = row.id
  useApi().post('copy-api', {
    api_id: selectedApiIdForDuplicate.value,
  }).then((res: any) => {
    if (res.success) {
      showToast({
        message: `${res.message} (New List ID: ${res.list_id})`,
        type: 'success',
      })
      props.refresh()
    }
    else {
      showToast({
        message: res.message || 'Failed to duplicate API.',
        type: 'error',
      })
    }
  }).catch((err: any) => {
    showToast({
      message: err.message || 'Failed to duplicate API.',
      type: 'error',
    })
  })
}

function handleDeleteClick(row: any) {
  selectedApiIdForDelete.value = row.id
  showDeleteConfirm.value = true
}

async function handleDeleteConfirm() {
  try {
    const res = await useApi().post('delete-api', {
      api_id: selectedApiIdForDelete.value,
    })
    if (res.success) {
      showToast({
        message: res.message,
        type: 'success',
      })
      props.refresh()
    }
    else {
      showToast({
        message: res.message || 'Failed to delete API.',
        type: 'error',
      })
    }
  }
  catch (err: any) {
    showToast({
      message: err.message || 'Failed to delete API.',
      type: 'error',
    })
  }
  finally {
    showDeleteConfirm.value = false
    selectedApiIdForDelete.value = null
  }
}

function handleDeleteCancel() {
  showDeleteConfirm.value = false
  selectedApiIdForDelete.value = null
}

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'inline-flex items-center justify-center w-full' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),
  columnHelper.accessor('title', {
    id: 'api_name',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'API Name',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.title),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('campaign', {
    id: 'campaign_name',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Campaign Name',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.campaign),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('url', {
    header: () => h('div', { class: 'inline-flex items-center justify-center w-full' }, 'URL'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.url),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('method', {
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Method',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.method),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('is_deleted', {
    id: 'status',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Status',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) =>
      h('span', {
        class: `inline-flex items-center justify-center px-0 py-1 h-6 w-[80px] rounded-full text-xs ${
          row.original.is_deleted !== '0' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`,
      }, row.original.is_deleted === '0' ? 'Inactive' : 'Active'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('is_default', {
    id: 'api_template',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'API Template',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) =>
      h('span', {
        class: `text-sm font-medium ${
          row.original.is_default === '1' ? 'text-green-600' : 'text-red-600'
        }`,
      }, row.original.is_default === '1' ? 'Yes' : 'No'),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('updated_at', {
    id: 'date_created',
    header: ({ column }) => h('div', { class: 'inline-flex items-center justify-center gap-0.5 w-full' }, [
      'Date Created',
      h(Button, {
        'class': 'p-0 m-0 h-auto min-w-0 bg-transparent hover:bg-transparent shadow-none align-middle',
        'variant': 'ghost',
        'aria-label': 'Sort',
        'onClick': () => column.toggleSorting(),
      }, () => h(ChevronsUpDown, { class: 'h-4 w-4' })),
    ]),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, moment(row.original.updated_at).format('DD/MM/YYYY HH:MM A')),
    sortingFn: 'datetime',
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Action'),
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center gap-2' }, [
      h(Button, {
        size: 'icon',
        variant: 'outline',
        class: 'text-primary h-8 w-15 min-w-0 flex items-center gap-1 px-2',
        title: 'Edit',
        onClick: () => handleEditClick(row.original),
      }, [
        h(Icon, { name: 'material-symbols:edit-square', size: 14 }),
        h('span', { class: 'text-xs font-medium' }, 'Edit'),
      ]),
      h(ConfigurationApiActionDropdown, {
        onDuplicate: () => handleDuplicateClick(row.original),
        onDelete: () => handleDeleteClick(row.original),
      }),
    ]),
  }),
]

const table = useVueTable({
  get data() { return paginatedList.value || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
</script>

<template>
  <div>
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
          <TableRow v-if="props.loading">
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

    <div v-if="totalRows" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
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
          of {{ totalRows }} entries
        </div>
      </div>
      <div class="space-x-2">
        <TableServerPagination
          :total-items="Number(totalRows)"
          :current-page="Number(currentPage)"
          :items-per-page="Number(limit)"
          :last-page="Number(lastPage)"
          @page-change="changePage"
        />
      </div>
    </div>

    <ConfirmAction
      v-model="showDeleteConfirm"
      :confirm="handleDeleteConfirm"
      :cancel="handleDeleteCancel"
      title="Delete API"
      description="You are about to delete this API. Do you wish to proceed?"
    />
  </div>
</template>

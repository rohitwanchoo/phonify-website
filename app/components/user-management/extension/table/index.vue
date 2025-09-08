<script setup lang="ts">
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import type { Extension } from '~/types/extension'
import { Icon } from '#components'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { useConfirmDialog } from '@vueuse/core'
import { ChevronsUpDown, CircleCheck, Copy } from 'lucide-vue-next'
import { h, ref } from 'vue'
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
import { valueUpdater } from '@/components/ui/table/utils'

import { cn } from '@/lib/utils'
import resetImage from '~/assets/svg/reset.svg'
import Action from './Action.vue'

const props = withDefaults(defineProps<{
  loading: boolean
  totalRows: number
  list: any[]
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

const selectedExtension = ref<Extension>()

const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

const {
  isRevealed: showResetConfirm,
  reveal: revealResetConfirm,
  confirm: resetConfirm,
  cancel: resetCancel,
} = useConfirmDialog()

async function deleteMethod(val: Extension) {
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled) {
    return false
  }
  useApi().post(`/edit-extension`, { extension_id: val.id, is_deleted: 1 }).then((res) => {
    showToast({
      message: res.message,
    })
    emits('refresh')
  }).catch((err) => {
    showToast({
      message: err.message,
    })
  })
}

async function resetExtension(row: { extension: number }) {
  const { isCanceled } = await revealResetConfirm()
  if (isCanceled) {
    return false
  }

  useApi().post(`/delete-ext-live`, { sip: row.extension }).then((res) => {
    showToast({
      type: 'success',
      message: res.message,
    })
    emits('refresh')
  }).catch((err) => {
    showToast({
      message: err.message,
      type: 'error',
    })
  })
  // // console.log(row)
  // showToast({
  //   type: 'success',
  //   message: 'Extension reset successfully',
  // })
}

const extensionLoadingId = ref(0)
const sheet = ref(false)

const extensionById = ref<Extension>()

function getExtensionByID(id: number) {
  extensionLoadingId.value = id

  useApi().post('extension', {
    extension_id: id,
  }).then((res: any) => {
    extensionById.value = res.data
    sheet.value = true
  }).catch(({ data }) => {
    showToast({
      type: 'error',
      message: data.message,
    })
  }).finally(() => {
    extensionLoadingId.value = 0
  })
}

const changePasswordModel = ref(false)
const changePermissionModel = ref(false)

const copy = ref('')

const columnHelper = createColumnHelper<Extension>()

const columns = [
  columnHelper.accessor('siNo', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('extension', {
    header: ({ column }) =>
      h('div', { class: 'text-center' }, h(Button, {
        class: 'text-sm font-normal',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Extension', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })])),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.getValue('extension')),
  }),

  columnHelper.accessor('secret', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Secret'),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'flex items-center justify-center gap-2 text-sm font-normal' },
        [
          h('span', '******'),
          h('div', { class: 'relative ' }, [
            h(copy.value === row.original.secret ? CircleCheck : Copy, {
              class: copy.value === row.original.secret ? 'w-4 h-4 text-green-600 cursor-pointer' : 'w-4 h-4 text-gray-500 cursor-pointer',
              onClick: async () => {
                await copyToClipboard(row.original.secret, 'Secret')
                copy.value = row.original.secret
                setTimeout(() => {
                  copy.value = ''
                }, 2000)
              },
            }),
          ]),
        ],
      ),
  }),

  // columnHelper.accessor('first_name', {
  //   header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Name'),
  //   cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.first_name + ' ' + row.original.last_name),

  // }),

  columnHelper.accessor('email', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Email'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.getValue('email')),
  }),

  columnHelper.accessor('mobile', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Phone Number'),
    cell: ({ row }) => {
      const mobile = row.original.country_code + row.original.mobile
      return h('div', { class: 'text-center font-normal text-sm' }, formatNumber(mobile) || '-')
    },
  }),

  columnHelper.accessor('actions', {
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm flex gap-x-1 justify-end pr-3' }, [
      h(Button, { size: 'icon', class: 'cursor-pointer', onClick: () => getExtensionByID(row.original?.id) }, h(Icon, { name: extensionLoadingId.value === row.original?.id ? 'eos-icons:bubble-loading' : 'lucide:eye' })),
      h(Action, {
        onEdit: () => {
          navigateTo({
            path: '/app/user-management/extension/create',
            query: { id: row?.original?.id },
          })
        },
        onDelete: () => {
          deleteMethod(row?.original)
        },
        onChangePassword: () => {
          selectedExtension.value = row?.original
          changePasswordModel.value = true
        },
        onUnlock: () => {
          selectedExtension.value = row?.original
          changePermissionModel.value = true
        },
        onReset: () => {
          resetExtension(row?.original)
        },
      }),
    ]),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  get data() { return props.list || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  initialState: { pagination: { pageSize: props.limit } },
  manualPagination: true,
  pageCount: last_page.value,
  rowCount: total.value,
  state: {
    pagination: {
      pageIndex: current_page.value,
      pageSize: per_page.value,
    },
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
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
  <div class="border rounded-lg my-6 overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers" :key="header.id"
            class="bg-gray-50"
          >
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
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
                v-for="cell in row.getVisibleCells()" :key="cell.id"
                class="p-[12px]"
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
          <TableCell :colspan="columns.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>

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
              <SelectItem v-for="n in 15" :key="n" :value="n">
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

  <!-- DETAILS -->
  <UserManagementDetails v-model:open="sheet" :data="extensionById as Extension" />

  <!-- CONFIRM DELETE -->
  <ConfirmAction v-model="showDeleteConfirm" :confirm="deleteConfirm" :cancel="deleteCancel" title="Delete Extension" description="You are about to delete extension. Do you wish to proceed?" />

  <!-- CONFIRM RESET -->
  <ConfirmAction v-model="showResetConfirm" :img="resetImage" title="Reset Extension" :cancel="resetCancel" description="You are about to reset extension. Do you wish to proceed?">
    <template #actions>
      <Button variant="outline" class="w-[49%] h-11 font-normal text-primary " @click="resetCancel">
        <Icon name="material-symbols:close" />
        Close
      </Button>
      <Button class="w-[49%] h-11 font-normal" @click="resetConfirm">
        <Icon name="material-symbols:delete" />
        Reset
      </Button>
    </template>
  </ConfirmAction>

  <!-- CHANGE PASSWORD -->
  <UserManagementExtensionChangePassword v-model="changePasswordModel" :selected-extension="selectedExtension" />

  <!-- CHANGE PERMISSION -->
  <UserManagementExtensionChangePermission v-model="changePermissionModel" :selected-extension="selectedExtension" />
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>

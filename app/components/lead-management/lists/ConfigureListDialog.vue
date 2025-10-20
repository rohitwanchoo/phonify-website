<script setup lang="ts">
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

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

import { toTypedSchema } from '@vee-validate/zod'

import { SelectIcon } from 'reka-ui'
import { useForm } from 'vee-validate'
import { h, ref } from 'vue'
import { z } from 'zod'

import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

const props = defineProps<Props>()

const emit = defineEmits(['update:open', 'complete'])

const listSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Title is required'),
  campaign_id: z.number().optional(),
}))

const dialingError = ref('')
const showLabelErrors = ref(false)

const { handleSubmit, setValues } = useForm({
  validationSchema: listSchema,
})

interface ListHeader {
  id: number
  list_id: number
  header: string
  label_id: number
  is_search: number
  is_dialing: number
  is_visible: number
  is_editable: number
}

interface ListData {
  campaign: string
  list: string
  campaign_id: number
  list_id: number
  updated_at: string
  is_active: number
  list_header: ListHeader[]
}

interface Props {
  open: boolean
  listData?: ListData
}

const { data: labelOptions } = await useLazyAsyncData('list-create-label', () =>
  useApi().post('/label'), {
  transform: res => res.data,
})

const title = ref<string>('')

const columnHelper = createColumnHelper<ListHeader>()
const columns = [
  columnHelper.display({
    id: 'slno',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.index + 1),
  }),

  columnHelper.accessor('header', {
    header: () =>
      h('div', { class: 'text-center' }, 'File Header'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm' }, row.original.header || '-'),
  }),

  columnHelper.accessor('is_search', {
    header: () =>
      h('div', { class: 'text-center' }, 'Search Filter'),
    cell: ({ row }) => h('div', { class: 'text-center' }, h(Checkbox, {
      'modelValue': !!row.original.is_search,
      'onUpdate:modelValue': (val: any) => row.original.is_search = val ? 1 : 0,
      'class': 'mx-auto border-primary data-[state=checked]:bg-[#16A34A] data-[state=checked]:border-[#16A34A]',
    })),
  }),

  columnHelper.accessor('is_visible', {
    header: () =>
      h('div', { class: 'text-center' }, 'Visible'),
    cell: ({ row }) => h('div', { class: 'text-center' }, h(Checkbox, {
      'modelValue': !!row.original.is_visible,
      'onUpdate:modelValue': (val: any) => row.original.is_visible = val ? 1 : 0,
      'class': 'mx-auto border-primary data-[state=checked]:bg-[#16A34A] data-[state=checked]:border-[#16A34A]',
    })),
  }),

  columnHelper.accessor('is_editable', {
    header: () =>
      h('div', { class: 'text-center' }, 'Editable'),
    cell: ({ row }) => h('div', { class: 'text-center' }, [

      h(Checkbox, {
        'modelValue': !!row.original.is_editable,
        'onUpdate:modelValue': (val: any) => row.original.is_editable = val ? 1 : 0,
        'class': 'mx-auto border-primary data-[state=checked]:bg-[#16A34A] data-[state=checked]:border-[#16A34A]',
      }),
    ]),
  }),

  columnHelper.accessor('is_dialing', {
    header: () =>
      h('div', { class: 'text-center' }, 'Dialing Column'),
    cell: ({ row }) => h('div', { class: 'text-center' }, h(RadioGroup, {
      'modelValue': row.original.is_dialing === 1 ? row.original.header : '',
      'onUpdate:modelValue': (value) => {
        // Update the dialing column for all rows
        // eslint-disable-next-line ts/no-use-before-define
        table.getRowModel().rows.forEach((r) => {
          r.original.is_dialing = r.original.header === value ? 1 : 0
        })
      },
      'defaultValue': props.listData?.list_header.find(el => el.is_dialing)?.header,
    }, () => [
      h(RadioGroupItem, {
        value: row.original.header,

        class: [
          'h-4.5 w-4.5 mx-auto border-1 border-primary text-primary',
          'data-[state=checked]:border-[#16A34A] border-2',
          '[&_[data-slot=radio-group-indicator]>svg]:!fill-[#16A34A]',
        ].join(' '),
      }),
    ])),
  }),

  columnHelper.accessor('label_id', {
    header: () =>
      h('div', { class: 'text-center' }, 'Label'),
    cell: ({ row }) => h('div', { class: 'text-center' }, [
      h(Select, {
        'modelValue': row.original.label_id,
        'onUpdate:modelValue': (val: any) => row.original.label_id = val,
      }, () => [
        h(SelectTrigger, {
          class: `w-full !h-11 !text-xs bg-[#F0F9F8] ${row.original.label_id ? 'text-black' : 'text-[#162D3A80]'}`,
        }, () => [
          h(SelectValue, {
            placeholder: 'Select label',
            class: 'text-xs md:text-sm',
          }),
        ]),
        h(SelectContent, {
          class: 'w-full',
        }, () =>
          labelOptions.value?.map((option: any) =>
            h(SelectItem, {
              key: option.id,
              value: option.id,
            }, () => option.title),
          )),
      ]),
      showLabelErrors.value && !row.original.label_id
        ? h('p', { class: 'text-red-500 text-xs mt-1 text-left' }, 'Label is required')
        : null,
    ]),
  }),

]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  get data() { return props.listData?.list_header || [] },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),

  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
})

function closeDialog() {
  emit('update:open', false)
}
const { data: campaigns } = useNuxtData('create-list-campaign')

const campaignLoading = ref(false)

async function refreshCampaignList() {
  if (!campaigns.value) {
    campaignLoading.value = true
    campaigns.value
    = await refreshNuxtData('create-list-campaign')
    campaignLoading.value = false
  }
}

const saveLoading = ref(false)

const saveConfigureList = handleSubmit((values) => {
  // Validate that at least one dialing column is selected
  const hasDialingColumn = table.getRowModel().flatRows.some(item => item.original.is_dialing === 1)
  if (!hasDialingColumn) {
    dialingError.value = 'Please select dialing column'
    return
  }
  dialingError.value = ''

  // Validate that all rows have a label selected
  const hasAllLabels = table.getRowModel().flatRows.every(item => item.original.label_id)
  if (!hasAllLabels) {
    showLabelErrors.value = true
    return
  }
  showLabelErrors.value = false

  const list_header = table.getRowModel().flatRows.map(item => ({
    id: item.original.id,
    column_name: item.original.header,
    is_search: item.original.is_search,
    is_visible: item.original.is_visible,
    is_editable: item.original.is_editable,
    is_dialing: item.original.is_dialing,
    label_id: item.original.label_id,
  }))
  const payload = {
    ...values,
    list_id: props.listData?.list_id,
    campaign_id: props.listData?.campaign_id,
    list_header,
  }
  saveLoading.value = true
  useApi().post('/edit-list', payload).then((response) => {
    showToast({ message: response.message })
    emit('complete')
    closeDialog()
  }).catch((err) => {
    showToast({ message: err.message, type: 'error' })
  }).finally(() => {
    saveLoading.value = false
  })
})

watch(() => props.open, (val) => {
  if (val) {
    setValues({ title: props?.listData?.list, new_campaign_id: props?.listData?.campaign_id })
    title.value = props?.listData?.list || ''
    refreshCampaignList()
  }
})
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-[90vw] w-[90vw] sm:min-w-[300px] md:min-w-[600px] lg:min-w-[900px] overflow-x-auto max-h-[70vh] lg:max-h-[95vh] text-primary">
      <DialogHeader>
        <DialogTitle class="text-primary">
          Configure List
        </DialogTitle>
      </DialogHeader>
      <div class="flex gap-4 w-full">
        <form class="flex gap-4 w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" v-model="title" name="title" class="w-1/2">
              <FormItem v-auto-animate class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-primary mb-1">
                  Title
                </FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Enter value" class="text-primary placeholder:text-primary text-xs md:text-sm h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" name="new_campaign_id" class="w-1/2">
              <FormItem v-auto-animate class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-primary mb-1">
                  Campaign
                </FormLabel>
                <FormControl>
                  <Select :disabled="campaignLoading" v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full text-primary !h-11 [&_svg]:hidden">
                      <SelectValue placeholder="Select option" class="text-primary text-xs md:text-sm" />
                      <SelectIcon>
                        <Icon :name="campaignLoading ? 'eos-icons:loading' : 'lucide:chevron-down'" class="mt-1" />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectContent class="w-full">
                      <SelectItem
                        v-if="props.listData?.campaign_id && props.listData?.campaign"
                        :key="`current-campaign-${props.listData.campaign_id}`"
                        :value="props.listData.campaign_id"
                      >
                        {{ props.listData.campaign }}
                      </SelectItem>

                      <SelectItem
                        v-for="option in campaigns"
                        :key="option.id"
                        :value="option.id"
                      >
                        {{ option.title }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </form>
      </div>
      <p v-if="dialingError" class="text-red-500 text-xs">
        {{ dialingError }}
      </p>
      <div class="overflow-x-auto rounded border mb-8">
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
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() && 'selected'"
              >
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :data-pinned="cell.column.getIsPinned()"
                  class="p-[12px]"
                  :class="cn(
                    { 'sticky bg-background/95': cell.column.getIsPinned() },
                    cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                  )"
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
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
      </div>
      <div class="flex justify-between items-center pt-2 pb-6 bg-white sticky -bottom-6">
        <Button type="button" variant="outline" class="w-[49%] border-red-500 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 h-11" @click="closeDialog">
          <Icon name="lucide:x" class="w-4 h-4 mr-1" />
          Discard
        </Button>
        <Button :disabled="saveLoading" :loading="saveLoading" type="button" class="w-[49%] bg-primary text-white border-primary hover:bg-primary/90 hover:text-white h-11" @click="saveConfigureList">
          <Icon name="lucide:save" class="w-4 h-4 mr-1 text-white" />
          Save
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

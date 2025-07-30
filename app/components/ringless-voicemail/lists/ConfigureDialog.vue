<script setup lang="ts">
import { useLazyAsyncData } from '#app'
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { computed, h, ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  open: boolean
  title: string
  selectedCampaign: string
  campaigns: { id: string, title: string }[]
  headers: string[]
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const api = useApi()

const selectValue = ref(props.selectedCampaign || '')
watch(() => props.open, async (val) => {
  if (val) {
    selectValue.value = props.selectedCampaign
    inputValue.value = props.title
    await labelRefresh()
  }
})

watch(() => props.headers, (newHeaders) => {
  if (newHeaders?.length) {
    tableData.value = newHeaders.map((header, i) => ({
      slno: i + 1,
      fileHeader: header,
      dialingColumn: false,
      label: '',
    }))
  }
})

// -- LABEL DATA --
const { data: labelData, refresh: labelRefresh } = await useLazyAsyncData('table-labels', () =>
  useApi().post('/label', {
    lower_limit: 0,
    upper_limit: 1000,
    search: '',
  }), { transform: res => res.data || [], immediate: false })

const inputValue = ref(props.title || '')

const dialingColumnValue = ref('')

const tableData = ref([
  { slno: 1, fileHeader: 'Phone Number', dialingColumn: false, label: '' },
  { slno: 2, fileHeader: 'Owner Name', dialingColumn: false, label: '' },
  { slno: 3, fileHeader: 'Business Name', dialingColumn: false, label: '' },
  { slno: 4, fileHeader: 'Email/Fax', dialingColumn: false, label: '' },
])

// -- TABLE --
const columnHelper = createColumnHelper<typeof tableData.value[0]>()
const columns = computed(() => [
  columnHelper.accessor('slno', {
    header: '#',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('fileHeader', {
    header: 'File Header',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('dialingColumn', {
    header: 'Dialing Column',
    cell: info => h(RadioGroup, {
      'modelValue': dialingColumnValue.value,
      'onUpdate:modelValue': (val: string) => {
        dialingColumnValue.value = val
        tableData.value.forEach(row => row.dialingColumn = row.slno.toString() === val)
      },
      'class': 'flex justify-center',
    }, {
      default: () => h(RadioGroupItem, {
        value: info.row.original.slno.toString(),
        class: [
          'h-4.5 w-4.5 mx-auto border-1 border-primary text-primary',
          'data-[state=checked]:border-[#16A34A] border-2',
          '[&_[data-slot=radio-group-indicator]>svg]:!fill-[#16A34A]',
        ].join(' '),
        checked: dialingColumnValue.value === info.row.original.slno.toString(),
      }),
    }),
  }),
  columnHelper.accessor('label', {
    header: 'Label',
    cell: info => h(Select, {
      'modelValue': info.row.original.label,
      'onUpdate:modelValue': (val: string) => {
        info.row.original.label = val
      },
    }, {
      default: () => [
        h(SelectTrigger, {
          class: 'w-full text-xs bg-[#F0F9F8] border-0',
        }, [
          h(SelectValue, {
            placeholder: labelData.value?.length ? 'Select label' : 'Loading...',
          }, () => {
            if (!info.row.original.label)
              return null
            const selectedLabel = labelData.value?.find(l => String(l.id) === info.row.original.label)
            return selectedLabel?.title || selectedLabel?.label || info.row.original.label
          }),
        ]),
        h(SelectContent, {
          class: 'w-full max-h-60 overflow-y-auto z-50',
        }, [
          labelData.value === null
            ? h('div', { class: 'p-2 text-xs text-gray-500' }, 'Loading...')
            : labelData.value?.length === 0
              ? h('div', { class: 'p-2 text-xs text-gray-500' }, 'No labels available')
              : (labelData.value || []).map(opt =>
                  h(SelectItem, {
                    value: String(opt.id),
                    key: opt.id,
                    class: 'text-xs',
                  }, () => opt.title || opt.label || `Label ${opt.id}`),
                ),
        ]),
      ],
    }),
  }),
])

const table = useVueTable({
  data: tableData.value,
  columns: columns.value,
  getCoreRowModel: getCoreRowModel(),
})

function closeDialog() {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-[90vw] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Configure List</DialogTitle>
      </DialogHeader>

      <div class="flex gap-4 mb-6">
        <div class="w-1/2 flex flex-col gap-1">
          <label class="text-sm font-medium text-primary mb-1">Title</label>
          <Input v-model="inputValue" :placeholder="title || 'Enter title'" class="text-primary placeholder:text-primary text-xs md:text-sm" />
        </div>
        <div class="w-1/2 flex flex-col gap-1">
          <label class="text-sm font-medium text-primary mb-1">Campaign</label>
          <Select v-model="selectValue">
            <SelectTrigger class="w-full text-primary">
              <SelectValue placeholder="Select campaign" class="text-primary text-xs md:text-sm" />
            </SelectTrigger>
            <SelectContent class="w-full text-primary">
              <SelectItem
                v-for="option in campaigns"
                :key="option.id"
                :value="String(option.id)"
                class="text-primary"
              >
                {{ option.title }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="overflow-x-auto border rounded-lg mb-8">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <th v-for="header in headerGroup.headers" :key="header.id" class="px-3 py-2 text-center">
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in table.getRowModel().rows" :key="row.id" class="border-t">
              <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-3 py-2 text-center">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center mt-6">
        <Button variant="outline" class="w-[49%] border-red-500 text-red-500 bg-red-50 hover:bg-red-100" @click="closeDialog">
          <Icon name="lucide:x" class="w-4 h-4 mr-1" />
          Discard
        </Button>
        <Button class="w-[49%] bg-primary text-white hover:bg-primary/90" @click="closeDialog">
          <Icon name="lucide:save" class="w-4 h-4 mr-1" />
          Save
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Icon } from '#components'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { h, ref } from 'vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])

const labelOptions = [
  { label: 'Label 1', value: 'label1' },
  { label: 'Label 2', value: 'label2' },
  { label: 'Label 3', value: 'label3' },
]

const inputValue = ref('')
const selectValue = ref('')
const dialingColumnValue = ref('')

const fileHeaderOptions = [
  'Phone Number',
  'Owner Name',
  'Business Name',
  'Email/Fax',
  'Address',
  'City',
  'State',
  'Zip',
  'Monthly Deposit',
  'Years in business',
  'Amount Needed',
]

const tableData = ref(fileHeaderOptions.map((header, idx) => {
  let label = ''
  if (Array.isArray(labelOptions) && labelOptions.length > 0) {
    const opt = labelOptions[idx % labelOptions.length]
    label = opt && typeof opt.value === 'string' ? opt.value : ''
  }
  return {
    slno: idx + 1,
    fileHeader: header,
    searchFilter: idx % 2 === 0,
    visible: true,
    editable: idx % 3 !== 0,
    dialingColumn: idx % 4 === 0,
    label,
  }
}))

const columnHelper = createColumnHelper<typeof tableData.value[0]>()
const columns = [
  columnHelper.accessor('slno', {
    header: 'Sl. No',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('fileHeader', {
    header: 'File Header',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('searchFilter', {
    header: 'Search Filter',
    cell: info => h(Checkbox, {
      modelValue: info.row.original.searchFilter,
      'onUpdate:modelValue': (val: boolean) => info.row.original.searchFilter = val,
      class: 'mx-auto !border-2 !border-primary data-[state=checked]:!bg-[#16A34A] data-[state=checked]:!border-[#16A34A] focus:!ring-[#16A34A] focus-visible:!ring-[#16A34A]'
    }),
  }),
  columnHelper.accessor('visible', {
    header: 'Visible',
    cell: info => h(Checkbox, {
      modelValue: info.row.original.visible,
      'onUpdate:modelValue': (val: boolean) => info.row.original.visible = val,
      class: 'mx-auto !border-2 !border-primary data-[state=checked]:!bg-[#16A34A] data-[state=checked]:!border-[#16A34A] focus:!ring-[#16A34A] focus-visible:!ring-[#16A34A]'
    }),
  }),
  columnHelper.accessor('editable', {
    header: 'Editable',
    cell: info => h(Checkbox, {
      modelValue: info.row.original.editable,
      'onUpdate:modelValue': (val: boolean) => info.row.original.editable = val,
      class: 'mx-auto !border-2 !border-primary data-[state=checked]:!bg-[#16A34A] data-[state=checked]:!border-[#16A34A] focus:!ring-[#16A34A] focus-visible:!ring-[#16A34A]'
    }),
  }),
  columnHelper.accessor('dialingColumn', {
    header: 'Dialing Column',
    cell: info => h(RadioGroup, {
      modelValue: dialingColumnValue.value,
      'onUpdate:modelValue': (val: string) => {
        dialingColumnValue.value = val
        tableData.value.forEach(row => row.dialingColumn = row.slno.toString() === val)
      },
      class: 'flex justify-center',
    }, {
      default: () => h(RadioGroupItem, {
        value: info.row.original.slno.toString(),
        class: 'mx-auto !border-2 !border-gray-300 data-[state=checked]:!border-[#16A34A] data-[state=checked]:!bg-[#16A34A] focus:!ring-[#16A34A] focus-visible:!ring-[#16A34A] !ring-2 !ring-offset-2',
        checked: dialingColumnValue.value === info.row.original.slno.toString(),
        style: {
          '--radio-indicator-stroke': '3px',
        },
      })
    }),
  }),
  columnHelper.accessor('label', {
    header: 'Label',
    cell: info => h(Select, {
      modelValue: info.getValue(),
      'onUpdate:modelValue': (val: string | number | null) => info.row.original.label = val ? String(val) : '',
    }, {
      default: () => [
        h(SelectTrigger, { class: 'w-full text-xs bg-[#F0F9F8] border-0' }, [
          h(SelectValue, { placeholder: 'Select label' }),
        ]),
        h(SelectContent, { class: 'w-full text-xs bg-[#F0F9F8] border-0' }, [
          labelOptions.map(opt =>
            h(SelectItem, { value: opt.value, key: opt.value, class: 'text-xs' }, () => opt.label)
          ),
        ]),
      ],
    }),
  }),
]

const table = useVueTable({
  data: tableData.value,
  columns,
  getCoreRowModel: getCoreRowModel(),
})

function closeDialog() {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-[90vw] w-[90vw] min-w-[900px] min-h-[70vh] text-primary">
      <DialogHeader>
        <DialogTitle class="text-primary">
          Configure List
        </DialogTitle>
      </DialogHeader>
      <div class="flex gap-4 mb-6">
        <div class="w-1/2 flex flex-col gap-1">
          <label class="text-sm font-medium text-primary mb-1">Title</label>
          <Input v-model="inputValue" placeholder="Enter value" class="text-primary placeholder:text-primary" />
        </div>
        <div class="w-1/2 flex flex-col gap-1">
          <label class="text-sm font-medium text-primary mb-1">Campaign</label>
          <Select v-model="selectValue">
            <SelectTrigger class="w-full text-primary">
              <SelectValue placeholder="Select option" class="text-primary" />
            </SelectTrigger>
            <SelectContent class="w-full text-primary">
              <SelectItem v-for="option in labelOptions" :key="option.value" :value="option.value" class="text-primary">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div class="overflow-x-auto rounded border mb-8">
        <table class="min-w-full text-sm text-primary">
          <thead class="bg-gray-50 text-primary">
            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <th v-for="header in headerGroup.headers" :key="header.id" class="px-3 py-2 text-center font-medium text-primary align-middle">
                <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in table.getRowModel().rows" :key="row.id" class="border-t text-primary align-middle">
              <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-3 py-2 text-center text-primary align-middle">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between items-center mt-6">
        <Button type="button" variant="outline" class="w-[49%] border-red-500 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600" @click="closeDialog">
          <Icon name="lucide:x" class="w-4 h-4 mr-1" />
          Discard
        </Button>
        <Button type="button" class="w-[49%] bg-primary text-white border-primary hover:bg-primary/90 hover:text-white" @click="closeDialog">
          <Icon name="lucide:save" class="w-4 h-4 mr-1 text-white" />
          Save
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

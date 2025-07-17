<script setup lang="ts">
import { ref, h, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '#components'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const breadcrumbs = [
  { label: 'IVR', href: '/app/inbound-settings/ivr' },
  { label: 'IVR Menu', active: true },
]

const router = useRouter()
const loading = ref(false)

const dtmfOptions = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'])
const titleOptions = ref(['Sales', 'Support', 'Billing', 'General Inquiry', 'Technical Help'])
const destinationTypeOptions = ref(['Extension', 'Queue', 'Voicemail', 'External Number', 'Hangup'])
const userOptions = ref([
  { id: '1', name: 'John Doe - 12345' },
  { id: '2', name: 'Jane Smith - 12346' },
  { id: '3', name: 'Robert Johnson - 12347' },
])

const tableData = ref([
  { id: 1, dtmf: '1', title: 'Sales', destinationType: 'Extension', destination: 'John Doe - 12345' },
  { id: 2, dtmf: '2', title: 'Support', destinationType: 'Queue', destination: 'Support Queue' },
  { id: 3, dtmf: '3', title: 'Billing', destinationType: 'Voicemail', destination: 'Billing Voicemail' },
])

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('dtmf', {
    header: () => h('div', { class: 'text-center align-middle' }, 'DTMF'),
    cell: ({ row }) => {
      return h(Select, {
        modelValue: row.original.dtmf,
        'onUpdate:modelValue': (val) => row.original.dtmf = val,
      }, () => [
        h(SelectTrigger, { class: 'w-full flex items-center' }, () => [
          h(SelectValue, { placeholder: 'Select DTMF' })
        ]),
        h(SelectContent, {}, () => [
          h(SelectGroup, {}, () => [
            h(SelectLabel, {}, 'DTMF Options'),
            ...dtmfOptions.value.map(option =>
              h(SelectItem, { value: option, key: option }, () => option)
            )
          ])
        ])
      ])
    },
  }),
  columnHelper.accessor('title', {
    header: () => h('div', { class: 'text-center align-middle' }, 'DTMF Title'),
    cell: ({ row }) => {
      return h(Select, {
        modelValue: row.original.title,
        'onUpdate:modelValue': (val) => row.original.title = val,
      }, () => [
        h(SelectTrigger, { class: 'w-full flex items-center' }, () => [
          h(SelectValue, { placeholder: 'Select Title' })
        ]),
        h(SelectContent, {}, () => [
          h(SelectGroup, {}, () => [
            h(SelectLabel, {}, 'Title Options'),
            ...titleOptions.value.map(option =>
              h(SelectItem, { value: option, key: option }, () => option)
            )
          ])
        ])
      ])
    },
  }),
  columnHelper.accessor('destinationType', {
    header: () => h('div', { class: 'text-center align-middle' }, 'Destination Type'),
    cell: ({ row }) => {
      return h(Select, {
        modelValue: row.original.destinationType,
        'onUpdate:modelValue': (val) => row.original.destinationType = val,
      }, () => [
        h(SelectTrigger, { class: 'w-full flex items-center' }, () => [
          h(SelectValue, { placeholder: 'Select Type' })
        ]),
        h(SelectContent, {}, () => [
          h(SelectGroup, {}, () => [
            h(SelectLabel, {}, 'Destination Types'),
            ...destinationTypeOptions.value.map(option =>
              h(SelectItem, { value: option, key: option }, () => option)
            )
          ])
        ])
      ])
    },
  }),
  columnHelper.accessor('destination', {
    header: () => h('div', { class: 'text-center align-middle' }, 'Destination'),
    cell: ({ row }) => {
      return h(Select, {
        modelValue: row.original.destination,
        'onUpdate:modelValue': (val) => row.original.destination = val,
      }, () => [
        h(SelectTrigger, { class: 'w-full flex items-center' }, () => [
          h(SelectValue, { placeholder: 'Select Destination' })
        ]),
        h(SelectContent, {}, () => [
          h(SelectGroup, {}, () => [
            h(SelectLabel, {}, 'Destinations'),
            ...userOptions.value.map(option =>
              h(SelectItem, { value: option.name, key: option.id }, () => option.name)
            )
          ])
        ])
      ])
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center text-sm font-normal align-middle' }, 'Actions'),
    cell: ({ row }) => {
      const isLastRow = row.index === tableData.value.length - 1
      
      return h('div', { class: 'flex items-center justify-center h-full' }, [
        isLastRow 
          ? h(Button, {
              variant: 'outline',
              size: 'icon',
              class: 'text-primary border-primary',
              onClick: () => addNewRow()
            }, [
              h(Icon, { 
                name: 'material-symbols:add', 
                class: 'text-lg' 
              })
            ])
          : h(Button, {
              variant: 'outline',
              size: 'icon',
              class: 'text-red-500 hover:text-red-500 border-red-500',
              onClick: () => tableData.value = tableData.value.filter(item => item.id !== row.original.id)
            }, [
              h(Icon, { 
                name: 'material-symbols:delete', 
                class: 'text-lg' 
              })
            ])
      ])
    }
  })
]

const table = useVueTable({
  get data() {
    return tableData.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
})

const addNewRow = () => {
  const newId = tableData.value.length > 0 
    ? Math.max(...tableData.value.map(item => item.id)) + 1 
    : 1

  const newRow = {
    id: newId,
    dtmf: '',
    title: '',
    destinationType: '',
    destination: ''
  }

  tableData.value = [...tableData.value, newRow]
}

const onSubmit = () => {
  loading.value = true
  console.log('Table data to be saved:', tableData.value)
  setTimeout(() => {
    loading.value = false
    router.push('/app/inbound-settings/ivr')
  }, 1000)
}

function onCancel() {
  router.push('/app/inbound-settings/ivr')
}
</script>

<template>
  <BaseHeader title="Lorem ipsum dolor sit amet consectetur." :breadcrumbs="breadcrumbs" />
  <div class="relative h-[calc(100vh-190px)] overflow-y-hidden border rounded-lg">
    <div class="space-y-4 h-full">
      <div class="h-full rounded-lg bg-white">
        <div class="border-b px-5 py-5 flex items-center justify-between">
          <div class="text-lg font-medium text-primary/100">Set IVR Menu</div>
        </div>
        <div class="overflow-auto">
          <Table class="w-full">
            <TableHeader>
              <TableRow>
                <TableHead
                  v-for="header in table.getHeaderGroups()[0].headers"
                  :key="header.id"
                  class="bg-gray-50 align-middle"
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
              <template v-if="table.getRowModel().rows?.length">
                <TableRow
                  v-for="row in table.getRowModel().rows"
                  :key="row.id"
                  class="h-16"
                >
                  <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                    class="p-2 align-middle"
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
                  class="h-24 text-center align-middle"
                >
                  No IVR options configured. Click the "+" button to add a new row.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <div class="sticky bottom-0 right-0 w-full bg-white p-4 gap-2 flex border rounded-b-lg">
        <Button class="w-1/2 h-[52px]" variant="outline" :loading="loading" type="button" @click="onCancel">
          <Icon :name="loading ? '' : 'material-symbols:autorenew'" size="20" />
          Reset
        </Button>
        <Button class="w-1/2 h-[52px]" type="button" :loading="loading" @click="onSubmit">
          <Icon :name="loading ? '' : 'material-symbols:save'" size="20" />
          Save
        </Button>
      </div>
    </div>
  </div>
</template>
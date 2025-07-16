<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next'
import { ref, h } from 'vue'
import moment from 'moment'

import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Table imports
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = defineProps({
  scheduleData: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Call Timing'
  }
})

const emit = defineEmits(['edit'])

const isOpen = ref(false) 

const columnHelper = createColumnHelper<any>()

const toggleAccordion = () => {
  isOpen.value = !isOpen.value
}

const columns = [
  // Serial number column
  columnHelper.display({
    id: 'siNo',
    header: () => h('div', { class: 'text-center text-sm font-normal' }, '#'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm flex items-center justify-center h-full' }, row.index + 1),
  }),

  // Day column
  columnHelper.accessor('day', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'Day'),
    cell: ({ row }) => h('div', { class: 'text-center font-normal text-sm flex items-center justify-center h-full' }, row.original.day),
  }),

  // From time column
  columnHelper.accessor('from', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'From'),
    cell: ({ row }) => {
      const time = row.original.from
      return h('div', { 
        class: 'text-center font-normal text-sm flex items-center justify-center h-full',
      }, time ? moment(time, 'HH:mm:ss').format('hh:mm A') : 'NA')
    },
  }),

  // To time column
  columnHelper.accessor('to', {
    header: () => h('div', { class: 'text-center text-sm font-normal' }, 'To'),
    cell: ({ row }) => {
      const time = row.original.to
      return h('div', { 
        class: 'text-center font-normal text-sm flex items-center justify-center h-full',
      }, time ? moment(time, 'HH:mm:ss').format('hh:mm A') : 'NA')
    },
  }),
]

const table = useVueTable({
  data: props.scheduleData,
  columns,
  getCoreRowModel: getCoreRowModel(),
})

const handleEditClick = () => {
  emit('edit', { data: props.scheduleData }, props.title)
}
</script>

<template>
  <div class="border rounded-lg">
    <Accordion type="single" collapsible class="w-full" >
      <AccordionItem value="item-1">
        <div class="flex items-center justify-between px-4 py-2 gap-2">
          <div>
            <h4 class="text-md">
              {{ title }}
            </h4>
            <p class="text-xs font-light text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur illum vitae, error ratione nesciunt distinctio aliquam molestias delectus ipsa velit eveniet repellat. Aliquam veritatis veniam animi, voluptatum repellendus explicabo cum.
            </p>
          </div>
         <AccordionTrigger >
            <template  #icon>  <Button variant="outline" size="icon" class="relative" @click="toggleAccordion">
    <Icon 
      :name="isOpen ? 'material-symbols:close' : 'material-symbols:arrow-drop-down'" 
      :class="isOpen ? 'text-md' : 'text-xl'" 
    />
  </Button>
</template>
</AccordionTrigger>
        </div>
        <AccordionContent class="">
          <div class="border border-r-0 border-l-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                  <TableHead
                    v-for="header in headerGroup.headers"
                    :key="header.id"
                    class="bg-gray-50 text-center"
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
                    class="h-12"
                  >
                    <TableCell
                      v-for="cell in row.getVisibleCells()"
                      :key="cell.id"
                      class="p-2"
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
                    No schedule found.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div class=" px-4 pt-5 pb-1">
            <Button class="w-full h-11" @click="handleEditClick">
              <Icon name="material-symbols:edit-square" class="text-lg" />
              Edit
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
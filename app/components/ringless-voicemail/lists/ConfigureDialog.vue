<script setup lang="ts">
import { useFetch } from '#app'
import { Icon } from '#components'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { h, onMounted, ref, watch } from 'vue'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

const props = defineProps<{
  open: boolean
  title: string
  campaign: string
}>()

const emit = defineEmits(['update:open'])

const api = useApi()

// 🟢 Fetch campaign list

const selectValue = ref(String(props.campaign || ''))
const campaigns = ref<{ id: string, title: string }[]>([])

// Fetch campaign list
async function fetchCampaigns() {
  const { data } = await api.get('/ringless/campaign')
  campaigns.value = data
}

// Init campaign data
onMounted(async () => {
  await fetchCampaigns()

  // If the campaign ID exists in the list, set it
  const exists = campaigns.value.some(c => String(c.id) === String(props.campaign))
  if (exists) {
    selectValue.value = String(props.campaign)
  }
  else {
    selectValue.value = ''
  }
})
watch(() => props.campaign, (newVal) => {
  const exists = campaigns.value.some(c => String(c.id) === String(newVal))
  if (exists) {
    selectValue.value = String(newVal)
  }
})
watch(() => props.open, (val) => {
  if (val) {
    labelRefresh()
  }
})
const labelStart = ref(0)
const labelLimit = ref(1000) // Get all labels
const labelSearch = ref('')

const { data: labelData, refresh: labelRefresh } = await useLazyAsyncData('table-labels', () =>
  api.post('/label', {
    lower_limit: labelStart.value,
    upper_limit: labelLimit.value,
    search: labelSearch.value,
  }), {
  transform: res => res.data || [], // Ensure we always return an array
  immediate: false, // Don't fetch immediately
})

// Watch for dialog open to fetch labels
watch(() => props.open, async (val) => {
  if (val) {
    await labelRefresh()
    console.log('Label data:', labelData.value) // Debug: check the data
  }
})

const inputValue = ref(props.title || '')

const dialingColumnValue = ref('')

const tableData = ref([
  { slno: 1, fileHeader: 'Phone Number', dialingColumn: false, label: '' },
  { slno: 2, fileHeader: 'Owner Name', dialingColumn: false, label: '' },
  { slno: 3, fileHeader: 'Business Name', dialingColumn: false, label: '' },
  { slno: 4, fileHeader: 'Email/Fax', dialingColumn: false, label: '' },
])

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
      'modelValue': info.getValue(),
      'onUpdate:modelValue': (val: string | number | null) => {
        info.row.original.label = val ? String(val) : ''
      },
    }, {
      default: () => [
        h(SelectTrigger, {
          class: 'w-full text-xs bg-[#F0F9F8] border-0',
          onClick: (e) => {
            e.preventDefault() // Prevent immediate close
            e.stopPropagation()
          },
        }, [
          h(SelectValue, {
            placeholder: labelData.value?.length ? 'Select label' : 'Loading...',
          }),
        ]),
        h(SelectContent, {
          class: 'w-full max-h-60 overflow-y-auto z-50', // Ensure dropdown is above other elements
        }, [
          // Show loading state if data isn't ready
          labelData.value === null ? h('div', { class: 'p-2 text-xs text-gray-500' }, 'Loading...')
          // Show empty state if no labels
            : labelData.value?.length === 0 ? h('div', { class: 'p-2 text-xs text-gray-500' }, 'No labels available')
            // Render label options
              : (labelData.value || []).map(opt =>
                  h(SelectItem, {
                    value: String(opt.id),
                    key: opt.id,
                    class: 'text-xs',
                  }, () => opt.label || `Label ${opt.id}`), // Fallback if label is empty
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
    <DialogContent class="max-w-[90vw] sm:min-w-[300px] md:min-w-[600px] lg:min-w-[900px] overflow-x-auto max-h-[70vh] lg:max-h-[95vh] text-primary">
      <DialogHeader>
        <DialogTitle class="text-primary">
          Configure List
        </DialogTitle>
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
      <div class="overflow-x-auto rounded-lg border mb-8">
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

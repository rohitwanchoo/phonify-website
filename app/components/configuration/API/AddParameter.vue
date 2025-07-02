<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import Button from '~/components/ui/button/Button.vue'
import Label from '~/components/ui/label/Label.vue'

const props = defineProps<{
  initialData?: {
    id: number
    title: string
    data_type?: string
    values?: string
    leadStatus?: number
  } | null
  open: boolean
}>()

const emit = defineEmits(['close', 'saved', 'add-parameter'])

const selectedType = ref('parameter_constant') // default to first option
const selectedRow = ref('1')

// Type options
const typeOptions = [
  { label: 'Parameter & Constant', value: 'parameter_constant' },
  { label: 'Parameter and Label', value: 'parameter_label' },
]

// Remove labelName and labelOptions logic

async function handleSubmit() {
  emit('add-parameter', {
    type: selectedType.value,
    rows: Number(selectedRow.value),
  })
  emit('close')
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent class="max-w-md w-full sm:max-w-lg p-4 sm:p-8 overflow-y-auto">
      <DialogHeader class="pb-4 border-b border-[#0000000D]">
        <DialogTitle class="flex text-[#121E3D] font-normal">
          Add Parameter
        </DialogTitle>
      </DialogHeader>

      <div>
        <Label for="typeSelect" class="mb-1 text-xs text-[#162D3A]">
          Type
        </Label>
        <Select v-model="selectedType">
          <SelectTrigger id="typeSelect" class="h-11 w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in typeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Toggle Group for Number of Rows -->
      <div class="mt-2">
        <Label class="mb-1 text-xs text-[#162D3A]">Number of Rows</Label>
        <ToggleGroup
          v-model="selectedRow"
          type="single"
          class="flex gap-1 flex-nowrap mt-2 w-full"
        >
          <ToggleGroupItem
            v-for="n in 10"
            :key="n"
            :value="String(n)"
            class="flex-1 px-0  py-2 text-center rounded border border-gray-300 text-sm data-[state=on]:bg-primary data-[state=on]:text-white"
          >
            {{ n }}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <DialogFooter class="w-full mt-4 flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" class="flex-1 h-11" as-child>
          <DialogClose>
            <Icon name="material-symbols:close" size="20" />
            Close
          </DialogClose>
        </Button>
        <Button class="flex-1 h-11" @click="handleSubmit">
          <Icon name="material-symbols:save" size="20" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

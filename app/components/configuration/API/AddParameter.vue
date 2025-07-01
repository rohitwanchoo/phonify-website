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
import Input from '~/components/ui/input/Input.vue'
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

const emit = defineEmits(['close', 'saved'])

const labelName = ref('')
const isSubmitting = ref(false)
const selectedRow = ref('1')

const labelOptions = [
  { label: 'Label 1', value: 'Label 1' },
  { label: 'Label 2', value: 'Label 2' },
  { label: 'Label 3', value: 'Label 3' },
]

// Fill form when editing
watch(() => props.initialData, (val) => {
  labelName.value = val?.title ?? ''
}, { immediate: true })

const isEditMode = computed(() => !!props.initialData?.id)

async function handleSubmit() {
  if (!labelName.value.trim()) {
    showToast({ type: 'error', message: 'Label name is required' })
    return
  }

  isSubmitting.value = true

  const payload = {
    title: labelName.value,
    edit_mode: true,
    data_type: 'text',
    required: false,
    merchant_required: false,
    number_length: 0,
    heading_type: '',
    values: '',
  }

  try {
    let res

    if (isEditMode.value) {
      // EDIT
      res = await useApi().post(`/crm-update-label/${props.initialData?.id}`, payload)
    }
    else {
      // CREATE
      res = await useApi().put('/crm-add-label', payload)
    }

    if (res?.success) {
      showToast({ type: 'success', message: res.message })
      emit('saved')
      emit('close')
    }
    else {
      showToast({ type: 'error', message: res.message || 'Operation failed' })
    }
  }
  catch {
    showToast({ type: 'error', message: 'Something went wrong' })
  }
  finally {
    isSubmitting.value = false
  }
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
        <Label for="labelName" class="mb-1 text-xs text-[#162D3A]">
          Type
        </Label>
        <Select v-model="labelName">
          <SelectTrigger id="labelName" class="h-11 w-full">
            <SelectValue placeholder="parameter & label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in labelOptions" :key="option.value" :value="option.value">
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
        <Button class="flex-1 h-11" :disabled="isSubmitting" @click="handleSubmit">
          <Icon name="material-symbols:save" size="20" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
